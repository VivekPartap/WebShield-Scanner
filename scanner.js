// Scanner functionality
function initScanner() {
    // DOM Elements
    const scanUrlInput = document.getElementById('scan-url');
    const startScanBtn = document.getElementById('start-scan');
    const cancelScanBtn = document.getElementById('cancel-scan');
    const downloadReportBtn = document.getElementById('download-report');
    const saveScanBtn = document.getElementById('save-scan');
    const scanProgressSection = document.querySelector('.scan-progress');
    const scanResultsSection = document.querySelector('.scan-results');
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    const statusMessage = document.querySelector('.status-message');
    const statusDetails = document.querySelector('.status-details');
    const vulnerabilitiesList = document.querySelector('.vulnerabilities-list .list-body');
    const summaryCards = {
        critical: document.querySelector('.summary-card.critical .summary-count'),
        high: document.querySelector('.summary-card.high .summary-count'),
        medium: document.querySelector('.summary-card.medium .summary-count'),
        low: document.querySelector('.summary-card.low .summary-count'),
        info: document.querySelector('.summary-card.info .summary-count')
    };
    const headersGrid = document.querySelector('.headers-grid');
    
    let scanInProgress = false;
    let scanResults = null;
    let progressInterval = null;
    
    // Sample vulnerabilities data
    const sampleVulnerabilities = {
        zap: [
            {
                name: 'SQL Injection',
                description: 'The application appears vulnerable to SQL injection attacks.',
                solution: 'Use parameterized queries and input validation.',
                severity: 'critical'
            },
            {
                name: 'Cross-Site Scripting (XSS)',
                description: 'User input is reflected without proper output encoding.',
                solution: 'Implement proper output encoding and CSP headers.',
                severity: 'high'
            }
        ],
        openvas: [
            {
                name: 'SSL/TLS Weak Cipher Suites',
                description: 'Server supports weak encryption cipher suites.',
                solution: 'Disable weak cipher suites in server configuration.',
                severity: 'high'
            }
        ],
        nmap: [
            {
                name: 'Open Port: 21/tcp (FTP)',
                description: 'FTP service running with potential vulnerabilities.',
                solution: 'Disable FTP or implement secure authentication.',
                severity: 'medium'
            }
        ]
    };
    
    // Sample security headers data
    const sampleHeaders = [
        { name: 'Content-Security-Policy', present: false, description: 'Prevents XSS attacks' },
        { name: 'X-Frame-Options', present: true, description: 'Prevents clickjacking' }
    ];

    // Check authentication
    function checkAuth() {
        return localStorage.getItem('isLoggedIn') === 'true';
    }

    // Start scan handler
    startScanBtn.addEventListener('click', function() {
        if (!checkAuth()) {
            alert('Please log in to use the scanner');
            window.location.href = 'auth.html';
            return;
        }

        const url = scanUrlInput.value.trim();
        const scanMode = document.querySelector('input[name="scan-mode"]:checked').value;
        
        if (!url) {
            alert('Please enter a valid URL to scan');
            return;
        }
        
        if (!isValidUrl(url)) {
            alert('Please enter a valid URL (e.g., https://example.com)');
            return;
        }
        
        startScan(url, scanMode);
    });

    // Cancel scan handler
    cancelScanBtn.addEventListener('click', function() {
        if (!scanInProgress) return;
        clearInterval(progressInterval);
        resetScanUI();
        statusMessage.textContent = 'Scan canceled by user';
        statusDetails.textContent = 'The scan was stopped before completion.';
    });

    // Download report handler
    downloadReportBtn.addEventListener('click', function() {
        if (!scanResults) return;
        generatePDFReport(scanResults);
    });

    // Save scan handler
    saveScanBtn.addEventListener('click', function() {
        if (!scanResults) return;
        saveScanToHistory(scanResults);
    });

    // Validate URL format
    function isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    // Start scan process
    function startScan(url, mode) {
        scanInProgress = true;
        startScanBtn.disabled = true;
        scanProgressSection.classList.remove('hidden');
        scanResultsSection.classList.add('hidden');
        
        // Reset progress
        progressFill.style.width = '0%';
        progressText.textContent = '0%';
        
        // Reset steps
        document.querySelectorAll('.step').forEach(step => {
            step.classList.remove('active');
        });
        document.querySelector('.step[data-step="1"]').classList.add('active');
        
        // Start progress simulation
        let progress = 0;
        let currentStep = 1;
        
        progressInterval = setInterval(() => {
            progress += Math.random() * 5;
            if (progress > 100) progress = 100;
            
            progressFill.style.width = `${progress}%`;
            progressText.textContent = `${Math.floor(progress)}%`;
            
            // Update steps based on progress
            if (progress > 20 && currentStep === 1) {
                currentStep = 2;
                document.querySelector('.step[data-step="2"]').classList.add('active');
                statusMessage.textContent = 'Connecting to target...';
                statusDetails.textContent = `Establishing connection to ${url}`;
            } else if (progress > 40 && currentStep === 2) {
                currentStep = 3;
                document.querySelector('.step[data-step="3"]').classList.add('active');
                statusMessage.textContent = 'Scanning target...';
                statusDetails.textContent = `Running ${mode.toUpperCase()} scan on ${url}`;
            } else if (progress > 60 && currentStep === 3) {
                currentStep = 4;
                document.querySelector('.step[data-step="4"]').classList.add('active');
                statusMessage.textContent = 'Analyzing results...';
                statusDetails.textContent = 'Processing scan data and identifying vulnerabilities';
            } else if (progress > 80 && currentStep === 4) {
                currentStep = 5;
                document.querySelector('.step[data-step="5"]').classList.add('active');
                statusMessage.textContent = 'Generating report...';
                statusDetails.textContent = 'Compiling scan results into a comprehensive report';
            }
            
            // Complete scan when progress reaches 100%
            if (progress === 100) {
                clearInterval(progressInterval);
                completeScan(url, mode);
            }
        }, 300);
    }

    // Complete scan and show results
    function completeScan(url, mode) {
        scanInProgress = false;
        startScanBtn.disabled = false;
        
        statusMessage.textContent = 'Scan completed successfully';
        statusDetails.textContent = `Scan of ${url} finished with ${sampleVulnerabilities[mode].length} vulnerabilities found`;
        
        // Generate scan results
        scanResults = {
            url: url,
            mode: mode,
            date: new Date().toISOString(),
            vulnerabilities: sampleVulnerabilities[mode],
            headers: sampleHeaders
        };
        
        // Display results
        displayScanResults(scanResults);
        scanResultsSection.classList.remove('hidden');
    }

    // Display scan results
    function displayScanResults(results) {
        // Clear previous results
        vulnerabilitiesList.innerHTML = '';
        
        // Reset summary counts
        Object.keys(summaryCards).forEach(severity => {
            summaryCards[severity].textContent = '0';
        });
        
        // Count vulnerabilities by severity
        const severityCounts = {
            critical: 0,
            high: 0,
            medium: 0,
            low: 0,
            info: 0
        };
        
        // Add vulnerabilities to list
        results.vulnerabilities.forEach(vuln => {
            const severity = vuln.severity;
            severityCounts[severity]++;
            
            const item = document.createElement('div');
            item.className = 'vulnerability-item';
            item.innerHTML = `
                <div class="severity severity-${severity}">${severity}</div>
                <div class="vulnerability-name">${vuln.name}</div>
                <div class="vulnerability-description">${vuln.description}</div>
                <div class="vulnerability-solution">${vuln.solution}</div>
            `;
            vulnerabilitiesList.appendChild(item);
        });
        
        // Update summary counts
        Object.keys(severityCounts).forEach(severity => {
            summaryCards[severity].textContent = severityCounts[severity];
        });
        
        // Display security headers
        headersGrid.innerHTML = '';
        results.headers.forEach(header => {
            const card = document.createElement('div');
            card.className = 'header-card';
            card.innerHTML = `
                <div class="header-name">${header.name}</div>
                <div class="header-status ${header.present ? 'status-present' : 'status-missing'}">
                    ${header.present ? 'Present' : 'Missing'}
                </div>
                <div class="header-description">${header.description}</div>
            `;
            headersGrid.appendChild(card);
        });
    }

    // Save scan to history
    function saveScanToHistory(results) {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            alert('Please log in to save your scan history');
            window.location.href = 'auth.html';
            return;
        }
        
        let scanHistory = JSON.parse(localStorage.getItem(`scanHistory_${userId}`) || '[]');
        scanHistory.unshift({
            id: Date.now().toString(),
            ...results
        });
        
        // Keep only last 50 scans
        if (scanHistory.length > 50) {
            scanHistory = scanHistory.slice(0, 50);
        }
        
        localStorage.setItem(`scanHistory_${userId}`, JSON.stringify(scanHistory));
        alert('Scan saved to your history');
    }

    // Generate PDF report
    function generatePDFReport(results) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Report header
        doc.setFontSize(22);
        doc.setTextColor(10, 25, 47);
        doc.text('WebShield Scanner Report', 105, 20, null, null, 'center');
        
        // Logo (would be added in production)
        // doc.addImage(logoData, 'PNG', 10, 10, 30, 30);
        
        // Scan details
        doc.setFontSize(12);
        doc.text(`URL: ${results.url}`, 14, 40);
        doc.text(`Scan Mode: ${results.mode.toUpperCase()}`, 14, 50);
        doc.text(`Date: ${new Date(results.date).toLocaleString()}`, 14, 60);
        
        // Vulnerability summary
        doc.setFontSize(16);
        doc.text('Vulnerability Summary', 14, 80);
        
        const severityCounts = {
            critical: results.vulnerabilities.filter(v => v.severity === 'critical').length,
            high: results.vulnerabilities.filter(v => v.severity === 'high').length,
            medium: results.vulnerabilities.filter(v => v.severity === 'medium').length,
            low: results.vulnerabilities.filter(v => v.severity === 'low').length
        };
        
        // Summary table
        doc.autoTable({
            startY: 90,
            head: [['Severity', 'Count']],
            body: [
                ['Critical', severityCounts.critical],
                ['High', severityCounts.high],
                ['Medium', severityCounts.medium],
                ['Low', severityCounts.low]
            ],
            styles: {
                cellPadding: 5,
                fontSize: 12,
                halign: 'center'
            }
        });
        
        // Detailed vulnerabilities
        doc.addPage();
        doc.setFontSize(16);
        doc.text('Vulnerability Details', 14, 20);
        
        const vulnData = results.vulnerabilities.map(v => ({
            severity: v.severity.toUpperCase(),
            name: v.name,
            description: v.description,
            solution: v.solution
        }));
        
        doc.autoTable({
            startY: 30,
            columns: [
                { header: 'Severity', dataKey: 'severity' },
                { header: 'Vulnerability', dataKey: 'name' },
                { header: 'Description', dataKey: 'description' },
                { header: 'Solution', dataKey: 'solution' }
            ],
            body: vulnData,
            styles: { fontSize: 10 },
            columnStyles: {
                0: { cellWidth: 20 },
                1: { cellWidth: 30 },
                2: { cellWidth: 70 },
                3: { cellWidth: 70 }
            }
        });
        
        // Save the PDF
        doc.save(`WebShield-Scan-${results.url.replace(/[^a-z0-9]/gi, '-')}-${Date.now()}.pdf`);
    }

    // Reset scan UI
    function resetScanUI() {
        scanInProgress = false;
        startScanBtn.disabled = false;
        progressFill.style.width = '0%';
        progressText.textContent = '0%';
        
        document.querySelectorAll('.step').forEach(step => {
            step.classList.remove('active');
        });
        document.querySelector('.step[data-step="1"]').classList.add('active');
    }
}

// Initialize scanner when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.scanner-main')) {
        // Show auth prompt if not logged in
        if (localStorage.getItem('isLoggedIn') !== 'true') {
            document.getElementById('auth-required').classList.remove('hidden');
            document.querySelector('.scanner-controls').classList.add('hidden');
        } else {
            initScanner();
        }
    }
});