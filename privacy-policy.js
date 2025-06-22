document.addEventListener('DOMContentLoaded', function() {
    const currentDate = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    document.getElementById('currentDate').textContent = currentDate;
});

// Toggle mobile menu (placeholder function)
function toggleMenu() {
    // This function can be extended to show/hide a mobile menu
    // For now, it's just a placeholder for the hamburger button functionality
    console.log('Menu button clicked');
    
    // You can add mobile menu functionality here
    // Example: show/hide a dropdown menu or sidebar
    alert('Menu functionality can be implemented here');
}

// Smooth scrolling for internal links (if needed)
document.addEventListener('DOMContentLoaded', function() {
    // Add any additional JavaScript functionality here
    
    // Example: Add click handlers for menu items
    const menuBtn = document.querySelector('.menu-btn');
    if (menuBtn) {
        menuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            toggleMenu();
        });
    }
    
    // Add animation on scroll (optional)
    const cards = document.querySelectorAll('.card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});