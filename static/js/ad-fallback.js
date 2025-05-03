/**
 * Ad Fallback Script for 9jaWaveLyrics
 * This script provides fallback content when ads are blocked
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check if ads are loaded after a delay
    setTimeout(checkAdsLoaded, 2000);
    
    // Function to check if ads are loaded
    function checkAdsLoaded() {
        const sidebarAd = document.getElementById('sidebar-ad');
        const bottomAd = document.getElementById('bottom-ad');
        
        // Check if sidebar ad is empty
        if (sidebarAd && sidebarAd.innerHTML.trim() === '' || sidebarAd.clientHeight < 10) {
            showFallbackAd(sidebarAd, 'sidebar');
        }
        
        // Check if bottom ad is empty
        if (bottomAd && bottomAd.innerHTML.trim() === '' || bottomAd.clientHeight < 10) {
            showFallbackAd(bottomAd, 'bottom');
        }
    }
    
    // Function to show fallback ad content
    function showFallbackAd(adContainer, type) {
        // Clear the container
        adContainer.innerHTML = '';
        
        if (type === 'sidebar') {
            // Create affiliate link for sidebar
            const affiliateLink = document.createElement('a');
            affiliateLink.href = 'https://distrokid.com/vip/9jawave';
            affiliateLink.target = '_blank';
            affiliateLink.className = 'affiliate-link';
            
            // Create image
            const img = document.createElement('img');
            img.src = '/static/images/distrokid-promo.jpg';
            img.alt = 'DistroKid - Distribute your music';
            img.style.maxWidth = '100%';
            img.style.height = 'auto';
            
            // Create text
            const text = document.createElement('p');
            text.className = 'mt-2 mb-0';
            text.innerHTML = '<strong>Distribute Your Music</strong><br>Get 7% off with code: <span class="text-primary">9JAWAVE</span>';
            
            // Append elements
            affiliateLink.appendChild(img);
            adContainer.appendChild(affiliateLink);
            adContainer.appendChild(text);
        } else {
            // Create affiliate link for bottom
            const affiliateLink = document.createElement('a');
            affiliateLink.href = 'https://tunecore.com/r/9jawave';
            affiliateLink.target = '_blank';
            affiliateLink.className = 'affiliate-link d-flex align-items-center';
            
            // Create image
            const img = document.createElement('img');
            img.src = '/static/images/tunecore-promo.jpg';
            img.alt = 'TuneCore - First release free';
            img.style.height = '90px';
            img.style.width = 'auto';
            
            // Create text
            const textDiv = document.createElement('div');
            textDiv.className = 'ms-3';
            textDiv.innerHTML = '<strong>Ready to release your music?</strong><br>Get your first release free with TuneCore';
            
            // Append elements
            affiliateLink.appendChild(img);
            affiliateLink.appendChild(textDiv);
            adContainer.appendChild(affiliateLink);
        }
        
        // Add fallback class for styling
        adContainer.classList.add('ad-fallback');
    }
});
