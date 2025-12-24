

//  Configuration 
const API_BASE_URL = 'http://localhost:8000';

//  DOM Element References 
const inputText = document.getElementById('input-text');
const minLengthInput = document.getElementById('min-length');
const maxLengthInput = document.getElementById('max-length');
const summarizeBtn = document.getElementById('summarize-btn');
const btnText = document.getElementById('btn-text');
const btnLoader = document.getElementById('btn-loader');
const btnLoadingText = document.getElementById('btn-loading-text');
const outputText = document.getElementById('output-text');
const outputCard = document.getElementById('output-card');
const errorMessage = document.getElementById('error-message');
const errorText = errorMessage.querySelector('.error-text');
const charCount = document.getElementById('char-count');

// Utility Functions 


//  Update character count display in real-time

function updateCharCount() {
    const count = inputText.value.length;
    charCount.textContent = `${count.toLocaleString()} character${count !== 1 ? 's' : ''}`;
    
    // Add visual feedback for long texts
    if (count > 1000) {
        charCount.style.color = 'var(--warning)';
        charCount.style.fontWeight = '500';
    } else {
        charCount.style.color = 'var(--text-secondary)';
        charCount.style.fontWeight = '400';
    }
}

/**
 * Set loading state for the summarize button
 * @param {boolean} loading - Whether the button should be in loading state
 */
function setLoading(loading) {
    if (loading) {
        summarizeBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline-block';
        btnLoadingText.style.display = 'inline';
    } else {
        summarizeBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
        btnLoadingText.style.display = 'none';
    }
}

/**
 * Show error message with smooth animation
 * @param {string} message - Error message to display
 */
function showError(message) {
    errorText.textContent = message;
    errorMessage.style.display = 'flex';
    
    // Clear output and reset styles
    outputText.textContent = '';
    outputText.className = 'output-text output-placeholder';
    outputText.textContent = 'Your summary will appear here...';
    
    // Scroll to error message smoothly
    errorMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Hide error message
 */
function hideError() {
    errorMessage.style.display = 'none';
}

/**
 * Display the generated summary with fade-in animation
 * @param {string} summary - The generated summary text
 */
function displaySummary(summary) {
    // Hide error if visible
    hideError();
    
    // Update output text
    outputText.textContent = summary || 'No summary generated.';
    outputText.className = 'output-text has-content';
    
    // Make output card visible with animation
    outputCard.classList.add('visible');
    
    // Scroll to output smoothly
    setTimeout(() => {
        outputCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
    
    // Add subtle highlight effect
    outputText.style.transform = 'scale(1.02)';
    setTimeout(() => {
        outputText.style.transform = 'scale(1)';
    }, 300);
}

/**
 * Show loading state in output area
 */
function showOutputLoading() {
    outputText.textContent = 'Generating summary...';
    outputText.className = 'output-text output-placeholder';
    outputCard.classList.add('visible');
}

/**
 * Validate input text
 * @returns {boolean} True if input is valid
 */
function validateInput() {
    const text = inputText.value.trim();
    
    if (!text) {
        showError('Please enter some text to summarize.');
        inputText.focus();
        return false;
    }
    
    if (text.length < 10) {
        showError('Input text is too short. Please enter at least 10 characters.');
        inputText.focus();
        return false;
    }
    
    return true;
}

/**
 * Validate length parameters
 * @returns {boolean} True if parameters are valid
 */
function validateParameters() {
    const minLength = parseInt(minLengthInput.value, 10);
    const maxLength = parseInt(maxLengthInput.value, 10);
    
    if (isNaN(minLength) || minLength < 1 || minLength > 200) {
        showError('Minimum length must be between 1 and 200 tokens.');
        minLengthInput.focus();
        return false;
    }
    
    if (isNaN(maxLength) || maxLength < 10 || maxLength > 512) {
        showError('Maximum length must be between 10 and 512 tokens.');
        maxLengthInput.focus();
        return false;
    }
    
    if (minLength >= maxLength) {
        showError('Minimum length must be less than maximum length.');
        minLengthInput.focus();
        return false;
    }
    
    return true;
}

//  Main Summarization Function 

/**
 * Main function to summarize text using the API
 */
async function summarizeText() {
    // Validate inputs
    if (!validateInput() || !validateParameters()) {
        return;
    }
    
    // Hide previous errors
    hideError();
    
    // Get input values
    const text = inputText.value.trim();
    const minLength = parseInt(minLengthInput.value, 10);
    const maxLength = parseInt(maxLengthInput.value, 10);
    
    // Set loading state
    setLoading(true);
    showOutputLoading();
    
    try {
        // Make API request to FastAPI backend
        const response = await fetch(`${API_BASE_URL}/summarize`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: text,
                min_length: minLength,
                max_length: maxLength
            })
        });
        
        // Check if response is ok
        if (!response.ok) {
            // Try to parse error response
            let errorDetail = 'Unknown error occurred';
            try {
                const errorData = await response.json();
                errorDetail = errorData.detail || errorData.message || `HTTP ${response.status}`;
            } catch (e) {
                errorDetail = `HTTP ${response.status}: ${response.statusText}`;
            }
            throw new Error(errorDetail);
        }
        
        // Parse successful response
        const data = await response.json();
        
        // Display the summary with animation
        if (data.summary && data.summary.trim()) {
            displaySummary(data.summary);
        } else {
            showError('The server returned an empty summary. Please try again.');
        }
        
    } catch (error) {
        console.error('Summarization error:', error);
        
        // Handle different error types with user-friendly messages
        let errorMessage = 'An unexpected error occurred.';
        
        if (error.message.includes('Failed to fetch') || 
            error.message.includes('NetworkError') ||
            error.name === 'TypeError') {
            errorMessage = 'Unable to connect to the server. Please make sure the backend is running on ' + API_BASE_URL;
        } else if (error.message.includes('timeout')) {
            errorMessage = 'The request timed out. The text might be too long, or the server is busy. Please try again.';
        } else {
            errorMessage = error.message || 'An unexpected error occurred. Please try again.';
        }
        
        showError(errorMessage);
        
    } finally {
        // Always reset loading state
        setLoading(false);
    }
}

// Health Check Function 

/**
 * Check if the API server is healthy and model is loaded
 */
async function checkHealth() {
    try {
        const response = await fetch(`${API_BASE_URL}/health`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            if (!data.model_loaded) {
                console.warn('Model is not loaded on the server');
                // Optionally show a warning to the user (not blocking)
            }
        }
    } catch (error) {
        console.warn('Health check failed:', error);
        // Don't show error on page load, just log it
        // The error will be shown when user tries to summarize
    }
}

//  Event Listeners 

/**
 * Character count update on input
 */
inputText.addEventListener('input', updateCharCount);

/**
 * Update character count on page load
 */
updateCharCount();

/**
 * Keyboard shortcut: Ctrl+Enter or Cmd+Enter to summarize
 */
inputText.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (!summarizeBtn.disabled) {
            summarizeText();
        }
    }
});

/**
 * Enter key validation for number inputs
 */
[minLengthInput, maxLengthInput].forEach(input => {
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (!summarizeBtn.disabled) {
                summarizeText();
            }
        }
    });
    
    // Visual feedback on input change
    input.addEventListener('input', () => {
        if (validateParameters()) {
            hideError();
        }
    });
});

/**
 * Run health check when page loads
 */
window.addEventListener('load', () => {
    checkHealth();
    
    // Focus on input textarea for better UX
    inputText.focus();
});

/**
 * Handle window visibility change (pause/resume animations if needed)
 */
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is hidden - could pause animations here if needed
    } else {
        // Page is visible again
    }
});

/**
 * Prevent form submission on Enter key in textarea
 */
inputText.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !(e.ctrlKey || e.metaKey)) {
        // Allow normal Enter behavior (new line) unless Ctrl/Cmd is pressed
    }
});

//  Error Handling for Unhandled Errors 

/**
 * Global error handler for unhandled promise rejections
 */
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    // Optionally show error to user
});

/**
 * Global error handler for JavaScript errors
 */
window.addEventListener('error', (event) => {
    console.error('JavaScript error:', event.error);
    // Optionally show error to user
});
