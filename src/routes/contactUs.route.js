const express = require("express");
const catchAsync = require("../errors/catchAsync");
const ContactUsServices = require("../controllers/contactUs.controller");

const contactUsRouter = express.Router();

contactUsRouter.post(
  "/postMymeassage",
  catchAsync(ContactUsServices.postMeassageHandler)
);

module.exports = contactUsRouter;
