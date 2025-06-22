// Initialize Lucide icons
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide icons
    lucide.createIcons();
    
    // Add intersection observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, observerOptions);
    
    // Observe all animated elements
    const animatedElements = document.querySelectorAll('.capability-card, .highlight-item, .impact-card');
    animatedElements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.1}s`;
        el.style.animationPlayState = 'paused';
        observer.observe(el);
    });
    
    // Smooth scrolling for buttons (if they had href attributes)
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // You can add custom actions here for each button
            console.log('Button clicked:', this.textContent.trim());
        });
    });
    
    // Add parallax effect to hero background
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.5;
            
            heroSection.style.transform = `translateY(${parallax}px)`;
        });
    }
    
    // Add hover effects to stat cards
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add pulse animation control
    const pulseElements = document.querySelectorAll('.pulse-dot');
    pulseElements.forEach(element => {
        element.addEventListener('mouseover', function() {
            this.style.animationDuration = '0.5s';
        });
        
        element.addEventListener('mouseout', function() {
            this.style.animationDuration = '2s';
        });
    });
    
    // Add typewriter effect to hero title (optional)
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.innerHTML;
        heroTitle.innerHTML = '';
        let i = 0;
        
        function typeWriter() {
            if (i < text.length) {
                heroTitle.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        }
        
        // Uncomment the line below to enable typewriter effect
        // setTimeout(typeWriter, 1000);
        
        // For now, just show the text immediately
        heroTitle.innerHTML = text;
    }
    
    // Add number counter animation for stats
    function animateNumbers() {
        const statNumbers = document.querySelectorAll('.stat-number, .impact-stat, .roi-number');
        
        statNumbers.forEach(stat => {
            const target = stat.textContent;
            const isPercentage = target.includes('%');
            const isMultiplier = target.includes('x');
            const isDollar = target.includes('$');
            const isTime = target.includes('min') || target.includes('Months');
            
            let numericValue = parseFloat(target.replace(/[^\d.]/g, ''));
            
            if (isNaN(numericValue)) return;
            
            let current = 0;
            const increment = numericValue / 60; // 60 frames for smooth animation
            const timer = setInterval(() => {
                current += increment;
                if (current >= numericValue) {
                    current = numericValue;
                    clearInterval(timer);
                }
                
                let displayValue = Math.floor(current);
                
                if (isDollar) {
                    stat.textContent = `$${displayValue.toFixed(1)}M`;
                } else if (isPercentage) {
                    stat.textContent = `${displayValue}%`;
                } else if (isMultiplier) {
                    stat.textContent = `${displayValue}x`;
                } else if (isTime && target.includes('min')) {
                    stat.textContent = `<${displayValue}min`;
                } else if (isTime && target.includes('Months')) {
                    stat.textContent = `${displayValue} Months`;
                } else {
                    stat.textContent = displayValue.toFixed(1);
                }
            }, 16); // ~60fps
        });
    }
    
    // Trigger number animation when stats come into view
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumbers();
                statsObserver.disconnect(); // Only animate once
            }
        });
    }, { threshold: 0.5 });
    
    const statsSection = document.querySelector('.stats-grid');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
    
    // Add loading states for buttons
    function addLoadingState(button) {
        const originalText = button.innerHTML;
        button.innerHTML = '<i data-lucide="loader-2"></i> Loading...';
        button.disabled = true;
        
        // Re-initialize icons for the new loader icon
        lucide.createIcons();
        
        // Simulate loading
        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
            lucide.createIcons();
        }, 2000);
    }
    
    // Add click handlers for demo buttons
    document.querySelectorAll('.btn-primary, .btn-accent').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            addLoadingState(this);
        });
    });
});

// Add scroll-based header background change (if you want to add a header later)
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset > 50;
    document.body.classList.toggle('scrolled', scrolled);
});

// Add form validation (if forms are added later)
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Add resize handler for responsive adjustments
window.addEventListener('resize', function() {
    // Reinitialize any size-dependent features
    lucide.createIcons();
});

// Error handling for missing elements
window.addEventListener('error', function(e) {
    console.warn('Minor error caught:', e.message);
});
