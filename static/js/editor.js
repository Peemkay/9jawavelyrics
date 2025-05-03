/**
 * 9jaWaveLyrics Artwork Maker - Editor JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Google AdSense ads
    initializeAds();

    // Function to initialize ads
    function initializeAds() {
        try {
            // Sidebar ad
            (adsbygoogle = window.adsbygoogle || []).push({
                google_ad_client: "ca-pub-YOUR_PUBLISHER_ID",
                google_ad_slot: "SIDEBAR_AD_SLOT_ID",
                google_ad_width: 300,
                google_ad_height: 250,
                container: document.getElementById('sidebar-ad')
            });

            // Bottom ad
            (adsbygoogle = window.adsbygoogle || []).push({
                google_ad_client: "ca-pub-YOUR_PUBLISHER_ID",
                google_ad_slot: "BOTTOM_AD_SLOT_ID",
                google_ad_width: 728,
                google_ad_height: 90,
                container: document.getElementById('bottom-ad')
            });

            console.log("Ads initialized successfully");
        } catch (e) {
            console.error("Error initializing ads:", e);
        }
    }
    // Elements
    const dropArea = document.getElementById('dropArea');
    const imageUpload = document.getElementById('imageUpload');
    const previewContainer = document.getElementById('previewContainer');
    const previewImage = document.getElementById('previewImage');
    const noImageMessage = document.getElementById('noImageMessage');
    const textOverlays = document.getElementById('textOverlays');
    const imageOverlays = document.getElementById('imageOverlays');
    const gridOverlay = document.getElementById('gridOverlay');
    const selectionOverlay = document.getElementById('selectionOverlay');

    // Rulers and guides elements
    const rulersContainer = document.getElementById('rulersContainer');
    const horizontalRuler = document.getElementById('horizontalRuler');
    const verticalRuler = document.getElementById('verticalRuler');
    const horizontalGuide = document.getElementById('horizontalGuide');
    const verticalGuide = document.getElementById('verticalGuide');
    const customGuides = document.getElementById('customGuides');
    const smartGuides = document.getElementById('smartGuides');

    // Editor toolbar elements
    const undoBtn = document.getElementById('undoBtn');
    const redoBtn = document.getElementById('redoBtn');

    // Alignment elements
    const alignLeftBtn = document.getElementById('alignLeftBtn');
    const alignCenterHBtn = document.getElementById('alignCenterHBtn');
    const alignRightBtn = document.getElementById('alignRightBtn');
    const alignTopBtn = document.getElementById('alignTopBtn');
    const alignMiddleBtn = document.getElementById('alignMiddleBtn');
    const alignBottomBtn = document.getElementById('alignBottomBtn');
    const distributeHorizontallyBtn = document.getElementById('distributeHorizontallyBtn');
    const distributeVerticallyBtn = document.getElementById('distributeVerticallyBtn');

    // Grid and snap elements
    const showGridBtn = document.getElementById('showGridBtn');
    const snapToGridBtn = document.getElementById('snapToGridBtn');
    const gridSizeSlider = document.getElementById('gridSizeSlider');
    const gridSizeValue = document.getElementById('gridSizeValue');
    const showRulersBtn = document.getElementById('showRulersBtn');
    const showGuidesBtn = document.getElementById('showGuidesBtn');

    // Arrangement elements
    const bringToFrontBtn = document.getElementById('bringToFrontBtn');
    const sendToBackBtn = document.getElementById('sendToBackBtn');
    const bringForwardBtn = document.getElementById('bringForwardBtn');
    const sendBackwardBtn = document.getElementById('sendBackwardBtn');

    const autoSaveStatus = document.querySelector('.auto-save-status');

    // Resize and export elements
    const standardSizes = document.getElementById('standardSizes');
    const forceSquare = document.getElementById('forceSquare');
    const exportSize = document.getElementById('exportSize');
    const optimizeForDistribution = document.getElementById('optimizeForDistribution');

    // Text controls
    const textInput = document.getElementById('textInput');
    const fontSelect = document.getElementById('fontSelect');
    const fontSize = document.getElementById('fontSize');
    const fontSizeValue = document.getElementById('fontSizeValue');
    const textColor = document.getElementById('textColor');
    const textBold = document.getElementById('textBold');
    const textItalic = document.getElementById('textItalic');
    const textUnderline = document.getElementById('textUnderline');
    const addTextBtn = document.getElementById('addTextBtn');
    const fontPreview = document.getElementById('fontPreview');

    // Overlay controls
    const overlayDropArea = document.getElementById('overlayDropArea');
    const overlayUpload = document.getElementById('overlayUpload');
    const overlaySize = document.getElementById('overlaySize');
    const overlaySizeValue = document.getElementById('overlaySizeValue');
    const overlayOpacity = document.getElementById('overlayOpacity');
    const overlayOpacityValue = document.getElementById('overlayOpacityValue');
    const addOverlayBtn = document.getElementById('addOverlayBtn');

    // Edit controls
    const cropBtn = document.getElementById('cropBtn');
    const resizeBtn = document.getElementById('resizeBtn');
    const resizeControls = document.getElementById('resizeControls');
    const resizeWidth = document.getElementById('resizeWidth');
    const resizeHeight = document.getElementById('resizeHeight');
    const maintainAspectRatio = document.getElementById('maintainAspectRatio');
    const applyResizeBtn = document.getElementById('applyResizeBtn');
    const removeBackgroundBtn = document.getElementById('removeBackgroundBtn');
    const replaceBackgroundBtn = document.getElementById('replaceBackgroundBtn');
    const backgroundColorControls = document.getElementById('backgroundColorControls');
    const backgroundColor = document.getElementById('backgroundColor');
    const applyBackgroundBtn = document.getElementById('applyBackgroundBtn');

    // Export controls
    const exportFormat = document.getElementById('exportFormat');
    const exportQuality = document.getElementById('exportQuality');
    const exportQualityValue = document.getElementById('exportQualityValue');
    const downloadBtn = document.getElementById('downloadBtn');

    // Variables
    let currentImage = null;
    let cropper = null;
    let aspectRatio = 1; // Default to square (1:1)
    let textStyles = {
        bold: false,
        italic: false,
        underline: false
    };
    let currentOverlay = null;

    // History for undo/redo
    let history = [];
    let historyIndex = -1;
    const MAX_HISTORY = 30; // Maximum number of states to store

    // Auto-save variables
    let autoSaveInterval = null;
    const AUTO_SAVE_DELAY = 30000; // Auto-save every 30 seconds

    // Grid and snap variables
    let gridSize = 20; // Default grid size in pixels
    let snapToGridEnabled = false;
    let showGridEnabled = false;
    let showRulersEnabled = false;
    let showGuidesEnabled = false;
    let customGuidesList = []; // Array to store custom guides

    // Smart guides variables
    let smartGuidesEnabled = true;
    let smartGuideThreshold = 5; // Pixels threshold for smart guides

    // Selection variables
    let selectedElements = []; // Array to store multiple selected elements
    let isMultipleSelectionMode = false;
    let selectionStart = { x: 0, y: 0 };
    let isDrawingSelection = false;

    // Context menu and quick tools variables
    let contextMenuVisible = false;
    let quickToolsVisible = false;
    let currentContextElement = null;
    let longPressTimer = null;
    const LONG_PRESS_DURATION = 500; // milliseconds

    // Context menu and quick tools elements
    const contextMenu = document.getElementById('contextMenu');
    const quickTools = document.getElementById('quickTools');
    const longPressIndicator = document.getElementById('longPressIndicator');

    // Initialize range input displays
    fontSize.addEventListener('input', function() {
        fontSizeValue.textContent = `${this.value}px`;
        updateFontPreview();
    });

    overlaySize.addEventListener('input', function() {
        overlaySizeValue.textContent = `${this.value}%`;
    });

    overlayOpacity.addEventListener('input', function() {
        overlayOpacityValue.textContent = `${this.value}%`;
    });

    exportQuality.addEventListener('input', function() {
        exportQualityValue.textContent = `${this.value}%`;
    });

    // Font preview
    fontSelect.addEventListener('change', updateFontPreview);
    textColor.addEventListener('input', updateFontPreview);
    textBold.addEventListener('click', function() {
        textStyles.bold = !textStyles.bold;
        this.classList.toggle('active');
        updateFontPreview();
    });

    textItalic.addEventListener('click', function() {
        textStyles.italic = !textStyles.italic;
        this.classList.toggle('active');
        updateFontPreview();
    });

    textUnderline.addEventListener('click', function() {
        textStyles.underline = !textStyles.underline;
        this.classList.toggle('active');
        updateFontPreview();
    });

    function updateFontPreview() {
        fontPreview.style.fontFamily = fontSelect.value;
        fontPreview.style.fontSize = `${fontSize.value}px`;
        fontPreview.style.color = textColor.value;
        fontPreview.style.fontWeight = textStyles.bold ? 'bold' : 'normal';
        fontPreview.style.fontStyle = textStyles.italic ? 'italic' : 'normal';
        fontPreview.style.textDecoration = textStyles.underline ? 'underline' : 'none';
    }

    // Initialize font preview
    updateFontPreview();

    // Click on preview container to deselect elements
    previewContainer.addEventListener('click', function(e) {
        // Only deselect if clicking directly on the container or the base image
        if (e.target === previewContainer || e.target === previewImage) {
            document.querySelectorAll('.editor-element').forEach(el => {
                el.classList.remove('selected');
            });
        }
    });

    // Save current state to history
    function saveToHistory() {
        // Get the current state of the editor
        const state = {
            baseImage: currentImage,
            textElements: [],
            imageElements: []
        };

        // Save text elements
        document.querySelectorAll('#textOverlays .editor-element').forEach(el => {
            state.textElements.push({
                text: el.textContent,
                style: {
                    fontFamily: el.style.fontFamily,
                    fontSize: el.style.fontSize,
                    color: el.style.color,
                    fontWeight: el.style.fontWeight,
                    fontStyle: el.style.fontStyle,
                    textDecoration: el.style.textDecoration,
                    top: el.style.top,
                    left: el.style.left,
                    transform: el.style.transform,
                    width: el.style.width,
                    height: el.style.height
                }
            });
        });

        // Save image elements
        document.querySelectorAll('#imageOverlays .editor-element').forEach(el => {
            const img = el.querySelector('img');
            state.imageElements.push({
                src: img.src,
                style: {
                    top: el.style.top,
                    left: el.style.left,
                    width: el.style.width,
                    height: el.style.height,
                    transform: el.style.transform,
                    opacity: el.style.opacity
                }
            });
        });

        // If we're in the middle of the history and making a new change,
        // remove all future states
        if (historyIndex < history.length - 1) {
            history = history.slice(0, historyIndex + 1);
        }

        // Add the new state to history
        history.push(state);

        // Limit history size
        if (history.length > MAX_HISTORY) {
            history.shift();
        }

        // Update history index
        historyIndex = history.length - 1;

        // Update undo/redo buttons
        updateUndoRedoButtons();

        // Auto-save to localStorage
        saveToLocalStorage();
    }

    // Undo the last action
    function undo() {
        if (historyIndex > 0) {
            historyIndex--;
            restoreState(history[historyIndex]);
            updateUndoRedoButtons();
        }
    }

    // Redo the last undone action
    function redo() {
        if (historyIndex < history.length - 1) {
            historyIndex++;
            restoreState(history[historyIndex]);
            updateUndoRedoButtons();
        }
    }

    // Restore editor to a saved state
    function restoreState(state) {
        // Clear current elements
        textOverlays.innerHTML = '';
        imageOverlays.innerHTML = '';

        // Restore base image if it exists
        if (state.baseImage) {
            currentImage = state.baseImage;
            previewImage.src = currentImage;
            previewImage.style.display = 'block';
            noImageMessage.style.display = 'none';
        }

        // Restore text elements
        state.textElements.forEach(textEl => {
            const element = document.createElement('div');
            element.className = 'editor-element text-element';
            element.style.position = 'absolute';
            element.style.fontFamily = textEl.style.fontFamily;
            element.style.fontSize = textEl.style.fontSize;
            element.style.color = textEl.style.color;
            element.style.fontWeight = textEl.style.fontWeight;
            element.style.fontStyle = textEl.style.fontStyle;
            element.style.textDecoration = textEl.style.textDecoration;
            element.style.top = textEl.style.top;
            element.style.left = textEl.style.left;
            element.style.transform = textEl.style.transform;
            element.style.width = textEl.style.width;
            element.style.height = textEl.style.height;
            element.style.cursor = 'move';
            element.style.userSelect = 'none';
            element.style.padding = '5px';
            element.style.minWidth = '50px';
            element.style.minHeight = '20px';
            element.textContent = textEl.text;

            textOverlays.appendChild(element);
            makeElementDraggable(element);
        });

        // Restore image elements
        state.imageElements.forEach(imgEl => {
            const element = document.createElement('div');
            element.className = 'editor-element overlay-element';
            element.style.position = 'absolute';
            element.style.top = imgEl.style.top;
            element.style.left = imgEl.style.left;
            element.style.width = imgEl.style.width;
            element.style.height = imgEl.style.height;
            element.style.transform = imgEl.style.transform;
            element.style.opacity = imgEl.style.opacity;
            element.style.cursor = 'move';
            element.style.userSelect = 'none';
            element.style.minWidth = '30px';
            element.style.minHeight = '30px';

            const img = document.createElement('img');
            img.src = imgEl.src;
            img.style.width = '100%';
            img.style.height = 'auto';
            img.style.display = 'block';

            element.appendChild(img);
            imageOverlays.appendChild(element);
            makeElementDraggable(element);
        });
    }

    // Update undo/redo buttons state
    function updateUndoRedoButtons() {
        // This will be implemented when we add the buttons to the UI
        const canUndo = historyIndex > 0;
        const canRedo = historyIndex < history.length - 1;

        // Update button states if they exist
        if (document.getElementById('undoBtn')) {
            document.getElementById('undoBtn').disabled = !canUndo;
        }

        if (document.getElementById('redoBtn')) {
            document.getElementById('redoBtn').disabled = !canRedo;
        }
    }

    // Save the current state to localStorage
    function saveToLocalStorage() {
        try {
            const projectData = {
                timestamp: new Date().toISOString(),
                currentState: history[historyIndex],
                projectName: 'Artwork Project'
            };

            localStorage.setItem('9jaWaveLyrics_artwork_autosave', JSON.stringify(projectData));
            const saveTime = new Date().toLocaleTimeString();
            console.log('Project auto-saved at', saveTime);

            // Update status display
            updateAutoSaveStatus(`Auto-saved at ${saveTime}`);

            // Reset status after 3 seconds
            setTimeout(() => {
                updateAutoSaveStatus('Auto-save enabled');
            }, 3000);
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            updateAutoSaveStatus('Auto-save failed');
        }
    }

    // Load the saved state from localStorage
    function loadFromLocalStorage() {
        try {
            const savedData = localStorage.getItem('9jaWaveLyrics_artwork_autosave');

            if (savedData) {
                const projectData = JSON.parse(savedData);

                // Check if the data is recent (less than 24 hours old)
                const savedTime = new Date(projectData.timestamp);
                const currentTime = new Date();
                const hoursDiff = (currentTime - savedTime) / (1000 * 60 * 60);

                if (hoursDiff < 24 && projectData.currentState) {
                    // Ask user if they want to restore
                    if (confirm(`Would you like to restore your unsaved project from ${savedTime.toLocaleString()}?`)) {
                        // Restore the saved state
                        history = [projectData.currentState];
                        historyIndex = 0;
                        restoreState(projectData.currentState);

                        showNotification('Project restored from auto-save', 'success');
                    }
                }
            }
        } catch (error) {
            console.error('Error loading from localStorage:', error);
        }
    }

    // Start auto-save
    function startAutoSave() {
        // Clear any existing interval
        if (autoSaveInterval) {
            clearInterval(autoSaveInterval);
        }

        // Set up new interval
        autoSaveInterval = setInterval(function() {
            if (history.length > 0) {
                saveToLocalStorage();
            }
        }, AUTO_SAVE_DELAY);
    }

    // Stop auto-save
    function stopAutoSave() {
        if (autoSaveInterval) {
            clearInterval(autoSaveInterval);
            autoSaveInterval = null;
        }
    }

    // Initialize auto-save and load any saved project
    startAutoSave();
    loadFromLocalStorage();

    // Initialize grid and rulers
    updateGridSize();

    // Initialize event listener for window resize to update rulers
    window.addEventListener('resize', function() {
        if (showRulersEnabled) {
            updateRulers();
        }
    });

    // Initialize the editor when an image is loaded
    previewImage.addEventListener('load', function() {
        if (showRulersEnabled) {
            updateRulers();
        }
    });

    // Context menu and quick tools functionality

    // Context menu event listeners
    document.getElementById('editMenuItem').addEventListener('click', function() {
        if (currentContextElement) {
            // Open edit panel for the element type
            if (currentContextElement.classList.contains('text-element')) {
                // Show text editing panel
                document.getElementById('text-tab').click();
            } else if (currentContextElement.classList.contains('overlay-element')) {
                // Show overlay editing panel
                document.getElementById('overlay-tab').click();
            }
            hideContextMenu();
        }
    });

    document.getElementById('duplicateMenuItem').addEventListener('click', function() {
        if (currentContextElement) {
            duplicateElement(currentContextElement);
            hideContextMenu();
        }
    });

    document.getElementById('flipHMenuItem').addEventListener('click', function() {
        if (currentContextElement) {
            flipElement(currentContextElement, 'horizontal');
            hideContextMenu();
        }
    });

    document.getElementById('flipVMenuItem').addEventListener('click', function() {
        if (currentContextElement) {
            flipElement(currentContextElement, 'vertical');
            hideContextMenu();
        }
    });

    document.getElementById('frontMenuItem').addEventListener('click', function() {
        if (currentContextElement) {
            bringToFront(currentContextElement);
            hideContextMenu();
        }
    });

    document.getElementById('backMenuItem').addEventListener('click', function() {
        if (currentContextElement) {
            sendToBack(currentContextElement);
            hideContextMenu();
        }
    });

    document.getElementById('deleteMenuItem').addEventListener('click', function() {
        if (currentContextElement) {
            deleteElement(currentContextElement);
            hideContextMenu();
        }
    });

    // Quick tools event listeners
    document.getElementById('quickEditBtn').addEventListener('click', function() {
        if (currentContextElement) {
            // Open edit panel for the element type
            if (currentContextElement.classList.contains('text-element')) {
                // Show text editing panel
                document.getElementById('text-tab').click();
            } else if (currentContextElement.classList.contains('overlay-element')) {
                // Show overlay editing panel
                document.getElementById('overlay-tab').click();
            }
            hideQuickTools();
        }
    });

    document.getElementById('quickDuplicateBtn').addEventListener('click', function() {
        if (currentContextElement) {
            duplicateElement(currentContextElement);
            hideQuickTools();
        }
    });

    document.getElementById('quickDeleteBtn').addEventListener('click', function() {
        if (currentContextElement) {
            deleteElement(currentContextElement);
            hideQuickTools();
        }
    });

    document.getElementById('quickFrontBtn').addEventListener('click', function() {
        if (currentContextElement) {
            bringToFront(currentContextElement);
            hideQuickTools();
        }
    });

    document.getElementById('quickBackBtn').addEventListener('click', function() {
        if (currentContextElement) {
            sendToBack(currentContextElement);
            hideQuickTools();
        }
    });

    // Hide context menu when clicking outside
    document.addEventListener('click', function(e) {
        if (contextMenuVisible && !contextMenu.contains(e.target)) {
            hideContextMenu();
        }
    });

    // Hide quick tools when clicking outside
    document.addEventListener('click', function(e) {
        if (quickToolsVisible && !quickTools.contains(e.target) && !e.target.classList.contains('editor-element')) {
            hideQuickTools();
        }
    });

    // Prevent default context menu
    previewContainer.addEventListener('contextmenu', function(e) {
        e.preventDefault();
    });

    // Function to show context menu
    function showContextMenu(x, y, element) {
        // Set current context element
        currentContextElement = element;

        // Position the menu
        contextMenu.style.left = x + 'px';
        contextMenu.style.top = y + 'px';

        // Show the menu
        contextMenu.style.display = 'block';
        contextMenuVisible = true;

        // Ensure menu stays within viewport
        const rect = contextMenu.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        if (rect.right > viewportWidth) {
            contextMenu.style.left = (x - rect.width) + 'px';
        }

        if (rect.bottom > viewportHeight) {
            contextMenu.style.top = (y - rect.height) + 'px';
        }
    }

    // Function to hide context menu
    function hideContextMenu() {
        contextMenu.style.display = 'none';
        contextMenuVisible = false;
        currentContextElement = null;
    }

    // Function to show quick tools
    function showQuickTools(element) {
        // Set current context element
        currentContextElement = element;

        // Position the tools above the element
        const rect = element.getBoundingClientRect();
        const containerRect = previewContainer.getBoundingClientRect();

        quickTools.style.left = (rect.left + rect.width/2 - quickTools.offsetWidth/2 - containerRect.left) + 'px';
        quickTools.style.top = (rect.top - quickTools.offsetHeight - 10 - containerRect.top) + 'px';

        // Show the tools
        quickTools.classList.add('visible');
        quickToolsVisible = true;
    }

    // Function to hide quick tools
    function hideQuickTools() {
        quickTools.classList.remove('visible');
        quickToolsVisible = false;
    }

    // Function to flip an element
    function flipElement(element, direction) {
        // Get current transform
        let transform = element.style.transform || '';

        // Check if already flipped
        const isFlippedH = transform.includes('scaleX(-1)');
        const isFlippedV = transform.includes('scaleY(-1)');

        // Remove existing flip transforms
        transform = transform.replace(/\s*scaleX\(-1\)/g, '');
        transform = transform.replace(/\s*scaleY\(-1\)/g, '');

        // Add new flip transform
        if (direction === 'horizontal' && !isFlippedH) {
            transform += ' scaleX(-1)';
        } else if (direction === 'vertical' && !isFlippedV) {
            transform += ' scaleY(-1)';
        }

        // Apply transform
        element.style.transform = transform.trim();

        // Save to history
        saveToHistory();
    }

    // Function to start long press timer
    function startLongPress(e, element) {
        // Show long press indicator
        longPressIndicator.style.display = 'block';
        longPressIndicator.style.left = e.clientX + 'px';
        longPressIndicator.style.top = e.clientY + 'px';

        // Start timer
        longPressTimer = setTimeout(function() {
            // Hide indicator
            longPressIndicator.style.display = 'none';

            // Show context menu
            const rect = previewContainer.getBoundingClientRect();
            showContextMenu(e.clientX - rect.left, e.clientY - rect.top, element);

            // Clear timer
            longPressTimer = null;
        }, LONG_PRESS_DURATION);
    }

    // Function to cancel long press
    function cancelLongPress() {
        if (longPressTimer) {
            clearTimeout(longPressTimer);
            longPressTimer = null;
            longPressIndicator.style.display = 'none';
        }
    }

    // Add event listeners for toolbar buttons
    undoBtn.addEventListener('click', undo);
    redoBtn.addEventListener('click', redo);

    // Grid and snap functionality

    // Grid size slider
    gridSizeSlider.addEventListener('input', function() {
        gridSize = parseInt(this.value);
        gridSizeValue.textContent = `${gridSize}px`;
        updateGridSize();
    });

    // Show grid toggle
    showGridBtn.addEventListener('change', function() {
        showGridEnabled = this.checked;
        gridOverlay.style.display = showGridEnabled ? 'block' : 'none';
        showNotification(showGridEnabled ? 'Grid visible' : 'Grid hidden', 'info');
    });

    // Snap to grid toggle
    snapToGridBtn.addEventListener('change', function() {
        snapToGridEnabled = this.checked;
        if (snapToGridEnabled && !showGridEnabled) {
            showGridBtn.checked = true;
            showGridEnabled = true;
            gridOverlay.style.display = 'block';
        }
        showNotification(snapToGridEnabled ? 'Snap to grid enabled' : 'Snap to grid disabled', 'info');
    });

    // Show rulers toggle
    showRulersBtn.addEventListener('change', function() {
        showRulersEnabled = this.checked;
        rulersContainer.style.display = showRulersEnabled ? 'block' : 'none';
        if (showRulersEnabled) {
            updateRulers();
        }
        showNotification(showRulersEnabled ? 'Rulers visible' : 'Rulers hidden', 'info');
    });

    // Show guides toggle
    showGuidesBtn.addEventListener('change', function() {
        showGuidesEnabled = this.checked;
        customGuides.style.display = showGuidesEnabled ? 'block' : 'none';
        showNotification(showGuidesEnabled ? 'Guides visible' : 'Guides hidden', 'info');
    });

    // Update grid size
    function updateGridSize() {
        gridOverlay.style.backgroundSize = `${gridSize}px ${gridSize}px`;
    }

    // Update rulers
    function updateRulers() {
        if (!showRulersEnabled) return;

        // Clear existing ruler markings
        horizontalRuler.innerHTML = '';
        verticalRuler.innerHTML = '';

        // Get container dimensions
        const width = previewContainer.offsetWidth;
        const height = previewContainer.offsetHeight;

        // Set ruler dimensions
        horizontalRuler.style.width = width + 'px';
        verticalRuler.style.height = height + 'px';

        // Add markings to horizontal ruler
        for (let i = 0; i < width; i += 50) {
            const marking = document.createElement('div');
            marking.className = 'ruler-marking';
            marking.style.position = 'absolute';
            marking.style.left = i + 'px';
            marking.style.top = '0';
            marking.style.height = i % 100 === 0 ? '10px' : '5px';
            marking.style.width = '1px';
            marking.style.backgroundColor = '#888';

            if (i % 100 === 0) {
                const label = document.createElement('div');
                label.className = 'ruler-label';
                label.style.position = 'absolute';
                label.style.left = (i + 2) + 'px';
                label.style.top = '10px';
                label.style.fontSize = '8px';
                label.textContent = i;
                horizontalRuler.appendChild(label);
            }

            horizontalRuler.appendChild(marking);
        }

        // Add markings to vertical ruler
        for (let i = 0; i < height; i += 50) {
            const marking = document.createElement('div');
            marking.className = 'ruler-marking';
            marking.style.position = 'absolute';
            marking.style.top = i + 'px';
            marking.style.left = '0';
            marking.style.width = i % 100 === 0 ? '10px' : '5px';
            marking.style.height = '1px';
            marking.style.backgroundColor = '#888';

            if (i % 100 === 0) {
                const label = document.createElement('div');
                label.className = 'ruler-label';
                label.style.position = 'absolute';
                label.style.top = (i + 2) + 'px';
                label.style.left = '10px';
                label.style.fontSize = '8px';
                label.textContent = i;
                verticalRuler.appendChild(label);
            }

            verticalRuler.appendChild(marking);
        }
    }

    // Create custom guide
    function createCustomGuide(type, position) {
        const guide = document.createElement('div');
        guide.className = `custom-guide ${type}`;

        if (type === 'horizontal') {
            guide.style.top = position + 'px';
        } else {
            guide.style.left = position + 'px';
        }

        guide.dataset.position = position;
        guide.dataset.type = type;

        // Make guide draggable
        guide.addEventListener('mousedown', function(e) {
            e.stopPropagation();
            const startPos = type === 'horizontal' ? e.clientY : e.clientX;
            const guidePos = parseInt(guide.dataset.position);

            guide.classList.add('active');

            function moveGuide(e) {
                const currentPos = type === 'horizontal' ? e.clientY : e.clientX;
                const delta = currentPos - startPos;
                const newPos = guidePos + delta;

                if (type === 'horizontal') {
                    guide.style.top = newPos + 'px';
                } else {
                    guide.style.left = newPos + 'px';
                }
            }

            function stopMoving() {
                document.removeEventListener('mousemove', moveGuide);
                document.removeEventListener('mouseup', stopMoving);

                // Update guide position in dataset
                const newPos = type === 'horizontal' ?
                    parseInt(guide.style.top) :
                    parseInt(guide.style.left);
                guide.dataset.position = newPos;

                guide.classList.remove('active');

                // Update guide in the list
                const index = customGuidesList.findIndex(g => g.element === guide);
                if (index !== -1) {
                    customGuidesList[index].position = newPos;
                }
            }

            document.addEventListener('mousemove', moveGuide);
            document.addEventListener('mouseup', stopMoving);
        });

        // Double-click to remove guide
        guide.addEventListener('dblclick', function() {
            guide.remove();

            // Remove from guides list
            const index = customGuidesList.findIndex(g => g.element === guide);
            if (index !== -1) {
                customGuidesList.splice(index, 1);
            }
        });

        customGuides.appendChild(guide);

        // Add to guides list
        customGuidesList.push({
            type: type,
            position: position,
            element: guide
        });

        return guide;
    }

    // Create guides from rulers
    horizontalRuler.addEventListener('mousedown', function(e) {
        if (!showGuidesEnabled) return;

        const startX = e.clientX;
        const guide = createCustomGuide('vertical', startX - previewContainer.getBoundingClientRect().left);
        guide.classList.add('active');

        function moveGuide(e) {
            const currentX = e.clientX;
            const newPos = currentX - previewContainer.getBoundingClientRect().left;
            guide.style.left = newPos + 'px';
        }

        function stopMoving() {
            document.removeEventListener('mousemove', moveGuide);
            document.removeEventListener('mouseup', stopMoving);

            // Update guide position in dataset
            const newPos = parseInt(guide.style.left);
            guide.dataset.position = newPos;

            guide.classList.remove('active');

            // Update guide in the list
            const index = customGuidesList.findIndex(g => g.element === guide);
            if (index !== -1) {
                customGuidesList[index].position = newPos;
            }
        }

        document.addEventListener('mousemove', moveGuide);
        document.addEventListener('mouseup', stopMoving);
    });

    verticalRuler.addEventListener('mousedown', function(e) {
        if (!showGuidesEnabled) return;

        const startY = e.clientY;
        const guide = createCustomGuide('horizontal', startY - previewContainer.getBoundingClientRect().top);
        guide.classList.add('active');

        function moveGuide(e) {
            const currentY = e.clientY;
            const newPos = currentY - previewContainer.getBoundingClientRect().top;
            guide.style.top = newPos + 'px';
        }

        function stopMoving() {
            document.removeEventListener('mousemove', moveGuide);
            document.removeEventListener('mouseup', stopMoving);

            // Update guide position in dataset
            const newPos = parseInt(guide.style.top);
            guide.dataset.position = newPos;

            guide.classList.remove('active');

            // Update guide in the list
            const index = customGuidesList.findIndex(g => g.element === guide);
            if (index !== -1) {
                customGuidesList[index].position = newPos;
            }
        }

        document.addEventListener('mousemove', moveGuide);
        document.addEventListener('mouseup', stopMoving);
    });

    // Function to snap position to grid
    function snapToGrid(position) {
        if (!snapToGridEnabled) return position;
        return Math.round(position / gridSize) * gridSize;
    }

    // Function to check if position is close to a guide
    function checkGuideSnap(position, isHorizontal) {
        if (!showGuidesEnabled) return position;

        // Check custom guides
        for (const guide of customGuidesList) {
            if ((isHorizontal && guide.type === 'horizontal') ||
                (!isHorizontal && guide.type === 'vertical')) {

                if (Math.abs(guide.position - position) <= smartGuideThreshold) {
                    return guide.position;
                }
            }
        }

        return position;
    }

    // Function to show smart guides
    function showSmartGuide(type, position) {
        if (type === 'horizontal') {
            horizontalGuide.style.top = position + 'px';
            horizontalGuide.style.display = 'block';
        } else {
            verticalGuide.style.left = position + 'px';
            verticalGuide.style.display = 'block';
        }
    }

    // Function to hide smart guides
    function hideSmartGuides() {
        horizontalGuide.style.display = 'none';
        verticalGuide.style.display = 'none';
    }

    // Alignment buttons
    alignLeftBtn.addEventListener('click', function() {
        alignSelectedElements('left');
    });

    alignCenterHBtn.addEventListener('click', function() {
        alignSelectedElements('centerH');
    });

    alignRightBtn.addEventListener('click', function() {
        alignSelectedElements('right');
    });

    alignTopBtn.addEventListener('click', function() {
        alignSelectedElements('top');
    });

    alignMiddleBtn.addEventListener('click', function() {
        alignSelectedElements('middle');
    });

    alignBottomBtn.addEventListener('click', function() {
        alignSelectedElements('bottom');
    });

    // Distribution buttons
    distributeHorizontallyBtn.addEventListener('click', function() {
        distributeElements('horizontal');
    });

    distributeVerticallyBtn.addEventListener('click', function() {
        distributeElements('vertical');
    });

    // Arrangement buttons
    bringToFrontBtn.addEventListener('click', function() {
        const selectedElement = getSelectedElement();
        if (selectedElement) {
            bringToFront(selectedElement);
        }
    });

    sendToBackBtn.addEventListener('click', function() {
        const selectedElement = getSelectedElement();
        if (selectedElement) {
            sendToBack(selectedElement);
        }
    });

    bringForwardBtn.addEventListener('click', function() {
        const selectedElement = getSelectedElement();
        if (selectedElement) {
            bringForward(selectedElement);
        }
    });

    sendBackwardBtn.addEventListener('click', function() {
        const selectedElement = getSelectedElement();
        if (selectedElement) {
            sendBackward(selectedElement);
        }
    });

    // Function to get the currently selected element
    function getSelectedElement() {
        const selectedElement = document.querySelector('.editor-element.selected');
        if (!selectedElement) {
            showNotification('Please select an element first', 'warning');
            return null;
        }
        return selectedElement;
    }

    // Function to get all selected elements
    function getSelectedElements() {
        if (selectedElements.length > 0) {
            return selectedElements;
        }

        const selectedElement = getSelectedElement();
        return selectedElement ? [selectedElement] : [];
    }

    // Function to align selected elements
    function alignSelectedElements(alignment) {
        const elements = getSelectedElements();
        if (elements.length === 0) {
            showNotification('Please select at least one element to align', 'warning');
            return;
        }

        const containerWidth = previewContainer.offsetWidth;
        const containerHeight = previewContainer.offsetHeight;

        elements.forEach(element => {
            // Remove any transform that might interfere with alignment
            if (element.style.transform && element.style.transform.includes('translate')) {
                element.style.transform = element.style.transform.replace(/translate\([^)]*\)/g, '');
            }

            switch (alignment) {
                case 'left':
                    element.style.left = '10px';
                    break;
                case 'centerH':
                    const elementWidth = element.offsetWidth;
                    element.style.left = ((containerWidth - elementWidth) / 2) + 'px';
                    break;
                case 'right':
                    const elemWidth = element.offsetWidth;
                    element.style.left = (containerWidth - elemWidth - 10) + 'px';
                    break;
                case 'top':
                    element.style.top = '10px';
                    break;
                case 'middle':
                    const elementHeight = element.offsetHeight;
                    element.style.top = ((containerHeight - elementHeight) / 2) + 'px';
                    break;
                case 'bottom':
                    const elemHeight = element.offsetHeight;
                    element.style.top = (containerHeight - elemHeight - 10) + 'px';
                    break;
            }
        });

        // Save to history
        saveToHistory();

        showNotification(`Elements aligned ${alignment}`, 'success');
    }

    // Function to distribute elements
    function distributeElements(direction) {
        const elements = getSelectedElements();
        if (elements.length < 3) {
            showNotification('Please select at least three elements to distribute', 'warning');
            return;
        }

        // Sort elements by position
        if (direction === 'horizontal') {
            elements.sort((a, b) => a.offsetLeft - b.offsetLeft);

            // Get total available space
            const firstElement = elements[0];
            const lastElement = elements[elements.length - 1];
            const totalSpace = (lastElement.offsetLeft + lastElement.offsetWidth) - firstElement.offsetLeft;
            const totalElementsWidth = elements.reduce((sum, el) => sum + el.offsetWidth, 0);
            const availableSpace = totalSpace - totalElementsWidth;
            const spacing = availableSpace / (elements.length - 1);

            // Position elements
            let currentPosition = firstElement.offsetLeft;
            elements.forEach((element, index) => {
                if (index === 0) return; // Skip first element

                const prevElement = elements[index - 1];
                currentPosition = prevElement.offsetLeft + prevElement.offsetWidth + spacing;
                element.style.left = currentPosition + 'px';
            });
        } else {
            elements.sort((a, b) => a.offsetTop - b.offsetTop);

            // Get total available space
            const firstElement = elements[0];
            const lastElement = elements[elements.length - 1];
            const totalSpace = (lastElement.offsetTop + lastElement.offsetHeight) - firstElement.offsetTop;
            const totalElementsHeight = elements.reduce((sum, el) => sum + el.offsetHeight, 0);
            const availableSpace = totalSpace - totalElementsHeight;
            const spacing = availableSpace / (elements.length - 1);

            // Position elements
            let currentPosition = firstElement.offsetTop;
            elements.forEach((element, index) => {
                if (index === 0) return; // Skip first element

                const prevElement = elements[index - 1];
                currentPosition = prevElement.offsetTop + prevElement.offsetHeight + spacing;
                element.style.top = currentPosition + 'px';
            });
        }

        // Save to history
        saveToHistory();

        showNotification(`Elements distributed ${direction === 'horizontal' ? 'horizontally' : 'vertically'}`, 'success');
    }

    // Function to bring element forward one layer
    function bringForward(element) {
        const parent = element.parentNode;
        const nextElement = element.nextElementSibling;

        if (nextElement) {
            parent.insertBefore(nextElement, element);
            saveToHistory();
            showNotification('Element brought forward', 'success');
        } else {
            showNotification('Element is already at the front', 'info');
        }
    }

    // Function to send element backward one layer
    function sendBackward(element) {
        const parent = element.parentNode;
        const prevElement = element.previousElementSibling;

        if (prevElement) {
            parent.insertBefore(element, prevElement);
            saveToHistory();
            showNotification('Element sent backward', 'success');
        } else {
            showNotification('Element is already at the back', 'info');
        }
    }

    // Update auto-save status display
    function updateAutoSaveStatus(message) {
        if (autoSaveStatus) {
            autoSaveStatus.textContent = message;
        }
    }

    // Set up keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Check if ctrl or cmd key is pressed
        const ctrlOrCmd = e.ctrlKey || e.metaKey;

        // Undo: Ctrl+Z
        if (ctrlOrCmd && e.key === 'z' && !e.shiftKey) {
            e.preventDefault();
            undo();
        }

        // Redo: Ctrl+Y or Ctrl+Shift+Z
        if ((ctrlOrCmd && e.key === 'y') || (ctrlOrCmd && e.shiftKey && e.key === 'z')) {
            e.preventDefault();
            redo();
        }

        // Delete: Delete key when an element is selected
        if (e.key === 'Delete') {
            const selectedElement = document.querySelector('.editor-element.selected');
            if (selectedElement) {
                e.preventDefault();
                deleteElement(selectedElement);
            }
        }
    });

    // Drag and drop for main image
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false);
    });

    dropArea.addEventListener('drop', handleDrop, false);

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function highlight() {
        dropArea.classList.add('dragging');
    }

    function unhighlight() {
        dropArea.classList.remove('dragging');
    }

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;

        if (files.length > 0 && isImageFile(files[0])) {
            handleImageUpload(files[0]);
        }
    }

    // Click to upload main image
    dropArea.addEventListener('click', function() {
        imageUpload.click();
    });

    imageUpload.addEventListener('change', function() {
        if (this.files.length > 0) {
            handleImageUpload(this.files[0]);
        }
    });

    // Handle image upload
    function handleImageUpload(file) {
        if (!isImageFile(file)) {
            showNotification('Please upload an image file', 'danger');
            return;
        }

        const reader = new FileReader();

        reader.onload = function(e) {
            currentImage = e.target.result;
            previewImage.src = currentImage;
            previewImage.style.display = 'block';
            noImageMessage.style.display = 'none';

            // Get image dimensions
            const img = new Image();
            img.onload = function() {
                aspectRatio = this.width / this.height;
                resizeWidth.value = this.width;
                resizeHeight.value = this.height;

                // Save to history after image is loaded
                saveToHistory();
            };
            img.src = currentImage;
        };

        reader.readAsDataURL(file);

        // Upload to server
        uploadImage(file);
    }

    // Upload image to server
    function uploadImage(file) {
        showSpinner();

        const formData = new FormData();
        formData.append('file', file);

        fetch('/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                showNotification(data.error, 'danger');
            } else {
                currentImage = data.path;
                showNotification('Image uploaded successfully', 'success');
            }
            hideSpinner();
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('Error uploading image', 'danger');
            hideSpinner();
        });
    }

    // Add text to image
    addTextBtn.addEventListener('click', function() {
        if (!currentImage) {
            showNotification('Please upload an image first', 'warning');
            return;
        }

        if (!textInput.value.trim()) {
            showNotification('Please enter some text', 'warning');
            return;
        }

        const textElement = document.createElement('div');
        textElement.className = 'editor-element text-element';
        textElement.style.position = 'absolute';
        textElement.style.top = '50%';
        textElement.style.left = '50%';
        textElement.style.transform = 'translate(-50%, -50%)';
        textElement.style.fontFamily = fontSelect.value;
        textElement.style.fontSize = `${fontSize.value}px`;
        textElement.style.color = textColor.value;
        textElement.style.fontWeight = textStyles.bold ? 'bold' : 'normal';
        textElement.style.fontStyle = textStyles.italic ? 'italic' : 'normal';
        textElement.style.textDecoration = textStyles.underline ? 'underline' : 'none';
        textElement.style.cursor = 'move';
        textElement.style.userSelect = 'none';
        textElement.style.padding = '5px'; // Add padding for easier selection
        textElement.style.minWidth = '50px'; // Minimum width for easier handling
        textElement.style.minHeight = '20px'; // Minimum height for easier handling
        textElement.textContent = textInput.value;
        textElement.dataset.text = textInput.value;
        textElement.dataset.font = fontSelect.value;
        textElement.dataset.size = fontSize.value;
        textElement.dataset.color = textColor.value;
        textElement.dataset.bold = textStyles.bold;
        textElement.dataset.italic = textStyles.italic;
        textElement.dataset.underline = textStyles.underline;

        textOverlays.appendChild(textElement);

        // Make text draggable
        makeElementDraggable(textElement);

        // Save to history
        saveToHistory();

        showNotification('Text added', 'success');
    });

    // Drag and drop for overlay
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        overlayDropArea.addEventListener(eventName, preventDefaults, false);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        overlayDropArea.addEventListener(eventName, function() {
            overlayDropArea.classList.add('dragging');
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        overlayDropArea.addEventListener(eventName, function() {
            overlayDropArea.classList.remove('dragging');
        }, false);
    });

    overlayDropArea.addEventListener('drop', function(e) {
        const dt = e.dataTransfer;
        const files = dt.files;

        if (files.length > 0 && isImageFile(files[0])) {
            handleOverlayUpload(files[0]);
        }
    }, false);

    // Click to upload overlay
    overlayDropArea.addEventListener('click', function() {
        overlayUpload.click();
    });

    overlayUpload.addEventListener('change', function() {
        if (this.files.length > 0) {
            handleOverlayUpload(this.files[0]);
        }
    });

    // Handle overlay upload
    function handleOverlayUpload(file) {
        if (!isImageFile(file)) {
            showNotification('Please upload an image file', 'danger');
            return;
        }

        const reader = new FileReader();

        reader.onload = function(e) {
            currentOverlay = {
                src: e.target.result,
                file: file
            };

            // Show preview
            overlayDropArea.innerHTML = '<img src="' + e.target.result + '" style="max-width: 100%; max-height: 100px;">';
        };

        reader.readAsDataURL(file);
    }

    // Add overlay to image
    addOverlayBtn.addEventListener('click', function() {
        if (!currentImage) {
            showNotification('Please upload a base image first', 'warning');
            return;
        }

        if (!currentOverlay) {
            showNotification('Please upload an overlay image', 'warning');
            return;
        }

        const overlayElement = document.createElement('div');
        overlayElement.className = 'editor-element overlay-element';
        overlayElement.style.position = 'absolute';
        overlayElement.style.top = '50%';
        overlayElement.style.left = '50%';
        overlayElement.style.transform = 'translate(-50%, -50%)';
        overlayElement.style.width = `${overlaySize.value}%`;
        overlayElement.style.opacity = overlayOpacity.value / 100;
        overlayElement.style.cursor = 'move';
        overlayElement.style.userSelect = 'none';
        overlayElement.style.minWidth = '30px'; // Minimum width for easier handling
        overlayElement.style.minHeight = '30px'; // Minimum height for easier handling

        const img = document.createElement('img');
        img.src = currentOverlay.src;
        img.style.width = '100%';
        img.style.height = 'auto';
        img.style.display = 'block'; // Prevent extra space below image

        overlayElement.appendChild(img);
        imageOverlays.appendChild(overlayElement);

        // Make overlay draggable
        makeElementDraggable(overlayElement);

        // Save to history
        saveToHistory();

        showNotification('Overlay added', 'success');
    });

    // Make elements draggable and transformable
    function makeElementDraggable(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        let isResizing = false;
        let isRotating = false;
        let resizeHandle = null;
        let rotation = 0;
        let scale = { x: 1, y: 1 };
        let flipped = { horizontal: false, vertical: false };
        let mouseDownTime = 0;
        let mouseDownPos = { x: 0, y: 0 };
        let hasMoved = false;

        // Add transform controls
        addTransformControls(element);

        element.onmousedown = dragMouseDown;

        // Add touch events for mobile
        element.addEventListener('touchstart', handleTouchStart, { passive: false });
        element.addEventListener('touchmove', handleTouchMove, { passive: false });
        element.addEventListener('touchend', handleTouchEnd);

        // Double click to show quick tools
        element.addEventListener('dblclick', function(e) {
            e.stopPropagation();
            showQuickTools(element);
        });

        // Right click to show context menu
        element.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            e.stopPropagation();

            const rect = previewContainer.getBoundingClientRect();
            showContextMenu(e.clientX - rect.left, e.clientY - rect.top, element);
        });

        function dragMouseDown(e) {
            if (e.target !== element && !e.target.classList.contains('transform-handle') && e.target.parentNode !== element) {
                return;
            }

            e.preventDefault();

            // Record mouse down time and position for long press detection
            mouseDownTime = Date.now();
            mouseDownPos = { x: e.clientX, y: e.clientY };
            hasMoved = false;

            // Start long press timer
            startLongPress(e, element);

            // Check if we're resizing or rotating
            if (e.target.classList.contains('transform-handle')) {
                if (e.target.classList.contains('rotate')) {
                    isRotating = true;
                } else {
                    isResizing = true;
                    resizeHandle = e.target;
                }
            } else {
                // Regular dragging
                isResizing = false;
                isRotating = false;
            }

            // Get the mouse cursor position at startup
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // Call a function whenever the cursor moves
            document.onmousemove = elementDrag;

            // Add selected class
            document.querySelectorAll('.editor-element').forEach(el => {
                el.classList.remove('selected');
            });
            element.classList.add('selected');

            // Hide quick tools when selecting a new element
            if (quickToolsVisible && currentContextElement !== element) {
                hideQuickTools();
            }
        }

        // Touch event handlers
        function handleTouchStart(e) {
            e.preventDefault(); // Prevent scrolling

            // Record touch start time and position for long press detection
            mouseDownTime = Date.now();
            const touch = e.touches[0];
            mouseDownPos = { x: touch.clientX, y: touch.clientY };
            hasMoved = false;

            // Start long press timer
            startLongPress(touch, element);

            // Get the touch position at startup
            pos3 = touch.clientX;
            pos4 = touch.clientY;

            // Add selected class
            document.querySelectorAll('.editor-element').forEach(el => {
                el.classList.remove('selected');
            });
            element.classList.add('selected');
        }

        function handleTouchMove(e) {
            e.preventDefault(); // Prevent scrolling

            // Cancel long press if moved
            if (!hasMoved) {
                const touch = e.touches[0];
                const dx = touch.clientX - mouseDownPos.x;
                const dy = touch.clientY - mouseDownPos.y;

                // If moved more than 10px, cancel long press
                if (Math.sqrt(dx*dx + dy*dy) > 10) {
                    hasMoved = true;
                    cancelLongPress();
                }
            }

            // Handle element dragging
            const touch = e.touches[0];

            // Calculate the new cursor position
            pos1 = pos3 - touch.clientX;
            pos2 = pos4 - touch.clientY;
            pos3 = touch.clientX;
            pos4 = touch.clientY;

            // Calculate new position
            let newTop = element.offsetTop - pos2;
            let newLeft = element.offsetLeft - pos1;

            // Apply snap to grid if enabled
            if (snapToGridEnabled) {
                newTop = snapToGrid(newTop);
                newLeft = snapToGrid(newLeft);
            }

            // Set the element's new position
            element.style.top = newTop + "px";
            element.style.left = newLeft + "px";
        }

        function handleTouchEnd(e) {
            // Cancel long press
            cancelLongPress();

            // Check if it was a tap without much movement
            if (!hasMoved && Date.now() - mouseDownTime < 300) {
                // Show quick tools on tap
                showQuickTools(element);
            }

            // Save to history if moved
            if (hasMoved) {
                saveToHistory();
            }
        }

        function elementDrag(e) {
            e.preventDefault();

            // Check if moved enough to cancel long press
            if (!hasMoved) {
                const dx = e.clientX - mouseDownPos.x;
                const dy = e.clientY - mouseDownPos.y;

                // If moved more than 5px, cancel long press
                if (Math.sqrt(dx*dx + dy*dy) > 5) {
                    hasMoved = true;
                    cancelLongPress();
                }
            }

            if (isResizing) {
                // Handle resizing
                handleResize(e);
            } else if (isRotating) {
                // Handle rotation
                handleRotation(e);
            } else {
                // Handle dragging
                // Calculate the new cursor position
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;
                // Calculate new position
                let newTop = element.offsetTop - pos2;
                let newLeft = element.offsetLeft - pos1;

                // Apply snap to grid if enabled
                if (snapToGridEnabled) {
                    newTop = snapToGrid(newTop);
                    newLeft = snapToGrid(newLeft);
                }

                // Check for guide snapping
                let showHorizontalSmartGuide = false;
                let showVerticalSmartGuide = false;

                if (showGuidesEnabled) {
                    // Check for snapping to custom guides
                    const snappedTop = checkGuideSnap(newTop, true);
                    const snappedLeft = checkGuideSnap(newLeft, false);

                    if (snappedTop !== newTop) {
                        newTop = snappedTop;
                        showHorizontalSmartGuide = true;
                        showSmartGuide('horizontal', newTop);
                    }

                    if (snappedLeft !== newLeft) {
                        newLeft = snappedLeft;
                        showVerticalSmartGuide = true;
                        showSmartGuide('vertical', newLeft);
                    }
                }

                // Check for smart alignment with other elements
                if (smartGuidesEnabled) {
                    const elementRect = {
                        left: newLeft,
                        top: newTop,
                        right: newLeft + element.offsetWidth,
                        bottom: newTop + element.offsetHeight,
                        centerX: newLeft + element.offsetWidth / 2,
                        centerY: newTop + element.offsetHeight / 2
                    };

                    // Get all other elements
                    const allElements = [...document.querySelectorAll('.editor-element')].filter(el => el !== element);

                    for (const otherElement of allElements) {
                        const otherRect = {
                            left: otherElement.offsetLeft,
                            top: otherElement.offsetTop,
                            right: otherElement.offsetLeft + otherElement.offsetWidth,
                            bottom: otherElement.offsetTop + otherElement.offsetHeight,
                            centerX: otherElement.offsetLeft + otherElement.offsetWidth / 2,
                            centerY: otherElement.offsetTop + otherElement.offsetHeight / 2
                        };

                        // Check for horizontal alignment (top, center, bottom)
                        if (Math.abs(elementRect.top - otherRect.top) <= smartGuideThreshold) {
                            newTop = otherRect.top;
                            showHorizontalSmartGuide = true;
                            showSmartGuide('horizontal', newTop);
                        } else if (Math.abs(elementRect.centerY - otherRect.centerY) <= smartGuideThreshold) {
                            newTop = otherRect.centerY - element.offsetHeight / 2;
                            showHorizontalSmartGuide = true;
                            showSmartGuide('horizontal', otherRect.centerY);
                        } else if (Math.abs(elementRect.bottom - otherRect.bottom) <= smartGuideThreshold) {
                            newTop = otherRect.bottom - element.offsetHeight;
                            showHorizontalSmartGuide = true;
                            showSmartGuide('horizontal', otherRect.bottom);
                        }

                        // Check for vertical alignment (left, center, right)
                        if (Math.abs(elementRect.left - otherRect.left) <= smartGuideThreshold) {
                            newLeft = otherRect.left;
                            showVerticalSmartGuide = true;
                            showSmartGuide('vertical', newLeft);
                        } else if (Math.abs(elementRect.centerX - otherRect.centerX) <= smartGuideThreshold) {
                            newLeft = otherRect.centerX - element.offsetWidth / 2;
                            showVerticalSmartGuide = true;
                            showSmartGuide('vertical', otherRect.centerX);
                        } else if (Math.abs(elementRect.right - otherRect.right) <= smartGuideThreshold) {
                            newLeft = otherRect.right - element.offsetWidth;
                            showVerticalSmartGuide = true;
                            showSmartGuide('vertical', otherRect.right);
                        }
                    }
                }

                // Set the element's new position
                element.style.top = newTop + "px";
                element.style.left = newLeft + "px";

                // Hide smart guides if not showing
                if (!showHorizontalSmartGuide) {
                    horizontalGuide.style.display = 'none';
                }

                if (!showVerticalSmartGuide) {
                    verticalGuide.style.display = 'none';
                }
            }
        }

        function handleResize(e) {
            // Calculate the new cursor position
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;

            const rect = element.getBoundingClientRect();
            let newWidth = rect.width;
            let newHeight = rect.height;

            // Determine which handle is being used and resize accordingly
            if (resizeHandle.classList.contains('top-left')) {
                newWidth = rect.width + pos1;
                newHeight = rect.height + pos2;
                element.style.left = (element.offsetLeft - pos1) + "px";
                element.style.top = (element.offsetTop - pos2) + "px";
            } else if (resizeHandle.classList.contains('top-right')) {
                newWidth = rect.width - pos1;
                newHeight = rect.height + pos2;
                element.style.top = (element.offsetTop - pos2) + "px";
            } else if (resizeHandle.classList.contains('bottom-left')) {
                newWidth = rect.width + pos1;
                newHeight = rect.height - pos2;
                element.style.left = (element.offsetLeft - pos1) + "px";
            } else if (resizeHandle.classList.contains('bottom-right')) {
                newWidth = rect.width - pos1;
                newHeight = rect.height - pos2;
            }

            // Apply the new dimensions
            if (newWidth > 20) {
                element.style.width = newWidth + "px";
                scale.x = newWidth / rect.width;
            }

            if (newHeight > 20) {
                element.style.height = newHeight + "px";
                scale.y = newHeight / rect.height;
            }

            // For text elements, adjust font size proportionally
            if (element.classList.contains('text-element')) {
                const currentSize = parseInt(element.style.fontSize);
                const newSize = Math.max(currentSize * Math.min(scale.x, scale.y), 8); // Minimum font size of 8px
                element.style.fontSize = newSize + "px";
            }
        }

        function handleRotation(e) {
            const rect = element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            // Calculate angle
            const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
            rotation = angle + 90; // Adjust to make it intuitive

            // Apply rotation
            updateElementTransform();
        }

        function updateElementTransform() {
            let transform = `rotate(${rotation}deg)`;

            // Apply flipping if needed
            if (flipped.horizontal || flipped.vertical) {
                let scaleX = flipped.horizontal ? -1 : 1;
                let scaleY = flipped.vertical ? -1 : 1;
                transform = `${transform} scale(${scaleX}, ${scaleY})`;
            }

            element.style.transform = transform;
        }

        function closeDragElement() {
            // Stop moving when mouse button is released
            document.onmouseup = null;
            document.onmousemove = null;
            isResizing = false;
            isRotating = false;
            resizeHandle = null;

            // Cancel long press
            cancelLongPress();

            // Hide smart guides
            hideSmartGuides();

            // Check if it was a click without much movement
            if (!hasMoved && Date.now() - mouseDownTime < 300) {
                // Show quick tools on click
                showQuickTools(element);
            }

            // Save state to history after transformation
            saveToHistory();
        }

        // Add toolbar and transform controls
        function addTransformControls(element) {
            // Add transform handles
            const transformControls = document.createElement('div');
            transformControls.className = 'transform-controls';

            // Add resize handles
            const topLeft = document.createElement('div');
            topLeft.className = 'transform-handle top-left';
            transformControls.appendChild(topLeft);

            const topRight = document.createElement('div');
            topRight.className = 'transform-handle top-right';
            transformControls.appendChild(topRight);

            const bottomLeft = document.createElement('div');
            bottomLeft.className = 'transform-handle bottom-left';
            transformControls.appendChild(bottomLeft);

            const bottomRight = document.createElement('div');
            bottomRight.className = 'transform-handle bottom-right';
            transformControls.appendChild(bottomRight);

            // Add rotation handle
            const rotateHandle = document.createElement('div');
            rotateHandle.className = 'transform-handle rotate';
            rotateHandle.innerHTML = '<i class="fas fa-sync-alt"></i>';
            transformControls.appendChild(rotateHandle);

            // Add toolbar
            const toolbar = document.createElement('div');
            toolbar.className = 'element-toolbar';

            // Duplicate button
            const duplicateBtn = document.createElement('button');
            duplicateBtn.innerHTML = '<i class="fas fa-clone"></i>';
            duplicateBtn.title = 'Duplicate';
            duplicateBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                duplicateElement(element);
            });
            toolbar.appendChild(duplicateBtn);

            // Divider
            const divider1 = document.createElement('div');
            divider1.className = 'divider';
            toolbar.appendChild(divider1);

            // Flip horizontal button
            const flipHBtn = document.createElement('button');
            flipHBtn.innerHTML = '<i class="fas fa-arrows-alt-h"></i>';
            flipHBtn.title = 'Flip Horizontal';
            flipHBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                flipped.horizontal = !flipped.horizontal;
                updateElementTransform();
            });
            toolbar.appendChild(flipHBtn);

            // Flip vertical button
            const flipVBtn = document.createElement('button');
            flipVBtn.innerHTML = '<i class="fas fa-arrows-alt-v"></i>';
            flipVBtn.title = 'Flip Vertical';
            flipVBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                flipped.vertical = !flipped.vertical;
                updateElementTransform();
            });
            toolbar.appendChild(flipVBtn);

            // Divider
            const divider2 = document.createElement('div');
            divider2.className = 'divider';
            toolbar.appendChild(divider2);

            // Bring to front button
            const bringFrontBtn = document.createElement('button');
            bringFrontBtn.innerHTML = '<i class="fas fa-level-up-alt"></i>';
            bringFrontBtn.title = 'Bring to Front';
            bringFrontBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                bringToFront(element);
            });
            toolbar.appendChild(bringFrontBtn);

            // Send to back button
            const sendBackBtn = document.createElement('button');
            sendBackBtn.innerHTML = '<i class="fas fa-level-down-alt"></i>';
            sendBackBtn.title = 'Send to Back';
            sendBackBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                sendToBack(element);
            });
            toolbar.appendChild(sendBackBtn);

            // Divider
            const divider3 = document.createElement('div');
            divider3.className = 'divider';
            toolbar.appendChild(divider3);

            // Delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
            deleteBtn.title = 'Delete';
            deleteBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                deleteElement(element);
            });
            toolbar.appendChild(deleteBtn);

            // Append controls to element
            element.appendChild(transformControls);
            element.appendChild(toolbar);
        }

        // Duplicate element
        function duplicateElement(element) {
            const clone = element.cloneNode(true);
            clone.style.top = (element.offsetTop + 20) + "px";
            clone.style.left = (element.offsetLeft + 20) + "px";

            // Remove the selected class from the clone
            clone.classList.remove('selected');

            // Add the clone to the appropriate container
            if (element.classList.contains('text-element')) {
                textOverlays.appendChild(clone);
            } else if (element.classList.contains('overlay-element')) {
                imageOverlays.appendChild(clone);
            }

            // Make the clone draggable and transformable
            makeElementDraggable(clone);

            // Save to history
            saveToHistory();

            showNotification('Element duplicated', 'success');
        }

        // Delete element
        function deleteElement(element) {
            element.remove();

            // Save to history
            saveToHistory();

            showNotification('Element deleted', 'success');
        }

        // Bring element to front
        function bringToFront(element) {
            const parent = element.parentNode;
            parent.appendChild(element);

            // Save to history
            saveToHistory();

            showNotification('Brought to front', 'success');
        }

        // Send element to back
        function sendToBack(element) {
            const parent = element.parentNode;
            parent.prepend(element);

            // Save to history
            saveToHistory();

            showNotification('Sent to back', 'success');
        }
    }

    // Crop functionality
    cropBtn.addEventListener('click', function() {
        if (!currentImage) {
            showNotification('Please upload an image first', 'warning');
            return;
        }

        if (cropper) {
            cropper.destroy();
            cropper = null;
            cropBtn.textContent = 'Crop';
            return;
        }

        cropper = new Cropper(previewImage, {
            aspectRatio: 1, // Square by default
            viewMode: 1,
            guides: true,
            autoCropArea: 0.8,
            responsive: true
        });

        cropBtn.innerHTML = '<i class="fas fa-check me-1"></i> Apply Crop';
    });

    // Resize controls
    resizeBtn.addEventListener('click', function() {
        if (!currentImage) {
            showNotification('Please upload an image first', 'warning');
            return;
        }

        resizeControls.style.display = resizeControls.style.display === 'none' ? 'block' : 'none';
    });

    // Standard sizes dropdown
    standardSizes.addEventListener('change', function() {
        if (this.value) {
            const [width, height] = this.value.split(',').map(Number);
            resizeWidth.value = width;
            resizeHeight.value = height;

            // Force square is implied with standard sizes
            forceSquare.checked = true;
        }
    });

    // Force square checkbox
    forceSquare.addEventListener('change', function() {
        if (this.checked) {
            // If forcing square, make height match width
            resizeHeight.value = resizeWidth.value;
            aspectRatio = 1;
        } else {
            // If unchecking, restore original aspect ratio if available
            if (currentImage) {
                const img = new Image();
                img.onload = function() {
                    aspectRatio = this.width / this.height;
                };
                img.src = currentImage;
            }
        }
    });

    // Maintain aspect ratio
    resizeWidth.addEventListener('input', function() {
        if (forceSquare.checked) {
            // If force square is checked, height should always equal width
            resizeHeight.value = resizeWidth.value;
        } else if (maintainAspectRatio.checked) {
            resizeHeight.value = Math.round(resizeWidth.value / aspectRatio);
        }
    });

    resizeHeight.addEventListener('input', function() {
        if (forceSquare.checked) {
            // If force square is checked, width should always equal height
            resizeWidth.value = resizeHeight.value;
        } else if (maintainAspectRatio.checked) {
            resizeWidth.value = Math.round(resizeHeight.value * aspectRatio);
        }
    });

    // Apply resize
    applyResizeBtn.addEventListener('click', function() {
        if (!currentImage) {
            showNotification('Please upload an image first', 'warning');
            return;
        }

        const width = parseInt(resizeWidth.value);
        const height = parseInt(resizeHeight.value);

        if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
            showNotification('Please enter valid dimensions', 'warning');
            return;
        }

        // Validate dimensions for music distribution
        if (width < 1400 || height < 1400) {
            if (!confirm('The minimum recommended size for music distribution is 1400x1400 pixels. Your image may be rejected by some platforms. Continue anyway?')) {
                return;
            }
        }

        // Check if dimensions are square when force square is checked
        if (forceSquare.checked && width !== height) {
            showNotification('Width and height must be equal when "Force square format" is checked', 'warning');
            resizeHeight.value = resizeWidth.value;
            return;
        }

        // Show processing message
        showNotification('Resizing image...', 'info');

        // Create a new image to resize
        const img = new Image();
        img.onload = function() {
            // Create a canvas to draw the resized image
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');

            // Draw the image at the new size
            ctx.drawImage(img, 0, 0, width, height);

            // Update the preview image
            const resizedImageData = canvas.toDataURL('image/png');
            previewImage.src = resizedImageData;
            currentImage = resizedImageData;

            // Update aspect ratio
            aspectRatio = width / height;

            // Save to history
            saveToHistory();

            showNotification('Image resized successfully', 'success');

            // If this is a standard size for music distribution, show confirmation
            if ((width === 3000 && height === 3000) || (width === 4000 && height === 4000)) {
                showNotification('Your artwork now meets premium quality standards for music distribution', 'success');
            }
        };
        img.src = currentImage;
    });

    // Background editing
    removeBackgroundBtn.addEventListener('click', function() {
        if (!currentImage) {
            showNotification('Please upload an image first', 'warning');
            return;
        }

        // TODO: Implement background removal with server-side processing
        showNotification('Background removal will be implemented', 'info');
    });

    replaceBackgroundBtn.addEventListener('click', function() {
        if (!currentImage) {
            showNotification('Please upload an image first', 'warning');
            return;
        }

        backgroundColorControls.style.display = backgroundColorControls.style.display === 'none' ? 'block' : 'none';
    });

    applyBackgroundBtn.addEventListener('click', function() {
        if (!currentImage) {
            showNotification('Please upload an image first', 'warning');
            return;
        }

        // TODO: Implement background replacement with server-side processing
        showNotification('Background replacement will be implemented', 'info');
    });

    // Download artwork
    downloadBtn.addEventListener('click', function() {
        if (!currentImage) {
            showNotification('Please upload an image first', 'warning');
            return;
        }

        // Show processing message
        showNotification('Preparing artwork for download...', 'info');

        // Get export options
        const format = exportFormat.value;
        const quality = parseInt(exportQuality.value) / 100;
        const sizeOption = exportSize.value;
        const optimize = optimizeForDistribution.checked;

        // Hide transform controls and toolbars during capture
        const transformControls = document.querySelectorAll('.transform-controls, .element-toolbar, .quick-tools, .context-menu');
        transformControls.forEach(el => {
            el.style.display = 'none';
        });

        // Hide grid and guides during capture
        const gridDisplay = gridOverlay.style.display;
        const rulersDisplay = rulersContainer ? rulersContainer.style.display : 'none';
        const guidesDisplay = customGuides ? customGuides.style.display : 'none';

        gridOverlay.style.display = 'none';
        if (rulersContainer) rulersContainer.style.display = 'none';
        if (customGuides) customGuides.style.display = 'none';
        if (smartGuides) smartGuides.style.display = 'none';

        // Use html2canvas for more accurate rendering
        html2canvas(previewContainer, {
            useCORS: true,
            allowTaint: true,
            backgroundColor: null,
            scale: 2 // Higher scale for better quality
        }).then(capturedCanvas => {
            // Restore UI elements
            transformControls.forEach(el => {
                el.style.display = '';
            });

            gridOverlay.style.display = gridDisplay;
            if (rulersContainer) rulersContainer.style.display = rulersDisplay;
            if (customGuides) customGuides.style.display = guidesDisplay;

            let width, height;

            // Determine export dimensions
            if (sizeOption === 'original') {
                // Get the original image dimensions
                const originalImg = new Image();
                originalImg.src = currentImage;
                width = originalImg.width || capturedCanvas.width;
                height = originalImg.height || capturedCanvas.height;
            } else {
                [width, height] = sizeOption.split(',').map(Number);
            }

            // Validate dimensions for music distribution if optimization is enabled
            if (optimize) {
                // Check if image is square
                if (width !== height) {
                    if (confirm('Music distribution platforms require square artwork. Would you like to make your image square?')) {
                        // Make the image square using the larger dimension
                        const size = Math.max(width, height);
                        width = height = size;
                    }
                }

                // Check minimum size
                if (width < 1400 || height < 1400) {
                    if (confirm('The minimum size for music distribution is 1400x1400 pixels. Would you like to upscale your image?')) {
                        // Upscale to minimum required size
                        width = Math.max(width, 1400);
                        height = Math.max(height, 1400);
                    }
                }
            }

            // Create a canvas for the final image
            const finalCanvas = document.createElement('canvas');
            finalCanvas.width = width;
            finalCanvas.height = height;
            const ctx = finalCanvas.getContext('2d');

            // If we're optimizing for distribution, add a white background to ensure no transparency
            if (optimize && format === 'jpg') {
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, width, height);
            }

            // Draw the captured canvas onto the final canvas
            ctx.drawImage(capturedCanvas, 0, 0, capturedCanvas.width, capturedCanvas.height, 0, 0, width, height);

            // Convert to data URL
            let dataURL;
            if (format === 'jpg') {
                dataURL = finalCanvas.toDataURL('image/jpeg', quality);
            } else {
                dataURL = finalCanvas.toDataURL('image/png');
            }

            // Create a download link
            const link = document.createElement('a');
            link.href = dataURL;
            link.download = `9jaWaveLyrics_Artwork_${width}x${height}.${format}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            showNotification('Artwork downloaded successfully', 'success');

            // Show additional message for optimized artwork
            if (optimize) {
                showNotification('Your artwork has been optimized for music distribution platforms', 'info');
            }
        }).catch(error => {
            console.error('Error capturing canvas:', error);
            showNotification('Error creating artwork. Trying alternative method...', 'warning');

            // Restore UI elements
            transformControls.forEach(el => {
                el.style.display = '';
            });

            gridOverlay.style.display = gridDisplay;
            if (rulersContainer) rulersContainer.style.display = rulersDisplay;
            if (customGuides) customGuides.style.display = guidesDisplay;

            // Fall back to the original method
            useOriginalDownloadMethod();
        });

        // Original download method as fallback
        function useOriginalDownloadMethod() {
            // Create a new image for processing
            const img = new Image();
            img.onload = function() {
                let width, height;

                // Determine export dimensions
                if (sizeOption === 'original') {
                    width = img.width;
                    height = img.height;
                } else {
                    [width, height] = sizeOption.split(',').map(Number);
                }

                // Validate dimensions for music distribution if optimization is enabled
                if (optimize) {
                    // Check if image is square
                    if (width !== height) {
                        if (confirm('Music distribution platforms require square artwork. Would you like to make your image square?')) {
                            // Make the image square using the larger dimension
                            const size = Math.max(width, height);
                            width = height = size;
                        }
                    }

                    // Check minimum size
                    if (width < 1400 || height < 1400) {
                        if (confirm('The minimum size for music distribution is 1400x1400 pixels. Would you like to upscale your image?')) {
                            // Upscale to minimum required size
                            width = Math.max(width, 1400);
                            height = Math.max(height, 1400);
                        }
                    }
                }

                // Create a canvas for the final image
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');

                // If we're optimizing for distribution, add a white background to ensure no transparency
                if (optimize && format === 'jpg') {
                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillRect(0, 0, width, height);
                }

                // Draw the image and all overlays
                ctx.drawImage(img, 0, 0, width, height);

            // Create a function to render an element with its transformations
            function renderElementToCanvas(el, ctx, width, height) {
                const previewRect = previewContainer.getBoundingClientRect();
                const scaleX = width / previewContainer.offsetWidth;
                const scaleY = height / previewContainer.offsetHeight;

                // Get element position and dimensions
                const elLeft = parseFloat(el.style.left) || 0;
                const elTop = parseFloat(el.style.top) || 0;
                const elWidth = el.offsetWidth;
                const elHeight = el.offsetHeight;

                // Calculate scaled position and dimensions
                const x = elLeft * scaleX;
                const y = elTop * scaleY;
                const w = elWidth * scaleX;
                const h = elHeight * scaleY;

                // Save current context state
                ctx.save();

                // Apply transformations
                ctx.translate(x + w/2, y + h/2); // Move to element center

                // Apply rotation if present
                if (el.style.transform) {
                    // Extract rotation value
                    const rotateMatch = el.style.transform.match(/rotate\(([^)]+)\)/);
                    if (rotateMatch) {
                        const rotateDeg = parseFloat(rotateMatch[1]);
                        ctx.rotate(rotateDeg * Math.PI / 180);
                    }

                    // Extract scale values
                    const scaleXMatch = el.style.transform.match(/scaleX\(([^)]+)\)/);
                    const scaleYMatch = el.style.transform.match(/scaleY\(([^)]+)\)/);

                    if (scaleXMatch) {
                        ctx.scale(parseFloat(scaleXMatch[1]), 1);
                    }

                    if (scaleYMatch) {
                        ctx.scale(1, parseFloat(scaleYMatch[1]));
                    }
                }

                // Move back to top-left corner for drawing
                ctx.translate(-w/2, -h/2);

                return { x: 0, y: 0, w, h }; // Return local coordinates for drawing
            }

            // Add text overlays
            const textElements = document.querySelectorAll('#textOverlays .editor-element');
            textElements.forEach(el => {
                // Get text properties
                const text = el.textContent;
                const fontFamily = el.style.fontFamily || 'Arial';
                const fontSize = parseInt(el.style.fontSize || '24') * (width / previewContainer.offsetWidth);
                const color = el.style.color || '#000000';
                const fontWeight = el.style.fontWeight || 'normal';
                const fontStyle = el.style.fontStyle || 'normal';
                const textDecoration = el.style.textDecoration || 'none';

                // Apply transformations and get local coordinates
                const coords = renderElementToCanvas(el, ctx, width, height);

                // Set text properties
                ctx.fillStyle = color;
                ctx.font = `${fontWeight} ${fontStyle} ${fontSize}px ${fontFamily}`;

                // Add underline if needed
                if (textDecoration === 'underline') {
                    ctx.textDecoration = 'underline';
                }

                // Draw the text
                ctx.fillText(text, coords.x, coords.y + fontSize); // Add fontSize to y to account for text baseline

                // Restore context state
                ctx.restore();
            });

            // Add image overlays
            const imageElements = document.querySelectorAll('#imageOverlays .editor-element');
            imageElements.forEach(el => {
                const imgEl = el.querySelector('img');
                if (imgEl) {
                    // Apply transformations and get local coordinates
                    const coords = renderElementToCanvas(el, ctx, width, height);

                    // Set opacity
                    ctx.globalAlpha = parseFloat(el.style.opacity) || 1;

                    // Draw the image
                    ctx.drawImage(imgEl, coords.x, coords.y, coords.w, coords.h);

                    // Reset opacity
                    ctx.globalAlpha = 1;

                    // Restore context state
                    ctx.restore();
                }
            });

            // Convert canvas to data URL
            let dataURL;
            if (format === 'jpg') {
                dataURL = canvas.toDataURL('image/jpeg', quality);
            } else {
                dataURL = canvas.toDataURL('image/png');
            }

            // Create a download link
            const link = document.createElement('a');
            link.href = dataURL;
            link.download = `9jaWaveLyrics_Artwork_${width}x${height}.${format}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            showNotification('Artwork downloaded successfully', 'success');

            // Show additional message for optimized artwork
            if (optimize) {
                showNotification('Your artwork has been optimized for music distribution platforms', 'info');
            }
        };
        img.src = currentImage;
    });
});
