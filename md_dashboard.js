const districts = ['Thiruvananthapuram','Kollam','Pathanamthitta','Alappuzha','Kottayam','Idukki','Ernakulam','Thrissur','Palakkad','Malappuram','Kozhikode','Wayanad','Kannur','Kasaragod'];
const departments = ['Education', 'Finance', 'Health', 'Agriculture'];

const dataStore = {};
districts.forEach(d => {
  dataStore[d] = {};
  departments.forEach(dep => {
    dataStore[d][dep] = {
      value: Math.floor(40 + Math.random() * 60),
      monthly: Array.from({ length: 6 }, () => Math.floor(20 + Math.random() * 30)),
      quarterly: Array.from({ length: 4 }, () => Math.floor(100 + Math.random() * 100))
    };
  });
});

// Populate dropdowns
const districtSelect = document.getElementById('districtSelect');
const departmentSelect = document.getElementById('departmentSelect');
const graphSelect = document.getElementById('graphSelect');

districts.forEach(d => {
  const opt = document.createElement('option');
  opt.value = d; opt.textContent = d;
  districtSelect.appendChild(opt);
});
departments.forEach(dep => {
  const opt = document.createElement('option');
  opt.value = dep; opt.textContent = dep;
  departmentSelect.appendChild(opt);
});

// Chart setup
const barChart = new Chart(document.getElementById('barChart').getContext('2d'), {
  type: 'bar',
  data: {},
  options: { responsive: true, scales: { y: { beginAtZero: true, max: 100 } } }
});
const pieChart = new Chart(document.getElementById('pieChart').getContext('2d'), {
  type: 'pie',
  data: {},
  options: { responsive: true }
});
const lineChart = new Chart(document.getElementById('lineChart').getContext('2d'), {
  type: 'line',
  data: {},
  options: { responsive: true }
});
const areaChart = new Chart(document.getElementById('areaChart').getContext('2d'), {
  type: 'line',
  data: {},
  options: {
    responsive: true,
    elements: { line: { fill: true } },
    scales: { y: { beginAtZero: true } }
  }
});

function updateCharts() {
  const district = districtSelect.value;
  const department = departmentSelect.value;
  const selectedGraph = graphSelect.value;

  let labels = [], data = [], secondaryLabels = [];

  if (district === 'All' && department === 'All') {
    labels = districts;
    data = districts.map(d => {
      const values = Object.values(dataStore[d]).map(obj => obj.value);
      return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
    });
  } else if (district !== 'All' && department === 'All') {
    labels = departments;
    data = departments.map(dep => dataStore[district][dep].value);
  } else if (district === 'All' && department !== 'All') {
    labels = districts;
    data = districts.map(d => dataStore[d][department].value);
  } else {
    labels = [district];
    data = [dataStore[district][department].value];
  }

  const chartVisibility = {
    Bar: 'barChart',
    Pie: 'pieChart',
    Line: 'lineChart',
    Area: 'areaChart'
  };

  // Hide all charts
  Object.values(chartVisibility).forEach(id => {
    document.getElementById(id).style.display = 'none';
  });

  // Show selected chart
  const chartId = chartVisibility[selectedGraph];
  document.getElementById(chartId).style.display = 'block';

  // Chart-specific data
  switch (selectedGraph) {
   case 'Bar':
  const barColors = [
    'rgba(114, 9, 32, 0.7)',   // Red
    'rgba(5, 79, 129, 0.7)',   // Blue
    'rgba(140, 102, 6, 0.7)',   // Yellow
    'rgba(6, 165, 165, 0.7)',   // Teal
    'rgba(43, 10, 110, 0.7)',  // Purple
    'rgba(234, 27, 171, 0.7)',   // Orange
    'rgba(119, 51, 67, 0.7)',  // Grey
    'rgba(86, 218, 255, 0.27)',   // Light Yellow
    'rgba(0, 54, 163, 0.7)',  // Light Grey
    'rgba(36, 133, 36, 0.7)',  // Green
    'rgba(0, 109, 137, 0.7)',    // Cyan
    'rgba(100, 0, 100, 0.7)',  // Pink
    'rgba(0, 172, 17, 0.7)',    // Dark Purple
    'rgba(18, 52, 138, 0.7)'     // Dark Teal
  ];

  barChart.data = {
    labels: labels,
    datasets: [{
      label: 'Performance %',
      data: data,
      backgroundColor: barColors.slice(0, data.length), // Match color count to data
      borderRadius: 4
    }]
  };
  barChart.update();
  break;


    case 'Pie':
      pieChart.data = {
        labels: labels,
        datasets: [{ data: data, backgroundColor: ['orange', 'purple', 'green', 'blue', 'gray', 'pink', 'red', 'teal'] }]
      };
      pieChart.update();
      break;

    case 'Line':
      const months = ['Jan','Feb','Mar','Apr','May','Jun'];
      lineChart.data = {
        labels: months,
        datasets: [{
          label: 'Monthly Progress',
          data: months.map((_, i) => {
            if (district !== 'All' && department !== 'All') {
              return dataStore[district][department].monthly[i];
            } else if (district === 'All' && department !== 'All') {
              return Math.round(districts.reduce((sum, d) => sum + dataStore[d][department].monthly[i], 0) / districts.length);
            } else {
              return Math.round(districts.reduce((sum, d) => {
                return sum + departments.reduce((s, dep) => s + dataStore[d][dep].monthly[i], 0);
              }, 0) / (districts.length * departments.length));
            }
          }),
          borderColor: 'purple',
          fill: false
        }]
      };
      lineChart.update();
      break;

    case 'Area':
      const quarters = ['Q1','Q2','Q3','Q4'];
      areaChart.data = {
        labels: quarters,
        datasets: [{
          label: 'Quarterly Budget',
          data: quarters.map((_, i) => {
            if (district !== 'All' && department !== 'All') {
              return dataStore[district][department].quarterly[i];
            } else if (district === 'All' && department !== 'All') {
              return Math.round(districts.reduce((sum, d) => sum + dataStore[d][department].quarterly[i], 0) / districts.length);
            } else {
              return Math.round(districts.reduce((sum, d) => {
                return sum + departments.reduce((s, dep) => s + dataStore[d][dep].quarterly[i], 0);
              }, 0) / (districts.length * departments.length));
            }
          }),
          backgroundColor: 'rgba(70,130,180,0.4)',
          borderColor: 'steelblue'
        }]
      };
      areaChart.update();
      break;
  }
}

districtSelect.addEventListener('change', updateCharts);
departmentSelect.addEventListener('change', updateCharts);
graphSelect.addEventListener('change', updateCharts);

updateCharts(); // initial render

function updateDateTime() {
  const now = new Date();
  document.getElementById('currentDate').textContent = now.toLocaleDateString();
  document.getElementById('currentTime').textContent = now.toLocaleTimeString();
  document.getElementById('lastUpdated').textContent = now.toLocaleString();
}
setInterval(updateDateTime, 1000);
updateDateTime();

function toggleChatbot() {
  const modal = document.getElementById("chatbotModal");
  modal.style.display = (modal.style.display === "flex" ? "none" : "flex");
}
// Close chatbot when clicking outside the modal content
window.addEventListener("click", function (e) {
  const modal = document.getElementById("chatbotModal");
  if (e.target === modal) {
    modal.style.display = "none";
  }
});


// Populate DM district dropdown
const dmSelect = document.getElementById("dmSelect");
districts.forEach(d => {
  const option = document.createElement("option");
  option.value = d;
  option.textContent = d;
  dmSelect.appendChild(option);
});

// Dummy DM replies
function sendMessage() {
  const dm = dmSelect.value;
  const msg = document.getElementById("userMessage").value.trim();
  const chatBox = document.getElementById("chatBox");
  if (!msg) return;

  const userMsg = `<div><strong>You:</strong> ${msg}</div>`;
  const replyMsg = `<div><strong>${dm} DM:</strong> Thanks for reaching out. We'll get back shortly.</div>`;

  chatBox.innerHTML += userMsg + replyMsg;
  document.getElementById("userMessage").value = "";
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Open AI Chatbot Modal
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
function openLogoutModal() {
  document.getElementById('logoutModal').style.display = 'flex';
}

function closeLogoutModal() {
  document.getElementById('logoutModal').style.display = 'none';
}

function confirmLogout() {
  window.location.href = "Govt_login.html";
}

function openDocumentUploadModal() {
  document.getElementById("docUploadModal").style.display = "flex";
}
function closeDocumentUploadModal() {
  document.getElementById("docUploadModal").style.display = "none";
}

const docSelect = document.getElementById("docDistrict");
districts.forEach(d => {
  const option = document.createElement("option");
  option.value = d;
  option.textContent = d;
  docSelect.appendChild(option);
});

document.getElementById("documentForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const district = document.getElementById("docDistrict").value;
  const fileInput = document.getElementById("docFile");
  const message = document.getElementById("uploadMessage");

  if (!fileInput.files.length) {
    message.textContent = "❌ Please select a document to upload.";
    message.style.color = "red";
    return;
  }

  const fileName = fileInput.files[0].name;
  const now = new Date().toLocaleString();

  // Show confirmation message
  message.style.color = "green";
  message.textContent = `✅ Document for ${district} submitted successfully!`;

  // Add to Upload History Table
  const tableBody = document.querySelector("#uploadHistory tbody");
  const row = document.createElement("tr");
  row.innerHTML = `
    <td style="padding: 8px; border: 1px solid #ddd;">${district}</td>
    <td style="padding: 8px; border: 1px solid #ddd;">${fileName}</td>
    <td style="padding: 8px; border: 1px solid #ddd;">${now}</td>
  `;
  tableBody.prepend(row); // latest on top

  this.reset();
});
let videoStream = null;

function openCameraModal() {
  const modal = document.getElementById("cameraModal");
  const video = document.getElementById("video");

  modal.style.display = "flex";

  navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(stream => {
      video.srcObject = stream;
      videoStream = stream;
    })
    .catch(err => {
      alert("Camera not accessible: " + err);
    });
}

function closeCameraModal() {
  const modal = document.getElementById("cameraModal");
  modal.style.display = "none";

  if (videoStream) {
    videoStream.getTracks().forEach(track => track.stop());
    videoStream = null;
  }
}

// 📸 Capture the photo and convert it to a file
function capturePhoto() {
  const video = document.getElementById("video");
  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  canvas.toBlob(function (blob) {
    const file = new File([blob], "captured-photo.png", { type: "image/png" });

    // Replace the file input with this captured file
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    document.getElementById("docFile").files = dataTransfer.files;

    // Confirmation message
    document.getElementById("uploadMessage").textContent = "📸 Photo captured and ready to upload!";
    document.getElementById("uploadMessage").style.color = "green";

    closeCameraModal();
  }, "image/png");
}
// Auto-open upload modal if redirected from other page
window.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  if (params.get('upload') === 'true') {
    openDocumentUploadModal();
  }
});

