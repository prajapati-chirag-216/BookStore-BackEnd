const status = require("http-status");
const AdminServices = require("../services/admin.service");
const {
  setAccessTokenCookie,
  setRefreshTokenCookie,
} = require("../utils/function");

const AdminController = {
  async signupAdminHandler(req, res) {
    const { accessToken, refreshToken } =
      await AdminServices.signupAdminHandler(req.body);
    setAccessTokenCookie(res, accessToken);
    setRefreshTokenCookie(res, refreshToken);
    res.status(200).send({ success: true });
  },

  async loginAdminHandler(req, res) {
    const { accessToken, refreshToken } = await AdminServices.loginAdminHandler(
      req.body.email,
      req.body.password
    );
    setAccessTokenCookie(res, accessToken);
    setRefreshTokenCookie(res, refreshToken);

    res.status(200).send({
      success: true,
    });
  },

  async logoutAdminHandler(req, res) {
    res.clearCookie("refreshToken", { secure: true, sameSite: "None" });
    res.clearCookie("accessToken", { secure: true, sameSite: "None" });
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
    setAccessTokenCookie(res, accessToken);
    res.status(200).send({
      success: true,
    });
  },

  async getAdminHandler(req, res) {
    res.status(200).send(req.admin || null);
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
