// Profile functionality
function initProfile() {
    // DOM Elements
    const profileContent = document.getElementById('profile-content');
    const loginPrompt = document.getElementById('login-prompt');
    const profileForm = document.getElementById('profile-form');
    const signOutBtn = document.getElementById('sign-out-btn');
    
    // Check authentication state
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    // Handle authentication state
    if (!isLoggedIn) {
        profileContent.classList.add('hidden');
        loginPrompt.classList.remove('hidden');
        return;
    }
    
    // User is logged in - show profile content
    profileContent.classList.remove('hidden');
    loginPrompt.classList.add('hidden');
    
    // Load and display user data
    loadUserData();
    
    // Event listeners
    profileForm.addEventListener('submit', handleProfileUpdate);
    signOutBtn.addEventListener('click', handleSignOut);

    // Load user data function
    function loadUserData() {
        const name = localStorage.getItem('userName') || 'User';
        const email = localStorage.getItem('userEmail') || 'user@example.com';
        const since = localStorage.getItem('userSince') || new Date().toISOString();
        
        // Update UI elements
        document.getElementById('user-avatar').textContent = name.charAt(0).toUpperCase();
        document.getElementById('user-name').textContent = name;
        document.getElementById('user-email').textContent = email;
        document.getElementById('member-since').textContent = new Date(since).toLocaleDateString();
        document.getElementById('profile-name').value = name;
        document.getElementById('profile-email').value = email;
    }
    
    // Handle profile update
    function handleProfileUpdate(e) {
        e.preventDefault();
        
        const name = document.getElementById('profile-name').value;
        const email = document.getElementById('profile-email').value;
        const newPassword = document.getElementById('profile-new-password').value;
        const confirmPassword = document.getElementById('profile-confirm-password').value;
        
        // Validate form inputs
        if (!name || !email) {
            showAlert('Please fill in all required fields', 'error');
            return;
        }
        
        if (newPassword && newPassword !== confirmPassword) {
            showAlert('New passwords do not match', 'error');
            return;
        }
        
        // Update user data in localStorage (would be Firebase in production)
        localStorage.setItem('userName', name);
        localStorage.setItem('userEmail', email);
        
        // Handle password change
        if (newPassword) {
            // In a real app, this would update password via Firebase Auth
            showAlert('Password updated successfully', 'success');
            // Clear password fields
            document.getElementById('profile-current-password').value = '';
            document.getElementById('profile-new-password').value = '';
            document.getElementById('profile-confirm-password').value = '';
        }
        
        showAlert('Profile updated successfully', 'success');
        loadUserData(); // Refresh displayed data
    }
    
    // Handle sign out
    function handleSignOut() {
        // Clear authentication data
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        localStorage.removeItem('userId');
        
        // Redirect to home page
        window.location.href = 'index.html';
    }
    
    // Show alert message
    function showAlert(message, type) {
        // Remove any existing alerts
        const existingAlert = document.querySelector('.profile-alert');
        if (existingAlert) existingAlert.remove();
        
        // Create new alert
        const alert = document.createElement('div');
        alert.className = `profile-alert profile-alert-${type}`;
        alert.textContent = message;
        
        // Insert alert in DOM
        const formContainer = profileForm.parentNode;
        formContainer.insertBefore(alert, profileForm);
        
        // Remove alert after 5 seconds
        setTimeout(() => alert.remove(), 5000);
    }
}

// Initialize profile when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.profile-main')) {
        initProfile();
    }
});