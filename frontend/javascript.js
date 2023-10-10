// Load the Qcode Image on the document load:
document.addEventListener("DOMContentLoaded", async function () {
  await getQRCode();
  getFingerprint();
  await trustedDeviceCheck();
});

// get QRCode
async function getQRCode() {
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
}
// Fingerprint
function getFingerprint() {
  // Initialize ClientJS
  const client = new ClientJS();

  // Get browser information
  const browserInfo = client.getBrowser();

  // Get fingerprint
  const fingerprint = client.getFingerprint();

  // Log the results to the console (you can use these values as needed)
  console.log("Browser Info:", browserInfo);
  console.log("fingerprint:", fingerprint);
}

// Trusted device
async function trustedDeviceCheck() {
  console.log("trusted device check");
  const client = new ClientJS();

  // Get fingerprint
  const fingerprint = client.getFingerprint();
  const id = "1";
  fetch("http://localhost:3500/2fa/trusted", {
    method: "POST",
    body: JSON.stringify({ fingerprint, id }),
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
      const trusted = document.getElementById("trusted");
      console.log(data);
      trusted.innerText = JSON.stringify(data);
    })
    .catch((error) => {
      console.error("Error:", error?.message);
    });
}
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
