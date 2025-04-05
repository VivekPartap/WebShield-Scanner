// Authentication functionality
function initAuth() {
    // DOM Elements
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const passwordInput = document.getElementById('register-password');
    const passwordStrength = document.querySelector('.password-strength');
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text');
    const forgotPasswordLink = document.querySelector('.forgot-password');

    // Tab switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Update active tab button
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Update active tab pane
            tabPanes.forEach(pane => pane.classList.remove('active'));
            document.getElementById(`${tabId}-pane`).classList.add('active');
        });
    });

    // Password strength indicator
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        const strength = calculatePasswordStrength(password);
        
        strengthBar.style.width = `${strength.score * 25}%`;
        
        if (strength.score < 2) {
            strengthBar.style.backgroundColor = 'var(--critical)';
            strengthText.textContent = 'Weak';
        } else if (strength.score < 3) {
            strengthBar.style.backgroundColor = 'var(--medium)';
            strengthText.textContent = 'Medium';
        } else if (strength.score < 4) {
            strengthBar.style.backgroundColor = 'var(--low)';
            strengthText.textContent = 'Strong';
        } else {
            strengthBar.style.backgroundColor = 'var(--accent-color)';
            strengthText.textContent = 'Very Strong';
        }
    });

    // Login form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        // Simple validation
        if (!email || !password) {
            showAlert('Please fill in all fields', 'error');
            return;
        }
        
        // In a real implementation, this would use Firebase Auth
        simulateLogin(email, password);
    });

    // Register form submission
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm').value;
        const termsChecked = document.getElementById('register-terms').checked;
        
        // Validation
        if (!name || !email || !password || !confirmPassword) {
            showAlert('Please fill in all fields', 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            showAlert('Passwords do not match', 'error');
            return;
        }
        
        if (!termsChecked) {
            showAlert('You must agree to the terms and conditions', 'error');
            return;
        }
        
        const strength = calculatePasswordStrength(password);
        if (strength.score < 2) {
            showAlert('Please choose a stronger password', 'error');
            return;
        }
        
        // In a real implementation, this would use Firebase Auth
        simulateRegistration(name, email, password);
    });

    // Social login buttons
    document.querySelectorAll('.social-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const provider = this.classList.contains('google') ? 'Google' : 'GitHub';
            showAlert(`In a real implementation, this would authenticate with ${provider} using Firebase Auth`, 'info');
        });
    });

    // Forgot password
    forgotPasswordLink.addEventListener('click', function(e) {
        e.preventDefault();
        showAlert('In a real implementation, this would send a password reset email', 'info');
    });

    // Calculate password strength
    function calculatePasswordStrength(password) {
        let score = 0;
        const hasLower = /[a-z]/.test(password);
        const hasUpper = /[A-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecial = /[^a-zA-Z0-9]/.test(password);
        const isLong = password.length >= 8;
        
        if (hasLower) score++;
        if (hasUpper) score++;
        if (hasNumber) score++;
        if (hasSpecial) score++;
        if (isLong) score++;
        
        return { score, hasLower, hasUpper, hasNumber, hasSpecial, isLong };
    }

    // Simulate login (would be Firebase Auth in production)
    function simulateLogin(email, password) {
        // Show loading state
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Authenticating...';
        submitBtn.disabled = true;
        
        // Simulate API call delay
        setTimeout(() => {
            // In a real app, you would use:
            // firebase.auth().signInWithEmailAndPassword(email, password)
            //     .then((userCredential) => { ... })
            //     .catch((error) => { ... });
            
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userEmail', email);
            
            // Update UI
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            showAlert('Login successful! Redirecting to dashboard...', 'success');
            
            // Redirect to scanner page
            setTimeout(() => {
                window.location.href = 'scanner.html';
            }, 1500);
        }, 1500);
    }

    // Simulate registration (would be Firebase Auth in production)
    function simulateRegistration(name, email, password) {
        // Show loading state
        const submitBtn = registerForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Creating account...';
        submitBtn.disabled = true;
        
        // Simulate API call delay
        setTimeout(() => {
            // In a real app, you would use:
            // firebase.auth().createUserWithEmailAndPassword(email, password)
            //     .then((userCredential) => { ... })
            //     .catch((error) => { ... });
            
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userName', name);
            localStorage.setItem('userSince', new Date().toISOString());
            
            // Update UI
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            showAlert('Registration successful! Welcome to WebShield Scanner.', 'success');
            
            // Redirect to scanner page
            setTimeout(() => {
                window.location.href = 'scanner.html';
            }, 1500);
        }, 1500);
    }

    // Show alert message
    function showAlert(message, type) {
        // Remove any existing alerts
        const existingAlert = document.querySelector('.auth-alert');
        if (existingAlert) {
            existingAlert.remove();
        }
        
        const alert = document.createElement('div');
        alert.className = `auth-alert auth-alert-${type}`;
        alert.textContent = message;
        
        // Insert after the form
        const activePane = document.querySelector('.tab-pane.active');
        activePane.appendChild(alert);
        
        // Remove after 5 seconds
        setTimeout(() => {
            alert.remove();
        }, 5000);
    }

    // Initialize Firebase (would be uncommented in production)
    /*
    const firebaseConfig = {
        apiKey: "YOUR_API_KEY",
        authDomain: "your-project.firebaseapp.com",
        projectId: "your-project",
        storageBucket: "your-project.appspot.com",
        messagingSenderId: "YOUR_SENDER_ID",
        appId: "YOUR_APP_ID"
    };
    firebase.initializeApp(firebaseConfig);
    */
}

// Initialize auth when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.auth-main')) {
        initAuth();
    }
});