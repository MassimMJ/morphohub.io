// Navigation
// Handle file upload preview
function setupFilePreview() {
    const imageInput = document.getElementById('specimenImage');
    const imagePreview = document.getElementById('imagePreview');

    if (imageInput) {
        imageInput.addEventListener('change', function(e) {
            if (e.target.files && e.target.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                };
                reader.readAsDataURL(e.target.files[0]);
            }
        });
    }
}

// Handle form submission
function setupUploadForm() {
    const form = document.getElementById('upload-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            alert('Thank you for your submission!\n\nOur curation team will review your data before making it available on the site. This process ensures the quality and accuracy of all specimens in our database.\n\nYou will be notified once the review is complete.');
            
            // Clear all form fields
            form.reset();
            const imagePreview = document.getElementById('imagePreview');
            if (imagePreview) {
                imagePreview.innerHTML = '';
            }
        });
    }
}

// Navigation handling
document.addEventListener('DOMContentLoaded', () => {
    // Load initial content
    loadModels();
    loadServices();
    loadUserData();

    const navLinks = document.querySelectorAll('.nav-links a');
    const pages = document.querySelectorAll('.page');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = link.getAttribute('data-page');
            
            // Update navigation active states
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Hide all pages
            pages.forEach(p => {
                p.style.display = 'none';
                p.classList.remove('active');
            });
            
            // Show selected page
            const selectedPage = document.getElementById(pageId);
            if (selectedPage) {
                selectedPage.style.display = 'block';
                selectedPage.classList.add('active');
            }
            
            // Load content based on page
            if (pageId === 'services') {
                loadServices();
            } else if (pageId === 'news') {
                loadModels();
            } else if (pageId === 'mydata') {
                loadUserData();
            }
        });
    });
    
    // Setup forms
    setupAuthForm();
    setupUploadForm();
    setupFilePreview();
});

// Mock data
const mockSpecimens = {
    "1": { 
        name: "Tropical Rattlesnake",
        scientificName: "Crotalus durissus collilineatus",
        id: "INPA-H-004",
        institution: "Instituto Nacional de Pesquisas da Amazônia (INPA)"
    },
    "2": {
        name: "Alcatrazes Lancehead",
        scientificName: "Bothrops alcatraz",
        id: "MZUSP-H-002",
        institution: "Museu de Zoologia da USP (MZUSP)"
    },
    "3": {
        name: "Jararaca-Caiçaca",
        scientificName: "Bothrops atrox",
        id: "MPEG-H-003",
        institution: "Museu Paraense Emílio Goeldi (MPEG)"
    }
};

// Show or hide pages
function showPage(pageId, pages) {
    // First hide all pages with display: none
    pages.forEach(page => {
        page.style.display = 'none';
        page.classList.remove('active');
    });
    
    // Show the target page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.style.display = 'block';
        // Use setTimeout to ensure display: block is applied before adding active class
        setTimeout(() => targetPage.classList.add('active'), 10);
    }
}

// Load and display models
async function loadModels() {
    try {
        const response = await fetch('/api/models');
        const models = await response.json();
        
        const modelsGrid = document.getElementById('models-grid');
        if (!modelsGrid) return;

        modelsGrid.innerHTML = models.map(model => `
            <div class="model-card">
                <div class="model-image">
                    <img src="${model.image}" alt="${model.name}">
                </div>
                <div class="model-info">
                    <h3>${model.name}</h3>
                    <div class="specimen-id">${model.darwinCore.match(/occurrenceID: "(.*?)"/)[1]}</div>
                    <div class="info-grid">
                        <div class="info-item">
                            <span class="label">Museum:</span>
                            <span class="value">${model.museum}</span>
                        </div>
                        <div class="info-item">
                            <span class="label">Location:</span>
                            <span class="value">${model.location}</span>
                        </div>
                        <div class="info-item">
                            <span class="label">Uploader:</span>
                            <span class="value">${model.uploadedBy}</span>
                        </div>
                        <div class="info-item">
                            <span class="label">Institution:</span>
                            <span class="value">${model.institution}</span>
                        </div>
                        <div class="info-item">
                            <span class="label">Date Added:</span>
                            <span class="value">${new Date(model.date).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <div class="model-actions">
                        <button onclick="downloadMetadata(${model.id}, '${model.name}')" class="download-btn">
                            <span class="icon">📥</span> Download Darwin Core Metadata
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading models:', error);
        const modelsGrid = document.getElementById('models-grid');
        if (modelsGrid) {
            modelsGrid.innerHTML = '<p>Error loading models. Please try again later.</p>';
        }
    }
}

// Download metadata
async function downloadMetadata(modelId, modelName) {
    try {
        const response = await fetch(`/api/models/${modelId}/metadata`);
        if (!response.ok) throw new Error('Failed to download metadata');
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${modelName.toLowerCase().replace(/\s+/g, '_')}_metadata.txt`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    } catch (error) {
        console.error('Error downloading metadata:', error);
        alert('Failed to download metadata. Please try again.');
    }
}

// Load and display services
async function loadServices() {
    await Promise.all([loadTomographyLabs(), loadTechnicians()]);
}

async function loadTomographyLabs() {
    try {
        const response = await fetch('/api/tomography-labs');
        const labs = await response.json();
        
        const container = document.querySelector('.tomography-labs-container');
        if (!container) return;

        container.innerHTML = labs.map(lab => `
            <div class="service-card">
                <div class="service-header">
                    <h3>${lab.name}</h3>
                    <p class="subtitle">${lab.location}</p>
                </div>                <div class="equipment-info">
                    <div class="equipment-name">${lab.service.equipment}</div>
                    <div class="equipment-resolution">Resolution: ${lab.service.resolution}</div>
                </div>
                <div class="service-details">
                    <div class="detail-item">
                        <span class="label">Price:</span>
                        <span class="price">$${lab.service.price}/hour</span>
                    </div>
                </div>
                <div class="rating-section">
                    <div class="stars">
                        ${'★'.repeat(Math.floor(lab.service.rating))}${lab.service.rating % 1 ? '½' : ''}
                    </div>
                    <span class="review-count">(${lab.service.reviews} reviews)</span>
                </div>
                <button onclick="showPurchaseForm('tomography', ${lab.id}, ${lab.service.price}, '${lab.name}')">Book Session</button>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading tomography labs:', error);
    }
}

async function loadTechnicians() {
    try {
        const response = await fetch('/api/technicians');
        const technicians = await response.json();
        
        const container = document.querySelector('.technicians-container');
        if (!container) return;

        container.innerHTML = technicians.map(tech => `
            <div class="service-card">
                <div class="service-header">
                    <h3>${tech.name}</h3>
                    <p class="subtitle">${tech.title}</p>
                    <p class="subtitle">${tech.institution} - ${tech.location}</p>
                </div>
                <div class="specialties">
                    ${tech.specialties.map(specialty => 
                        `<span class="specialty-tag">${specialty}</span>`
                    ).join('')}
                </div>
                <div class="credentials">
                    <div class="detail-item">
                        <span class="label">Experience:</span>
                        <span>${tech.service.experience}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Publications:</span>
                        <span>${tech.service.publications}</span>
                    </div>
                </div>
                <div class="service-details">
                    <div class="detail-item">
                        <span class="label">Price per analysis:</span>
                        <span class="price">$${tech.service.price}</span>
                    </div>
                </div>
                <div class="rating-section">
                    <div class="stars">
                        ${'★'.repeat(Math.floor(tech.service.rating))}${tech.service.rating % 1 ? '½' : ''}
                    </div>
                    <span class="review-count">(${tech.service.reviews} reviews)</span>
                </div>
                <button onclick="showPurchaseForm('analysis', ${tech.id}, ${tech.service.price}, '${tech.name}')">Request Analysis</button>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading technicians:', error);
    }
}

// Show purchase form
function showPurchaseForm(serviceType, partnerId, price) {
    const modal = document.getElementById('purchase-form');
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Purchase ${serviceType.charAt(0).toUpperCase() + serviceType.slice(1)}</h3>
            <form onsubmit="submitPurchase(event, '${serviceType}', ${partnerId}, ${price})">
                <input type="text" placeholder="Card Number" pattern="[0-9]{16}" required>
                <input type="text" placeholder="MM/YY" pattern="(0[1-9]|1[0-2])\/([0-9]{2})" required>
                <input type="text" placeholder="CVV" pattern="[0-9]{3}" required>
                <input type="text" placeholder="Cardholder Name" required>
                <p class="total-price">Total: $${price}</p>
                <button type="submit">Purchase</button>
                <button type="button" onclick="closePurchaseForm()">Cancel</button>
            </form>
        </div>
    `;
}

// Close purchase form
function closePurchaseForm() {
    document.getElementById('purchase-form').style.display = 'none';
}

// Submit purchase
async function submitPurchase(event, serviceType, partnerId, price) {
    event.preventDefault();
    try {
        const response = await fetch('/api/purchase', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ serviceType, partnerId, price })
        });
        
        const result = await response.json();
        if (result.success) {
            const purchases = JSON.parse(localStorage.getItem('purchases') || '[]');
            purchases.push({
                serviceType,
                partnerId,
                price,
                date: new Date().toISOString()
            });
            localStorage.setItem('purchases', JSON.stringify(purchases));
            alert('Purchase successful!');
            closePurchaseForm();
            loadUserData();
        }
    } catch (error) {
        console.error('Error processing purchase:', error);
    }
}

// Setup authentication form
function setupAuthForm() {
    const form = document.getElementById('auth-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const [email, password, confirmPassword] = [...form.elements].slice(0, 3);
        
        if (password.value !== confirmPassword.value) {
            alert('Passwords do not match!');
            return;
        }
        
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email.value,
                    password: password.value
                })
            });
            
            const result = await response.json();
            if (result.success) {
                localStorage.setItem('user', JSON.stringify({ email: email.value }));
                alert('Registration successful!');
                form.reset();
            }
        } catch (error) {
            console.error('Error during registration:', error);
        }
    });
}

// Load user data
function loadUserData() {
    // Use global mockSpecimens defined above

    const mockDownloads = [
        {
            modelId: 2,
            name: "Alcatrazes Lancehead",
            date: "2025-06-14",
            institution: "Museu de Zoologia da USP (MZUSP)",
            type: "CT Scan & Darwin Core Metadata",
            specimenId: "MZUSP-H-002",
            scientificName: "Bothrops alcatraz"
        }
    ];

    const mockPurchases = [
        {
            serviceType: "Tomography",
            provider: "USP Imaging Lab",
            date: "2025-04-10",
            status: "Completed",
            details: "High-resolution scan of specimen MZUSP-123",
            price: 120,
            equipment: "Phoenix v|tome|x M"
        },
        {
            serviceType: "Technical Analysis",
            provider: "Dr. Ana Silva",
            date: "2025-05-01",
            status: "In Progress",
            details: "Morphological analysis of viper specimens",
            price: 450,
            specialties: "Viperidae, Elapidae"
        },
        {
            serviceType: "Tomography",
            provider: "UNICAMP Advanced Lab",
            date: "2025-06-10",
            status: "Scheduled",
            details: "Micro-CT scanning session",
            price: 150,
            equipment: "Bruker SkyScan 1272"
        }
    ];

    const downloads = JSON.parse(localStorage.getItem('downloads') || JSON.stringify(mockDownloads));
    const purchases = JSON.parse(localStorage.getItem('purchases') || JSON.stringify(mockPurchases));
    
    const downloadsContainer = document.querySelector('#downloads .item-list');
    const purchasesContainer = document.querySelector('#purchases .item-list');
      if (downloadsContainer) {
        const mockData = {
            2: {
                name: "Alcatrazes Lancehead",
                scientificName: "Bothrops alcatraz",
                institution: "Museu de Zoologia da USP (MZUSP)",
                id: "MZUSP-H-002",
                type: "CT Scan & Darwin Core Metadata",
                date: "2025-06-14"
            }
        };

        downloadsContainer.innerHTML = `
            <div class="history-item">
                <div class="history-header">
                    <strong>${mockData[2].name} (${mockData[2].scientificName})</strong>
                    <span class="date">${mockData[2].date}</span>
                </div>
                <div class="history-details">
                    <span class="label">Institution:</span> ${mockData[2].institution}<br>
                    <span class="label">Type:</span> ${mockData[2].type}<br>
                    <span class="label">Specimen ID:</span> ${mockData[2].id}
                </div>
            </div>
        `;
    }
    
    if (purchasesContainer) {
        purchasesContainer.innerHTML = purchases.map(purchase => `
            <div class="history-item">
                <div class="history-header">
                    <strong>${purchase.serviceType}</strong>
                    <span class="date">${new Date(purchase.date).toLocaleDateString()}</span>
                </div>
                <div class="history-details">
                    <span class="label">Provider:</span> ${purchase.provider}<br>
                    ${purchase.equipment ? `<span class="label">Equipment:</span> ${purchase.equipment}<br>` : ''}
                    ${purchase.specialties ? `<span class="label">Specialties:</span> ${purchase.specialties}<br>` : ''}
                    <span class="label">Status:</span> <span class="status-${purchase.status.toLowerCase()}">${purchase.status}</span><br>
                    <span class="label">Details:</span> ${purchase.details}<br>
                    <span class="label">Cost:</span> $${purchase.price}
                </div>
            </div>
        `).join('');
    }
}
