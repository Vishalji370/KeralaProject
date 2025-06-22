// Smooth scrolling for internal links
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling to all links
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all cards for animation
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        observer.observe(card);
    });

    // Add click tracking for support links
    const supportLinks = document.querySelectorAll('.contact-info a');
    supportLinks.forEach(link => {
        link.addEventListener('click', function() {
            console.log('Support contact clicked:', this.textContent);
            // You can add analytics tracking here
        });
    });

    // Add interactive hover effects
    const stepItems = document.querySelectorAll('.step-item');
    stepItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // Print functionality
    function addPrintStyles() {
        const printStyles = `
            @media print {
                body { background: white; }
                .card { break-inside: avoid; margin-bottom: 1rem; }
                .header { border-bottom: 2px solid #000; }
                a { color: #000; text-decoration: underline; }
                .support-message { background: #f0f0f0; }
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = printStyles;
        document.head.appendChild(styleSheet);
    }
    
    addPrintStyles();
});

// Utility function to copy text to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function() {
        console.log('Text copied to clipboard: ' + text);
        // You can add a toast notification here
    }, function(err) {
        console.error('Could not copy text: ', err);
    });
}

// Add copy functionality to email and phone numbers
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="mailto:"]')) {
        const email = e.target.textContent;
        copyToClipboard(email);
    }
    
    if (e.target.matches('a[href^="tel:"]')) {
        const phone = e.target.textContent;
        copyToClipboard(phone);
    }
});
