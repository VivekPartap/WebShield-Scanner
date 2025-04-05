// About page functionality
function initAbout() {
    const contactForm = document.getElementById('contact-form');
    const teamMembers = [
        {
            name: 'Alex Johnson',
            role: 'Security Lead',
            bio: '10+ years of experience in cybersecurity and penetration testing.',
            avatar: 'A'
        },
        {
            name: 'Maria Garcia',
            role: 'Frontend Developer',
            bio: 'Specializes in creating intuitive and secure user interfaces.',
            avatar: 'M'
        },
        {
            name: 'Sam Wilson',
            role: 'Backend Engineer',
            bio: 'Builds robust scanning engines and security APIs.',
            avatar: 'S'
        },
        {
            name: 'Taylor Chen',
            role: 'UX Designer',
            bio: 'Creates seamless user experiences for complex security tools.',
            avatar: 'T'
        }
    ];
    
    // Display team members
    const teamContainer = document.querySelector('.team-grid');
    teamMembers.forEach(member => {
        const memberCard = document.createElement('div');
        memberCard.className = 'team-card';
        memberCard.innerHTML = `
            <div class="team-avatar">${member.avatar}</div>
            <h4>${member.name}</h4>
            <div class="team-role">${member.role}</div>
            <p class="team-bio">${member.bio}</p>
        `;
        teamContainer.appendChild(memberCard);
    });
    
    // Contact form submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('contact-name').value;
        const email = document.getElementById('contact-email').value;
        const message = document.getElementById('contact-message').value;
        
        if (!name || !email || !message) {
            alert('Please fill in all fields');
            return;
        }
        
        // In a real implementation, this would send via Firebase Functions
        // For this example, we'll simulate it
        
        alert(`Thank you for your message, ${name}! We'll get back to you soon.`);
        contactForm.reset();
    });
}