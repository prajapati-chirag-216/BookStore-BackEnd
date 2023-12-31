const express = require("express");
const {
  adminAuth,
  verifyAdminRefreshToken,
  verifyAdmin,
} = require("../middlewares/auth");
const roleTypes = require("../utils/roleTypes");
const catchAsync = require("../errors/catchAsync");
const AdminController = require("../controllers/admin.controller");
const router = express.Router();

router.get(
  "/admin/getAccessToken",
  catchAsync(verifyAdminRefreshToken),
  catchAsync(AdminController.getAccessTokenHandler)
);
router.get(
  "/admin/profile",
  catchAsync(verifyAdmin),
  catchAsync(AdminController.getAdminHandler)
);
router.get(
  "/getAllAdmins",
  catchAsync(adminAuth(roleTypes.FETCH_ADMINS)),
  catchAsync(AdminController.getAllAdminsHandler)
);
// uncomment this to add initial Admin Data then comment it again
// note that when adding admin data first time go to admin modal and in schema set role property's default value to ADMIN
// router.post("/admin/signup", AdminController.signupAdminHandler);

router.post(
  "/admin/addAdmin",
  catchAsync(adminAuth(roleTypes.ADD_ADMIN)),
  catchAsync(AdminController.createAdminHandler)
);
router.post("/admin/login", catchAsync(AdminController.loginAdminHandler));
router.post(
  "/admin/logout",
  catchAsync(adminAuth(roleTypes.LOGOUT_ADMIN)),
  catchAsync(AdminController.logoutAdminHandler)
);
router.post(
  "/admin/forgotPassword",
  catchAsync(AdminController.forgotPasswordHandler)
);
router.post(
  "/admin/resetPassword/:id",
  catchAsync(AdminController.resetPasswordHandler)
);

router.patch(
  "/updateAdmin/:id",
  catchAsync(adminAuth(roleTypes.UPDATE_ADMIN)),
  catchAsync(AdminController.updateAdminHandler)
);

router.delete(
  "/deleteAdmin/:id",
  catchAsync(adminAuth(roleTypes.DELETE_ADMIN)),
  catchAsync(AdminController.deleteAdminHandler)
);

module.exports = router;
