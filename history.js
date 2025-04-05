function saveScanToHistory(results) {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn) {
        showAlert('Please log in to save your scan history', 'error');
        window.location.href = 'auth.html';
        return;
    }
    
    // Get current user's history
    const userId = localStorage.getItem('userId');
    let userHistory = JSON.parse(localStorage.getItem(`scanHistory_${userId}`)) || [];
    
    // Add new scan
    userHistory.unshift({
        id: Date.now().toString(),
        ...results
    });
    
    // Keep only last 50 scans
    if (userHistory.length > 50) {
        userHistory = userHistory.slice(0, 50);
    }
    
    // Save to localStorage
    localStorage.setItem(`scanHistory_${userId}`, JSON.stringify(userHistory));
    showAlert('Scan saved to your history', 'success');
}

function loadScanHistory() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn) {
        historyList.innerHTML = '<div class="empty-history">Please log in to view your scan history</div>';
        return;
    }
    
    const userId = localStorage.getItem('userId');
    const userHistory = JSON.parse(localStorage.getItem(`scanHistory_${userId}`)) || [];
    
    if (userHistory.length === 0) {
        historyList.innerHTML = '<div class="empty-history">No scan history found. Run your first scan to get started.</div>';
        return;
    }
    
    // Render history items...
}

// History page functionality
function initHistory() {
    const historyList = document.querySelector('.history-list');
    const searchInput = document.getElementById('history-search');
    const filterSelect = document.getElementById('history-filter');
    
    // Load scan history
    function loadScanHistory() {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        
        if (!isLoggedIn) {
            historyList.innerHTML = '<div class="empty-history">Please log in to view your scan history</div>';
            return;
        }
        
        // In a real implementation, this would fetch from Firestore
        // For this example, we'll use localStorage
        
        const scanHistory = JSON.parse(localStorage.getItem('scanHistory') || '[]');
        
        if (scanHistory.length === 0) {
            historyList.innerHTML = '<div class="empty-history">No scan history found. Run your first scan to get started.</div>';
            return;
        }
        
        historyList.innerHTML = '';
        
        scanHistory.forEach((scan, index) => {
            const scanItem = document.createElement('div');
            scanItem.className = 'history-item';
            scanItem.innerHTML = `
                <div class="scan-info">
                    <div class="scan-url">${scan.url}</div>
                    <div class="scan-meta">
                        <span class="scan-mode">${scan.mode.toUpperCase()}</span>
                        <span class="scan-date">${new Date(scan.date).toLocaleString()}</span>
                    </div>
                </div>
                <div class="scan-stats">
                    <div class="stat critical">${scan.vulnerabilities.filter(v => v.severity === 'critical').length}</div>
                    <div class="stat high">${scan.vulnerabilities.filter(v => v.severity === 'high').length}</div>
                    <div class="stat medium">${scan.vulnerabilities.filter(v => v.severity === 'medium').length}</div>
                    <div class="stat low">${scan.vulnerabilities.filter(v => v.severity === 'low').length}</div>
                </div>
                <div class="scan-actions">
                    <button class="btn-view" data-index="${index}">View</button>
                    <button class="btn-download" data-index="${index}">Download</button>
                </div>
            `;
            historyList.appendChild(scanItem);
        });
        
        // Add event listeners to buttons
        document.querySelectorAll('.btn-view').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                viewScanDetails(scanHistory[index]);
            });
        });
        
        document.querySelectorAll('.btn-download').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                generatePDFReport(scanHistory[index]);
            });
        });
    }
    
    // View scan details
    function viewScanDetails(scan) {
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Scan Details</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="scan-details">
                        <div class="detail">
                            <span class="detail-label">URL:</span>
                            <span class="detail-value">${scan.url}</span>
                        </div>
                        <div class="detail">
                            <span class="detail-label">Scan Mode:</span>
                            <span class="detail-value">${scan.mode.toUpperCase()}</span>
                        </div>
                        <div class="detail">
                            <span class="detail-label">Date:</span>
                            <span class="detail-value">${new Date(scan.date).toLocaleString()}</span>
                        </div>
                        <div class="detail">
                            <span class="detail-label">Vulnerabilities:</span>
                            <span class="detail-value">${scan.vulnerabilities.length} found</span>
                        </div>
                    </div>
                    
                    <div class="vulnerabilities-summary">
                        <h4>Vulnerability Summary</h4>
                        <div class="summary-grid">
                            <div class="summary-item critical">
                                <span class="count">${scan.vulnerabilities.filter(v => v.severity === 'critical').length}</span>
                                <span class="label">Critical</span>
                            </div>
                            <div class="summary-item high">
                                <span class="count">${scan.vulnerabilities.filter(v => v.severity === 'high').length}</span>
                                <span class="label">High</span>
                            </div>
                            <div class="summary-item medium">
                                <span class="count">${scan.vulnerabilities.filter(v => v.severity === 'medium').length}</span>
                                <span class="label">Medium</span>
                            </div>
                            <div class="summary-item low">
                                <span class="count">${scan.vulnerabilities.filter(v => v.severity === 'low').length}</span>
                                <span class="label">Low</span>
                            </div>
                        </div>
                    </div>
                    
                    <button class="btn-primary btn-download-full">Download Full Report</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal
        modal.querySelector('.modal-close').addEventListener('click', function() {
            document.body.removeChild(modal);
        });
        
        // Download full report
        modal.querySelector('.btn-download-full').addEventListener('click', function() {
            generatePDFReport(scan);
        });
        
        // Close when clicking outside
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }
    
    // Generate PDF report (same as in scanner.js)
    function generatePDFReport(results) {
        const blob = new Blob([`WebShield Scanner Report\n\nURL: ${results.url}\nScan Mode: ${results.mode}\nDate: ${new Date(results.date).toLocaleString()}\n\nVulnerabilities Found: ${results.vulnerabilities.length}\n\n---\n\n${results.vulnerabilities.map(v => `[${v.severity.toUpperCase()}] ${v.name}\n${v.description}\nSolution: ${v.solution}\n`).join('\n---\n\n')}`], { type: 'text/plain' });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `webshield-scan-${results.url.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${new Date(results.date).toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    // Search functionality
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const items = document.querySelectorAll('.history-item');
        
        items.forEach(item => {
            const url = item.querySelector('.scan-url').textContent.toLowerCase();
            if (url.includes(searchTerm)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    });
    
    // Filter functionality
    filterSelect.addEventListener('change', function() {
        const filterValue = this.value;
        const items = document.querySelectorAll('.history-item');
        
        items.forEach(item => {
            const mode = item.querySelector('.scan-mode').textContent.toLowerCase();
            if (filterValue === 'all' || mode === filterValue) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    });
    
    // Initialize history on page load
    loadScanHistory();
}