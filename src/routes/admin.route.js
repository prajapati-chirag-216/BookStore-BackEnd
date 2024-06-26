const express = require("express");
const {
  adminAuth,
  verifyAdminRefreshToken,
  verifyAdmin,
} = require("../middlewares/auth");
const permissions = require("../utils/permissions");
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
  catchAsync(AdminController.getAdminProfileHandler)
);
router.get(
  "/getAllAdmins",
  catchAsync(adminAuth(permissions.FETCH_ADMINS)),
  catchAsync(AdminController.getAllAdminsHandler)
);
router.get(
  "/getAdmin/:id",
  catchAsync(adminAuth(permissions.FETCH_ADMIN_OR_EMPLOYEE)),
  catchAsync(AdminController.getAdminHandler)
);
router.get(
  "/searchAdmin/:email",
  catchAsync(adminAuth(permissions.SEARCH_ADMIN_OR_EMPLOYEE)),
  catchAsync(AdminController.searchAdminHandler)
);
// uncomment this to add initial Admin Data then comment it again
// note that when adding admin data first time go to admin modal and in schema set role property's default value to ADMIN
// router.post("/admin/signup", AdminController.signupAdminHandler);

router.post(
  "/admin/addAdmin",
  catchAsync(adminAuth(permissions.ADD_ADMIN)),
  catchAsync(AdminController.createAdminHandler)
);
router.post("/admin/login", catchAsync(AdminController.loginAdminHandler));
router.post(
  "/admin/logout",
  catchAsync(adminAuth(permissions.LOGOUT_ADMIN_OR_EMPLOYEE)),
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
  catchAsync(adminAuth(permissions.UPDATE_ADMIN)),
  catchAsync(AdminController.updateAdminHandler)
);

router.delete(
  "/deleteAdmin/:id",
  catchAsync(adminAuth(permissions.DELETE_ADMIN)),
  catchAsync(AdminController.deleteAdminHandler)
);

module.exports = router;
