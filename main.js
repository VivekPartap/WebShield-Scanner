// DOM Elements
const themeSwitch = document.getElementById('theme-switch');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navMenu = document.querySelector('nav ul');
const profileNav = document.getElementById('profile-nav');
const authNav = document.getElementById('auth-nav');

// Check for saved theme preference
const currentTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', currentTheme);
if (currentTheme === 'light') {
    themeSwitch.checked = true;
}

// Theme switcher
themeSwitch.addEventListener('change', function(e) {
    if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    }
});

// Mobile menu toggle
mobileMenuBtn.addEventListener('click', function() {
    navMenu.classList.toggle('active');
});

// Check authentication state and update UI
function checkAuthState() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (isLoggedIn) {
        profileNav.style.display = 'block';
        authNav.style.display = 'none';
    } else {
        profileNav.style.display = 'none';
        authNav.style.display = 'block';
    }
}

// Initialize auth state
checkAuthState();

// Close mobile menu when clicking a link
document.querySelectorAll('nav ul li a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Initialize page-specific scripts
function initPageScripts() {
    const currentPage = window.location.pathname.split('/').pop().split('.')[0];
    
    if (currentPage === 'scanner') {
        // Initialize scanner page scripts
        if (typeof initScanner === 'function') {
            initScanner();
        }
    } else if (currentPage === 'auth') {
        // Initialize auth page scripts
        if (typeof initAuth === 'function') {
            initAuth();
        }
    } else if (currentPage === 'history') {
        // Initialize history page scripts
        if (typeof initHistory === 'function') {
            initHistory();
        }
    } else if (currentPage === 'profile') {
        // Initialize profile page scripts
        if (typeof initProfile === 'function') {
            initProfile();
        }
    } else if (currentPage === 'about') {
        // Initialize about page scripts
        if (typeof initAbout === 'function') {
            initAbout();
        }
    }
}

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initPageScripts();
});