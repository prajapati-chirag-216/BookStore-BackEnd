const ContactUs = require("../model/contactUs.modal");

const ContactUsServices = {
  async postMeassageHandler(message) {
    const data = new ContactUs(message);
    if (!data) {
      throw { message: "Your Order Not Found!" };
    }
    await data.save();

    return data;
  },
};
module.exports = ContactUsServices;
