const status = require("http-status");
const AdminServices = require("../services/admin.service");
const {
  setAdminAccessTokenCookie,
  setAdminRefreshTokenCookie,
} = require("../utils/function");

const AdminController = {
  async signupAdminHandler(req, res) {
    const { accessToken, refreshToken } =
      await AdminServices.signupAdminHandler(req.body);
    setAdminAccessTokenCookie(res, accessToken);
    setAdminRefreshTokenCookie(res, refreshToken);
    res.status(200).send({ success: true });
  },

  async loginAdminHandler(req, res) {
    const { accessToken, refreshToken } = await AdminServices.loginAdminHandler(
      req.body.email,
      req.body.password
    );
    setAdminAccessTokenCookie(res, accessToken);
    setAdminRefreshTokenCookie(res, refreshToken);

    res.status(200).send({
      success: true,
    });
  },

  async logoutAdminHandler(req, res) {
    res.clearCookie("adminRefreshToken", { secure: true, sameSite: "None" });
    res.clearCookie("adminAccessToken", { secure: true, sameSite: "None" });
    res.status(200).send({ success: true });
  },

  async forgotPasswordHandler(req, res) {
    const resettoken = await AdminServices.forgotPasswordHandler(
      req.body.email
    );
    await data.save({ validateBeforeSave: false });
    res.status(200).send({ success: true, resettoken });
  },

  async resetPasswordHandler(req, res) {
    await AdminServices.resetPasswordHandler(req.params.id);
    res.status(200).send({ status: true });
  },

  async getAccessTokenHandler(req, res) {
    if (!req?.admin) {
      throw { message: "Admin not exist", status: status.BAD_REQUEST };
    }
    const accessToken = await AdminServices.getAccessTokenHandler(req.admin);
    setAdminAccessTokenCookie(res, accessToken);
    res.status(200).send({
      success: true,
    });
  },

  async getAdminProfileHandler(req, res) {
    res.status(200).send(req.admin || null);
  },

  async getAdminHandler(req, res) {
    const id = req.params.id;
    const data = await AdminServices.getAdminHandler(id);
    res.status(200).send(data || []);
  },

  async searchAdminHandler(req, res) {
    // searchId could be partial as well so in res we return list of Admins that matches this searchId
    const searchEmail = req.params.email;

    const data = await AdminServices.searchAdminHandler(searchEmail);
    res.status(200).send(data || []);
  },

  async getAllAdminsHandler(req, res) {
    const data = await AdminServices.getAllAdminsHandler();
    return res.status(200).send(data);
  },

  async updateAdminHandler(req, res) {
    const response = await AdminServices.updateAdminHandler(
      req.body,
      req.params.id
    );
    return res.status(200).send(response);
  },

  async deleteAdminHandler(req, res) {
    const result = await AdminServices.deleteAdminHandler(req.params.id);
    res.status(200).json(result);
  },

  async createAdminHandler(req, res) {
    await AdminServices.createAdminHandler(req.body);
    res.status(200).send({ success: true });
  },
};

module.exports = AdminController;
