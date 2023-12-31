const ContactUsServices = require("../services/contactUs.service");

const ContactUsController = {
  async postMeassageHandler(req, res) {
    const data = await ContactUsServices.postMeassageHandler(req.body);

    return res.status(200).send(data);
  },
};

module.exports = ContactUsController;
