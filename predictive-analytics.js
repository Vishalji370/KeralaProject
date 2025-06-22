// Predictive Analytics Page JavaScript

// Initialize Lucide icons when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide icons
    lucide.createIcons();
    
    // Populate content sections
    populateKeyCapabilities();
    populateSolutionHighlights();
    populateBusinessImpacts();
    
    // Add scroll animations
    setupScrollAnimations();
    
    // Add interaction handlers
    setupInteractionHandlers();
});

// Key Capabilities data
const keyCapabilities = [
    {
        icon: "calendar",
        title: "Project Timeline Forecasting",
        description: "Predict project completion dates and identify potential delays before they impact delivery schedules."
    },
    {
        icon: "dollar-sign",
        title: "Budget Consumption Prediction",
        description: "Forecast spending patterns and budget utilization to prevent cost overruns and optimize financial planning."
    },
    {
        icon: "users",
        title: "Resource Demand Forecasting",
        description: "Anticipate staffing needs and resource requirements across departments and projects."
    },
    {
        icon: "alert-triangle",
        title: "Early Warning System",
        description: "Receive automated alerts for potential risks, bottlenecks, and compliance issues before they escalate."
    },
    {
        icon: "settings",
        title: "Scenario Simulation",
        description: "Model different scenarios and their outcomes to make informed strategic decisions."
    }
];

// Solution Highlights data
const solutionHighlights = [
    {
        icon: "bar-chart-3",
        title: "Fully Integrated Dashboards",
        description: "Seamlessly embedded into your existing governance workflows"
    },
    {
        icon: "zap",
        title: "Real-time Data Processing",
        description: "Instant insights from live data streams and updates"
    },
    {
        icon: "refresh-cw",
        title: "Continuous Model Learning",
        description: "AI models that improve accuracy over time with new data"
    },
    {
        icon: "layers",
        title: "Customizable Per Department",
        description: "Tailored analytics for specific organizational needs"
    },
    {
        icon: "building-2",
        title: "Multi-agency Scalability",
        description: "Designed to scale across multiple departments and agencies"
    }
];

// Business Impact data
const businessImpacts = [
    {
        icon: "target",
        title: "Improved Project Delivery",
        description: "95% on-time completion rate with predictive insights"
    },
    {
        icon: "trending-up",
        title: "Optimized Resource Utilization",
        description: "30% improvement in resource allocation efficiency"
    },
    {
        icon: "shield",
        title: "Reduced Cost Overruns",
        description: "Average 25% reduction in budget overages"
    },
    {
        icon: "eye",
        title: "Enhanced Operational Visibility",
        description: "Complete transparency across all governance processes"
    },
    {
        icon: "check-circle",
        title: "Proactive Governance",
        description: "Shift from reactive to predictive decision-making"
    }
];

// Populate Key Capabilities section
function populateKeyCapabilities() {
    const container = document.getElementById('keyCapabilities');
    
    keyCapabilities.forEach((capability, index) => {
        const cardHTML = `
            <div class="capability-card p-6 bg-white border-2 border-slate-200 hover:border-blue-300 rounded-lg opacity-0 card-enter" data-index="${index}">
                <div class="flex items-center mb-4">
                    <div class="p-3 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg mr-4">
                        <i data-lucide="${capability.icon}" class="w-6 h-6 text-blue-600"></i>
                    </div>
                    <h3 class="text-xl font-semibold text-slate-800">
                        ${capability.title}
                    </h3>
                </div>
                <p class="text-slate-600 leading-relaxed">
                    ${capability.description}
                </p>
            </div>
        `;
        container.innerHTML += cardHTML;
    });
    
    // Re-initialize icons for the new content
    lucide.createIcons();
}

// Populate Solution Highlights section
function populateSolutionHighlights() {
    const container = document.getElementById('solutionHighlights');
    
    solutionHighlights.forEach((highlight, index) => {
        const cardHTML = `
            <div class="highlight-card text-center p-6 bg-white rounded-lg border border-slate-200 opacity-0 card-enter" style="animation-delay: ${0.1 * (index + 1)}s">
                <div class="inline-flex p-4 bg-gradient-to-br from-cyan-100 to-green-100 rounded-lg mb-4">
                    <i data-lucide="${highlight.icon}" class="w-8 h-8 text-cyan-600"></i>
                </div>
                <h3 class="text-lg font-semibold mb-2 text-slate-800">${highlight.title}</h3>
                <p class="text-sm text-slate-600">${highlight.description}</p>
            </div>
        `;
        container.innerHTML += cardHTML;
    });
    
    // Re-initialize icons for the new content
    lucide.createIcons();
}

// Populate Business Impact section
function populateBusinessImpacts() {
    const container = document.getElementById('businessImpacts');
    
    businessImpacts.forEach((impact, index) => {
        const cardHTML = `
            <div class="impact-card flex items-start p-6 bg-gradient-to-br from-slate-50 to-blue-50 rounded-lg border border-slate-200 opacity-0 card-enter" style="animation-delay: ${0.1 * (index + 1)}s">
                <div class="flex-shrink-0 p-3 bg-green-100 rounded-lg mr-4">
                    <i data-lucide="${impact.icon}" class="w-6 h-6 text-green-600"></i>
                </div>
                <div>
                    <h3 class="text-lg font-semibold mb-2 text-slate-800">${impact.title}</h3>
                    <p class="text-sm text-slate-600">${impact.description}</p>
                </div>
            </div>
        `;
        container.innerHTML += cardHTML;
    });
    
    // Re-initialize icons for the new content
    lucide.createIcons();
}

// Setup scroll animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all cards
    document.querySelectorAll('.card-enter').forEach(card => {
        observer.observe(card);
    });
}

// Setup interaction handlers
function setupInteractionHandlers() {
    // Add hover effects to capability cards
    const capabilityCards = document.querySelectorAll('.capability-card');
    capabilityCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '';
        });
    });

    // Add click handlers for CTA buttons
    const ctaButtons = document.querySelectorAll('button');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (this.textContent.includes('Book a Demo')) {
                console.log('Demo booking requested');
                // Add your demo booking logic here
                alert('Demo booking functionality would be implemented here');
            } else if (this.textContent.includes('Contact Us')) {
                console.log('Contact form requested');
                // Add your contact form logic here
                alert('Contact form would be implemented here');
            } else if (this.textContent.includes('See AI In Action')) {
                console.log('AI demo requested');
                // Add your AI demo logic here
                alert('AI demonstration would be implemented here');
            }
        });
    });

    // Smooth scroll for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Add some utility functions for potential future use
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transition-all duration-300 ${
        type === 'success' ? 'bg-green-500 text-white' :
        type === 'error' ? 'bg-red-500 text-white' :
        'bg-blue-500 text-white'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Analytics tracking (placeholder)
function trackEvent(eventName, eventData = {}) {
    console.log('Event tracked:', eventName, eventData);
    // Implement your analytics tracking here
}

// Track page load
trackEvent('page_view', {
    page: 'predictive_analytics',
    timestamp: new Date().toISOString()
});
