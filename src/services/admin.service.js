const Admin = require("../model/admin.modal");
const crypto = require("crypto");
const { sendResetPasswordEmail } = require("../utils/email");
const status = require("http-status");

const AdminServices = {
  async signupAdminHandler(adminData) {
    const data = new Admin(adminData);
    const { accessToken, refreshToken } = data.getAuthToken();
    await data.save();
    return { accessToken, refreshToken };
  },

  async loginAdminHandler(email, password) {
    const data = await Admin.findbyCredentials(email, password);
    const { accessToken, refreshToken } = await data.getAuthToken();
    return { accessToken, refreshToken };
  },

  async forgotPasswordHandler(email) {
    const data = await Admin.findOne({ email });
    if (!data || data.length === 0) {
      throw {
        message: "No account exist with this E-mail Id",
        status: status.UNAUTHORIZED,
      };
    }
    const resettoken = data.createResetToken();
    await data.save({ validateBeforeSave: false });
    sendResetPasswordEmail(
      data.email,
      `${req.protocol}://localhost:3000/resetPassword/${resettoken}`
    );
    return resettoken;
  },

  async resetPasswordHandler(id) {
    const hashedToken = crypto.createHash("sha256").update(id).digest("hex");
    const data = await Admin.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!data || data.length === 0) {
      throw {
        message: "Session Time out! Please try again.",
        status: 440,
      };
    }
    data.password = req.body.password;
    data.passwordResetToken = undefined;
    data.passwordResetExpires = undefined;
    await data.save();
  },

  async getAccessTokenHandler(admin) {
    const accessToken = await admin.getAccessToken();
    return accessToken;
  },

  async getAllAdminsHandler() {
    const data = await Admin.find();
    return data;
  },

  async updateAdminHandler(adminData, id) {
    const data = await Admin.findByIdAndUpdate({ _id: id }, adminData, {
      new: 1,
    });
    return data;
  },

  async deleteAdminHandler(id) {
    const result = await Admin.findByIdAndDelete(id);
    if (!result) {
      throw { message: "Your Admin was not deleted!" };
    }
    return result;
  },

  async createAdminHandler(adminData) {
    const data = new Admin(adminData);
    await data.save();
  },
};

module.exports = AdminServices;
