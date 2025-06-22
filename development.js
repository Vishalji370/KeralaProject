// Static departments and districts
const departments = ['Education', 'Finance', 'Health', 'Agriculture'];
const districts = ['Thiruvananthapuram', 'Kollam', 'Pathanamthitta', 'Alappuzha', 'Kottayam', 'Idukki', 'Ernakulam', 'Thrissur', 'Palakkad', 'Malappuram', 'Kozhikode', 'Wayanad', 'Kannur', 'Kasaragod'];

// Dummy project data
const projects = [];
districts.forEach((district, i) => {
  departments.forEach((department, j) => {
    projects.push(
      {
        id: `${i}-${j}-r`,
        title: `${department} Initiative - ${district}`,
        district,
        department,
        status: 'running',
        budget: `₹${100 + i * 50 + j * 20} cr`,
        beneficiaries: `${(i + 1) * 1000} people`,
        area: `Area ${i + 1}`,
        img: 'https://www.shutterstock.com/image-vector/person-lightning-logo-fast-run-260nw-2438786263.jpg',
        description: 'This is a key running initiative to improve infrastructure and access to public services.'
      },
      {
        id: `${i}-${j}-u`,
        title: `${department} Infra - ${district}`,
        district,
        department,
        status: 'under-construction',
        budget: `₹${200 + i * 40 + j * 15} cr`,
        beneficiaries: `${(i + 2) * 800} people`,
        area: `Area ${i + 2}`,
        img: 'https://www.shutterstock.com/image-vector/under-construction-sign-vector-isolated-260nw-2250504483.jpg',
        description: 'This project is currently under construction with major improvements underway.'
      },
      {
        id: `${i}-${j}-p`,
        title: `${department} Plan - ${district}`,
        district,
        department,
        status: 'planning',
        budget: `₹${150 + i * 30 + j * 10} cr`,
        beneficiaries: `${(i + 3) * 500} people`,
        area: `Area ${i + 3}`,
        img: 'https://thumbs.dreamstime.com/b/group-people-planning-concept-business-plan-office-56275448.jpg',
        description: 'Planned initiative aiming to strengthen community resources and outreach.'
      }
    );
  });
});

const districtFilter = document.getElementById('districtFilter');
const departmentFilter = document.getElementById('departmentFilter');
const statusFilter = document.getElementById('statusFilter');
const grid = document.getElementById('projectGrid');

// Populate filter dropdowns
function populateFilters() {
  // Districts
  districts.forEach(d => {
    const opt = document.createElement('option');
    opt.value = d;
    opt.textContent = d;
    districtFilter.appendChild(opt);
  });

  // Departments
  departments.forEach(dep => {
    const opt = document.createElement('option');
    opt.value = dep;
    opt.textContent = dep;
    departmentFilter.appendChild(opt);
  });

  // Add 'All' to status filter
  const allStatus = document.createElement('option');
  allStatus.value = 'all';
  allStatus.textContent = 'All Status';
  statusFilter.prepend(allStatus);
}

// Render cards based on filters
function renderProjects() {
  const selectedDistrict = districtFilter.value;
  const selectedDept = departmentFilter.value;
  const selectedStatus = statusFilter.value;

  const filtered = projects.filter(p =>
    (selectedDistrict === 'all' || p.district === selectedDistrict) &&
    (selectedDept === 'all' || p.department === selectedDept) &&
    (selectedStatus === 'all' || p.status === selectedStatus)
  );

  grid.innerHTML = '';

  if (filtered.length === 0) {
    grid.innerHTML = '<p>No projects found for selected filters.</p>';
    return;
  }

  filtered.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="card-image"><img src="${p.img}" alt="${p.title}"/></div>
      <div class="card-content">
        <h2>${p.title}</h2>
        <p><strong>District:</strong> ${p.district}</p>
        <p><strong>Department:</strong> ${p.department}</p>
        <p><strong>Status:</strong> ${p.status}</p>
        <p><strong>Budget:</strong> ${p.budget}</p>
        <p><strong>Area:</strong> ${p.area}</p>
        <button class="btn" onclick="openProjectModal('${p.id}')">View Details</button>
        <button class="btn" onclick="openSatelliteModal('${p.id}')">Satellite View</button>
      </div>
    `;
    grid.appendChild(card);
  });
}
function openSatelliteModal(id) {
  const project = projects.find(p => p.id === id);
  if (!project) return;

  const modal = document.getElementById('satelliteModal');
  const content = document.getElementById('satelliteModalContent');

 content.innerHTML = `
  <span class="close" onclick="closeSatelliteModal()" style="position:absolute; top:10px; right:20px; font-size:24px; cursor:pointer;">&times;</span>
  <h2 style="margin-top: 30px;">Satellite View: ${project.title}</h2>
  <p><strong>Location:</strong> ${project.area}, ${project.district}, Kerala</p>

<img src="https://eoimages.gsfc.nasa.gov/images/imagerecords/146000/146302/world.topo.bathy.200412.3x5400x2700.jpg"
     alt="Satellite View"
     style="width:100%; max-height:300px; object-fit:cover; border-radius:10px; margin-top:10px;">



  <!-- Dummy Progress Bar -->
  <div style="margin-top:20px;">
    <p><strong>Construction Progress:</strong></p>
    <div style="width:100%; background:#ddd; border-radius:10px; overflow:hidden; height:20px;">
      <div style="width:70%; background:#4caf50; height:100%; text-align:center; color:white;">70%</div>
    </div>
  </div>

  <!-- Dummy Embedded Google Map -->
  <h3 style="margin-top:30px;">Live Map Preview</h3>
  <iframe src="https://maps.google.com/maps?q=Kerala&t=k&z=7&ie=UTF8&iwloc=&output=embed"
          width="100%" height="300" style="border:0; border-radius:10px;"></iframe>

  <!-- Fullscreen toggle button -->
  <div style="text-align:right; margin-top:15px;">
    <button onclick="toggleFullscreenSatellite()" style="padding:10px 16px; background:#00796b; color:white; border:none; border-radius:6px; cursor:pointer;">🖥 Fullscreen</button>
  </div>
  <!-- Exit Fullscreen Button -->
<div id="exitFullscreenBtn" style="display:none; text-align:right; margin-top:10px;">
  <button onclick="exitFullscreenSatellite()" style="padding:8px 14px; background:#c62828; color:white; border:none; border-radius:6px; cursor:pointer;">❌ Exit Fullscreen</button>
</div>

`;


  modal.style.display = 'flex';
}

function closeSatelliteModal() {
  document.getElementById('satelliteModal').style.display = 'none';
}


// Modal logic
function openProjectModal(id) {
  const project = projects.find(p => p.id === id);
  if (!project) return;

  const modal = document.getElementById('projectModal');
  const content = document.getElementById('projectModalContent');

  content.innerHTML = `
    <span class="close" onclick="closeProjectModal()">&times;</span>
    <h2>${project.title}</h2>
    <iframe src="https://maps.google.com/maps?q=kerala&t=&z=13&ie=UTF8&iwloc=&output=embed"
  width="100%" height="200" frameborder="0" style="border-radius:8px;"></iframe>

    <p><strong>District:</strong> ${project.district}</p>
    <p><strong>Department:</strong> ${project.department}</p>
    <p><strong>Status:</strong> ${project.status}</p>
    <p><strong>Budget:</strong> ${project.budget}</p>
    <p><strong>Area:</strong> ${project.area}</p>
    <p><strong>Beneficiaries:</strong> ${project.beneficiaries}</p>
    <p style="margin-top:10px;"><strong>Description:</strong><br>${project.description}</p>
  `;

  modal.style.display = 'flex';
  
}

function handleOutsideClick(event) {
  const modalContent = document.getElementById('projectModalContent');
  if (!modalContent.contains(event.target)) {
    closeProjectModal();
  }
}

// Logout modal
function openLogoutModal() {
  document.getElementById('logoutModal').style.display = 'block';
}

function closeLogoutModal() {
  document.getElementById('logoutModal').style.display = 'none';
}

function confirmLogout() {
  window.location.href = "Govt_login.html";
}

// Init
populateFilters();
districtFilter.value = 'all';
departmentFilter.value = 'all';
statusFilter.value = 'all';
renderProjects();
[districtFilter, departmentFilter, statusFilter].forEach(filter =>
  filter.addEventListener('change', renderProjects)
);

function updateDateTime() {
  const now = new Date();
  document.getElementById('currentDate').textContent = now.toLocaleDateString();
  document.getElementById('currentTime').textContent = now.toLocaleTimeString();
  document.getElementById('lastUpdated').textContent = now.toLocaleString();
}
setInterval(updateDateTime, 1000);
updateDateTime();

// Chatbot toggle


// Populate DM dropdown
// ✅ Ensure DOM is loaded first
window.addEventListener("DOMContentLoaded", () => {
  // ✅ Populate filter dropdowns
  populateFilters();
  districtFilter.value = 'all';
  departmentFilter.value = 'all';
  statusFilter.value = 'all';
  renderProjects();

  // ✅ Live Date/Time
  updateDateTime();
  setInterval(updateDateTime, 1000);

  // ✅ Populate Chatbot Districts
  // ✅ Populate Chatbot Dropdown Immediately After DOM Loads
const dmSelect = document.getElementById("dmSelect");
if (dmSelect) {
  const keralaDistricts = [
    "Thiruvananthapuram", "Kollam", "Pathanamthitta", "Alappuzha",
    "Kottayam", "Idukki", "Ernakulam", "Thrissur",
    "Palakkad", "Malappuram", "Kozhikode", "Wayanad",
    "Kannur", "Kasaragod"
  ];
  keralaDistricts.forEach(d => {
    const opt = document.createElement("option");
    opt.value = d;
    opt.textContent = d;
    dmSelect.appendChild(opt);
  });
}

});

// ✅ Toggle Chatbot Modal
function toggleChatbot() {
  const modal = document.getElementById("chatbotModal");
  modal.style.display = modal.style.display === "flex" ? "none" : "flex";
}
window.addEventListener("click", function (e) {
  const modal = document.getElementById("chatbotModal");
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

// ✅ Send message to DM
function sendMessage() {
  const dm = document.getElementById("dmSelect").value;
  const msg = document.getElementById("userMessage").value.trim();
  const chatBox = document.getElementById("chatBox");
  if (!msg) return;

  chatBox.innerHTML += `<div><strong>You:</strong> ${msg}</div>`;
  chatBox.innerHTML += `<div><strong>${dm} DM:</strong> Thanks for reaching out. We'll get back shortly.</div>`;
  document.getElementById("userMessage").value = "";
  chatBox.scrollTop = chatBox.scrollHeight;
}
function closeProjectModal() {
  document.getElementById('projectModal').style.display = 'none';
}

function toggleFullscreenSatellite() {
  const modal = document.getElementById('satelliteModalContent');
  const iframe = modal.querySelector("iframe");
  const exitBtn = document.getElementById('exitFullscreenBtn');

  if (!document.fullscreenElement) {
    modal.requestFullscreen().then(() => {
      exitBtn.style.display = 'block';
      iframe.classList.add("fullscreen-map"); // 👈 Add class to expand map
    }).catch(err => {
      alert(`Error attempting fullscreen: ${err.message}`);
    });
  } else {
    document.exitFullscreen();
  }
}


function exitFullscreenSatellite() {
  if (document.fullscreenElement) {
    document.exitFullscreen();
    const iframe = document.querySelector('#satelliteModalContent iframe');
    iframe.classList.remove("fullscreen-map"); // 👈 Remove fullscreen class
    document.getElementById('exitFullscreenBtn').style.display = 'none';
  }
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


