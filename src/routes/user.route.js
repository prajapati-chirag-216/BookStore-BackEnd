const express = require("express");
const {
  auth,
  verifyUser,
  verifyRefreshToken,
} = require("../middlewares/userAuth");
const { adminAuth } = require("../middlewares/auth");
const roleTypes = require("../utils/roleTypes");
const catchAsync = require("../errors/catchAsync");
const router = express.Router();

const UserController = require("../controllers/user.controller");

router.get(
  "/user/profile",
  catchAsync(verifyUser),
  catchAsync(UserController.getUserHandler)
);

router.post("/user/signup", catchAsync(UserController.signupUserHandler));
router.post("/user/login", catchAsync(UserController.loginUserHandler));
router.post(
  "/user/logout",
  catchAsync(auth),
  catchAsync(UserController.logoutUserHandler)
);
router.post(
  "/user/forgotPassword",
  catchAsync(UserController.forgotPasswordHandler)
);
router.post(
  "/user/resetPassword/:id",
  catchAsync(UserController.resetPasswordHandler)
);
router.post(
  "/addCartItems",
  catchAsync(auth),
  catchAsync(UserController.addCartItemsHandler)
);
router.get(
  "/getAllUsers",
  catchAsync(adminAuth(roleTypes.FETCH_USERS)),
  catchAsync(UserController.getAllUsersHandler)
);
router.get(
  "/user/getAccessToken",
  catchAsync(verifyRefreshToken),
  catchAsync(UserController.getAccessTokenHandler)
);
router.patch(
  "/updateUser",
  catchAsync(auth),
  catchAsync(UserController.updateUserHandler)
);
router.patch(
  "/updatePassword",
  catchAsync(auth),
  catchAsync(UserController.updatePasswordHandler)
);
router.delete(
  "/deleteUser/:id",
  catchAsync(adminAuth(roleTypes.DELETE_USER)),
  catchAsync(UserController.deleteUserHandler)
);
module.exports = router;
