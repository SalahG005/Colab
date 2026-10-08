const { MailtrapClient } = require("mailtrap");
const dotenv = require("dotenv");

dotenv.config();

const mailtrapClient = process.env.MAILTRAP_TOKEN
  ? new MailtrapClient({
      endpoint: process.env.MAILTRAP_ENDPOINT || "https://send.api.mailtrap.io/",
      token: process.env.MAILTRAP_TOKEN,
    })
  : null;

const sender = {
  email: "hello@demomailtrap.co",
  name: "Colab",
};

module.exports = { mailtrapClient, sender };
