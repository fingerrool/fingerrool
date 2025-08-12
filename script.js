document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const signUpButton = document.getElementById('signUp');
    const signInButton = document.getElementById('signIn');
    const container = document.getElementById('container');
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const premiumContent = document.getElementById('premiumContent');
    const logoutBtn = document.getElementById('logoutBtn');
    const notification = document.getElementById('notification');
    
    // Password strength elements
    const regPassword = document.getElementById('regPassword');
    const strengthMeter = document.querySelector('.strength-meter');
    const strengthText = document.querySelector('.strength-text');
    
    // Check if user is already logged in
    checkAuthStatus();
    
    // Event listeners
    signUpButton.addEventListener('click', () => {
        container.classList.add('right-panel-active');
    });
    
    signInButton.addEventListener('click', () => {
        container.classList.remove('right-panel-active');
    });
    
    // Register form submission
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('regName').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const password = document.getElementById('regPassword').value;
        
        // Simple validation
        if (!name || !email || !password) {
            showNotification('Veuillez remplir tous les champs', 'error');
            return;
        }
        
        // Email validation
        if (!validateEmail(email)) {
            showNotification('Veuillez entrer une adresse email valide', 'error');
            return;
        }
        
        // Password strength check
        if (calculatePasswordStrength(password) < 3) {
            showNotification('Votre mot de passe est trop faible', 'error');
            return;
        }
        
        // Save user to localStorage (in a real app, this would be an API call)
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Check if user already exists
        if (users.some(user => user.email === email)) {
            showNotification('Un compte avec cet email existe déjà', 'error');
            return;
        }
        
        // Add new user
        users.push({
            name,
            email,
            password // In a real app, never store plain text passwords!
        });
        
        localStorage.setItem('users', JSON.stringify(users));
        
        // Set as logged in
        localStorage.setItem('currentUser', JSON.stringify({ email }));
        
        // Show success and redirect to premium content
        showNotification('Inscription réussie! Redirection...', 'success');
        
        setTimeout(() => {
            showPremiumContent();
        }, 1500);
    });
    
    // Login form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        
        // Simple validation
        if (!email || !password) {
            showNotification('Veuillez remplir tous les champs', 'error');
            return;
        }
        
        // Check credentials (in a real app, this would be an API call)
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(user => user.email === email && user.password === password);
        
        if (user) {
            // Set as logged in
            localStorage.setItem('currentUser', JSON.stringify({ 
                email: user.email,
                name: user.name
            }));
            
            showNotification('Connexion réussie! Redirection...', 'success');
            
            setTimeout(() => {
                showPremiumContent();
            }, 1500);
        } else {
            showNotification('Email ou mot de passe incorrect', 'error');
        }
    });
    
    // Logout button
    logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('currentUser');
        showNotification('Déconnexion réussie', 'success');
        setTimeout(() => {
            hidePremiumContent();
        }, 1000);
    });
    
    // Password strength indicator
    regPassword.addEventListener('input', function() {
        const strength = calculatePasswordStrength(this.value);
        updateStrengthIndicator(strength);
    });
    
    // Functions
    function checkAuthStatus() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            showPremiumContent();
        }
    }
    
    function showPremiumContent() {
        container.style.display = 'none';
        premiumContent.style.display = 'block';
        
        // Update welcome message if user has a name
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.name) {
            const welcomeHeading = document.querySelector('.welcome-message h1');
            welcomeHeading.textContent = `Bienvenue, ${currentUser.name.split(' ')[0]}!`;
        }
    }
    
    function hidePremiumContent() {
        container.style.display = 'flex';
        premiumContent.style.display = 'none';
        
        // Reset forms
        registerForm.reset();
        loginForm.reset();
        
        // Reset to login panel
        container.classList.remove('right-panel-active');
    }
    
    function showNotification(message, type) {
        notification.textContent = message;
        notification.className = 'notification ' + type;
        
        setTimeout(() => {
            notification.classList.remove(type);
            notification.style.transform = 'translateY(100px)';
            notification.style.opacity = '0';
        }, 3000);
    }
    
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function calculatePasswordStrength(password) {
        let strength = 0;
        
        // Length check
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        
        // Character variety
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        
        return Math.min(strength, 5);
    }
    
    function updateStrengthIndicator(strength) {
        const colors = [
            '#ff3333', // red (weak)
            '#ff6600', // orange
            '#ffcc00', // yellow
            '#66cc00', // light green
            '#4bb543'  // green (strong)
        ];
        
        const texts = [
            'Très faible',
            'Faible',
            'Moyen',
            'Fort',
            'Très fort'
        ];
        
        const width = (strength / 5) * 100;
        strengthMeter.style.width = `${width}%`;
        strengthMeter.style.backgroundColor = colors[strength - 1] || colors[0];
        strengthText.textContent = texts[strength - 1] || texts[0];
        strengthText.style.color = colors[strength - 1] || colors[0];
    }
    
    // Add subtle animations to content cards
    const contentCards = document.querySelectorAll('.content-card');
    contentCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
});