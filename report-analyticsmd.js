const districts = ['Thiruvananthapuram','Kollam','Ernakulam','Thrissur','Kozhikode'];
const departments = ['Health','Education','Finance','Agriculture'];

const reports = [
  {
    id: 1, district: 'Ernakulam', department: 'Health', status: 'md pending', vendor: 'Vendor A', project: 'Covid Relief',
    budget: 1000000, requested: 800000, submitDate: '2025-05-01', lastDate: '2025-06-15',
    tracking: [
    { level: 'Municipality Checked', date: '2025-04-05' },
    { level: 'MD Reviewed', date: '2025-04-10' },
    { level: 'DM Reviewed', date: '2025-04-12' },
    { level: 'Block Panchayat Reviewed', date: '2025-04-14' },
    { level: 'Vendor Submitted', date: '2025-04-18' },
    ]
  },
  {
    id: 2, district: 'Thiruvananthapuram', department: 'Education', status: 'md pending', vendor: 'Vendor C', project: 'Digital Library',
    budget: 1000000, requested: 800000, submitDate: '2025-01-01', lastDate: '2025-09-15',
    tracking: [
    { level: 'Director Verified', date: '2025-06-05' },
    { level: 'MD Reviewed', date: '2025-07-10' },
    { level: 'DM Reviewed', date: '2025-08-12' },
    { level: 'Municipality Checked', date: '2025-09-14' },
    { level: 'Block Panchayat Reviewed', date: '2025-10-18' },
    { level: 'Vendor Submitted', date: '2025-11-20' }
    ]
  },
  {
    id: 3, district: 'Kollam', department: 'Finance', status: 'md pending', vendor: 'Vendor C', project: 'Infrastructure Development',
    budget: 1000000, requested: 800000, submitDate: '2025-01-01', lastDate: '2025-09-15',
    tracking: [
      {level: 'MD', date: '2025-07-02'},
      {level: 'DM', date: '2025-06-04'},
      {level: 'block panchayat', date: '2025-05-07'},
      {level: 'vendor submission', date: '2025-08-07'}
    ]
  },
  {
    id: 4, district: 'Kozhikode', department: 'Finance', status: 'md pending', vendor: 'Vendor E', project: 'Urban Development',
    budget: 1000000, requested: 800000, submitDate: '2025-01-01', lastDate: '2025-09-15',
    tracking: [
      {level: 'MD', date: '2025-07-02'},
      {level: 'DM', date: '2025-07-02'},
      {level: 'block panchayat', date: '2025-06-04'},
      {level: 'vendor submission', date: '2025-05-07'}
    ]
  },
  {
    id: 5, district: 'Kozhikode', department: 'Agriculture', status: 'md pending', vendor: 'Vendor D', project: 'Organic Farming Initiative',
    budget: 1000000, requested: 800000, submitDate: '2025-01-01', lastDate: '2025-09-15',
    tracking: [
       { level: 'Final Approval Issued', date: '2025-04-01' },
    { level: 'Finance Department Cleared', date: '2025-04-03' },
    { level: 'Director Verified', date: '2025-04-05' },
    { level: 'MD Reviewed', date: '2025-04-10' },
    { level: 'DM Reviewed', date: '2025-08-12' },
    { level: 'Municipality Checked', date: '2025-012-14' },
    { level: 'Block Panchayat Reviewed', date: '2025-17-18' },
    { level: 'Vendor Submitted', date: '2025-019-20' }
    ]
  },
  {
    id: 6, district: 'Thrissur', department: 'Education', status: 'md verified', vendor: 'Vendor B', project: 'Smart Classroom',
    budget: 500000, requested: 400000, submitDate: '2025-04-20', lastDate: '2025-06-01',
    tracking: [
      {level: 'MD', date: '2025-01-21'},
      {level: 'DM', date: '2025-02-23'},
      {level: 'block panchayat', date: '2025-03-25'},
      {level: 'vendor submission', date: '2025-04-27'}
    ]
  },
  {
    id: 7, district: 'Thrissur', department: 'Agriculture', status: 'pending', vendor: 'Vendor D', project: 'Irrigation Project',
    budget: 500000, requested: 400000, submitDate: '2025-04-20', lastDate: '2025-06-01',
    tracking: [
      {level: 'MD', date: '2025-04-21'},
      {level: 'DM', date: '2025-04-23'},
      {level: 'block panchayat', date: '2025-04-25'},
      {level: 'vendor submission', date: '2025-04-27'}
    ]
  },
  {
    id: 8, district: 'Thrissur', department: 'finance', status: 'approved', vendor: 'Vendor E', project: 'Road Construction',
    budget: 500000, requested: 400000, submitDate: '2025-04-20', lastDate: '2025-06-01',
    tracking: [
          { level: 'MD Reviewed', date: '2025-04-01' },
    { level: 'DM Reviewed', date: '2025-05-03' },
    { level: 'Municipality Checked', date: '2025-06-05' },
    { level: 'Block Panchayat Reviewed', date: '2025-07-10' },
    { level: 'Vendor Submitted', date: '2025-08-12' }
    ]
  }
];



const districtSelect = document.getElementById("districtFilter");
const departmentSelect = document.getElementById("departmentFilter");
const statusSelect = document.getElementById("statusFilter");
const reportsContainer = document.getElementById("reportsContainer");
const projectSelect = document.getElementById("projectTracker");
const timelineContainer = document.getElementById("timelineContainer"); // <--- This must exist in your HTML

function populateFilters() {
  districts.forEach(d => {
    const option = document.createElement("option");
    option.value = d;
    option.textContent = d;
    districtSelect.appendChild(option);
  });
  departments.forEach(dep => {
    const option = document.createElement("option");
    option.value = dep;
    option.textContent = dep;
    departmentSelect.appendChild(option);
  });
}

function populateProjectFilter() {
  const projectNames = [...new Set(reports.map(r => r.project))];
  projectNames.forEach(name => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    projectSelect.appendChild(option);
  });
}

function renderReports() {
  const selectedDistrict = districtSelect.value;
  const selectedDepartment = departmentSelect.value;
  const selectedStatus = statusSelect.value;

  reportsContainer.innerHTML = "";

  const filtered = reports.filter(r => {
    const districtMatch = selectedDistrict === "All" || r.district === selectedDistrict;
    const deptMatch = selectedDepartment === "All" || r.department.toLowerCase() === selectedDepartment.toLowerCase();
    const statusMatch = selectedStatus === "All" || r.status.toLowerCase() === selectedStatus.toLowerCase();
    return districtMatch && deptMatch && statusMatch;
  });

  // ✅ If no data matches, show message
  if (filtered.length === 0) {
    reportsContainer.innerHTML = `
      <div style="padding: 20px; background-color: #fff3cd; border: 1px solid #ffeeba; color: #856404; border-radius: 6px;">
        <strong>No reports found</strong> for the selected filters. Please try a different combination.
      </div>
    `;
    return;
  }

  // ✅ Render cards if data exists
  filtered.forEach(report => {
    const card = document.createElement("div");
    card.className = "report-card";

    const showReject = selectedStatus.toLowerCase() !== "md verified";

    card.innerHTML = `
      <div class="card-header">
        <h3>Project Progress Report ${report.id}</h3>
        <span class="status-label">DM REVIEWING</span>
      </div>
      <div class="card-body">
        <div class="report-info">
          <div><strong>REPORT ID</strong><br>${'RPT' + String(report.id).padStart(3, '0')}</div>
          <div><strong>DEPARTMENT</strong><br>${report.department}</div>
          <div><strong>VENDOR</strong><br>${report.vendor}</div>
          <div><strong>PROJECT</strong><br>${report.project}</div>
          <div><strong>COMPLETION</strong><br>${Math.floor(Math.random() * 100)}%</div>
        </div>
        <div class="report-info">
          <div><strong>BUDGET</strong><br>₹${(report.budget / 10000000).toFixed(1)} Cr</div>
          <div><strong>REQUESTED</strong><br>₹${(report.requested / 10000000).toFixed(1)} Cr</div>
          <div><strong>SUBMIT DATE</strong><br>${report.submitDate}</div>
          <div><strong>LAST DATE</strong><br>${report.lastDate}</div>
        </div>
      <div class="action-buttons">
  <button class="btn secondary" onclick="showViewDetails(${report.id})">👁 View Details</button>
  <button class="btn secondary" onclick="showWorkflowHistory(${report.id})">🕓 Workflow History</button>
  <button class="btn primary" onclick="showUpdateReport(${report.id})">✏️ Update Report</button>
  <button class="btn success" onclick="notifyDM('${report.id}', 'verified')">✔ Verify & Approve</button>
  ${showReject ? `<button class="btn danger" onclick="notifyDM('${report.id}', 'rejected')">✖ Reject</button>` : ''}
</div>
</div>
    `;

    reportsContainer.appendChild(card);
  });
}


function notifyDM(reportId, status) {
  alert(`Report #${reportId} is now ${status.toUpperCase()} and sent to DM.`);
}

function getFilteredReports() {
  const selectedDistrict = districtSelect.value;
  const selectedDepartment = departmentSelect.value;
  const selectedStatus = statusSelect.value;

  return reports.filter(r => {
    const districtMatch = selectedDistrict === "All" || r.district === selectedDistrict;
    const deptMatch = selectedDepartment === "All" || r.department.toLowerCase() === selectedDepartment.toLowerCase();
    const statusMatch = selectedStatus === "All" || r.status.toLowerCase() === selectedStatus.toLowerCase();
    return districtMatch && deptMatch && statusMatch;
  });
}

function downloadExcel() {
  const filtered = getFilteredReports();
  const data = filtered.map(report => ({
    ID: report.id,
    District: report.district,
    Department: report.department,
    Vendor: report.vendor,
    Project: report.project,
    Budget: report.budget,
    Requested: report.requested,
    "Submit Date": report.submitDate,
    "Last Date": report.lastDate
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Filtered Reports");
  XLSX.writeFile(wb, "filtered_reports.xlsx");
}

async function downloadPDF() {
  const filtered = getFilteredReports();
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  let y = 10;
  doc.setFontSize(14);
  doc.text("Filtered Project Reports", 10, y);
  y += 10;

  doc.setFontSize(10);
  filtered.forEach((report) => {
    if (y > 270) {
      doc.addPage();
      y = 10;
    }
    doc.text(`ID: ${report.id}`, 10, y);
    doc.text(`District: ${report.district}`, 50, y);
    y += 6;
    doc.text(`Department: ${report.department}`, 10, y);
    doc.text(`Vendor: ${report.vendor}`, 50, y);
    y += 6;
    doc.text(`Project: ${report.project}`, 10, y);
    y += 6;
    doc.text(`Budget: ₹${report.budget}`, 10, y);
    doc.text(`Requested: ₹${report.requested}`, 50, y);
    y += 6;
    doc.text(`Submit Date: ${report.submitDate}`, 10, y);
    doc.text(`Last Date: ${report.lastDate}`, 50, y);
    y += 10;
  });

  doc.save("filtered_reports.pdf");
}

// 🔁 TRACKING SYSTEM
function renderTimeline(projectName) {
  const report = reports.find(r => r.project === projectName);
  if (!report || !report.tracking) return;

  const container = document.getElementById("timelineContainer");
  container.innerHTML = `
    <h2 style="margin-bottom: 20px;">Tracking Timeline: ${report.project}</h2>
  `;

  report.tracking.forEach(step => {
    let statusClass = 'waiting';
    let statusLabel = 'WAITING';

    const level = step.level.toLowerCase();

    if (level.includes('vendor')) {
      statusClass = 'completed';
      statusLabel = 'COMPLETED';
    } else if (level.includes('panchayat')) {
      statusClass = 'approved';
      statusLabel = 'APPROVED';
    } else if (level.includes('dm')) {
      statusClass = 'pending';
      statusLabel = 'PENDING';
    } else if (level.includes('md') || level.includes('director')) {
      statusClass = 'waiting';
      statusLabel = 'WAITING';
    }

    const stepHTML = `
      <div class="timeline-step ${statusClass}">
        <h4>${step.level}</h4>
        <p>${step.date ? `Reviewed on: ${step.date}` : 'No date available'}</p>
        <span class="badge ${statusClass}">${statusLabel}</span>
      </div>
    `;
    container.innerHTML += stepHTML;
  });
}

projectSelect.addEventListener("change", () => {
  const selectedProject = projectSelect.value;
  if (selectedProject !== "All") {
    renderTimeline(selectedProject);
  } else {
    document.getElementById("timelineContainer").innerHTML = "";
  }
});

// ✅ Initialize on page load
window.onload = () => {
  populateFilters();
  populateProjectFilter();
  renderReports(); // <- this displays your report cards!
};

// ✅ Attach event listeners
districtSelect.addEventListener("change", renderReports);
departmentSelect.addEventListener("change", renderReports);
statusSelect.addEventListener("change", renderReports);
projectSelect.addEventListener("change", () => renderTimeline(projectSelect.value));
// logout system

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

function updateDateTime() {
  const now = new Date();
  document.getElementById('currentDate').textContent = now.toLocaleDateString();
  document.getElementById('currentTime').textContent = now.toLocaleTimeString();
  document.getElementById('lastUpdated').textContent = now.toLocaleString();
}
setInterval(updateDateTime, 1000);
updateDateTime();


// code of buttons functionalty

function showViewDetails(id) {
  const report = reports.find(r => r.id === id);
  const html = `
    <h3>Project Details</h3>
    <p><strong>District:</strong> ${report.district}</p>
    <p><strong>Department:</strong> ${report.department}</p>
    <p><strong>Project:</strong> ${report.project}</p>
    <p><strong>Vendor:</strong> ${report.vendor}</p>
    <p><strong>Budget:</strong> ₹${report.budget}</p>
    <p><strong>Requested:</strong> ₹${report.requested}</p>
    <p><strong>Submit Date:</strong> ${report.submitDate}</p>
    <p><strong>Last Date:</strong> ${report.lastDate}</p>
  `;
  document.getElementById("viewModalContent").innerHTML = html;
  document.getElementById("viewModal").classList.remove("hidden");
}

function showWorkflowHistory(id) {
  const report = reports.find(r => r.id === id);
  let html = `<h3>Workflow History - ${report.project}</h3><ul>`;
  report.tracking.forEach(t => {
    html += `<li><strong>${t.level}:</strong> ${t.date}</li>`;
  });
  html += `</ul>`;
  document.getElementById("historyModalContent").innerHTML = html;
  document.getElementById("historyModal").classList.remove("hidden");
}

function showUpdateReport(id) {
  const report = reports.find(r => r.id === id);
  document.getElementById("updateProject").value = report.project;
  document.getElementById("updateBudget").value = report.budget;
  document.getElementById("updateRequested").value = report.requested;
  document.getElementById("updateLastDate").value = report.lastDate;
  document.getElementById("updateForm").onsubmit = function(e) {
    e.preventDefault();
    alert("✅ Report updated successfully!");
    document.getElementById("updateModal").classList.add("hidden");
  };
  document.getElementById("updateModal").classList.remove("hidden");
}

function closePopup(e, modalId) {
  document.getElementById(modalId).classList.add("hidden");
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



