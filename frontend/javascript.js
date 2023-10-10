// Load the Qcode Image on the document load:
document.addEventListener("DOMContentLoaded", function () {
  fetch("http://localhost:3500/2fa/enable", {
    method: "POST",
    body: JSON.stringify({ id: "1" }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Failed to fetch QR code image");
      }
    })
    .then((data) => {
      const qrCodeImage = document.getElementById("qrCodeImage");
      qrCodeImage.src = data.qrcode;
    })
    .catch((error) => {
      console.error("Error:", error?.message);
    });
});

// Verify OTP
document.getElementById("otpForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const otpInput = document.getElementById("otp");
  const otpValue = otpInput.value;
  fetch("http://localhost:3500/2fa/verify", {
    method: "POST",
    body: JSON.stringify({ id: "1", otp: otpValue }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        console.log("OTP verification successful");
      } else {
        console.error("OTP verification failed");
      }
    })
    .catch((error) => {
      console.error("Error:", error?.message);
    });
});

// Initialize ClientJS
var client = new ClientJS();

// Get browser information
var browserInfo = client.getBrowser();

// Get device information
var deviceInfo = client.getDevice();

// Log the results to the console (you can use these values as needed)
console.log("Browser Info:", browserInfo);
console.log("Device Info:", deviceInfo);
