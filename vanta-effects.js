// Initialize Vanta.js effects
document.addEventListener('DOMContentLoaded', function() {
    // Check if Vanta is available
    if (typeof VANTA !== 'undefined') {
        // Initialize Vanta.js net effect
        VANTA.NET({
            el: "#vanta-bg",
            color: 0x64ffda,
            backgroundColor: 0xa192f,
            points: 12.00,
            maxDistance: 22.00,
            spacing: 18.00
        });
    }
    
    // Add floating particles to scanner visualization
    const scannerVisualization = document.querySelector('.scanner-visualization');
    if (scannerVisualization) {
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'scan-particle';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 5}s`;
            scannerVisualization.appendChild(particle);
        }
    }
});