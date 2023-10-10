const { authenticator } = require("otplib");
const qrcode = require("qrcode");
const { users } = require("../data");
async function generateTwoFAQRCode(id, secret) {
  const otpauthURL = authenticator.keyuri(id, "2FA", secret);
  let imagePath = await qrcode.toDataURL(otpauthURL);
  return imagePath;
}
function isTrusted(id, fingerprirnt) {
  const userIndex = getUserIndexById(id);
  if (userIndex === -1) {
    return false;
  }
  const user = users[userIndex];
  let isValid = false;
  try {
    isValid = authenticator.verify({
      token: fingerprirnt,
      secret: user.otpSecret,
    });
  } catch (error) {
    console.log(error);
  }
  return isValid;
}
module.exports = { generateTwoFAQRCode };
