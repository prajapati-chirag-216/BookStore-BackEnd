const UserServices = require("../services/user.service");
const {
  setAccessTokenCookie,
  setRefreshTokenCookie,
} = require("../utils/function");

const UserController = {
  async signupUserHandler(req, res) {
    const { accessToken, refreshToken } = await UserServices.signupUserHandler(
      req.body
    );
    setAccessTokenCookie(res, accessToken);
    setRefreshTokenCookie(res, refreshToken);
    res.status(200).send({ success: true });
  },

  async loginUserHandler(req, res) {
    const { accessToken, refreshToken, cartItems } =
      await UserServices.loginUserHandler(req.body.email, req.body.password);
    setAccessTokenCookie(res, accessToken);
    setRefreshTokenCookie(res, refreshToken);
    res.status(200).send({
      success: true,
      cartItems,
    });
  },

  logoutUserHandler(req, res) {
    res.clearCookie("refreshToken", { secure: true, sameSite: "None" });
    res.clearCookie("accessToken", { secure: true, sameSite: "None" });
    res.status(200).send({ success: true });
  },

  async forgotPasswordHandler(req, res) {
    const resetToken = await UserServices.forgotPasswordHandler(req.body.email);
    res.status(200).send({ success: true, resetToken });
  },

  async resetPasswordHandler(req, res) {
    await UserServices.resetPasswordHandler(req.params.id);
    res.status(200).send({ status: true });
  },

  async getUserHandler(req, res) {
    res.status(200).send(req.user || null);
  },

  async addCartItemsHandler(req, res) {
    const userData = req.user;
    const cartData = req.body;
    const cartItems = await UserServices.addCartItemsHandler(
      userData,
      cartData
    );
    res.status(200).send({ success: true, cartItems });
  },

  async getAllUsersHandler(req, res) {
    const users = await UserServices.getAllUsersHandler();
    res.status(200).send(users);
  },

  async getAccessTokenHandler(req, res) {
    const accessToken = await UserServices.getAccessTokenHandler(req.user);
    setAccessTokenCookie(res, accessToken);
    res.status(200).send({
      success: true,
    });
  },

  async updateUserHandler(req, res) {
    const userId = req.user._id.toString();

    const user = await UserServices.updateUserHandler(userId, req.body);
    res.status(200).send(user);
  },

  async updatePasswordHandler(req, res) {
    await UserServices.updatePasswordHandler(req.body, req.user.email);
    res.status(200).send({ success: true });
  },
  async deleteUserHandler(req, res) {
    const userId = req.params.id;
    await UserServices.deleteUserHandler(userId);
    res.status(200).send({ success: true });
  },
};

module.exports = UserController;
