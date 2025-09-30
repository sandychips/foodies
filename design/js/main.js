/**
 * Main JavaScript functionality for Foodies website
 * Handles modal interactions, form validation, and user experience enhancements
 */

// DOM elements
const elements = {
    // Modal elements
    signInModal: document.getElementById('signin-modal'),
    signUpModal: document.getElementById('signup-modal'),
    modalBackdrops: document.querySelectorAll('.modal__backdrop'),
    modalCloseButtons: document.querySelectorAll('.modal__close'),
    
    // Buttons
    signInButton: document.querySelector('.auth-buttons .btn--ghost'),
    signUpButton: document.querySelector('.auth-buttons .btn--outlined'),
    switchToSignUpButton: document.querySelector('#signin-modal .link-button'),
    switchToSignInButton: document.querySelector('#signup-modal .link-button'),
    
    // Forms
    signInForm: document.querySelector('#signin-modal .modal__form'),
    signUpForm: document.querySelector('#signup-modal .modal__form'),
    
    // Password toggles
    passwordToggles: document.querySelectorAll('.form-input-toggle'),
    
    // Testimonial navigation
    testimonialDots: document.querySelectorAll('.testimonials__dot'),
    
    // User profile (for authenticated state)
    authButtons: document.querySelector('.auth-buttons'),
    userProfile: document.querySelector('.user-profile'),
    userDropdown: document.querySelector('.user-profile__dropdown'),
    
    // Category cards
    categoryCards: document.querySelectorAll('.category-card'),
    
    // Form inputs
    formInputs: document.querySelectorAll('.form-input')
};

// Application state
const state = {
    isAuthenticated: false,
    currentTestimonial: 0,
    testimonials: [
        {
            text: "Thank you for the wonderful recipe for feta pasta with tomatoes and basil. It turned out to be not only tasty, but also incredibly colorful. This has become a favorite family meal!",
            author: "Larry Pageim"
        },
        {
            text: "The dessert recipes are absolutely amazing! My family loves the chocolate cake recipe. It's now our go-to for special occasions.",
            author: "Sarah Johnson"
        },
        {
            text: "As a beginner cook, these recipes have been a lifesaver. Clear instructions and delicious results every time!",
            author: "Mike Chen"
        }
    ]
};

// Utility functions
const utils = {
    // Add/remove classes with animation support
    addClass: (element, className) => {
        if (element) element.classList.add(className);
    },
    
    removeClass: (element, className) => {
        if (element) element.classList.remove(className);
    },
    
    // Toggle boolean attributes
    toggleAttribute: (element, attribute, value) => {
        if (element) {
            if (value !== undefined) {
                element.setAttribute(attribute, value);
            } else {
                const currentValue = element.getAttribute(attribute) === 'true';
                element.setAttribute(attribute, (!currentValue).toString());
            }
        }
    },
    
    // Create and dispatch custom events
    dispatchEvent: (element, eventName, detail = {}) => {
        if (element) {
            const event = new CustomEvent(eventName, { detail });
            element.dispatchEvent(event);
        }
    },
    
    // Validate email format
    isValidEmail: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
    
    // Validate password strength
    isValidPassword: (password) => {
        return password.length >= 6;
    },
    
    // Show/hide form errors
    showFormError: (input, message) => {
        const errorElement = document.getElementById(input.getAttribute('aria-describedby'));
        if (errorElement) {
            errorElement.textContent = message;
            utils.addClass(input, 'error');
        }
    },
    
    hideFormError: (input) => {
        const errorElement = document.getElementById(input.getAttribute('aria-describedby'));
        if (errorElement) {
            errorElement.textContent = '';
            utils.removeClass(input, 'error');
        }
    }
};

// Modal functionality
const modal = {
    // Open modal
    open: (modalElement) => {
        if (modalElement) {
            utils.toggleAttribute(modalElement, 'aria-hidden', 'false');
            utils.addClass(document.body, 'modal-open');
            
            // Focus first input
            const firstInput = modalElement.querySelector('.form-input');
            if (firstInput) {
                setTimeout(() => firstInput.focus(), 100);
            }
            
            // Trap focus
            modal.trapFocus(modalElement);
            
            utils.dispatchEvent(modalElement, 'modalOpened');
        }
    },
    
    // Close modal
    close: (modalElement) => {
        if (modalElement) {
            utils.toggleAttribute(modalElement, 'aria-hidden', 'true');
            utils.removeClass(document.body, 'modal-open');
            modal.clearFormErrors(modalElement);
            
            utils.dispatchEvent(modalElement, 'modalClosed');
        }
    },
    
    // Close all modals
    closeAll: () => {
        elements.signInModal && modal.close(elements.signInModal);
        elements.signUpModal && modal.close(elements.signUpModal);
    },
    
    // Clear form errors
    clearFormErrors: (modalElement) => {
        const inputs = modalElement.querySelectorAll('.form-input');
        inputs.forEach(input => {
            utils.hideFormError(input);
        });
    },
    
    // Trap focus within modal
    trapFocus: (modalElement) => {
        const focusableElements = modalElement.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        modalElement.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        });
    }
};

// Form validation and handling
const forms = {
    // Validate individual field
    validateField: (input) => {
        const value = input.value.trim();
        const fieldType = input.type;
        const isRequired = input.hasAttribute('required');
        
        utils.hideFormError(input);
        
        if (isRequired && !value) {
            utils.showFormError(input, 'This field is required');
            return false;
        }
        
        if (fieldType === 'email' && value && !utils.isValidEmail(value)) {
            utils.showFormError(input, 'Please enter a valid email address');
            return false;
        }
        
        if (fieldType === 'password' && value && !utils.isValidPassword(value)) {
            utils.showFormError(input, 'Password must be at least 6 characters long');
            return false;
        }
        
        return true;
    },
    
    // Validate entire form
    validateForm: (form) => {
        const inputs = form.querySelectorAll('.form-input[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!forms.validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    },
    
    // Handle form submission
    handleSubmit: async (form, formType) => {
        const isValid = forms.validateForm(form);
        
        if (!isValid) {
            return false;
        }
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        try {
            // Simulate API call
            await forms.simulateApiCall(data, formType);
            
            // Handle success
            forms.handleSuccess(formType, data);
            
        } catch (error) {
            forms.handleError(error.message);
        }
        
        return true;
    },
    
    // Simulate API call
    simulateApiCall: (data, formType) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate occasional network error
                if (Math.random() > 0.9) {
                    reject(new Error('Network error. Please try again.'));
                    return;
                }
                
                // Simulate email already exists for sign up
                if (formType === 'signup' && data.email === 'test@example.com') {
                    reject(new Error('An account with this email already exists.'));
                    return;
                }
                
                resolve({ success: true, user: { name: data.name || 'User', email: data.email } });
            }, 1000);
        });
    },
    
    // Handle successful form submission
    handleSuccess: (formType, data) => {
        modal.closeAll();
        
        if (formType === 'signin' || formType === 'signup') {
            auth.login({ name: data.name || 'Victoria', email: data.email });
        }
        
        // Show success message (you could implement a toast notification here)
        console.log(`${formType} successful:`, data);
    },
    
    // Handle form submission error
    handleError: (message) => {
        // Show error message (you could implement a toast notification here)
        console.error('Form error:', message);
        alert(message); // Replace with proper error UI
    }
};

// Authentication functionality
const auth = {
    // Login user
    login: (userData) => {
        state.isAuthenticated = true;
        
        // Hide auth buttons, show user profile
        if (elements.authButtons) elements.authButtons.style.display = 'none';
        if (elements.userProfile) {
            elements.userProfile.style.display = 'flex';
            elements.userProfile.removeAttribute('hidden');
            
            // Update user name
            const nameElement = elements.userProfile.querySelector('.user-profile__name');
            if (nameElement && userData.name) {
                nameElement.textContent = userData.name;
            }
        }
        
        utils.dispatchEvent(document, 'userLoggedIn', userData);
    },
    
    // Logout user
    logout: () => {
        state.isAuthenticated = false;
        
        // Show auth buttons, hide user profile
        if (elements.authButtons) elements.authButtons.style.display = 'flex';
        if (elements.userProfile) {
            elements.userProfile.style.display = 'none';
            elements.userProfile.setAttribute('hidden', '');
        }
        
        utils.dispatchEvent(document, 'userLoggedOut');
    }
};

// Testimonials carousel
const testimonials = {
    // Update testimonial display
    update: (index) => {
        if (index < 0 || index >= state.testimonials.length) return;
        
        state.currentTestimonial = index;
        
        // Update testimonial content
        const testimonialElement = document.querySelector('.testimonial');
        if (testimonialElement) {
            const textElement = testimonialElement.querySelector('.testimonial__text');
            const authorElement = testimonialElement.querySelector('.testimonial__author');
            
            if (textElement) textElement.textContent = state.testimonials[index].text;
            if (authorElement) authorElement.textContent = state.testimonials[index].author;
        }
        
        // Update navigation dots
        elements.testimonialDots.forEach((dot, i) => {
            if (i === index) {
                utils.addClass(dot, 'testimonials__dot--active');
                utils.toggleAttribute(dot, 'aria-selected', 'true');
            } else {
                utils.removeClass(dot, 'testimonials__dot--active');
                utils.toggleAttribute(dot, 'aria-selected', 'false');
            }
        });
    },
    
    // Auto-rotate testimonials
    startAutoRotate: () => {
        setInterval(() => {
            const nextIndex = (state.currentTestimonial + 1) % state.testimonials.length;
            testimonials.update(nextIndex);
        }, 5000); // Change every 5 seconds
    }
};

// Password visibility toggle
const passwordToggle = {
    // Toggle password visibility
    toggle: (button) => {
        const input = button.parentElement.querySelector('.form-input');
        if (!input) return;
        
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        
        // Update button aria-label
        button.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
        
        // Update icon (you could change the SVG here if needed)
    }
};

// Scroll animations
const scrollAnimations = {
    // Initialize intersection observer for scroll animations
    init: () => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    utils.addClass(entry.target, 'revealed');
                }
            });
        }, observerOptions);
        
        // Observe category cards
        elements.categoryCards.forEach((card, index) => {
            utils.addClass(card, 'reveal-on-scroll');
            card.style.setProperty('--animation-order', index);
            observer.observe(card);
        });
        
        // Observe other sections
        const sections = document.querySelectorAll('.categories, .testimonials');
        sections.forEach(section => {
            utils.addClass(section, 'reveal-on-scroll');
            observer.observe(section);
        });
    }
};

// Event listeners
const events = {
    init: () => {
        // Modal open buttons
        if (elements.signInButton) {
            elements.signInButton.addEventListener('click', () => modal.open(elements.signInModal));
        }
        
        if (elements.signUpButton) {
            elements.signUpButton.addEventListener('click', () => modal.open(elements.signUpModal));
        }
        
        // Modal switching buttons
        if (elements.switchToSignUpButton) {
            elements.switchToSignUpButton.addEventListener('click', () => {
                modal.close(elements.signInModal);
                modal.open(elements.signUpModal);
            });
        }
        
        if (elements.switchToSignInButton) {
            elements.switchToSignInButton.addEventListener('click', () => {
                modal.close(elements.signUpModal);
                modal.open(elements.signInModal);
            });
        }
        
        // Modal close buttons
        elements.modalCloseButtons.forEach(button => {
            button.addEventListener('click', () => {
                const modalElement = button.closest('.modal');
                if (modalElement) modal.close(modalElement);
            });
        });
        
        // Modal backdrop clicks
        elements.modalBackdrops.forEach(backdrop => {
            backdrop.addEventListener('click', (e) => {
                if (e.target === backdrop) {
                    const modalElement = backdrop.closest('.modal');
                    if (modalElement) modal.close(modalElement);
                }
            });
        });
        
        // Form submissions
        if (elements.signInForm) {
            elements.signInForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await forms.handleSubmit(elements.signInForm, 'signin');
            });
        }
        
        if (elements.signUpForm) {
            elements.signUpForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await forms.handleSubmit(elements.signUpForm, 'signup');
            });
        }
        
        // Form input validation
        elements.formInputs.forEach(input => {
            input.addEventListener('blur', () => forms.validateField(input));
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    forms.validateField(input);
                }
            });
        });
        
        // Password toggles
        elements.passwordToggles.forEach(toggle => {
            toggle.addEventListener('click', () => passwordToggle.toggle(toggle));
        });
        
        // Testimonial dots
        elements.testimonialDots.forEach((dot, index) => {
            dot.addEventListener('click', () => testimonials.update(index));
        });
        
        // User dropdown
        if (elements.userDropdown) {
            elements.userDropdown.addEventListener('click', () => {
                const isExpanded = elements.userDropdown.getAttribute('aria-expanded') === 'true';
                utils.toggleAttribute(elements.userDropdown, 'aria-expanded', (!isExpanded).toString());
            });
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            // Close modals with Escape key
            if (e.key === 'Escape') {
                modal.closeAll();
            }
        });
        
        // Category card clicks
        elements.categoryCards.forEach(card => {
            card.addEventListener('click', () => {
                const categoryName = card.querySelector('.category-card__label')?.textContent;
                console.log(`Clicked on category: ${categoryName}`);
                // Add navigation logic here
            });
        });
    }
};

// Initialize application
const app = {
    init: () => {
        // Check if DOM is loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', app.init);
            return;
        }
        
        // Initialize components
        events.init();
        scrollAnimations.init();
        testimonials.startAutoRotate();
        
        // Initialize first testimonial
        testimonials.update(0);
        
        console.log('Foodies website initialized');
    }
};

// Start the application
app.init();

// Export for module systems (optional)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { modal, forms, auth, testimonials, utils };
}