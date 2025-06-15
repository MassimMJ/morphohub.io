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

// Navigation handling
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-links a');
    const pages = document.querySelectorAll('.page');
    
    // Initialize content on page load
    const initializeContent = async () => {
        try {
            await Promise.all([
                loadModels(),
                loadServices(),
                loadUserData()
            ]);
            setupAuthForm();
            setupUploadForm();
            setupFilePreview();
        } catch (error) {
            console.error('Error initializing content:', error);
        }
    };
    
    initializeContent();
    
    navLinks.forEach(link => {
        link.addEventListener('click', async (e) => {
            e.preventDefault();
            const pageId = link.getAttribute('data-page');
            
            // Update navigation active states
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Show the selected page using our showPage function
            showPage(pageId, pages);
            
            // Refresh page-specific content with error handling
            try {
                if (pageId === 'services') {
                    await loadServices();
                } else if (pageId === 'news') {
                    await loadModels();
                } else if (pageId === 'mydata') {
                    await loadUserData();
                }
            } catch (error) {
                console.error(`Error loading content for ${pageId}:`, error);
            }
        });
    });
});

