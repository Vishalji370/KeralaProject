// Wait until DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Profile update button
  document.querySelectorAll("button")[0].addEventListener("click", () => {
    const name = document.querySelector('input[type="text"]').value.trim();
    const email = document.querySelector('input[type="email"]').value.trim();

    if (name === "" || email === "") {
      alert("Please fill out both name and email.");
    } else {
      // Simulated save action
      alert("✅ Profile updated successfully!\nName: " + name + "\nEmail: " + email);
    }
  });

  // Password change button
  document.querySelectorAll("button")[1].addEventListener("click", () => {
    const current = document.querySelectorAll('input[type="password"]')[0].value;
    const newPass = document.querySelectorAll('input[type="password"]')[1].value;
    const confirm = document.querySelectorAll('input[type="password"]')[2].value;

    if (!current || !newPass || !confirm) {
      alert("Please fill all password fields.");
    } else if (newPass !== confirm) {
      alert("❌ New password and confirmation do not match!");
    } else {
      // Simulated password change
      alert("🔒 Password changed successfully!");
    }
  });

  // Notification save button
  document.querySelectorAll("button")[2].addEventListener("click", () => {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    let preferences = [];

    checkboxes.forEach((checkbox, index) => {
      if (checkbox.checked) {
        preferences.push(checkbox.parentElement.textContent.trim());
      }
    });

    alert("🔔 Preferences saved:\n" + preferences.join("\n"));
  });
});
function openLogoutModal() {
  document.getElementById("logoutModal").style.display = "flex";
}

function closeLogoutModal() {
  document.getElementById("logoutModal").style.display = "none";
}

function confirmLogout() {
  // Optional: clear session data
  // localStorage.clear();

  // Redirect to logout page
  window.location.href = "Govt_login.html";
}
function openAIChatModal() {
  document.getElementById("aiModal").style.display = "flex";
  document.getElementById("aiChatBox").innerHTML = "";
}

function closeAIChatModal() {
  document.getElementById("aiModal").style.display = "none";
}

function sendAIMessage() {
  const input = document.getElementById("aiUserMessage");
  const chatBox = document.getElementById("aiChatBox");
  const msg = input.value.trim();
  if (!msg) return;

  // Add user bubble
  const userBubble = `<div class="bubble user">You: ${msg}</div>`;
  chatBox.innerHTML += userBubble;

  // Auto scroll
  chatBox.scrollTop = chatBox.scrollHeight;

  // AI Reply
  const lowerMsg = msg.toLowerCase();
  let reply = "I'm here to assist you with Kerala district data.";

  if (lowerMsg.includes("performance")) reply = "You can view performance in the dashboard chart.";
  else if (lowerMsg.includes("budget")) reply = "Budget is shown in each district card.";
  else if (lowerMsg.includes("status")) reply = "Status updates are available under Reports.";
  else if (lowerMsg.includes("hello") || lowerMsg.includes("hi")) reply = "Hello! How can I help you today?";
  else if (lowerMsg.includes("report")) reply = "Reports can be accessed from the sidebar.";
  else reply = "Let me look into that and get back to you.";

  // Add AI reply with delay
  setTimeout(() => {
    const aiBubble = `<div class="bubble ai">AI: ${reply}</div>`;
    chatBox.innerHTML += aiBubble;
    chatBox.scrollTop = chatBox.scrollHeight;
  }, 600);

  input.value = "";
}
// 📸 Profile Photo Preview Logic
document.getElementById("profilePhotoInput").addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      document.getElementById("profilePreview").src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});

const districts = ['Thiruvananthapuram','Kollam','Pathanamthitta','Alappuzha','Kottayam','Idukki','Ernakulam','Thrissur','Palakkad','Malappuram','Kozhikode','Wayanad','Kannur','Kasaragod'];

function toggleChatbot() {
  const modal = document.getElementById("chatbotModal");
  const isOpen = modal.style.display === "flex";
  modal.style.display = isOpen ? "none" : "flex";
  modal.style.position = "fixed";
  modal.style.top = "0";
  modal.style.left = "0";
  modal.style.width = "100%";
  modal.style.height = "100%";
  modal.style.backgroundColor = "rgba(0, 0, 0, 0.4)";
  modal.style.justifyContent = "center";
  modal.style.alignItems = "center";
  modal.style.zIndex = "9999";
}


// Close chatbot when clicking outside
window.addEventListener("click", function (e) {
  const modal = document.getElementById("chatbotModal");
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

// Populate DM dropdown
const dmSelect = document.getElementById("dmSelect");
districts.forEach(d => {
  const option = document.createElement("option");
  option.value = d;
  option.textContent = d;
  dmSelect.appendChild(option);
});

function sendMessage() {
  const dm = dmSelect.value;
  const msg = document.getElementById("userMessage").value.trim();
  const chatBox = document.getElementById("chatBox");
  if (!msg) return;

  const userMsg = `<div><strong>You:</strong> ${msg}</div>`;
  const replyMsg = `<div><strong>${dm} DM:</strong> Thank you for your message. We'll follow up shortly.</div>`;

  chatBox.innerHTML += userMsg + replyMsg;
  document.getElementById("userMessage").value = "";
  chatBox.scrollTop = chatBox.scrollHeight;
}
function updateDateTime() {
  const now = new Date();
  document.getElementById("currentDate").textContent = now.toLocaleDateString();
  document.getElementById("currentTime").textContent = now.toLocaleTimeString();
}
setInterval(updateDateTime, 1000);
updateDateTime();






