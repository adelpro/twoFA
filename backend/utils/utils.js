const { authenticator } = require("otplib");
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");
async function generateTwoFAQRCode(id, secret) {
  const label = id;
  const otpauthURL = speakeasy.otpauthURL({});
  const result = await qrcode.toDataURL(secret);
  return result;
}
module.exports = { generateTwoFAQRCode };
