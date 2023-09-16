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
function showCurrentTime() {
  const currentTime = new Date();
  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const seconds = currentTime.getSeconds();

  const formattedTime = `${hours}:${minutes}:${seconds}`;

  console.log(formattedTime);
}
module.exports = { generateTwoFAQRCode, showCurrentTime };
