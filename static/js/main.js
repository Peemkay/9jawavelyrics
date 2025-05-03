/**
 * 9jaWaveLyrics Artwork Maker - Main JavaScript
 */

// Initialize tooltips
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Bootstrap tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Initialize Bootstrap popovers
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add active class to nav links based on current page
    const currentPath = window.location.pathname;
    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath === currentPath) {
            link.classList.add('active');
        }
    });
});

/**
 * Show loading spinner
 */
function showSpinner() {
    // Create spinner overlay if it doesn't exist
    if (!document.querySelector('.spinner-overlay')) {
        const spinnerOverlay = document.createElement('div');
        spinnerOverlay.className = 'spinner-overlay';
        
        const spinnerContainer = document.createElement('div');
        spinnerContainer.className = 'spinner-container';
        
        const spinner = document.createElement('div');
        spinner.className = 'spinner-border';
        spinner.setAttribute('role', 'status');
        
        const spinnerText = document.createElement('span');
        spinnerText.className = 'visually-hidden';
        spinnerText.textContent = 'Loading...';
        
        spinner.appendChild(spinnerText);
        spinnerContainer.appendChild(spinner);
        
        const loadingText = document.createElement('p');
        loadingText.className = 'mt-2';
        loadingText.textContent = 'Processing...';
        spinnerContainer.appendChild(loadingText);
        
        spinnerOverlay.appendChild(spinnerContainer);
        document.body.appendChild(spinnerOverlay);
    } else {
        document.querySelector('.spinner-overlay').style.display = 'flex';
    }
}

/**
 * Hide loading spinner
 */
function hideSpinner() {
    const spinner = document.querySelector('.spinner-overlay');
    if (spinner) {
        spinner.style.display = 'none';
    }
}

/**
 * Show a notification
 * @param {string} message - The message to display
 * @param {string} type - The type of notification (success, danger, warning, info)
 * @param {number} duration - Duration in milliseconds
 */
function showNotification(message, type = 'success', duration = 3000) {
    // Create notification container if it doesn't exist
    let notificationContainer = document.querySelector('.notification-container');
    
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container position-fixed top-0 end-0 p-3';
        notificationContainer.style.zIndex = '9999';
        document.body.appendChild(notificationContainer);
    }
    
    // Create toast element
    const toastId = 'toast-' + Date.now();
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type} border-0`;
    toast.id = toastId;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    // Toast content
    const toastContent = document.createElement('div');
    toastContent.className = 'd-flex';
    
    const toastBody = document.createElement('div');
    toastBody.className = 'toast-body';
    toastBody.textContent = message;
    
    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'btn-close btn-close-white me-2 m-auto';
    closeButton.setAttribute('data-bs-dismiss', 'toast');
    closeButton.setAttribute('aria-label', 'Close');
    
    toastContent.appendChild(toastBody);
    toastContent.appendChild(closeButton);
    toast.appendChild(toastContent);
    
    notificationContainer.appendChild(toast);
    
    // Initialize and show the toast
    const toastInstance = new bootstrap.Toast(toast, {
        autohide: true,
        delay: duration
    });
    
    toastInstance.show();
    
    // Remove the toast element after it's hidden
    toast.addEventListener('hidden.bs.toast', function () {
        toast.remove();
    });
}

/**
 * Format file size in human-readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Generate a random ID
 * @returns {string} Random ID
 */
function generateId() {
    return 'id-' + Math.random().toString(36).substr(2, 9);
}

/**
 * Check if a file is an image
 * @param {File} file - The file to check
 * @returns {boolean} True if the file is an image
 */
function isImageFile(file) {
    return file && file['type'].split('/')[0] === 'image';
}

/**
 * Get file extension from filename
 * @param {string} filename - The filename
 * @returns {string} The file extension
 */
function getFileExtension(filename) {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
}

/**
 * Convert data URL to Blob
 * @param {string} dataUrl - The data URL
 * @returns {Blob} The Blob object
 */
function dataURLtoBlob(dataUrl) {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    
    return new Blob([u8arr], { type: mime });
}

/**
 * Download a file
 * @param {string} url - The URL of the file
 * @param {string} filename - The filename
 */
function downloadFile(url, filename) {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
