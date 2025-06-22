const features = [
    {
        icon: "brain",
        title: "Predictive Analytics",
        description: "Anticipate policy outcomes and resource needs through advanced machine learning algorithms and historical data analysis."
    },
    {
        icon: "shield",
        title: "Anomaly Detection & Risk Alerts",
        description: "Real-time identification of unusual patterns, potential fraud, and compliance risks across government operations."
    },
    {
        icon: "file-text",
        title: "Document Intelligence",
        description: "Automated processing, classification, and insights extraction from government documents and legislative texts."
    },
    {
        icon: "video",
        title: "Image & Video Verification",
        description: "AI-powered verification of visual content for authenticity, compliance monitoring, and evidence validation."
    },
    {
        icon: "message-square",
        title: "Smart Governance Assistant",
        description: "Intelligent chatbot providing instant access to policy information, procedures, and regulatory guidance."
    },
    {
        icon: "trending-up",
        title: "Sentiment Analysis",
        description: "Monitor public opinion and stakeholder feedback across digital channels for informed decision-making."
    }
];

// Advantages data
const advantages = [
    {
        icon: "eye",
        title: "Smarter Oversight",
        description: "Enhanced monitoring capabilities with AI-driven insights"
    },
    {
        icon: "zap",
        title: "Proactive Governance",
        description: "Anticipate issues before they become problems"
    },
    {
        icon: "clock",
        title: "Faster Decisions",
        description: "Accelerated decision-making with real-time data analysis"
    },
    {
        icon: "check-circle",
        title: "Greater Transparency",
        description: "Improved accountability through automated reporting"
    },
    {
        icon: "users",
        title: "Scalable & Modular",
        description: "Adaptable solution that grows with your organization"
    }
];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide icons
    lucide.createIcons();
    
    // Populate features
    populateFeatures();
    
    // Populate advantages
    populateAdvantages();
    
    // Set up scroll functionality
    setupScrollToFeatures();
    
    // Set up hover effects
    setupHoverEffects();
});

function populateFeatures() {
    const featuresGrid = document.getElementById('featuresGrid');
    
    features.forEach((feature, index) => {
        const featureCard = document.createElement('div');
        featureCard.className = 'feature-card p-6 bg-white border-2 border-slate-200 hover:border-cyan-300 hover:shadow-xl transition-all duration-300 cursor-pointer rounded-lg';
        
        featureCard.innerHTML = `
            <div class="p-0">
                <div class="flex items-center mb-4">
                    <div class="p-3 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-lg mr-4">
                        <i data-lucide="${feature.icon}" class="w-6 h-6 text-blue-600"></i>
                    </div>
                    <h3 class="text-xl font-semibold text-slate-800">
                        ${feature.title}
                    </h3>
                </div>
                <p class="text-slate-600 leading-relaxed mb-4">
    ${feature.description}
</p>
${
    feature.title === "Predictive Analytics" || feature.title === "Anomaly Detection & Risk Alerts"
        ? `<a href="${feature.title === 'Predictive Analytics' ? 'predictive-analytics.html' : 'Risk_alerts.html'}" 
              class="inline-flex items-center text-cyan-700 font-medium hover:underline group">
              Learn More 
              <i data-lucide="arrow-right" class="ml-2 w-4 h-4 group-hover:translate-x-1 transition"></i>
          </a>`
        : ""
}

            </div>
        `;
        
        featuresGrid.appendChild(featureCard);
    });
    
    // Re-initialize Lucide icons for newly added elements
    lucide.createIcons();
}

function populateAdvantages() {
    const advantagesGrid = document.getElementById('advantagesGrid');
    
    advantages.forEach((advantage, index) => {
        const advantageCard = document.createElement('div');
        advantageCard.className = 'text-center p-6 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300';
        
        advantageCard.innerHTML = `
            <div class="inline-flex p-3 bg-cyan-500/20 rounded-lg mb-4">
                <i data-lucide="${advantage.icon}" class="w-8 h-8 text-cyan-300"></i>
            </div>
            <h3 class="text-lg font-semibold mb-2">${advantage.title}</h3>
            <p class="text-sm text-blue-100">${advantage.description}</p>
        `;
        
        advantagesGrid.appendChild(advantageCard);
    });
    
    // Re-initialize Lucide icons for newly added elements
    lucide.createIcons();
}

function setupScrollToFeatures() {
    const scrollButton = document.getElementById('scrollToFeatures');
    const featuresSection = document.getElementById('features');
    
    scrollButton.addEventListener('click', function() {
        featuresSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    });
}

function setupHoverEffects() {
    // Add hover effect tracking for feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach((card, index) => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

// Add smooth scroll behavior for any anchor links
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

// Add animation on scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    const windowHeight = window.innerHeight;
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        
        if (elementTop < windowHeight - 100) {
            element.classList.add('animate-fade-in');
        }
    });
}

// Listen for scroll events
window.addEventListener('scroll', animateOnScroll);

// Run animation check on load
animateOnScroll();


//code of video
function openDemoVideo() {
  const modal = document.getElementById("demoVideoModal");
  const video = document.getElementById("demoVideo");
  modal.classList.remove("hidden");
  video.currentTime = 0;
  video.play();
}

function closeDemoVideo() {
  const modal = document.getElementById("demoVideoModal");
  const video = document.getElementById("demoVideo");
  modal.classList.add("hidden");
  video.pause();
}
// code of back button
function goBack() {
  window.history.back();
}

