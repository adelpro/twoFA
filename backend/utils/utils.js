const speakeasy = require("speakeasy");
const qrcode = require("qrcode");
async function generateTwoFAQRCode(secret) {
  const otpauthURL = speakeasy.otpauthURL({
    secret,
    label: "2FA-auth",
  });
  const result = await qrcode.toDataURL(otpauthURL);
  return result;
}

module.exports = { generateTwoFAQRCode };
