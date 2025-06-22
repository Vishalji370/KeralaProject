// Global Variables
let currentSection = 'dashboard';
let sidebarCollapsed = false;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    showSection('dashboard');
    initializeDashboardMap(); 
});
function initializeDashboardMap() {
  const mapContainer = document.getElementById('dashboardMap');
  if (!mapContainer) return;

  const map = L.map('dashboardMap').setView([10.8505, 76.2711], 7); // Kerala center
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  for (const id in dummyProjectDetails) {
    const project = dummyProjectDetails[id];
    if (project.lat && project.lng) {
      L.marker([project.lat, project.lng])
        .addTo(map)
        .bindPopup(`<strong>${project.title}</strong><br>${project.location}`);
    }
  }
}


function initializeApp() {
    console.log('Kerala Government Vendor Portal Initialized');
    
    // Set active menu item
    updateActiveMenuItem('dashboard');
    
    // Initialize project tracker
    updateTracker();
    
    // Setup document filters
    setupDocumentFilters();
}

function setupEventListeners() {
    // Sidebar toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', toggleSidebar);

    // Notification click
const bellIcon = document.querySelector('.notifications');
bellIcon.addEventListener('click', showNotificationPopups);

    // Auto show sidebar on hover (desktop only)
    const sidebar = document.getElementById('sidebar');

    sidebar.addEventListener('mouseenter', () => {
        if (window.innerWidth > 768 && sidebarCollapsed) {
            sidebarCollapsed = false;
            updateSidebarState();
        }
    });

    sidebar.addEventListener('mouseleave', () => {
        if (window.innerWidth > 768 && !sidebarCollapsed) {
            sidebarCollapsed = true;
            updateSidebarState();
        }
    });
    document.addEventListener('mousemove', (e) => {
        if (window.innerWidth > 768) {
            if (e.clientX < 20 && sidebarCollapsed) {
                sidebarCollapsed = false;
                updateSidebarState();
            } else if (e.clientX > 250 && !sidebarCollapsed) {
                sidebarCollapsed = true;
                updateSidebarState();
            }
        }
    });


    }

    // Menu items
    const menuItems = document.querySelectorAll('.menu-item a');
    menuItems.forEach(item => {
        item.addEventListener('click', handleMenuClick);
    });

    // Project form submission
    const projectForm = document.getElementById('projectForm');
    if (projectForm) {
        projectForm.addEventListener('submit', handleProjectSubmission);
    }

    // Modal close events
    const closeModal = document.querySelector('.close-modal');
    if (closeModal) {
        closeModal.addEventListener('click', closeModal);
    }

    // Click outside modal to close
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('successModal');
        if (event.target === modal) {
            closeModal();
        }
    });

    // Responsive sidebar for mobile
    if (window.innerWidth <= 768) {
        sidebarCollapsed = true;
        updateSidebarState();
    }

    // Window resize handler
    window.addEventListener('resize', handleWindowResize);
}

function toggleSidebar() {
    sidebarCollapsed = !sidebarCollapsed;
    updateSidebarState();
}

function updateSidebarState() {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (sidebarCollapsed) {
        sidebar.classList.add('collapsed');
        mainContent.classList.add('expanded');
    } else {
        sidebar.classList.remove('collapsed');
        mainContent.classList.remove('expanded');
    }
}

function handleMenuClick(event) {
    event.preventDefault();
    const href = event.currentTarget.getAttribute('href');
    const section = href.substring(1); // Remove the # symbol
    
    showSection(section);
    updateActiveMenuItem(section);
    
    // Close sidebar on mobile after menu click
    if (window.innerWidth <= 768) {
        sidebarCollapsed = true;
        updateSidebarState();
    }
}

function showSection(sectionName) {
    console.log(`Showing section: ${sectionName}`);
    
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show the requested section
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.add('active');
        targetSection.classList.add('fade-in');
        currentSection = sectionName;
        
        // Remove animation class after animation completes
        setTimeout(() => {
            targetSection.classList.remove('fade-in');
        }, 500);
    }
}

function updateActiveMenuItem(sectionName) {
    // Remove active class from all menu items
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.classList.remove('active');
    });
    
    // Add active class to current menu item
    const activeMenuItem = document.querySelector(`a[href="#${sectionName}"]`)?.parentElement;
    if (activeMenuItem) {
        activeMenuItem.classList.add('active');
    }
}

function updateTracker() {
  const projectKey = document.getElementById('projectSelect').value;
  const project = trackerData[projectKey];
  if (!project) return;

  const timelineContainer = document.querySelector('.tracking-timeline');
  const trackingInfo = document.querySelector('.tracking-info');
  
  // Clear current timeline
  timelineContainer.innerHTML = '';
  
  project.steps.forEach(step => {
    const div = document.createElement('div');
    div.className = `timeline-step ${step.status}`;
    div.innerHTML = `
      <div class="step-icon">
        <i class="fas fa-user-tie"></i>
      </div>
      <div class="step-content">
        <h4>${step.role}</h4>
        <p>${step.date ? `Updated on: ${step.date}` : 'Pending update'}</p>
        <span class="status-badge ${step.status}">${step.status.charAt(0).toUpperCase() + step.status.slice(1)}</span>
      </div>
    `;
    timelineContainer.appendChild(div);
  });

  // Update Tracking Info
  trackingInfo.innerHTML = `
    <div class="info-card">
      <h4>Current Status</h4>
      <p>${project.currentStatus}</p>
    </div>
    <div class="info-card">
      <h4>Required Documents</h4>
      <ul>
        ${project.requiredDocs.map(doc => `
          <li>
            <i class="fas fa-${doc.verified ? 'check text-success' : 'times text-danger'}"></i>
            ${doc.name}
          </li>
        `).join('')}
      </ul>
    </div>
  `;
}


function updateTimelineSteps(steps) {
    const timelineSteps = document.querySelectorAll('.timeline-step');
    
    timelineSteps.forEach((step, index) => {
        // Reset classes
        step.classList.remove('completed', 'active');
        
        if (steps[index]) {
            if (steps[index].completed) {
                step.classList.add('completed');
            } else if (steps[index].active) {
                step.classList.add('active');
            }
        }
    });
}

function handleFileUpload(input, boxId) {
    const uploadBox = document.getElementById(boxId);
    const file = input.files[0];
    
    if (file) {
        uploadBox.classList.add('uploaded');
        const icon = uploadBox.querySelector('i');
        const text = uploadBox.querySelector('p');
        
        // Update the icon and text to show successful upload
        icon.className = 'fas fa-check-circle';
        text.textContent = `${file.name} uploaded`;
        
        // Add animation
        uploadBox.classList.add('bounce');
        setTimeout(() => {
            uploadBox.classList.remove('bounce');
        }, 600);
        
        console.log(`File uploaded: ${file.name}`);
    }
}


// ... (existing code above remains unchanged)

// Updated handleProjectSubmission with backend integration
async function handleProjectSubmission(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const projectData = {
        title: formData.get('projectTitle'),
        type: formData.get('projectType'),
        cost: formData.get('estimatedCost'),
        description: formData.get('projectDescription'),
        location: formData.get('projectLocation'),
        vendorId: 'KL2024001',
        vendorName: 'Vishal Nair',
        status: 'vendor-submitted',
        submitDate: new Date().toISOString().split('T')[0]
    };

    try {
        const response = await fetch('http://localhost:3000/api/vendor-submissions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getVendorAuthToken()
            },
            body: JSON.stringify(projectData)
        });

        if (!response.ok) throw new Error('Submission failed');

        showNotification('✅ Project submitted to DM Dashboard', 'success');
        showSuccessModal();
        updateNewSubmissionCount();
        resetForm();

    } catch (err) {
        console.error('Submission Error:', err);
        showNotification('❌ Failed to submit. Please try again.', 'error');
    }
}

function getVendorAuthToken() {
    return 'demo-token'; // Replace this with actual token logic
}


function showSuccessModal() {
    const modal = document.getElementById('successModal');
    const projectId = generateProjectId();
    
    document.getElementById('generatedProjectId').textContent = projectId;
    modal.style.display = 'block';
    
    // Add animation
    const modalContent = modal.querySelector('.modal-content');
    modalContent.classList.add('bounce');
    setTimeout(() => {
        modalContent.classList.remove('bounce');
    }, 600);
}

function closeModal() {
    const modal = document.getElementById('successModal');
    modal.style.display = 'none';
}

function generateProjectId() {
    const prefix = 'KL-';
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}${year}-${random}`;
}

function resetForm() {
    const form = document.getElementById('projectForm');
    if (form) {
        form.reset();
        
        // Reset upload boxes
        const uploadBoxes = document.querySelectorAll('.upload-box');
        uploadBoxes.forEach(box => {
            box.classList.remove('uploaded');
            const icon = box.querySelector('i');
            const text = box.querySelector('p');
            
            icon.className = 'fas fa-cloud-upload-alt';
            // Reset text based on the original content
            if (box.id === 'uploadBox1') text.textContent = 'Technical Specifications';
            else if (box.id === 'uploadBox2') text.textContent = 'Cost Estimation';
            else if (box.id === 'uploadBox3') text.textContent = 'Site Survey Report';
            else if (box.id === 'uploadBox4') text.textContent = 'Environmental Clearance';
        });
    }
}

function setupDocumentFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const documentCards = document.querySelectorAll('.document-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            // Update active filter button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter documents
            documentCards.forEach(card => {
                if (filter === 'all' || card.classList.contains(filter)) {
                    card.style.display = 'block';
                    card.classList.add('fade-in');
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

function handleWindowResize() {
    if (window.innerWidth <= 768) {
        if (!sidebarCollapsed) {
            sidebarCollapsed = true;
            updateSidebarState();
        }
    } else {
        if (sidebarCollapsed) {
            sidebarCollapsed = false;
            updateSidebarState();
        }
    }
}

// Utility functions
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        padding: '1rem 2rem',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '600',
        zIndex: '3000',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease'
    });
    
    if (type === 'success') {
        notification.style.background = 'linear-gradient(45deg, #27ae60, #2ecc71)';
    } else if (type === 'error') {
        notification.style.background = 'linear-gradient(45deg, #e74c3c, #c0392b)';
    }
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function formatDate(date) {
    return new Intl.DateTimeFormat('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(date);
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(amount);
}
  function updateNewSubmissionCount() {
    const statCard = document.querySelector('.stat-card:nth-child(4) .stat-info h3');
    const submissionList = document.getElementById('submissionList');

    // Update count on Dashboard
    if (statCard) {
      const count = parseInt(statCard.textContent);
      statCard.textContent = count + 1;
    }

    // Add dummy submission item to Submissions list
    if (submissionList) {
      const div = document.createElement('div');
      div.className = 'submission-item';
      div.innerHTML = `
        <div class="submission-info">
          <h4>New Project Demo</h4>
          <p>Submitted: ${new Date().toLocaleDateString('en-IN')}</p>
        </div>
        <div class="submission-progress">
          <div class="progress-bar">
            <div class="progress-fill" style="width: 10%;"></div>
          </div>
          <span>10% Complete</span>
        </div>
      `;
      submissionList.prepend(div);
    }
  }
const dummyProjectDetails = {
  'KL-RD-2024-001': {
    title: 'Road Construction - NH47',
    location: 'Ernakulam to Palakkad',
    status: 'Approved',
    cost: '12,50,00,000',
    description: 'Renovation and widening of NH47',
    lat: 10.0159,
    lng: 76.3419
  },
  'KL-BR-2024-002': {
    title: 'Bridge Maintenance - Periyar',
    location: 'Periyar River, Aluva',
    status: 'Pending Review',
    cost: '3,75,00,000',
    description: 'Bridge repair',
    lat: 10.1060,
    lng: 76.3516
  },
  'KL-ED-2024-003': {
    title: 'School Building Construction',
    location: 'Thiruvananthapuram',
    status: 'In Progress',
    cost: '4,20,00,000',
    description: 'New Govt School',
    lat: 8.5241,
    lng: 76.9366
  }
};




function openProjectModal(projectId) {
  const detail = dummyProjectDetails[projectId];
  if (!detail) return alert("Project not found");

  document.getElementById('modalProjectTitle').textContent = detail.title;
  document.getElementById('modalProjectId').textContent = projectId;
  document.getElementById('modalStatus').textContent = detail.status;
  document.getElementById('modalDescription').textContent = detail.description;
  document.getElementById('modalLocation').textContent = detail.location;
  document.getElementById('modalCost').textContent = detail.cost;

  document.getElementById('projectDetailModal').style.display = 'block';
  
  // Clear any previous map (if necessary)
  const mapContainer = document.getElementById('projectMap');
  if (mapContainer) {
    mapContainer.innerHTML = '';
    
    // Use project's coordinates; if not found, default to Kerala's center
    const lat = detail.lat || 10.8505;
    const lng = detail.lng || 76.2711;
  
    // Delay initialization to allow the modal to fully render
    setTimeout(() => {
      // Create the map
      // Clear existing Leaflet map instance
const container = L.DomUtil.get('projectMap');
if (container && container._leaflet_id) {
  container._leaflet_id = null; // forcefully reset internal ID
}

// Re-initialize
const map = L.map('projectMap').setView([lat, lng], 10);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);
      
      // Create the marker and bind a popup with the project title
      let projectMarker = L.marker([lat, lng]).addTo(map)
                          .bindPopup(detail.title)
                          .openPopup();
      
      // Allow user to update marker by clicking on the map.
      map.on('click', function(e) {
        const newLatLng = e.latlng;
        projectMarker.setLatLng(newLatLng)
          .bindPopup("New location: " + newLatLng.toString())
          .openPopup();
        // Optionally, update the detail object or send the new coordinates to your server.
        console.log("Marker moved to:", newLatLng);
      });
    }, 300);
  }
}


function closeProjectModal() {
  document.getElementById('projectDetailModal').style.display = 'none';
}

function downloadProjectDetail() {
  const title = document.getElementById('modalProjectTitle').textContent;
  const id = document.getElementById('modalProjectId').textContent;
  const status = document.getElementById('modalStatus').textContent;
  const desc = document.getElementById('modalDescription').textContent;
  const location = document.getElementById('modalLocation').textContent;
  const cost = document.getElementById('modalCost').textContent;

  const data = [
    ["Field", "Value"],
    ["Title", title],
    ["Project ID", id],
    ["Status", status],
    ["Description", desc],
    ["Location", location],
    ["Estimated Cost", `₹${cost}`]
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Project Detail");

  const filename = `${id}_details.xlsx`;
  XLSX.writeFile(workbook, filename);
}

// for project tracker tracker isme se update hoga updateTracker()
const trackerData = {
  'project1': {
    title: 'Road Construction - NH47',
    steps: [
      { role: 'Vendor Submission', date: '15/03/2024', status: 'completed' },
      { role: 'Block Panchayat', date: '18/03/2024', status: 'completed' },
      { role: 'District Magistrate', date: '20/03/2024', status: 'active' },
      { role: 'Managing Director', date: '', status: 'waiting' },
      { role: 'State Secretary', date: '', status: 'waiting' }
    ],
    currentStatus: 'Under review by District Magistrate. Expected approval in 2-3 business days.',
    requiredDocs: [
      { name: 'Technical Specifications', verified: true },
      { name: 'Cost Estimation', verified: true },
      { name: 'Environmental Clearance', verified: false },
      { name: 'Site Survey Report', verified: true }
    ]
  },
  'project2': {
    title: 'Bridge Maintenance - Periyar',
    steps: [
      { role: 'Vendor Submission', date: '10/03/2024', status: 'completed' },
      { role: 'Block Panchayat', date: '12/03/2024', status: 'completed' },
      { role: 'District Magistrate', date: '14/03/2024', status: 'completed' },
      { role: 'Managing Director', date: '16/03/2024', status: 'active' },
      { role: 'State Secretary', date: '', status: 'waiting' }
    ],
    currentStatus: 'At Secretary level. Final decision expected soon.',
    requiredDocs: [
      { name: 'Technical Specifications', verified: true },
      { name: 'Cost Estimation', verified: true },
      { name: 'Environmental Clearance', verified: true },
      { name: 'Site Survey Report', verified: true }
    ]
  }
};

function showNotificationPopups() {
  const notifications = [
    { message: '✅ Project KL-ED-2024-003 updated to In Progress', type: 'success' },
    { message: '📤 New submission received: Bridge Maintenance', type: 'info' },
    { message: '📄 Cost_Estimation.xlsx approved', type: 'success' }
  ];

  notifications.forEach((note, index) => {
    setTimeout(() => {
      createToast(note.message, note.type);
    }, index * 1000); // delay each notification
  });
}

function createToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `popup-toast toast-${type}`;
  toast.innerText = message;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('show');
  }, 100);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => document.body.removeChild(toast), 500);
  }, 4000);
}
function toggleSidebar() {
    sidebarCollapsed = !sidebarCollapsed;
    updateSidebarState();
}

// for the logout
function showLogoutPopup() {
  const modal = document.getElementById('logoutModal');
  if (modal) modal.style.display = 'block';
}

function closeLogoutPopup() {
  const modal = document.getElementById('logoutModal');
  if (modal) modal.style.display = 'none';
}

function confirmLogout() {
  closeLogoutPopup();
  showNotification("Successfully logged out!", "success");
  // Optional: redirect to login page after delay
  setTimeout(() => {
    window.location.href = "Govt_login.html"; // Replace with your login page path
  }, 1500);
}
function showAllProjectsMapModal() {
  const modal = document.getElementById('allProjectsMapModal');
  modal.style.display = 'block';
  // Delay initialization to allow modal render
  setTimeout(() => {
    const map = L.map('allProjectsMap').setView([10.8505, 76.2711], 7);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Loop through dummy projects and add markers
    for (const id in dummyProjectDetails) {
      if (dummyProjectDetails.hasOwnProperty(id)) {
        const project = dummyProjectDetails[id];
        if (project.lat && project.lng) {
          L.marker([project.lat, project.lng])
            .addTo(map)
            .bindPopup(project.title);
        }
      }
    }
  }, 300);
}

function closeAllProjectsMapModal() {
  document.getElementById('allProjectsMapModal').style.display = 'none';
}

let currentUploadBox = null;
let videoStream = null;

function openCamera(boxId) {
  currentUploadBox = boxId;
  const modal = document.getElementById('cameraModal');
  const video = document.getElementById('video');
  modal.style.display = 'block';

  navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
    videoStream = stream;
    video.srcObject = stream;
  }).catch(err => {
    alert("Camera access denied or unavailable.");
  });
}

function closeCameraModal() {
  const modal = document.getElementById('cameraModal');
  modal.style.display = 'none';
  if (videoStream) {
    videoStream.getTracks().forEach(track => track.stop());
    videoStream = null;
  }
}

function capturePhoto() {
  const video = document.getElementById('video');
  const canvas = document.getElementById('snapshot');
  const uploadBox = document.getElementById(currentUploadBox);

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0);
  const dataURL = canvas.toDataURL('image/png');

  // Convert base64 to Blob
  const blob = dataURItoBlob(dataURL);
  const file = new File([blob], "captured-photo.png", { type: "image/png" });

  // Find correct input inside the clicked upload box
  const input = uploadBox.querySelector('input[type="file"]');
  const dataTransfer = new DataTransfer();
  dataTransfer.items.add(file);
  input.files = dataTransfer.files;

  // Trigger upload handler
  handleFileUpload(input, currentUploadBox);

  closeCameraModal();
}


// Helper to convert dataURI to Blob
function dataURItoBlob(dataURI) {
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}

// Simulated chat message data (JSON)
const chatMessages = [
  { sender: 'dm', message: 'Hello Vendor, please update the cost estimation.', timestamp: '10:00 AM' },
  { sender: 'vendor', message: 'Sure Sir, uploading it now.', timestamp: '10:02 AM' },
  { sender: 'dm', message: 'Great, looking forward to it.', timestamp: '10:05 AM' }
];

// Render chat
function renderChatMessages() {
  const chatBody = document.getElementById('chatBody');
  chatBody.innerHTML = '';

  chatMessages.forEach(msg => {
    const div = document.createElement('div');
    div.className = `chat-message ${msg.sender === getUserRole() ? 'sent' : 'received'}`;
    div.innerHTML = `${msg.message}<small>${msg.timestamp}</small>`;
    chatBody.appendChild(div);
  });

  // Auto-scroll
  chatBody.scrollTop = chatBody.scrollHeight;
}

// Toggle Chat
function toggleChatBox(event) {
  if (event) event.stopPropagation();
  document.getElementById('chatWidget').classList.toggle('active');
  renderChatMessages();
}

// Send new message
function sendMessage() {
  const input = document.getElementById('chatMessageInput');
  const text = input.value.trim();
  if (!text) return;

  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  chatMessages.push({
    sender: getUserRole(),
    message: text,
    timestamp: time
  });

  input.value = '';
  renderChatMessages();
}

// Utility: Returns 'dm' or 'vendor'
function getUserRole() {
  return location.href.includes('vendor') ? 'vendor' : 'dm';
}
// ✅ FRONTEND CHAT (Add to vendor-script.js & dm_script.js)
// ✅ FRONTEND CHAT (Add to vendor-script.js & dm_script.js)
const socket = io('http://localhost:3000');
let isTypingTimeout;

// Load messages from JSON file via API
async function loadChatMessages() {
  const res = await fetch('http://localhost:3000/api/chat');
  const messages = await res.json();
  renderChatMessages(messages);
}

// Render chat
function renderChatMessages(messages) {
  const chatBody = document.getElementById('chatBody');
  chatBody.innerHTML = '';

  messages.forEach(msg => {
    const div = document.createElement('div');
    div.className = `chat-message ${msg.sender === getUserRole() ? 'sent' : 'received'}`;
    div.innerHTML = `
      <div class="chat-avatar">
        <img src="${msg.sender === 'dm' ? 'dm1.jpg' : 'vendor.png'}" alt="${msg.sender}" />
      </div>
      <div class="chat-bubble">
        ${msg.message}<small>${msg.timestamp}</small>
      </div>
    `;
    chatBody.appendChild(div);
  });
  chatBody.scrollTop = chatBody.scrollHeight;
}

// Toggle chat widget
function toggleChatBox(event) {
  if (event) event.stopPropagation();
  const box = document.getElementById('chatWidget');
  box.classList.toggle('active');
  loadChatMessages();
}

// Send chat message
function sendMessage() {
  const input = document.getElementById('chatMessageInput');
  const message = input.value.trim();
  if (!message) return;

  const msg = {
    sender: getUserRole(),
    message,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  socket.emit('chatMessage', msg);
  input.value = '';
}

// Typing event
const inputBox = document.getElementById('chatMessageInput');
inputBox.addEventListener('input', () => {
  socket.emit('typing', getUserRole());

  if (isTypingTimeout) clearTimeout(isTypingTimeout);
  isTypingTimeout = setTimeout(() => {
    document.getElementById('typingStatus').textContent = '';
  }, 2000);
});

// Socket listeners
socket.on('chatMessage', msg => {
  loadChatMessages();
});

socket.on('typing', sender => {
  if (sender !== getUserRole()) {
    document.getElementById('typingStatus').textContent = `${sender === 'dm' ? 'District Magistrate' : 'Vendor'} is typing...`;
    clearTimeout(isTypingTimeout);
    isTypingTimeout = setTimeout(() => {
      document.getElementById('typingStatus').textContent = '';
    }, 2000);
  }
});

// Get current role
function getUserRole() {
  return location.href.includes('vendor') ? 'vendor' : 'dm';
}
function openChatbotModal() {
  document.getElementById('chatbotModal').classList.remove('hidden');
}

function closeChatbotModal() {
  document.getElementById('chatbotModal').classList.add('hidden');
}




// Export functions for global access
window.showSection = showSection;
window.updateTracker = updateTracker;
window.handleFileUpload = handleFileUpload;
window.closeModal = closeModal;
