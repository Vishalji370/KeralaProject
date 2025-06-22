// Backend API Configuration
 const API_BASE_URL = 'https://api.kerala-gov.in';
//  const API_BASE_URL = 'http://localhost:3000' for the server use;

 // Replace with actual API URL
const API_ENDPOINTS = {
    departments: '/api/departments',
    uploadReport: '/api/reports/upload',
    updateStatus: '/api/departments/status'
};
// start code of notification bar icon  
 const notificationList = document.getElementById("notificationList");
  const dropdown = document.getElementById("notificationDropdown");
  const alertCount = document.getElementById("alertDot");

  let allMessages = [
    "📢 Emergency meeting at 4 PM.",
    "📝 Budget report submitted.",
    "🚧 Road maintenance alert in Sreekaryam.",
    "📊 New stats available on performance dashboard.",
    "📦 Relief materials dispatched to coastal areas.",
    "⚠️ Cyclone warning: Red alert issued.",
    "✅ 3 New projects approved.",
    "📣 DM’s circular updated on portal.",
    "📍 Site inspection scheduled tomorrow.",
    "🧪 Health department: Dengue control drive starts."
  ];

  let notifications = [];     // all notifications
  let lastSeenCount = 0;      // how many user has seen

  function toggleNotifications() {
    dropdown.classList.toggle("hidden");

    // Mark all as seen if user opened dropdown
    if (!dropdown.classList.contains("hidden")) {
      lastSeenCount = notifications.length;
      updateAlertCount();
    }
  }

  // Add new notification every 8 seconds
  setInterval(() => {
    const newMessage = allMessages[Math.floor(Math.random() * allMessages.length)];
    notifications.push(newMessage);

    const li = document.createElement("li");
    li.textContent = newMessage;
    notificationList.prepend(li);

    updateAlertCount();
  }, 8000);

  // Update visible count of unseen notifications
  function updateAlertCount() {
    const unseen = notifications.length - lastSeenCount;

    if (unseen > 0) {
      alertCount.textContent = unseen;
      alertCount.style.display = "flex";
    } else {
      alertCount.style.display = "none";
    }
  }

  // Close dropdown if clicked outside
  document.addEventListener("click", function (e) {
    const isClickInside = dropdown.contains(e.target) || e.target.closest(".notification-icon");
    if (!isClickInside) {
      dropdown.classList.add("hidden");
    }
  });
// starting code of shairing button

  // ending code of shairing button
function openGalleryPopup(button) {
  document.getElementById("galleryPopup").classList.remove("hidden");
}
function closeGalleryPopup() {
  document.getElementById("galleryPopup").classList.add("hidden");
  document.getElementById("shareDropdown").style.display = 'none';
}

function openShareDropdown(button, imageUrl) {
  const dropdown = document.getElementById("shareDropdown");

  // Position it below the button
  const rect = button.getBoundingClientRect();
  dropdown.style.top = rect.bottom + window.scrollY + "px";
  dropdown.style.left = rect.left + window.scrollX + "px";
  dropdown.style.display = "flex";

  // Set share links
  document.getElementById("share-fb").href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(imageUrl)}`;
  document.getElementById("share-wa").href = `https://api.whatsapp.com/send?text=${encodeURIComponent(imageUrl)}`;
  document.getElementById("share-tw").href = `https://twitter.com/intent/tweet?url=${encodeURIComponent(imageUrl)}`;
  document.getElementById("share-ln").href = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(imageUrl)}`;
}

// Close both popup & dropdown when clicking outside
window.addEventListener("click", function (e) {
  const popup = document.getElementById("galleryPopup");
  const dropdown = document.getElementById("shareDropdown");

  if (!e.target.closest(".popup-content") && !e.target.closest(".view-more-btn")) {
    popup.classList.add("hidden");
  }

  if (!e.target.closest(".share-btn") && !e.target.closest("#shareDropdown")) {
    dropdown.style.display = "none";
  }
});

// Department data (will be replaced by API calls)
let departments = [];
let currentDepartmentId = null;
let cameraStream = null;

// API Functions
async function fetchDepartments() {
    try {
        showToast('Loading departments...');
        
        // Simulated API call - replace with actual API
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.departments}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + getAuthToken(),
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch departments');
        }
        
        const data = await response.json();
        departments = data.departments || [];
        
        console.log('Departments loaded from API:', departments);
        showToast('Departments loaded successfully', 'success');
        
    } catch (error) {
        console.error('Error fetching departments:', error);
        
        // Fallback to local data if API fails
        departments = [
            {
                id: '1',
                name: 'Health Department',
                projects: 12,
                status: 'Ongoing',
                lastUpdated: '2025-06-10',
                completionRate: 75,
                budget: '₹2.5 Cr',
                officer: 'Dr. Priya Nair',
                icon: '⏳'
            },
            {
                id: '2',
                name: 'Public Works Department',
                projects: 8,
                status: 'Completed',
                lastUpdated: '2025-06-08',
                completionRate: 100,
                budget: '₹4.2 Cr',
                officer: 'Eng. Rajesh Kumar',
                icon: '✓'
            },
            {
                id: '3',
                name: 'Education Department',
                projects: 15,
                status: 'Pending',
                lastUpdated: '2025-06-06',
                completionRate: 45,
                budget: '₹3.8 Cr',
                officer: 'Prof. Meera Thomas',
                icon: '⏸'
            },
            {
                id: '4',
                name: 'Agriculture Department',
                projects: 10,
                status: 'Ongoing',
                lastUpdated: '2025-06-09',
                completionRate: 80,
                budget: '₹1.9 Cr',
                officer: 'Dr. Suresh Babu',
                icon: '⏳'
            }
        ];
        
        showToast('Using offline data - Please check internet connection', 'warning');
    }
}

async function updateDepartmentStatus(departmentId, newStatus) {
    try {
        showToast('Updating status...');
        
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.updateStatus}`, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + getAuthToken(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                departmentId: departmentId,
                status: newStatus,
                updatedBy: getUserId(),
                timestamp: new Date().toISOString()
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to update status');
        }
        
        // Update local data
        const departmentIndex = departments.findIndex(dept => dept.id === departmentId);
        if (departmentIndex !== -1) {
            departments[departmentIndex].status = newStatus;
            departments[departmentIndex].lastUpdated = new Date().toISOString().split('T')[0];
            departments[departmentIndex].icon = getStatusIcon(newStatus);
            
            // Update completion rate based on status
            if (newStatus === 'Completed') {
                departments[departmentIndex].completionRate = 100;
            } else if (newStatus === 'Ongoing') {
                departments[departmentIndex].completionRate = Math.max(50, departments[departmentIndex].completionRate);
            } else {
                departments[departmentIndex].completionRate = Math.min(30, departments[departmentIndex].completionRate);
            }
        }
        
        showToast(`Status updated to ${newStatus}`, 'success');
        renderDepartments();
        updateStatistics();
        updateChart();
        
    } catch (error) {
        console.error('Error updating status:', error);
        showToast('Failed to update status - Please try again', 'error');
    }
}

async function uploadReportToServer(formData) {
    try {
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.uploadReport}`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + getAuthToken()
            },
            body: formData
        });
        
        if (!response.ok) {
            throw new Error('Failed to upload report');
        }
        
        const result = await response.json();
        return result;
        
    } catch (error) {
        console.error('Error uploading report:', error);
        throw error;
    }
}

// Utility functions
function getAuthToken() {
    // Replace with actual token retrieval logic
    return localStorage.getItem('authToken') || 'demo-token';
}

function getUserId() {
    // Replace with actual user ID retrieval
    return localStorage.getItem('userId') || 'demo-user';
}

function getStatusClass(status) {
    switch (status) {
        case 'Completed': return 'status-completed';
        case 'Ongoing': return 'status-ongoing';
        case 'Pending': return 'status-pending';
        default: return 'status-pending';
    }
}

function getStatusIcon(status) {
    switch (status) {
        case 'Completed': return '✓';
        case 'Ongoing': return '⏳';
        case 'Pending': return '⏸';
        default: return '❓';
    }
}

// Toast notification functions
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    // Add type-based styling
    toast.className = `toast ${type}`;
    toastMessage.textContent = message;
    toast.classList.remove('hidden');
    
    setTimeout(() => {
        hideToast();
    }, 3000);
}

function hideToast() {
    const toast = document.getElementById('toast');
    toast.classList.add('hidden');
}

// Update statistics
function updateStatistics() {
    const totalProjects = departments.reduce((sum, dept) => sum + dept.projects, 0);
    const avgCompletion = departments.length > 0 ? 
        Math.round(departments.reduce((sum, dept) => sum + dept.completionRate, 0) / departments.length) : 0;
    
    document.getElementById('totalProjects').textContent = totalProjects;
    document.getElementById('totalDepartments').textContent = departments.length;
    document.getElementById('avgCompletion').textContent = avgCompletion + '%';
}

// Upload Modal Functions
function openUploadModal(departmentId) {
    currentDepartmentId = departmentId;
    const department = departments.find(dept => dept.id === departmentId);
    
    document.getElementById('modalTitle').textContent = `Upload Report - ${department.name}`;
    document.getElementById('uploadModal').classList.remove('hidden');
    
    // Reset form
    resetUploadForm();
}

function closeUploadModal() {
    document.getElementById('uploadModal').classList.add('hidden');
    stopCamera();
    resetUploadForm();
    currentDepartmentId = null;
}

function resetUploadForm() {
    document.getElementById('fileInput').value = '';
    document.getElementById('reportTitle').value = '';
    document.getElementById('reportDescription').value = '';
    document.getElementById('reportCategory').value = '';
    document.getElementById('capturedImage').innerHTML = '';
    document.getElementById('cameraVideo').style.display = 'none';
    document.getElementById('captureBtn').disabled = true;
}

// Camera Functions
async function startCamera() {
    try {
        cameraStream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' } // Use back camera on mobile
        });
        
        const video = document.getElementById('cameraVideo');
        video.srcObject = cameraStream;
        video.style.display = 'block';
        document.getElementById('captureBtn').disabled = false;
        
        showToast('Camera started successfully', 'success');
        
    } catch (error) {
        console.error('Error accessing camera:', error);
        showToast('Failed to access camera. Please check permissions.', 'error');
    }
}

function capturePhoto() {
    const video = document.getElementById('cameraVideo');
    const canvas = document.getElementById('captureCanvas');
    const capturedImage = document.getElementById('capturedImage');
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    
    canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        capturedImage.innerHTML = `<img src="${url}" alt="Captured photo">`;
        
        // Store the blob for upload
        capturedImage.photoBlob = blob;
        
        showToast('Photo captured successfully', 'success');
    }, 'image/jpeg', 0.8);
    
    stopCamera();
}

function stopCamera() {
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
        document.getElementById('cameraVideo').style.display = 'none';
        document.getElementById('captureBtn').disabled = true;
    }
}

// File Upload Functions
document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        // Validate file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
            showToast('File size too large. Please select a file smaller than 10MB.', 'error');
            event.target.value = '';
            return;
        }
        
        showToast(`File selected: ${file.name}`, 'success');
    }
});

async function submitReport() {
    const fileInput = document.getElementById('fileInput');
    const capturedImage = document.getElementById('capturedImage');
    const title = document.getElementById('reportTitle').value;
    const description = document.getElementById('reportDescription').value;
    const category = document.getElementById('reportCategory').value;
    
    // Validation
    if (!title.trim()) {
        showToast('Please enter a report title', 'error');
        return;
    }
    
    if (!category) {
        showToast('Please select a category', 'error');
        return;
    }
    
    if (!fileInput.files[0] && !capturedImage.photoBlob) {
        showToast('Please select a file or capture a photo', 'error');
        return;
    }
    
    // Prepare form data
    const formData = new FormData();
    formData.append('departmentId', currentDepartmentId);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('uploadedBy', getUserId());
    formData.append('timestamp', new Date().toISOString());
    
    // Add file or captured photo
    if (fileInput.files[0]) {
        formData.append('file', fileInput.files[0]);
    } else if (capturedImage.photoBlob) {
        formData.append('file', capturedImage.photoBlob, 'captured-photo.jpg');
    }
    
    try {
        document.getElementById('submitBtn').disabled = true;
        document.getElementById('submitBtn').innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
        
        showToast('Uploading report...', 'info');
        
        await uploadReportToServer(formData);
        
        showToast('Report uploaded successfully!', 'success');
        closeUploadModal();
        
        // Refresh department data
       await fetchDepartments();     // <-- Refetch latest departments from server
renderDepartments();          // Re-render updated UI
updateStatistics();
updateChart();

        
    } catch (error) {
        console.error('Upload failed:', error);
        showToast('Failed to upload report. Please try again.', 'error');
    } finally {
        document.getElementById('submitBtn').disabled = false;
        document.getElementById('submitBtn').innerHTML = 'Upload Report';
    }
}

// Handle file upload
function handleUpload(departmentId) {
    openUploadModal(departmentId);
}

// Chart variables
let departmentChart = null;

// Initialize chart
function initChart() {
    const ctx = document.getElementById('departmentChart').getContext('2d');
    
    const chartData = getChartData();
    
    departmentChart = new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Department Progress Overview',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                },
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}

// Get chart data based on current filter
function getChartData() {
    const filter = document.getElementById('departmentFilter').value;
    const filteredDepartments = filter === 'all' ? departments : departments.filter(dept => dept.name === filter);
    
    return {
        labels: filteredDepartments.map(dept => dept.name),
        datasets: [
            {
                label: 'Completion Rate (%)',
                data: filteredDepartments.map(dept => dept.completionRate),
                backgroundColor: [
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(139, 92, 246, 0.8)'
                ],
                borderColor: [
                    'rgb(16, 185, 129)',
                    'rgb(59, 130, 246)',
                    'rgb(245, 158, 11)',
                    'rgb(139, 92, 246)'
                ],
                borderWidth: 2,
                borderRadius: 4
            },
            {
                label: 'Projects Count',
                data: filteredDepartments.map(dept => dept.projects * 2), // Scale for visibility
                backgroundColor: 'rgba(99, 102, 241, 0.6)',
                borderColor: 'rgb(99, 102, 241)',
                borderWidth: 2,
                type: 'line',
                yAxisID: 'y1'
            }
        ]
    };
}

// Update chart based on filters
function updateChart() {
    if (!departmentChart) return;
    
    const chartType = document.getElementById('chartType').value;
    const newData = getChartData();
    
    // Destroy existing chart and create new one with different type if needed
    if (departmentChart.config.type !== chartType) {
        departmentChart.destroy();
        
        const ctx = document.getElementById('departmentChart').getContext('2d');
        
        let chartConfig = {
            type: chartType,
            data: newData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Department Progress Overview',
                        font: {
                            size: 16,
                            weight: 'bold'
                        }
                    },
                    legend: {
                        display: true,
                        position: 'top'
                    }
                }
            }
        };
        
        // Adjust config based on chart type
        if (chartType === 'bar' || chartType === 'line') {
            chartConfig.options.scales = {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            };
        }
        
        if (chartType === 'doughnut') {
            // For doughnut chart, only show completion rates
            chartConfig.data.datasets = [{
                label: 'Completion Rate (%)',
                data: newData.datasets[0].data,
                backgroundColor: newData.datasets[0].backgroundColor,
                borderColor: newData.datasets[0].borderColor,
                borderWidth: 2
            }];
        }
        
        departmentChart = new Chart(ctx, chartConfig);
    } else {
        // Just update data
        departmentChart.data = newData;
        departmentChart.update();
    }
}

// Filter event handlers
function handleDepartmentFilter() {
    updateChart();
    showToast('Chart filtered successfully');
}

function handleChartTypeChange() {
    updateChart();
    showToast('Chart type updated');
}

// Create department card HTML
function createDepartmentCard(department) {
    return `
        <div class="department-card" onclick="showDepartmentDetails('${department.id}')">
            <div class="card-header">
                <div class="header-row">
                    <h3 class="department-title">
                        <span style="font-size: 1.5rem;">${department.icon}</span>
                        ${department.name}
                    </h3>
                    <span class="status-badge ${getStatusClass(department.status)}">
                        ${department.status}
                    </span>
                </div>
                <p class="officer-name">Officer: ${department.officer}</p>
            </div>
            
            <div class="card-content">
                <!-- Project Stats -->
                <div class="project-stats">
                    <div class="stat-box blue">
                        <p class="stat-box-label">Total Projects</p>
                        <p class="stat-box-value">${department.projects}</p>
                    </div>
                    <div class="stat-box emerald">
                        <p class="stat-box-label">Budget</p>
                        <p class="stat-box-value">${department.budget}</p>
                    </div>
                </div>

                <!-- Completion Rate -->
                <div class="progress-section">
                    <div class="progress-header">
                        <span>Completion Rate</span>
                        <span class="progress-value">${department.completionRate}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${department.completionRate}%"></div>
                    </div>
                </div>

                <!-- Last Updated -->
                <div class="last-updated">
                    <i class="fas fa-calendar"></i>
                    <span>Last updated: ${department.lastUpdated}</span>
                </div>

                <!-- Action Buttons -->
                ${department.status === 'Pending' ? `
    <button class="reason-btn" onclick="event.stopPropagation(); showPendingReason('${department.id}')">
        <i class="fas fa-info-circle"></i> Reason
    </button>
` : ''}

                    
                    <div class="status-buttons">
                        <button class="status-btn pending" onclick="event.stopPropagation(); handleStatusUpdate('${department.id}', 'Pending')">
                            Pending
                        </button>
                        <button class="status-btn ongoing" onclick="event.stopPropagation(); handleStatusUpdate('${department.id}', 'Ongoing')">
                            Ongoing
                        </button>
                        <button class="status-btn completed" onclick="event.stopPropagation(); handleStatusUpdate('${department.id}', 'Completed')">
                            Complete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Render all departments
function renderDepartments() {
    const departmentsGrid = document.getElementById('departmentsGrid');
    
    if (departments.length === 0) {
        departmentsGrid.innerHTML = `
            <div class="loading-state">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Loading departments...</p>
            </div>
        `;
        return;
    }
    
    departmentsGrid.innerHTML = departments.map(department => createDepartmentCard(department)).join('');
}

// Initialize the dashboard
async function initDashboard() {
    // Fetch departments from backend
    await fetchDepartments();
    
    renderDepartments();
    updateStatistics();
    initChart();
    
    // Add event listeners for filters
    document.getElementById('departmentFilter').addEventListener('change', handleDepartmentFilter);
    document.getElementById('chartType').addEventListener('change', handleChartTypeChange);
    
    // Add some interactive effects
    console.log('Kerala DM Dashboard initialized successfully');
    console.log('Total departments:', departments.length);
    
    // Simulate real-time updates (optional)
    setInterval(async () => {
        // This could be used to fetch real-time data from an API
        console.log('Dashboard active - Last check:', new Date().toLocaleTimeString());
        
        // Periodically refresh data from backend
        if (Math.random() > 0.9) { // 10% chance every 30 seconds
            try {
                await fetchDepartments();
                renderDepartments();
                updateStatistics();
                updateChart();
                console.log('Auto-refreshed department data');
            } catch (error) {
                console.log('Auto-refresh failed:', error);
            }
        }
    }, 30000); // Every 30 seconds
}

// Handle status update
async function handleStatusUpdate(departmentId, newStatus) {
    await updateDepartmentStatus(departmentId, newStatus);
}

// Page Navigation Functions
function showDashboard() {
    hideAllPages();
    document.getElementById('dashboardContent').classList.remove('hidden');
    document.querySelector('.analytics-section').classList.remove('hidden');
    document.querySelector('.departments-grid').classList.remove('hidden');
    updateBreadcrumb('Dashboard');
}


function showProjectsPage() {
    hideAllPages();
    document.getElementById('projectsContent').classList.remove('hidden');
    updateBreadcrumb('Dashboard > All Projects');
    loadProjectsData();
}

function showDepartmentsPage() {
    hideAllPages();
    document.getElementById('departmentsContent').classList.remove('hidden');
    updateBreadcrumb('Dashboard > All Departments');
    loadAllDepartmentsData();
    updateStatistics(); // Move it here
}


function showNotificationsPage() {
    hideAllPages();
    document.getElementById('notificationsContent').classList.remove('hidden');
    updateBreadcrumb('Dashboard > Notifications');
    loadNotificationsData();
}

function showDepartmentDetails(departmentId) {
    hideAllPages();
    document.getElementById('departmentDetailsContent').classList.remove('hidden');
    const department = departments.find(dept => dept.id === departmentId);
    updateBreadcrumb(`Dashboard > ${department.name} Details`);
    loadDepartmentDetails(departmentId);
}
function hideAllPages() {
    
    document.getElementById('projectsContent').classList.add('hidden');
    document.getElementById('departmentsContent').classList.add('hidden');
    document.getElementById('notificationsContent').classList.add('hidden');
    document.getElementById('departmentDetailsContent').classList.add('hidden');
    document.getElementById('projectTrackerContent').classList.add('hidden');
 const pages = document.querySelectorAll('.page-content');
  pages.forEach(page => page.classList.add('hidden'));
    // Also hide graphs and stats under dashboard
    const analyticsSection = document.querySelector('.analytics-section');
    const departmentsGrid = document.getElementById('departmentsGrid');

    if (analyticsSection) analyticsSection.classList.add('hidden');
    if (departmentsGrid) departmentsGrid.classList.add('hidden');
}


function updateBreadcrumb(path) {
    document.getElementById('breadcrumbPath').textContent = ' > ' + path;
}

// Projects distric all project Page Functions all projects data
async function loadProjectsData() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/projects`);
    if (!res.ok) throw new Error('Server responded with error');

    const data = await res.json();
    const projects = data.projects;

    setupProjectsFilters(projects);
    renderProjects(projects);

  } catch (err) {
    console.error('Server unavailable, using offline dummy data:', err);
    showToast('Server not reachable - showing offline projects', 'warning');

    const projects = generateProjectsDataOffline(); // fallback
    setupProjectsFilters(projects);
    renderProjects(projects);
  }
}
function generateProjectsDataOffline() {
    const departmentsList = [
        'Health Department',
        'Education Department',
        'Agriculture Department',
        'Public Works Department',
        'Energy Department',
        'Transport Department'
    ];

    const projects = [];

    for (let i = 1; i <= 45; i++) {
        const dept = departmentsList[i % departmentsList.length];
        projects.push({
            id: `P${i}`,
            name: `${dept} Project ${i}`,
            department: dept,
            vendor: `Vendor ${Math.floor(Math.random() * 100) + 1} Ltd.`,
            budget: `₹${(Math.random() * 4 + 1).toFixed(2)} Cr`,
            status: ['Completed', 'Ongoing', 'Pending'][i % 3],
            startDate: `2024-${String(i % 12 + 1).padStart(2, '0')}-01`,
            endDate: `2025-${String((i + 3) % 12 + 1).padStart(2, '0')}-28`,
            completion: Math.floor(Math.random() * 100),
            contact: `+91 9${Math.floor(100000000 + Math.random() * 899999999)}`,
            email: `project${i}@${dept.replace(/\s+/g, '').toLowerCase()}.gov.in`,
            pendingReason: (i % 3 === 2) ? 'Approval delayed due to budget reallocation and site clearance pending from forest department.' : ''
            
        });
     
    }
     
    return projects;
}
function setupProjectsFilters(projects) {
  const departmentFilter = document.getElementById('projectDepartmentFilter');
  departmentFilter.innerHTML = '<option value="all">All Departments</option>';

  const uniqueDepts = [...new Set(projects.map(p => p.department))];
  uniqueDepts.forEach(dept => {
    departmentFilter.innerHTML += `<option value="${dept}">${dept}</option>`;
  });

  departmentFilter.addEventListener('change', () => filterProjects(projects));
  document.getElementById('projectStatusFilter').addEventListener('change', () => filterProjects(projects));
}




function generateProjectsData() {
    const projects = [];
    departments.forEach(dept => {
        for (let i = 1; i <= dept.projects; i++) {
            projects.push({
                id: `${dept.id}-P${i}`,
                name: `${dept.name} Project ${i}`,
                department: dept.name,
                vendor: `Vendor ${Math.floor(Math.random() * 50) + 1} Ltd.`,
                budget: `₹${(Math.random() * 5 + 0.5).toFixed(1)} Cr`,
                status: ['Completed', 'Ongoing', 'Pending'][Math.floor(Math.random() * 3)],
                startDate: `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
                endDate: `2025-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
                completion: Math.floor(Math.random() * 100),
                contact: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
                email: `project${i}@${dept.name.toLowerCase().replace(/\s+/g, '')}.gov.in`
            });
        }
    });
    return projects;
}

function renderProjects(projects) {
    const projectsList = document.getElementById('projectsList');
    
    if (projects.length === 0) {
        projectsList.innerHTML = '<div class="loading-state"><p>No projects found</p></div>';
        return;
    }
    
    projectsList.innerHTML = projects.map(project => `
        <div class="project-card">
            <div class="project-header">
                <div>
                    <h3 class="project-title">${project.name}</h3>
                    <span class="status-badge ${getStatusClass(project.status)}">${project.status}</span>
                </div>
            </div>
            
            <div class="project-meta">
                <div class="meta-item">
                    <span class="meta-label">Department</span>
                    <span class="meta-value">${project.department}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Vendor</span>
                    <span class="meta-value">${project.vendor}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Budget</span>
                    <span class="meta-value">${project.budget}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Completion</span>
                    <span class="meta-value">${project.completion}%</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Start Date</span>
                    <span class="meta-value">${project.startDate}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">End Date</span>
                    <span class="meta-value">${project.endDate}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Contact</span>
                    <span class="meta-value">${project.contact}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Email</span>
                    <span class="meta-value">${project.email}</span>
                </div>
            </div>
            
            <div class="progress-section">
                <div class="progress-header">
                    <span>Progress</span>
                    <span class="progress-value">${project.completion}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${project.completion}%"></div>
                </div>
            </div>
${project.status === 'Pending' ? `
    <div style="margin-top: 1rem;">
        <button class="status-btn pending" onclick="showReasonPopup('${project.pendingReason || 'Reason not available'}')">Reason</button>
    </div>
` : ''}


        </div>
    `).join('');
}

function filterProjects(allProjects) {
    const deptFilter = document.getElementById('projectDepartmentFilter').value;
    const statusFilter = document.getElementById('projectStatusFilter').value;
    
    let filteredProjects = allProjects;
    
    if (deptFilter !== 'all') {
        filteredProjects = filteredProjects.filter(project => project.department === deptFilter);
    }
    
    if (statusFilter !== 'all') {
        filteredProjects = filteredProjects.filter(project => project.status === statusFilter);
    }
    
    renderProjects(filteredProjects);
}

// All Departments Page Functions
function loadAllDepartmentsData() {
    const allDepartmentsList = document.getElementById('allDepartmentsList');
    
    const departmentDetails = [
        {
            ...departments.find(d => d.name === 'Health Department'),
            address: 'Medical College Campus, Trivandrum - 695011',
            phone: '+91 471 2528895',
            email: 'health.tvm@kerala.gov.in',
            website: 'health.kerala.gov.in',
            establishedYear: '1957',
            totalStaff: '2,450',
            facilities: ['District Hospital', 'CHCs: 15', 'PHCs: 82', 'Sub Centers: 165']
        },
        {
            ...departments.find(d => d.name === 'Public Works Department'),
            address: 'PWD Complex, Vellayambalam, Trivandrum - 695003',
            phone: '+91 471 2314567',
            email: 'pwd.tvm@kerala.gov.in',
            website: 'pwd.kerala.gov.in',
            establishedYear: '1950',
            totalStaff: '1,850',
            facilities: ['Road Network: 2,500 km', 'Bridges: 120', 'Buildings: 450']
        },
        {
            ...departments.find(d => d.name === 'Education Department'),
            address: 'DPI Complex, Thycaud, Trivandrum - 695014',
            phone: '+91 471 2327890',
            email: 'education.tvm@kerala.gov.in',
            website: 'education.kerala.gov.in',
            establishedYear: '1956',
            totalStaff: '18,500',
            facilities: ['Schools: 1,250', 'Colleges: 85', 'Universities: 3', 'Training Centers: 12']
        },
        {
            ...departments.find(d => d.name === 'Agriculture Department'),
            address: 'Krishi Bhavan, Vellayambalam, Trivandrum - 695033',
            phone: '+91 471 2302345',
            email: 'agriculture.tvm@kerala.gov.in',
            website: 'agriculture.kerala.gov.in',
            establishedYear: '1958',
            totalStaff: '950',
            facilities: ['Farm Centers: 45', 'Seed Farms: 8', 'Warehouses: 25', 'Labs: 6']
        }
    ];
    
    allDepartmentsList.innerHTML = departmentDetails.map(dept => `
        <div class="department-detail-card">
            <div class="department-detail-header">
                <h3 class="department-detail-title">
                    <span style="font-size: 2rem;">${dept.icon}</span>
                    ${dept.name}
                </h3>
                <span class="status-badge ${getStatusClass(dept.status)}">${dept.status}</span>
                <p><strong>Officer:</strong> ${dept.officer}</p>
                <p><strong>Established:</strong> ${dept.establishedYear}</p>
            </div>
            
            <div class="department-contact">
                <div class="contact-item">
                    <div class="contact-label">Phone</div>
                    <div class="contact-value">${dept.phone}</div>
                </div>
                <div class="contact-item">
                    <div class="contact-label">Email</div>
                    <div class="contact-value">${dept.email}</div>
                </div>
                <div class="contact-item">
                    <div class="contact-label">Website</div>
                    <div class="contact-value">${dept.website}</div>
                </div>
                <div class="contact-item">
                    <div class="contact-label">Staff Count</div>
                    <div class="contact-value">${dept.totalStaff}</div>
                </div>
            </div>
            
            <div class="address-section">
                <h4><i class="fas fa-map-marker-alt"></i> Address</h4>
                <p>${dept.address}</p>
            </div>
            
            <div class="facilities-section">
                <h4><i class="fas fa-building"></i> Key Facilities</h4>
                <ul class="facilities-list">
                    ${dept.facilities.map(facility => `<li>${facility}</li>`).join('')}
                </ul>
            </div>
            
            <div class="action-buttons">
                <button class="upload-btn" onclick="handleUpload('${dept.id}')">
                    <i class="fas fa-upload"></i>
                    Upload Report
                </button>
                <button class="upload-btn" onclick="showDepartmentDetails('${dept.id}')">
                    <i class="fas fa-info-circle"></i>
                    View Details
                </button>
            </div>
        </div>
    `).join('');
}

// Notifications Page Functions
function loadNotificationsData() {
    const notificationsList = document.getElementById('notificationsList');
    
    const notifications = generateNotifications();
    
    notificationsList.innerHTML = notifications.map(notification => `
        <div class="notification-item">
            <div class="notification-header">
                <h4 class="notification-title">${notification.title}</h4>
                <span class="notification-time">${notification.time}</span>
            </div>
            <div class="notification-body">${notification.message}</div>
            <div class="notification-meta">
                <span class="notification-vendor">From: ${notification.vendor}</span>
                <span class="notification-priority priority-${notification.priority}">${notification.priority.toUpperCase()}</span>
            </div>
        </div>
    `).join('');
    
    // Auto-scroll to show new notifications
    startNotificationScroll();
}

function generateNotifications() {
    const notifications = [];
    const currentTime = new Date();
    
    for (let i = 0; i < 25; i++) {
        const notificationTime = new Date(currentTime - (i * 30 * 60 * 1000)); // 30 minutes apart
        notifications.push({
            id: i + 1,
            title: `Project Update - ${departments[Math.floor(Math.random() * departments.length)].name}`,
            message: [
                'Construction work completed for Phase 1. Materials delivered and quality check passed.',
                'Budget revision required due to material cost increase. Approval needed for additional ₹50,000.',
                'Weather delay reported. Work will resume on Monday. No impact on overall timeline.',
                'Equipment malfunction reported. Replacement parts ordered and delivery expected tomorrow.',
                'Local community meeting conducted successfully. No objections raised for Phase 2.',
                'Soil testing completed. Results are satisfactory for foundation work to proceed.',
                'Environmental clearance received from district authorities. Work can proceed as planned.',
                'Labor shortage reported. Additional workers being arranged through employment exchange.'
            ][Math.floor(Math.random() * 8)],
            vendor: `${['ABC Construction', 'XYZ Contractors', 'DEF Builders', 'GHI Infrastructure', 'JKL Engineering'][Math.floor(Math.random() * 5)]}`,
            time: notificationTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
            priority: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)]
        });
    }
    
    return notifications;
}

function startNotificationScroll() {
    const notificationsList = document.getElementById('notificationsList');
    let scrollPosition = 0;
    
    setInterval(() => {
        scrollPosition += 1;
        if (scrollPosition >= notificationsList.scrollHeight - notificationsList.clientHeight) {
            scrollPosition = 0;
        }
        notificationsList.scrollTop = scrollPosition;
    }, 100);
}

// Department Details Page Functions
function loadDepartmentDetails(departmentId) {
    const department = departments.find(dept => dept.id === departmentId);
    const title = document.getElementById('departmentDetailsTitle');
    const body = document.getElementById('departmentDetailsBody');
    
    title.innerHTML = `<i class="fas fa-info-circle"></i> ${department.name} - Complete Details`;
    
    // Generate detailed information
    const projects = generateProjectsData().filter(p => p.department === department.name);
    const staff = generateStaffData(department);
    const budget = generateBudgetData(department);
    
    body.innerHTML = `
        <div class="detail-section">
            <h3><i class="fas fa-chart-line"></i> Performance Overview</h3>
            <div class="detail-grid">
                <div class="detail-item">
                    <span class="detail-label">Total Projects</span>
                    <span class="detail-value">${department.projects}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Completion Rate</span>
                    <span class="detail-value">${department.completionRate}%</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Budget Allocated</span>
                    <span class="detail-value">${department.budget}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Last Updated</span>
                    <span class="detail-value">${department.lastUpdated}</span>
                </div>
            </div>
        </div>
        
        <div class="detail-section">
            <h3><i class="fas fa-users"></i> Staff Information</h3>
            <div class="detail-grid">
                <div class="detail-item">
                    <span class="detail-label">Department Head</span>
                    <span class="detail-value">${department.officer}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Total Staff</span>
                    <span class="detail-value">${staff.total}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Officers</span>
                    <span class="detail-value">${staff.officers}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Field Staff</span>
                    <span class="detail-value">${staff.fieldStaff}</span>
                </div>
            </div>
        </div>
        
        <div class="detail-section">
            <h3><i class="fas fa-rupee-sign"></i> Budget Details</h3>
            <div class="detail-grid">
                <div class="detail-item">
                    <span class="detail-label">Total Budget</span>
                    <span class="detail-value">${budget.total}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Utilized</span>
                    <span class="detail-value">${budget.utilized}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Remaining</span>
                    <span class="detail-value">${budget.remaining}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Utilization %</span>
                    <span class="detail-value">${budget.utilizationPercent}%</span>
                </div>
            </div>
        </div>
        
        <div class="detail-section">
            <h3><i class="fas fa-project-diagram"></i> Recent Projects</h3>
            <div class="projects-mini-list">
                ${projects.slice(0, 3).map(project => `
                    <div class="detail-item">
                        <span class="detail-label">${project.name}</span>
                        <span class="detail-value status-badge ${getStatusClass(project.status)}">${project.status}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function generateStaffData(department) {
    const baseStaff = {
        'Health Department': { total: 2450, officers: 245, fieldStaff: 2205 },
        'Public Works Department': { total: 1850, officers: 185, fieldStaff: 1665 },
        'Education Department': { total: 18500, officers: 1850, fieldStaff: 16650 },
        'Agriculture Department': { total: 950, officers: 95, fieldStaff: 855 }
    };
    
    return baseStaff[department.name] || { total: 100, officers: 10, fieldStaff: 90 };
}

function generateBudgetData(department) {
    const budgetValue = parseFloat(department.budget.replace('₹', '').replace(' Cr', ''));
    const utilized = budgetValue * (department.completionRate / 100);
    const remaining = budgetValue - utilized;
    
    return {
        total: department.budget,
        utilized: `₹${utilized.toFixed(1)} Cr`,
        remaining: `₹${remaining.toFixed(1)} Cr`,
        utilizationPercent: department.completionRate
    };
}

// Initialize dashboard on page load
document.addEventListener('DOMContentLoaded', function() {
    showDashboard(); // Show dashboard by default
    initDashboard();
    
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(event) {
        // Ctrl+R to refresh data
        if (event.ctrlKey && event.key === 'r') {
            event.preventDefault();
            showToast('Refreshing data...', 'info');
            fetchDepartments().then(() => {
                renderDepartments();
                updateStatistics();
                updateChart();
                showToast('Data refreshed successfully', 'success');
            });
        }
        
        // Escape to close modal
        if (event.key === 'Escape') {
            closeUploadModal();
        }
    });
    
    // Close modal when clicking outside
    document.getElementById('uploadModal').addEventListener('click', function(event) {
        if (event.target === this) {
            closeUploadModal();
        }
    });
});

// Additional utility functions for potential API integration
async function fetchDepartmentData() {
    return await fetchDepartments();
}

function saveDepartmentData() {
    // This function could be used to save data to a real API
    console.log('Saving department data:', departments);
    localStorage.setItem('dmDashboardData', JSON.stringify(departments));
}

function loadDepartmentData() {
    // Load data from localStorage if available
    const savedData = localStorage.getItem('dmDashboardData');
    if (savedData) {
        departments = JSON.parse(savedData);
        console.log('Loaded data from localStorage');
    }
}

// Load saved data on page load
loadDepartmentData();
let unreadNotifications = 3;
function updateNotificationBadge() {
    const badge = document.getElementById('notificationBadge');
    if (badge) {
        badge.textContent = unreadNotifications;
        badge.style.display = unreadNotifications > 0 ? 'inline-block' : 'none';
    }
}
setInterval(() => {
    unreadNotifications++;
    updateNotificationBadge();
}, 15000);

function showNotificationsPage() {
    hideAllPages();
    document.getElementById('notificationsContent').classList.remove('hidden');
    updateBreadcrumb('Dashboard > Notifications');
    loadNotificationsData();
    unreadNotifications = 0;
    updateNotificationBadge();
}

function toggleCard(button) {
    const content = button.closest('.department-card').querySelector('.card-content');
    if (content) {
        content.classList.toggle('hidden');
    }
}

function exportToExcel() {
    const rows = [['Project Name', 'Department', 'Budget', 'Completion']];
    document.querySelectorAll('#projectsList .project-card').forEach(card => {
        const name = card.querySelector('.project-title')?.textContent.trim() || '';
        const dept = card.querySelector('.meta-value')?.textContent.trim() || '';
        const budget = [...card.querySelectorAll('.meta-item')][2]?.querySelector('.meta-value')?.textContent || '';
        const completion = [...card.querySelectorAll('.meta-item')][3]?.querySelector('.meta-value')?.textContent || '';
        rows.push([name, dept, budget, completion]);
    });
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, "Projects");
    XLSX.writeFile(wb, "projects.xlsx");
}

function exportToPDF() {
    const doc = new jspdf.jsPDF();
    doc.text("Project List", 14, 16);
    let y = 25;
    document.querySelectorAll('#projectsList .project-card').forEach(card => {
        const name = card.querySelector('.project-title')?.textContent.trim();
        doc.text(name, 14, y);
        y += 7;
    });
    doc.save("projects.pdf");
}

document.addEventListener('DOMContentLoaded', async () => {
    updateNotificationBadge();
    await fetchDepartments();
    renderDepartments();
    updateStatistics();
    initChart();

    document.getElementById('dashboardContent').classList.remove('hidden');
    document.querySelector('.analytics-section').classList.remove('hidden');
    document.getElementById('departmentsGrid').classList.remove('hidden');
    document.getElementById('projectsContent').classList.remove('hidden');
    document.getElementById('departmentsContent').classList.remove('hidden');

    loadProjectsData();
    loadAllDepartmentsData();

    const projectSearch = document.getElementById('projectSearch');
    if (projectSearch) {
        projectSearch.addEventListener('input', e => {
            const term = e.target.value.toLowerCase();
            const cards = document.querySelectorAll('#projectsList .project-card');
            cards.forEach(card => {
                card.style.display = card.textContent.toLowerCase().includes(term) ? '' : 'none';
            });
        });
    }

    const deptSearch = document.getElementById('departmentSearch');
    if (deptSearch) {
        deptSearch.addEventListener('input', e => {
            const term = e.target.value.toLowerCase();
            const cards = document.querySelectorAll('#allDepartmentsList .department-detail-card');
            cards.forEach(card => {
                card.style.display = card.textContent.toLowerCase().includes(term) ? '' : 'none';
            });
        });
    }
});
// Real-time search for project cards
document.addEventListener('input', function (e) {
  if (e.target.id === 'projectSearch') {
    const term = e.target.value.toLowerCase();
    const cards = document.querySelectorAll('#projectsList .project-card');
    cards.forEach(card => {
      card.style.display = card.textContent.toLowerCase().includes(term) ? '' : 'none';
    });
  }

  if (e.target.id === 'departmentSearch') {
    const term = e.target.value.toLowerCase();
    const cards = document.querySelectorAll('#allDepartmentsList .department-detail-card');
    cards.forEach(card => {
      card.style.display = card.textContent.toLowerCase().includes(term) ? '' : 'none';
    });
  }
});
function confirmLogout() {
  if (confirm("Are you sure you want to logout?")) {
    localStorage.clear();
    window.location.href = 'login.html'; // or homepage if no login page exists
  }
}
function confirmLogout() {
  document.getElementById('logoutModal').classList.remove('hidden');
}

function closeLogoutModal() {
  document.getElementById('logoutModal').classList.add('hidden');
}

function logout() {
  localStorage.clear(); // Clear session, tokens etc.
  window.location.href = 'Govt_login.html'; // Redirect to login page
}
 function showSettingsPage() {
  hideAllPages();
  document.getElementById('settingsContent').classList.remove('hidden');
  updateBreadcrumb('Dashboard > Settings');
}

  function showProjectTrackerPage() {
    hideAllPages();
    document.getElementById('projectTrackerContent').classList.remove('hidden');
    document.getElementById('breadcrumbPath').textContent = ' > Project Tracker';
}
const trackingSteps = [
    { role: 'Vendor', description: 'Project submitted by vendor' },
    { role: 'Block Panchayat', description: 'Local review and forwarding' },
    { role: 'District Magistrate', description: 'District-level verification' },
    { role: 'Secretary', description: 'Department Secretary validation' },
    { role: 'Managing Director', description: 'Final approval and sanction' }
];

const dummyProjectStatus = {
    p1: 3, // up to DM verified
    p2: 5, // fully approved
    p3: 2  // under Block Panchayat
};

function renderTrackingTimeline() {
    const selectedId = document.getElementById('projectSelector').value;
    const timeline = document.getElementById('trackingTimeline');
    const info = document.getElementById('trackingInfo');

    timeline.innerHTML = '';
    info.innerHTML = '';

    if (!selectedId || !dummyProjectStatus[selectedId]) return;

    const currentStep = dummyProjectStatus[selectedId];

    trackingSteps.forEach((step, index) => {
        const isCompleted = index + 1 < currentStep;
        const isActive = index + 1 === currentStep;

        const statusClass = isCompleted ? 'completed' : isActive ? 'active' : 'waiting';

        timeline.innerHTML += `
            <div class="timeline-step ${statusClass}">
                <div class="step-icon">${isCompleted ? '✓' : isActive ? '⏳' : '...'}</div>
                <div class="step-content">
                    <h4>${step.role}</h4>
                    <p>${step.description}</p>
                    <span class="status-badge ${statusClass}">${statusClass.replace('-', ' ')}</span>
                </div>
            </div>
        `;

        info.innerHTML += `
            <div class="info-card">
                <h4>${step.role}</h4>
                <ul>
                    <li><i class="fas fa-info-circle text-success"></i> ${step.description}</li>
                    <li><i class="fas fa-calendar-alt text-success"></i> Updated on: 2025-06-10</li>
                </ul>
            </div>
        `;
    });
}
// Simulated chat message data (JSON)
const chatMessages = [
  { sender: 'dm', message: 'Hello Vendor, please update the cost estimation.', timestamp: '10:00 AM' },
  { sender: 'vendor', message: 'Sure Sir, uploading it now.', timestamp: '10:02 AM' },
  { sender: 'dm', message: 'Great, looking forward to it.', timestamp: '10:05 AM' }
];

// Render chat
function renderChatMessages(messages) {
  const chatBody = document.getElementById('chatBody');
  chatBody.innerHTML = '';

  messages.forEach(msg => {
    const div = document.createElement('div');
    div.className = `chat-message ${msg.sender === getUserRole() ? 'sent' : 'received'}`;
    
    div.innerHTML = `
      <div class="chat-avatar">
        <img src="${msg.sender === 'dm' ? 'dm.png' : 'vendor.png'}" alt="${msg.sender}" />
      </div>
      <div class="chat-bubble">
        ${msg.message}
        <small>${msg.timestamp}</small>
      </div>
    `;

    chatBody.appendChild(div);
  });

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

function showVendorTrackerPage() {
    hideAllPages();
    document.getElementById('projectTrackerContent').classList.remove('hidden');
    updateBreadcrumb('Dashboard > Project Tracker');
}

// Resion for pending information
const pendingReasons = {
  '1': 'Awaiting budget approval from central authority.',
  '2': 'Project paused due to monsoon season logistics.',
  '3': 'Need clarification from education board before moving forward.',
  '4': 'Vendor selection process is incomplete.'
};

function showPendingReason(departmentId) {
  const reasonText = pendingReasons[departmentId] || 'No reason specified.';
  const reasonPopup = document.getElementById('reasonPopup');
  const reasonContent = document.getElementById('reasonContent');
  
  reasonContent.innerHTML = `<p>${reasonText}</p>`;
  reasonPopup.classList.remove('hidden');
}

function hideReasonPopup() {
  document.getElementById('reasonPopup').classList.add('hidden');
  document.getElementById('reasonPopup').addEventListener('click', hideReasonPopup);

}

function showProjectPendingReason(projectId) {
  const project = allProjects.find(p => p.id === projectId); // use your project list
  const reasonText = project?.pendingReason || 'No specific reason provided.';
  const reasonPopup = document.getElementById('reasonPopup');
  const reasonContent = document.getElementById('reasonContent');

  reasonContent.innerHTML = `<p>${reasonText}</p>`;
  reasonPopup.classList.remove('hidden');
}
function showReasonPopup(reason) {
    const popup = document.getElementById('reasonPopup');
    const reasonContent = document.getElementById('reasonContent');
    reasonContent.innerHTML = `<p>${reason}</p>`;
    popup.classList.remove('hidden');
}

function hideReasonPopup() {
    document.getElementById('reasonPopup').classList.add('hidden');
}
// gallary code 
const imageMap = {
  flood: [
    "https://cdn.dnaindia.com/sites/default/files/2018/08/17/719158-kerala-floods.jpg?im=FitAndFill=(1200,900)",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvonUI-Epya5svtcy_EYhDTMaphfphAf2gMA&s",
    "https://th-i.thgim.com/public/news/cities/Kochi/2udfan/article24682558.ece/alternates/FREE_1200/11KI-NDRF"
  ],
  school: [
    "https://cc.pacifyca.com/storage/assets/uploads/news_images/7LzGYehyHP76NduP8FWdnYyLFlE9dWze8yltNLJY.jpg",
    "https://keralakaumudi.com/web-news/en/2025/02/NMAN0565800/image/thumb/school-no-students-kerala.1.3132963.webp",
    "https://versionweekly.com/wp-content/uploads/2020/04/How-Government-Schools-in-Kerala-Is-Changing-the-Way-We-Look-At-Them.jpg"
  ],
  health: [
    "https://assets.thehansindia.com/h-upload/2025/05/21/1552687-covid-case.webp",
    "https://s3.ap-south-1.amazonaws.com/media.thesouthfirst.com/wp-content/uploads/2025/01/The-Kerala-Medical-Services-Corporation-Limited-is-responsible-for-drugs-and-medical-equipment-in-Keralas-public-health-institutions.jpeg",
    "https://media.assettype.com/TNIE%2Fimport%2F2023%2F12%2F21%2Foriginal%2Fveena_george_EPS21_3009chn_351.jpg?w=480&auto=format%2Ccompress&fit=max"
  ],
    tourism: [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTV0SUPwtT3QOdWFZeHL484QyqCqabMEDSxmY4dxnONS2A58gGrdjukRs49-tRkDXN4kF4&usqp=CAU",
    "https://s7ap1.scene7.com/is/image/incredibleindia/1-kanakakunnu-palace-thiruvananthapuram-kerala-city-hero?qlt=82&ts=1726672509160",
    "https://s7ap1.scene7.com/is/image/incredibleindia/agasthyathoodam-biological-park-thiruvananthapuram-kerala-1-new-attr-hero?qlt=82&ts=1727367682550"
  ]
};

function openGalleryPopup(type) {
  const popup = document.getElementById("galleryPopup");
  const container = document.getElementById("popupImages");
  container.innerHTML = "";

  if (imageMap[type]) {
    imageMap[type].forEach(url => {
      const img = document.createElement("img");
      img.src = url;
      img.alt = "Gallery Image";
      img.style.width = "100%";
      img.style.borderRadius = "8px";
      container.appendChild(img);
    });
  }

  popup.classList.remove("hidden");
}

function closeGalleryPopup() {
  document.getElementById("galleryPopup").classList.add("hidden");
}
function showMediaGalleryPage() {
  hideAllPages();
  document.getElementById('mediaGalleryContent').classList.remove('hidden');
  updateBreadcrumb('Dashboard > Media Gallery');
}

window.onload = function () {
  const hash = window.location.hash;
  if (hash === "#tracker") {
    showVendorTrackerPage();
  }
};

function openAIChat() {
  document.getElementById("aiChatModal").classList.remove("hidden");
}

function closeAIChat() {
  document.getElementById("aiChatModal").classList.add("hidden");
}

function sendAIMessage() {
  const input = document.getElementById("aiMessageInput");
  const chatBox = document.getElementById("aiChatBox");
  const msg = input.value.trim();
  if (!msg) return;

  // Add user bubble
  const userBubble = `<div class="bubble user">You: ${msg}</div>`;
  chatBox.innerHTML += userBubble;

  // Scroll down
  chatBox.scrollTop = chatBox.scrollHeight;

  // Dummy AI reply
  const reply = getAIReply(msg);
  setTimeout(() => {
    const aiBubble = `<div class="bubble ai">AI: ${reply}</div>`;
    chatBox.innerHTML += aiBubble;
    chatBox.scrollTop = chatBox.scrollHeight;
  }, 600);

  input.value = "";
}

function getAIReply(userMsg) {
  const msg = userMsg.toLowerCase();
  if (msg.includes("project")) return "You can check all project statuses under the Development Project section.";
  if (msg.includes("hello") || msg.includes("hi")) return "Hello! How can I assist you today?";
  if (msg.includes("budget")) return "Budget info is visible in each department card.";
  return "I'm here to assist you with Kerala DM queries.";
}


