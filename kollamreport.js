// Reports & Analytics JavaScript
let currentReports = [];
let currentVendors = [];
let currentBudgets = [];
let reportsChart = null;

// API Configuration
const REPORTS_API = {
    baseUrl: 'https://api.kerala-gov.in',
    endpoints: {
        reports: '/api/vendor-reports',
        updateReport: '/api/vendor-reports/update',
        verifyReport: '/api/vendor-reports/verify',
        forwardToCM: '/api/vendor-reports/forward-cm',
        vendors: '/api/vendors',
        analytics: '/api/reports/analytics',
        budgets: '/api/budgets',
        submitBudget: '/api/budgets/submit',
        approveBudget: '/api/budgets/approve',
        notifications: '/api/notifications'
    }
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
  // end of notification cdoe 

// Workflow Status Types
const WORKFLOW_STATUS = {
    VENDOR_SUBMITTED: 'vendor-submitted',
    DM_REVIEWING: 'dm-reviewing', 
    DM_VERIFIED: 'dm-verified',
    CM_PENDING: 'cm-pending',
    CM_VERIFIED: 'cm-verified',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    WORK_AUTHORIZED: 'work-authorized'
};

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    loadReports();
    loadVendors();
    loadBudgets();
    loadAnalytics();
    setupEventListeners();
    checkForUpdates();
});

// Tab Management
function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.slider-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
    
    // Load specific data based on tab
    switch(tabName) {
        case 'reports':
            loadReports();
            break;
        case 'analytics':
            loadAnalytics();
            updateChart();
            break;
        case 'vendors':
            loadVendors();
            break;
        case 'workflow':
            loadWorkflow();
            break;
    }
}

// Load Reports from API
async function loadReports() {
    try {
        showToast('Loading vendor reports...', 'info');
        
        // Simulate API call - replace with actual API
        const response = await fetch(`${REPORTS_API.baseUrl}${REPORTS_API.endpoints.reports}`, {
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch reports');
        }
        
        const data = await response.json();
        currentReports = data.reports || [];
        
    } catch (error) {
        console.error('Error loading reports:', error);
        
        // Fallback demo data
        currentReports = generateDemoReports();
        showToast('Using demo data - Please check connection', 'warning');
    }
    
    renderReports();
    populateVendorFilter();
}

// Generate Demo Reports with Workflow Status
function generateDemoReports() {
    const departments = ['Health Department', 'Public Works Department', 'Education Department', 'Agriculture Department'];
    const vendors = ['ABC Construction Ltd', 'XYZ Contractors', 'DEF Infrastructure', 'GHI Builders', 'JKL Engineering'];
    const statuses = Object.values(WORKFLOW_STATUS);
    const reports = [];
    
    for (let i = 1; i <= 25; i++) {
        const submitDate = new Date(2025, 5, Math.floor(Math.random() * 10) + 1);
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        
        reports.push({
            id: `RPT${String(i).padStart(3, '0')}`,
            title: `Project Progress Report ${i}`,
            department: departments[Math.floor(Math.random() * departments.length)],
            vendor: vendors[Math.floor(Math.random() * vendors.length)],
            status: status,
            submitDate: submitDate.toISOString().split('T')[0],
            lastUpdate: new Date().toISOString().split('T')[0],
            projectName: `Infrastructure Project ${i}`,
            completion: Math.floor(Math.random() * 100),
            budget: `₹${(Math.random() * 10 + 1).toFixed(1)} Cr`,
            requestedAmount: `₹${(Math.random() * 5 + 0.5).toFixed(1)} Cr`,
            description: `Detailed progress report for project ${i} covering construction activities, resource utilization, and timeline adherence.`,
            vendorContact: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
            files: [`report_${i}.pdf`, `photos_${i}.zip`],
            priority: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)],
            workflowHistory: generateWorkflowHistory(status),
            dmVerifiedBy: status === WORKFLOW_STATUS.CM_VERIFIED || status === WORKFLOW_STATUS.APPROVED ? 'DM-Trivandrum' : null,
            cmVerifiedBy: status === WORKFLOW_STATUS.CM_VERIFIED || status === WORKFLOW_STATUS.APPROVED ? 'CM-Kerala' : null,
            verificationDate: status === WORKFLOW_STATUS.CM_VERIFIED || status === WORKFLOW_STATUS.APPROVED ? new Date().toISOString().split('T')[0] : null
        });
    }
    
    return reports;
}

// Generate Workflow History
function generateWorkflowHistory(currentStatus) {
    const history = [
        { status: WORKFLOW_STATUS.VENDOR_SUBMITTED, date: '2025-06-10', by: 'Vendor', notes: 'Initial submission' }
    ];
    
    if (currentStatus !== WORKFLOW_STATUS.VENDOR_SUBMITTED) {
        history.push({ status: WORKFLOW_STATUS.DM_REVIEWING, date: '2025-06-11', by: 'DM-Trivandrum', notes: 'Under review' });
    }
    
    if ([WORKFLOW_STATUS.DM_VERIFIED, WORKFLOW_STATUS.CM_PENDING, WORKFLOW_STATUS.CM_VERIFIED, WORKFLOW_STATUS.APPROVED].includes(currentStatus)) {
        history.push({ status: WORKFLOW_STATUS.DM_VERIFIED, date: '2025-06-12', by: 'DM-Trivandrum', notes: 'Verified and approved by DM' });
    }
    
    if ([WORKFLOW_STATUS.CM_PENDING, WORKFLOW_STATUS.CM_VERIFIED, WORKFLOW_STATUS.APPROVED].includes(currentStatus)) {
        history.push({ status: WORKFLOW_STATUS.CM_PENDING, date: '2025-06-12', by: 'DM-Trivandrum', notes: 'Forwarded to CM for verification' });
    }
    
    if ([WORKFLOW_STATUS.CM_VERIFIED, WORKFLOW_STATUS.APPROVED].includes(currentStatus)) {
        history.push({ status: WORKFLOW_STATUS.CM_VERIFIED, date: '2025-06-13', by: 'CM-Kerala', notes: 'Verified by Chief Minister' });
    }
    
    if (currentStatus === WORKFLOW_STATUS.APPROVED) {
        history.push({ status: WORKFLOW_STATUS.APPROVED, date: '2025-06-13', by: 'CM-Kerala', notes: 'Final approval granted' });
    }
    
    return history;
}

// Render Reports with Enhanced Workflow
function renderReports() {
    const reportsList = document.getElementById('reportsList');
    const filteredReports = filterReports();
    
    if (filteredReports.length === 0) {
        reportsList.innerHTML = '<div class="loading-state"><p>No reports found</p></div>';
        return;
    }
    
    reportsList.innerHTML = filteredReports.map(report => `
        <div class="report-card">
            <div class="report-header">
                <div>
                    <div class="report-title">${report.title}</div>
                    <span class="report-status status-${report.status}">${getStatusText(report.status)}</span>
                    ${report.dmVerifiedBy ? `<span class="verification-badge dm-verified">✓ Verified by DM</span>` : ''}
                    ${report.cmVerifiedBy ? `<span class="verification-badge cm-verified">✓ Verified by CM</span>` : ''}
                </div>
            </div>
            
            <div class="report-meta">
                <div class="meta-item">
                    <span class="meta-label">Report ID</span>
                    <span class="meta-value">${report.id}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Department</span>
                    <span class="meta-value">${report.department}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Vendor</span>
                    <span class="meta-value">${report.vendor}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Project</span>
                    <span class="meta-value">${report.projectName}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Completion</span>
                    <span class="meta-value">${report.completion}%</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Budget</span>
                    <span class="meta-value">${report.budget}</span>
                </div>
                ${report.requestedAmount ? `
                <div class="meta-item">
                    <span class="meta-label">Requested Amount</span>
                    <span class="meta-value">${report.requestedAmount}</span>
                </div>` : ''}
                <div class="meta-item">
                    <span class="meta-label">Submit Date</span>
                    <span class="meta-value">${report.submitDate}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Last Update</span>
                    <span class="meta-value">${report.lastUpdate}</span>
                </div>
            </div>
            
            ${generateWorkflowActions(report)}
        </div>
    `).join('');
}

// Generate Workflow Actions based on Status
function generateWorkflowActions(report) {
    let actions = `
        <div class="report-actions">
            <button class="action-btn btn-view" onclick="viewReport('${report.id}')">
                <i class="fas fa-eye"></i>
                View Details
            </button>
            <button class="action-btn btn-view" onclick="viewWorkflowHistory('${report.id}')">
                <i class="fas fa-history"></i>
                Workflow History
            </button>
    `;
    
    switch(report.status) {
        case WORKFLOW_STATUS.VENDOR_SUBMITTED:
        case WORKFLOW_STATUS.DM_REVIEWING:
            actions += `
             
               
            `;
            break;
      
            
            
        case WORKFLOW_STATUS.CM_VERIFIED:
        case WORKFLOW_STATUS.APPROVED:
            actions += `
                <button class="action-btn btn-authorize" onclick="authorizeWork('${report.id}')">
                    <i class="fas fa-play"></i>
                    Authorize Work
                </button>
                <button class="action-btn btn-budget" onclick="releaseBudget('${report.id}')">
                    <i class="fas fa-money-check"></i>
                    Release Budget
                </button>
            `;
            break;
            
        case WORKFLOW_STATUS.WORK_AUTHORIZED:
            actions += `
                <button class="action-btn btn-monitor" onclick="monitorProgress('${report.id}')">
                    <i class="fas fa-chart-line"></i>
                    Monitor Progress
                </button>
            `;
            break;
    }
    
    actions += '</div>';
    return actions;
}

// Enhanced Report Actions
async function verifyReport(reportId) {
    try {
        showToast('Verifying report...', 'info');
        
        const response = await fetch(`${REPORTS_API.baseUrl}${REPORTS_API.endpoints.verifyReport}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                reportId: reportId,
                verifiedBy: 'DM-Trivandrum',
                verificationDate: new Date().toISOString(),
                status: WORKFLOW_STATUS.DM_VERIFIED,
                notes: 'Verified by District Magistrate - Ready for CM review'
            })
        });
        
        // Update local data
        const reportIndex = currentReports.findIndex(r => r.id === reportId);
        if (reportIndex !== -1) {
            currentReports[reportIndex].status = WORKFLOW_STATUS.DM_VERIFIED;
            currentReports[reportIndex].dmVerifiedBy = 'DM-Trivandrum';
            currentReports[reportIndex].lastUpdate = new Date().toISOString().split('T')[0];
            currentReports[reportIndex].workflowHistory.push({
                status: WORKFLOW_STATUS.DM_VERIFIED,
                date: new Date().toISOString().split('T')[0],
                by: 'DM-Trivandrum',
                notes: 'Verified by District Magistrate'
            });
        }
        
        showToast('Report verified successfully. Ready to forward to CM.', 'success');
        renderReports();
        loadAnalytics();
        
        // Send notification to vendor
        sendNotificationToVendor(reportId, 'Your report has been verified by the District Magistrate');
        
    } catch (error) {
        console.error('Error verifying report:', error);
        showToast('Failed to verify report', 'error');
    }
}

async function forwardToCM(reportId) {
    try {
        showToast('Forwarding to CM...', 'info');
        
        const response = await fetch(`${REPORTS_API.baseUrl}${REPORTS_API.endpoints.forwardToCM}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                reportId: reportId,
                forwardedBy: 'DM-Trivandrum',
                forwardDate: new Date().toISOString(),
                priority: 'high',
                notes: 'Verified by DM and forwarded for CM approval',
                status: WORKFLOW_STATUS.CM_PENDING
            })
        });
        
        // Update local data
        const reportIndex = currentReports.findIndex(r => r.id === reportId);
        if (reportIndex !== -1) {
            currentReports[reportIndex].status = WORKFLOW_STATUS.CM_PENDING;
            currentReports[reportIndex].lastUpdate = new Date().toISOString().split('T')[0];
            currentReports[reportIndex].workflowHistory.push({
                status: WORKFLOW_STATUS.CM_PENDING,
                date: new Date().toISOString().split('T')[0],
                by: 'DM-Trivandrum',
                notes: 'Forwarded to CM for verification'
            });
        }
        
        showToast('Report forwarded to CM successfully', 'success');
        renderReports();
        loadAnalytics();
        
    } catch (error) {
        console.error('Error forwarding report:', error);
        showToast('Failed to forward report', 'error');
    }
}

async function rejectReport(reportId) {
    const reason = prompt('Please provide reason for rejection:');
    if (!reason) return;
    
    try {
        showToast('Rejecting report...', 'info');
        
        const reportIndex = currentReports.findIndex(r => r.id === reportId);
        if (reportIndex !== -1) {
            currentReports[reportIndex].status = WORKFLOW_STATUS.REJECTED;
            currentReports[reportIndex].lastUpdate = new Date().toISOString().split('T')[0];
            currentReports[reportIndex].workflowHistory.push({
                status: WORKFLOW_STATUS.REJECTED,
                date: new Date().toISOString().split('T')[0],
                by: 'DM-Trivandrum',
                notes: `Rejected: ${reason}`
            });
        }
        
        showToast('Report rejected. Vendor will be notified.', 'success');
        renderReports();
        
        // Send notification to vendor
        sendNotificationToVendor(reportId, `Your report has been rejected. Reason: ${reason}`);
        
    } catch (error) {
        console.error('Error rejecting report:', error);
        showToast('Failed to reject report', 'error');
    }
}

async function authorizeWork(reportId) {
    try {
        showToast('Authorizing work...', 'info');
        
        const reportIndex = currentReports.findIndex(r => r.id === reportId);
        if (reportIndex !== -1) {
            currentReports[reportIndex].status = WORKFLOW_STATUS.WORK_AUTHORIZED;
            currentReports[reportIndex].lastUpdate = new Date().toISOString().split('T')[0];
            currentReports[reportIndex].workflowHistory.push({
                status: WORKFLOW_STATUS.WORK_AUTHORIZED,
                date: new Date().toISOString().split('T')[0],
                by: 'DM-Trivandrum',
                notes: 'Work authorized after CM verification'
            });
        }
        
        showToast('Work authorized successfully. DM can proceed.', 'success');
        renderReports();
        
        // Send notification to vendor
        sendNotificationToVendor(reportId, 'Work has been authorized. You can proceed with the project.');
        
    } catch (error) {
        console.error('Error authorizing work:', error);
        showToast('Failed to authorize work', 'error');
    }
}

// Budget Management Functions
async function requestBudget(reportId) {
    const amount = prompt('Enter budget amount (in Crores):');
    if (!amount) return;
    
    try {
        showToast('Requesting budget...', 'info');
        
        const response = await fetch(`${REPORTS_API.baseUrl}${REPORTS_API.endpoints.submitBudget}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                reportId: reportId,
                amount: amount,
                requestedBy: 'DM-Trivandrum',
                requestDate: new Date().toISOString(),
                purpose: 'Project implementation budget',
                status: 'pending'
            })
        });
        
        showToast('Budget request submitted to DM', 'success');
        
    } catch (error) {
        console.error('Error requesting budget:', error);
        showToast('Failed to request budget', 'error');
    }
}

async function releaseBudget(reportId) {
    try {
        showToast('Releasing budget...', 'info');
        
        const report = currentReports.find(r => r.id === reportId);
        if (report && report.requestedAmount) {
            showToast(`Budget ${report.requestedAmount} released for project`, 'success');
            
            // Send notification to vendor
            sendNotificationToVendor(reportId, `Budget ${report.requestedAmount} has been released for your project`);
        }
        
    } catch (error) {
        console.error('Error releasing budget:', error);
        showToast('Failed to release budget', 'error');
    }
}

// Workflow History Viewer
function viewWorkflowHistory(reportId) {
    const report = currentReports.find(r => r.id === reportId);
    if (!report) return;
    
    const modal = document.getElementById('reportModal');
    const title = document.getElementById('modalReportTitle');
    const content = document.getElementById('modalReportContent');
    
    title.textContent = `Workflow History - ${report.title}`;
    content.innerHTML = `
        <div class="workflow-history">
            <h4>Status Timeline</h4>
            <div class="timeline">
                ${report.workflowHistory.map((step, index) => `
                    <div class="timeline-item ${index === report.workflowHistory.length - 1 ? 'current' : ''}">
                        <div class="timeline-marker"></div>
                        <div class="timeline-content">
                            <h5>${getStatusText(step.status)}</h5>
                            <p><strong>By:</strong> ${step.by}</p>
                            <p><strong>Date:</strong> ${step.date}</p>
                            <p><strong>Notes:</strong> ${step.notes}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="next-actions">
                <h4>Next Possible Actions</h4>
                <p>${getNextActions(report.status)}</p>
            </div>
        </div>
    `;
    
    modal.classList.remove('hidden');
}

function getNextActions(status) {
    switch(status) {
        case WORKFLOW_STATUS.VENDOR_SUBMITTED:
            return 'DM needs to review and verify the report';
        case WORKFLOW_STATUS.DM_VERIFIED:
            return 'DM can forward to CM for final verification';
        case WORKFLOW_STATUS.CM_PENDING:
            return 'Waiting for CM verification';
        case WORKFLOW_STATUS.CM_VERIFIED:
            return 'DM can authorize work and release budget';
        case WORKFLOW_STATUS.WORK_AUTHORIZED:
            return 'Vendor can proceed with work. Monitor progress.';
        case WORKFLOW_STATUS.REJECTED:
            return 'Vendor needs to resubmit with corrections';
        default:
            return 'No further action required';
    }
}

// Notification System
async function sendNotificationToVendor(reportId, message) {
    try {
        const response = await fetch(`${REPORTS_API.baseUrl}${REPORTS_API.endpoints.notifications}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                reportId: reportId,
                message: message,
                from: 'DM-Trivandrum',
                timestamp: new Date().toISOString(),
                type: 'workflow_update'
            })
        });
        
        console.log('Notification sent to vendor');
        
    } catch (error) {
        console.error('Error sending notification:', error);
    }
}

// Check for status updates from CM level
async function checkForUpdates() {
    try {
        // Simulate checking for CM verifications
        const cmUpdates = await fetch(`${REPORTS_API.baseUrl}/api/cm-updates`, {
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`,
                'Content-Type': 'application/json'
            }
        });
        
        // Process any CM verifications
        // Update local reports with CM verified status
        
    } catch (error) {
        console.log('No CM updates available');
    }
    
    // Check again in 30 seconds
    setTimeout(checkForUpdates, 30000);
}

// ... keep existing code (filter functions, vendor management, analytics, utility functions)

// Utility Functions
function getStatusText(status) {
    const statusMap = {
        [WORKFLOW_STATUS.VENDOR_SUBMITTED]: 'Vendor Submitted',
        [WORKFLOW_STATUS.DM_REVIEWING]: 'DM Reviewing',
        [WORKFLOW_STATUS.DM_VERIFIED]: 'DM Verified',
        [WORKFLOW_STATUS.CM_PENDING]: 'MD Pending',
        [WORKFLOW_STATUS.CM_VERIFIED]: 'MD Verified',
        [WORKFLOW_STATUS.APPROVED]: 'Approved',
        [WORKFLOW_STATUS.REJECTED]: 'Rejected',
        [WORKFLOW_STATUS.WORK_AUTHORIZED]: 'Work Authorized'
    };
    return statusMap[status] || status;
}

// ... keep existing code (remaining utility functions, event listeners, etc)

function filterReports() {
    const statusFilter = document.getElementById('statusFilter').value;
    const departmentFilter = document.getElementById('departmentFilterReports').value;
    const vendorFilter = document.getElementById('vendorFilter').value;
    
    return currentReports.filter(report => {
        const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
        const matchesDepartment = departmentFilter === 'all' || report.department.toLowerCase().includes(departmentFilter);
        const matchesVendor = vendorFilter === 'all' || report.vendor === vendorFilter;
        
        return matchesStatus && matchesDepartment && matchesVendor;
    });
}

function populateVendorFilter() {
    const vendorFilter = document.getElementById('vendorFilter');
    const vendors = [...new Set(currentReports.map(report => report.vendor))];
    
    vendorFilter.innerHTML = '<option value="all">All Vendors</option>';
    vendors.forEach(vendor => {
        vendorFilter.innerHTML += `<option value="${vendor}">${vendor}</option>`;
    });
}

async function viewReport(reportId) {
    const report = currentReports.find(r => r.id === reportId);
    if (!report) return;
    
    const modal = document.getElementById('reportModal');
    const title = document.getElementById('modalReportTitle');
    const content = document.getElementById('modalReportContent');
    
    title.textContent = `Report Details - ${report.title}`;
    content.innerHTML = `
        <div class="report-details">
            <h4>Project Information</h4>
            <p><strong>Project Name:</strong> ${report.projectName}</p>
            <p><strong>Department:</strong> ${report.department}</p>
            <p><strong>Vendor:</strong> ${report.vendor}</p>
            <p><strong>Contact:</strong> ${report.vendorContact}</p>
            <p><strong>Budget:</strong> ${report.budget}</p>
            <p><strong>Completion:</strong> ${report.completion}%</p>
            
            <h4>Report Details</h4>
            <p><strong>Description:</strong> ${report.description}</p>
            <p><strong>Priority:</strong> ${report.priority.toUpperCase()}</p>
            <p><strong>Submit Date:</strong> ${report.submitDate}</p>
            <p><strong>Last Update:</strong> ${report.lastUpdate}</p>
            
            <h4>Verification Status</h4>
            ${report.dmVerifiedBy ? `<p><strong>DM Verified by:</strong> ${report.dmVerifiedBy}</p>` : ''}
            ${report.cmVerifiedBy ? `<p><strong>CM Verified by:</strong> ${report.cmVerifiedBy}</p>` : ''}
            ${report.verificationDate ? `<p><strong>Verification Date:</strong> ${report.verificationDate}</p>` : ''}
            
            <h4>Attached Files</h4>
            <ul>
                ${report.files.map(file => `<li>${file}</li>`).join('')}
            </ul>
            
            <h4>Current Status</h4>
            <p><span class="report-status status-${report.status}">${getStatusText(report.status)}</span></p>
        </div>
    `;
    
    modal.classList.remove('hidden');
}

async function updateReport(reportId) {
    try {
        showToast('Updating report...', 'info');
        
        const response = await fetch(`${REPORTS_API.baseUrl}${REPORTS_API.endpoints.updateReport}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                reportId: reportId,
                updatedBy: 'DM-Trivandrum',
                timestamp: new Date().toISOString(),
                notes: 'Updated by District Magistrate'
            })
        });
        
        const reportIndex = currentReports.findIndex(r => r.id === reportId);
        if (reportIndex !== -1) {
            currentReports[reportIndex].lastUpdate = new Date().toISOString().split('T')[0];
        }
        
        showToast('Report updated successfully', 'success');
        renderReports();
        
    } catch (error) {
        console.error('Error updating report:', error);
        showToast('Failed to update report', 'error');
    }
}

function loadAnalytics() {
    const totalReports = currentReports.length;
    const pendingVerification = currentReports.filter(r => [WORKFLOW_STATUS.VENDOR_SUBMITTED, WORKFLOW_STATUS.DM_REVIEWING].includes(r.status)).length;
    const approvedReports = currentReports.filter(r => [WORKFLOW_STATUS.APPROVED, WORKFLOW_STATUS.WORK_AUTHORIZED].includes(r.status)).length;
    const avgProcessingTime = Math.floor(Math.random() * 7) + 3;
    
    document.getElementById('totalReports').textContent = totalReports;
    document.getElementById('pendingVerification').textContent = pendingVerification;
    document.getElementById('approvedReports').textContent = approvedReports;
    document.getElementById('avgProcessingTime').textContent = avgProcessingTime;
}

function loadVendors() {
    const vendorData = {};
    currentReports.forEach(report => {
        if (!vendorData[report.vendor]) {
            vendorData[report.vendor] = {
                name: report.vendor,
                totalReports: 0,
                approved: 0,
                pending: 0
            };
        }
        vendorData[report.vendor].totalReports++;
        if ([WORKFLOW_STATUS.APPROVED, WORKFLOW_STATUS.WORK_AUTHORIZED].includes(report.status)) {
            vendorData[report.vendor].approved++;
        } else if ([WORKFLOW_STATUS.VENDOR_SUBMITTED, WORKFLOW_STATUS.DM_REVIEWING, WORKFLOW_STATUS.DM_VERIFIED, WORKFLOW_STATUS.CM_PENDING].includes(report.status)) {
            vendorData[report.vendor].pending++;
        }
    });
    
    currentVendors = Object.values(vendorData);
    renderVendors();
}

function renderVendors() {
    const vendorsList = document.getElementById('vendorsList');
    
    vendorsList.innerHTML = currentVendors.map(vendor => `
        <div class="vendor-card">
            <div class="vendor-name">${vendor.name}</div>
            <div class="vendor-stats">
                <div class="vendor-stat">
                    <div class="stat-number">${vendor.totalReports}</div>
                    <div class="stat-label">Total Reports</div>
                </div>
                <div class="vendor-stat">
                    <div class="stat-number">${vendor.approved}</div>
                    <div class="stat-label">Approved</div>
                </div>
                <div class="vendor-stat">
                    <div class="stat-number">${vendor.pending}</div>
                    <div class="stat-label">Pending</div>
                </div>
            </div>
        </div>
    `).join('');
}

function loadWorkflow() {
    const workflowList = document.getElementById('workflowList');
    const statusCounts = {
        [WORKFLOW_STATUS.VENDOR_SUBMITTED]: currentReports.filter(r => r.status === WORKFLOW_STATUS.VENDOR_SUBMITTED).length,
        [WORKFLOW_STATUS.DM_VERIFIED]: currentReports.filter(r => r.status === WORKFLOW_STATUS.DM_VERIFIED).length,
        [WORKFLOW_STATUS.CM_PENDING]: currentReports.filter(r => r.status === WORKFLOW_STATUS.CM_PENDING).length,
        [WORKFLOW_STATUS.APPROVED]: currentReports.filter(r => r.status === WORKFLOW_STATUS.APPROVED).length
    };
    
    workflowList.innerHTML = `
        <div class="workflow-stages">
            <div class="stage-card">
                <h3>Stage 1: Vendor Submission</h3>
                <p class="stage-count">${statusCounts[WORKFLOW_STATUS.VENDOR_SUBMITTED]} reports</p>
                <p>Ground level vendors submit progress reports with photos and documentation</p>
            </div>
            <div class="stage-card">
                <h3>Stage 2: DM Verification</h3>
                <p class="stage-count">${statusCounts[WORKFLOW_STATUS.DM_VERIFIED]} reports</p>
                <p>District Magistrate reviews, updates, and verifies submitted reports</p>
            </div>
            <div class="stage-card">
                <h3>Stage 3: MD Review</h3>
                <p class="stage-count">${statusCounts[WORKFLOW_STATUS.CM_PENDING]} reports</p>
                <p>Reports forwarded to Chief Minister for final approval</p>
            </div>
            <div class="stage-card">
                <h3>Stage 4: Final Approval</h3>
                <p class="stage-count">${statusCounts[WORKFLOW_STATUS.APPROVED]} reports</p>
                <p>Reports approved and authorized for work implementation</p>
            </div>
        </div>
    `;
}

function closeReportModal() {
    document.getElementById('reportModal').classList.add('hidden');
}

function setupEventListeners() {
    document.getElementById('statusFilter').addEventListener('change', renderReports);
    document.getElementById('departmentFilterReports').addEventListener('change', renderReports);
    document.getElementById('vendorFilter').addEventListener('change', renderReports);
    
    document.getElementById('reportModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeReportModal();
        }
    });
}

function updateChart() {
    // Chart implementation for analytics
}

function getAuthToken() {
    return localStorage.getItem('authToken') || 'demo-token';
}

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
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

function loadBudgets() {
    // Budget loading functionality - placeholder for future implementation
}

function monitorProgress(reportId) {
    showToast('Monitoring progress for report ' + reportId, 'info');
    // Implementation for progress monitoring
}
function confirmLogout() {
  document.getElementById('logoutModal').classList.remove('hidden');
}

function closeLogoutModal() {
  document.getElementById('logoutModal').classList.add('hidden');
}

function logoutUser() {
  localStorage.clear(); // Clear token/session
  window.location.href = 'Govt_login.html'; // Or 'login.html'
}
