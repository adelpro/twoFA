const { authenticator } = require("otplib");
const qrcode = require("qrcode");
async function generateTwoFAQRCode(id, secret) {
  const otpauthURL = authenticator.keyuri(id, "2FA", secret);
  console.log({ otpauthURL });
  let imagePath = await qrcode.toDataURL(otpauthURL);
  return imagePath;
}
module.exports = { generateTwoFAQRCode };
