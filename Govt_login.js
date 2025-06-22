// function login() {
//   const role = document.getElementById("role").value;
//   const username = document.getElementById("username").value;
//   const password = document.getElementById("password").value;

//   if (!role || !username || !password) {
//     alert("Please fill all fields!");
//     return;
//   }
//   /*Login only if the server started */

// //   fetch("http://localhost:3000/login", {
// //     method: "POST",
// //     headers: {
// //       "Content-Type": "application/json",
// //     },
// //     body: JSON.stringify({ role, username, password }),
// //   })
// //     .then((res) => res.json())
// //     .then((data) => {
// //       if (data.success) {
// //         alert("Login successful!");

// //         // ✅ Redirect based on role
// //         switch (role) {
// //           case "cm":
// //             window.location.href = "cm_dashboard.html";
// //             break;
// //           case "md":
// //             window.location.href = "md_dashboard.html"; // Assuming MD redirects to CM dashboard
// //             break;
// //           case "dm":
// //             window.location.href = "kerala_dm_dashboard_gallery_final.html";
// //             break;
// //           case "constructor":
// //             window.location.href = "vendor-dashboard.html";
// //             break;
// //           default:
// //             alert("Unknown role. Please contact admin.");
// //         }

// //       } else {
// //         alert(data.message || "Login failed!");
// //       }
// //     })
// //     .catch((err) => {
// //       console.error(err);
// //       alert("Server error. Please try again later.");
// //     });
// // }
//  const credentials = {
//     cm: { username: "cm_user", password: "cm123" },
//     md: { username: "md_user", password: "md123" },
//     dm: { username: "dm_user", password: "dm123" },
//     constructor: { username: "vendor", password: "vendor123" }
//   };

//   const user = credentials[role];

//   if (user && user.username === username && user.password === password) {
//     alert("Login successful!");

//     // Redirect based on role
//     switch (role) {
//       case "cm":
//         window.location.href = "cm_dashboard.html";
//         break;
//       case "md":
//         window.location.href = "md_dashboard.html";
//         break;
//       case "dm":
//         window.location.href = "kerala_dm_dashboard_gallery_final.html";
//         break;
//       case "constructor":
//         window.location.href = "vendor-dashboard.html";
//         break;
//     }
//   } else {
//     alert("Invalid username or password.");
//   }
// }
let generatedCaptchaCode = "";

// Generate advanced captcha using canvas
function generateCaptcha() {
  const canvas = document.getElementById("captchaCanvas");
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Background
  ctx.fillStyle = "#f2f2f2";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Noise lines
  for (let i = 0; i < 6; i++) {
    ctx.strokeStyle = `rgba(${rand(100, 200)}, ${rand(100, 200)}, ${rand(100, 200)}, 0.6)`;
    ctx.beginPath();
    ctx.moveTo(rand(0, 150), rand(0, 50));
    ctx.lineTo(rand(0, 150), rand(0, 50));
    ctx.stroke();
  }

  // Captcha text generation
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  generatedCaptchaCode = "";
  for (let i = 0; i < 5; i++) {
    generatedCaptchaCode += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  // Draw each character with some distortion
  for (let i = 0; i < generatedCaptchaCode.length; i++) {
    const char = generatedCaptchaCode.charAt(i);
    ctx.font = `${rand(22, 30)}px Arial`;
    ctx.fillStyle = `rgb(${rand(0, 100)}, ${rand(0, 100)}, ${rand(0, 100)})`;
    ctx.save();
    ctx.translate(25 * i + 15, rand(25, 35));
    ctx.rotate((Math.random() - 0.5) * 0.5);
    ctx.fillText(char, 0, 0);
    ctx.restore();
  }
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function login() {
  const role = document.getElementById("role").value;
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const captchaInput = document.getElementById("captchaInput").value.trim();

  if (!role || !username || !password || !captchaInput) {
    alert("Please fill all fields including captcha!");
    return;
  }

  if (captchaInput.toUpperCase() !== generatedCaptchaCode) {
    alert("Incorrect captcha. Please try again.");
    generateCaptcha();
    return;
  }

  const credentials = {
    cm: { username: "cm_user", password: "cm123" },
    md: { username: "md_user", password: "md123" },
    dm: { username: "dm_user", password: "dm123" },
    constructor: { username: "vendor", password: "vendor123" }
  };

  const user = credentials[role];

  if (user && user.username === username && user.password === password) {
    alert("A verification email has been sent to your registered email address, please verify to continue.");
    switch (role) {
      case "cm":
        window.location.href = "cm_dashboard.html";
        break;
      case "md":
        window.location.href = "md_dashboard.html";
        break;
      case "dm":
        window.location.href = "kerala_dm_dashboard_gallery_final.html";
        break;
      case "constructor":
        window.location.href = "vendor-dashboard.html";
        break;
    }
  } else {
    alert("Invalid username or password.");
  }
}

function togglePassword() {
  const passwordInput = document.getElementById("password");
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
  } else {
    passwordInput.type = "password";
  }
}

// Generate captcha on initial page load
window.onload = generateCaptcha;
