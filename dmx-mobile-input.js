dmx.Component('mobile-input', {
  initialData: {
    id: null,
    phone_number: null,
    country_code: null,
    full_number: null,
    is_valid: false
  },

  attributes: {
    id: { default: null },
    placeholder: { type: String, default: 'Enter phone number' },
    initial_country: { type: String, default: 'us' },
    preferred_countries: { type: String, default: '' },
    only_countries: { type: String, default: '' },
    exclude_countries: { type: String, default: '' },
    separate_dial_code: { type: Boolean, default: false },
    auto_placeholder: { type: String, default: 'polite' },
    national_mode: { type: Boolean, default: true },
    format_on_display: { type: Boolean, default: false }, // Changed to false to prevent auto-formatting
    use_full_screen_popup: { type: Boolean, default: true },
    show_selected_dial_code: { type: Boolean, default: false },
    allow_dropdown: { type: Boolean, default: true },
    custom_class: { type: String, default: '' },
    input_class: { type: String, default: 'form-control' },
    container_class: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    readonly: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
    value: { type: String, default: '' },
    validation_error_map: { type: String, default: '' },
    utilsScript: { type: String, default: 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/18.2.1/js/utils.js' }
  },

  methods: {
    initializeInput: function () {
      dmx.nextTick(function() {
        this.initializeInput();
      }, this);
    },
    
    getNumber: function() {
      if (this.iti) {
        return this.iti.getNumber();
      }
      return '';
    },
    
    getSelectedCountryData: function() {
      if (this.iti) {
        return this.iti.getSelectedCountryData();
      }
      return null;
    },
    
    isValidNumber: function() {
      if (this.iti) {
        return this.iti.isValidNumber();
      }
      return false;
    },
    
    setCountry: function(countryCode) {
      if (this.iti) {
        this.iti.setCountry(countryCode);
      }
    },
    
    setNumber: function(number) {
      if (this.iti) {
        this.iti.setNumber(number);
      }
    },
    
    reset: function() {
      if (this.iti) {
        const input = this.$node.querySelector('input');
        if (input) {
          // Clear the input value
          this.iti.setNumber('');
          
          // Reset validation state
          input.classList.remove('is-invalid');
          input.classList.remove('is-valid');
          input.classList.remove('is-invalid-field');
          input.classList.remove('is-valid-field');
          
          // Reset any custom styling that might have been applied
          input.style.removeProperty('border-color');
          input.style.removeProperty('background-image');
          
          // Reset component data
          dmx.nextTick(() => {
            this.set('phone_number', '');
            this.set('full_number', '');
            this.set('is_valid', false);
            // Keep country_code as is to preserve the selected flag
          });
          
          // Clear validation message if it exists
          // Try both with and without form ID
          let formId = '';
          let parent = input.closest('form');
          if (parent && parent.id) {
            formId = parent.id;
          }
          
          const validatorId = 'dmxValidatorError' + (formId ? formId : '') + this.props.id;
          let validationDiv = document.getElementById(validatorId);
          
          if (!validationDiv) {
            const alternativeId = 'dmxValidatorError' + this.props.id;
            validationDiv = document.getElementById(alternativeId);
          }
          
          if (validationDiv) {
            validationDiv.style.display = 'none';
            validationDiv.textContent = ''; // Also clear the content
          }
          
          // Also hide the specific validation div for suppmobileinput1
          const specificDiv = document.getElementById('dmxValidatorErrorf_add_suppmobileinput1');
          if (specificDiv) {
            specificDiv.style.display = 'none';
            specificDiv.textContent = ''; // Also clear the content
          }
        }
      }
    }
  },

  initializeInput: function () {
    
    const self = this;
    const options = this.props;
    
    
    // Find parent form ID for DMX validation naming convention
    let formId = '';
    const parentForm = this.$node.closest('form');
    if (parentForm && parentForm.id) {
      formId = parentForm.id;
    }
    
    // Create the input HTML - without including validation feedback div initially
    // Check if the parent node has dmx-bind:value attribute
    const hasValueBinding = this.$node.hasAttribute('dmx-bind:value');
    const valueBindingAttr = hasValueBinding ? 
      `dmx-bind:value="${this.$node.getAttribute('dmx-bind:value')}"` : '';
    
    this.$node.innerHTML = `
      <div class="mobile-input-container ${options.container_class}">
        <input 
          type="tel" 
          id="${options.id}" 
          class="${options.input_class} ${options.custom_class}"
          placeholder="${options.placeholder}"
          ${options.disabled ? 'disabled' : ''}
          ${options.readonly ? 'readonly' : ''}
          ${options.required ? 'required' : ''}
          ${valueBindingAttr}
        />
      </div>
    `;

    const input = this.$node.querySelector('input');
    
    // Check if intl-tel-input library is loaded
    if (typeof window.intlTelInput !== 'function') {
      return;
    }
    
    // Initialize with a small delay to ensure everything is loaded
    setTimeout(() => {
      this.setupIntlTelInput(input, options, self);
    }, 100);
  },
  
  setupIntlTelInput: function(input, options, self) {
    // Add data binding listener for dmx-bind:value changes
    if (input.hasAttribute('dmx-bind:value')) {
      const valueBinding = input.getAttribute('dmx-bind:value');
      // Set up a watch for this binding
      this.$watch(valueBinding, (value) => {
        if (this.iti && value !== undefined) {
          this.iti.setNumber(value);
        }
      });
    }
    
    // Find parent form and attach submit event handler to log form submission
    const parentForm = input.closest('form');
    if (parentForm) {
      // Method 1: Standard form submit event
      parentForm.addEventListener('submit', function(e) {
        // Instead of logging, directly update the validation div
        // For all mobile inputs
        const formId = parentForm.id || '';
        const validatorId = 'dmxValidatorError' + (formId ? formId : '') + options.id;
        let validationDiv = document.getElementById(validatorId);
        
        if (!validationDiv) {
          const alternativeId = 'dmxValidatorError' + options.id;
          validationDiv = document.getElementById(alternativeId);
        }
        
        // Check if the input is invalid and has a value
        if (!self.iti.isValidNumber() && input.value) {
          // Add invalid class and remove valid class
          input.classList.remove('is-valid');
          input.classList.remove('is-valid-field');
          input.classList.add('is-invalid');
          input.classList.add('is-invalid-field');
          
          // First check if we have the validation div from above
          if (validationDiv) {
            validationDiv.textContent = "Invalid Number";
            validationDiv.style.display = 'block';
          }
          
          // Special check for specific div - this is the one you specifically want to target
          const specificValidationDiv = document.getElementById('dmxValidatorErrorf_add_suppmobileinput1');
          if (specificValidationDiv) {
            specificValidationDiv.textContent = "Invalid Number";
            specificValidationDiv.style.display = 'block';
          }
        } else if (input.value) {
          // Valid input with value - add valid class
          input.classList.remove('is-invalid');
          input.classList.remove('is-invalid-field');
          input.classList.add('is-valid');
          input.classList.add('is-valid-field');
          
          if (validationDiv) {
            validationDiv.style.display = 'none';
          }
        }
      });
      
      // Method 2: Monitor submit buttons
      const submitButtons = parentForm.querySelectorAll('button[type="submit"], input[type="submit"]');
      submitButtons.forEach(button => {
        button.addEventListener('click', function(e) {
          // When submit button is clicked, update validation div
          if (!self.iti.isValidNumber() && input.value) {
            // Add invalid class and remove valid class
            input.classList.remove('is-valid');
            input.classList.remove('is-valid-field');
            input.classList.add('is-invalid');
            input.classList.add('is-invalid-field');
            
            // Try to find specific div first
            const specificDiv = document.getElementById('dmxValidatorErrorf_add_suppmobileinput1');
            if (specificDiv) {
              specificDiv.textContent = "Invalid Number";
              specificDiv.style.display = 'block';
            }
            
            // Also try general validation div
            const formId = parentForm.id || '';
            const validatorId = 'dmxValidatorError' + (formId ? formId : '') + options.id;
            let validationDiv = document.getElementById(validatorId);
            
            if (!validationDiv) {
              const alternativeId = 'dmxValidatorError' + options.id;
              validationDiv = document.getElementById(alternativeId);
            }
            
            if (validationDiv) {
              validationDiv.textContent = "Invalid Number";
              validationDiv.style.display = 'block';
            }
          } else if (input.value) {
            // Valid input with value - add valid class
            input.classList.remove('is-invalid');
            input.classList.remove('is-invalid-field');
            input.classList.add('is-valid');
            input.classList.add('is-valid-field');
            
            // Hide any validation messages
            const specificDiv = document.getElementById('dmxValidatorErrorf_add_suppmobileinput1');
            if (specificDiv) {
              specificDiv.style.display = 'none';
            }
            
            const formId = parentForm.id || '';
            const validatorId = 'dmxValidatorError' + (formId ? formId : '') + options.id;
            let validationDiv = document.getElementById(validatorId);
            
            if (!validationDiv) {
              const alternativeId = 'dmxValidatorError' + options.id;
              validationDiv = document.getElementById(alternativeId);
            }
            
            if (validationDiv) {
              validationDiv.style.display = 'none';
            }
          }
        });
      });
      
      // Method 3: Use MutationObserver for form changes
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            // When form class changes (might indicate submission or validation)
            if (!self.iti.isValidNumber() && input.value) {
              // Add invalid class and remove valid class
              input.classList.remove('is-valid');
              input.classList.remove('is-valid-field');
              input.classList.add('is-invalid');
              input.classList.add('is-invalid-field');
              
              // Check for specific div with ID "dmxValidatorErrorf_add_suppmobileinput1"
              const specificDiv = document.getElementById('dmxValidatorErrorf_add_suppmobileinput1');
              if (specificDiv) {
                specificDiv.textContent = "Invalid Number";
                specificDiv.style.display = 'block';
              }
              
              // Also check for general validation div
              const formId = parentForm.id || '';
              const validatorId = 'dmxValidatorError' + (formId ? formId : '') + options.id;
              let validationDiv = document.getElementById(validatorId);
              
              if (!validationDiv) {
                const alternativeId = 'dmxValidatorError' + options.id;
                validationDiv = document.getElementById(alternativeId);
              }
              
              if (validationDiv) {
                validationDiv.textContent = "Invalid Number";
                validationDiv.style.display = 'block';
              }
            } else if (input.value) {
              // Valid input with value
              input.classList.remove('is-invalid');
              input.classList.remove('is-invalid-field');
              input.classList.add('is-valid');
              input.classList.add('is-valid-field');
            }
          }
        });
      });
      
      observer.observe(parentForm, { 
        attributes: true,
        attributeFilter: ['class']
      });
    }
    
    // Prepare intl-tel-input options
    const itiOptions = {
      initialCountry: options.initial_country,
      separateDialCode: options.separate_dial_code,
      autoPlaceholder: options.auto_placeholder,
      nationalMode: options.national_mode,
      formatOnDisplay: options.format_on_display,
      useFullscreenPopup: options.use_full_screen_popup,
      showSelectedDialCode: options.show_selected_dial_code,
      allowDropdown: options.allow_dropdown,
      utilsScript: options.utilsScript
    };

    // Add country filtering options if provided
    if (options.preferred_countries) {
      itiOptions.preferredCountries = options.preferred_countries.split(',').map(c => c.trim());
    }
    
    if (options.only_countries) {
      itiOptions.onlyCountries = options.only_countries.split(',').map(c => c.trim());
    }
    
    if (options.exclude_countries) {
      itiOptions.excludeCountries = options.exclude_countries.split(',').map(c => c.trim());
    }

    // Custom validation error messages - using generic message for all error types
    const errorMap = options.validation_error_map ? JSON.parse(options.validation_error_map) : {
      0: "Invalid number",
      1: "Invalid number", 
      2: "Invalid number",
      3: "Invalid number",
      4: "Invalid number"
    };

    // Initialize intl-tel-input
    this.iti = window.intlTelInput(input, itiOptions);
    
    // Set initial value if provided
    if (options.value) {
      this.iti.setNumber(options.value);
    }
    
    // Add specific handler for the target validation div
    if (options.id === 'suppmobileinput1' || input.id === 'suppmobileinput1') {
      
      // Create a function to update the validation message
      const updateValidationMessage = () => {
        const specificDiv = document.getElementById('dmxValidatorErrorf_add_suppmobileinput1');
        if (specificDiv) {
          if (!self.iti.isValidNumber() && input.value) {
            // Add invalid class and remove valid class
            input.classList.remove('is-valid');
            input.classList.remove('is-valid-field');
            input.classList.add('is-invalid');
            input.classList.add('is-invalid-field');
            
            specificDiv.textContent = "Invalid Number";
            specificDiv.style.display = 'block';
          } else if (input.value) {
            // Valid input
            input.classList.remove('is-invalid');
            input.classList.remove('is-invalid-field');
            input.classList.add('is-valid');
            input.classList.add('is-valid-field');
            
            specificDiv.style.display = 'none';
          }
        }
      };
      
      // Call function on initialization
      setTimeout(updateValidationMessage, 500);
      
      // Call function when anything in the DOM changes
      document.addEventListener('DOMSubtreeModified', function() {
        updateValidationMessage();
      });
      
      // Look for any form that might be submitting
      document.addEventListener('submit', function(e) {
        updateValidationMessage();
      });
      
      // Create a global trigger that other code can call
      window.updateMobileValidation = updateValidationMessage;
      
      // Add a dedicated observer for the specific validation div
      setTimeout(() => {
        const specificDiv = document.getElementById('dmxValidatorErrorf_add_suppmobileinput1');
        if (specificDiv) {
          const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
              // If div is visible but has no content, set the message
              if (specificDiv.style.display === 'block' && !specificDiv.textContent.trim()) {
                specificDiv.textContent = "Invalid Number";
              }
            });
          });
          
          observer.observe(specificDiv, {
            attributes: true,
            childList: true,
            characterData: true,
            subtree: true
          });
        }
      }, 500);
    }
    
    // Force flag refresh after initialization
    setTimeout(() => {
      const flagContainer = input.parentElement.querySelector('.iti__flag-container');
      if (flagContainer) {
        const flag = flagContainer.querySelector('.iti__flag');
        if (flag) {
          // Force a style recalculation to ensure flag is displayed
          flag.style.display = 'none';
          flag.offsetHeight; // Trigger reflow
          flag.style.display = 'inline-block';
          
          // Fix specific styles to prevent cutting off
          flag.style.overflow = 'visible';
          flag.style.position = 'static';
          flag.style.margin = '0 5px 0 0';
          
        }
      }
      
      // Add event listener to fix dropdown flags when dropdown opens
      const selectedFlag = input.parentElement.querySelector('.iti__selected-flag');
      if (selectedFlag) {
        selectedFlag.addEventListener('click', () => {
          setTimeout(() => {
            const countryList = document.querySelector('.iti__country-list');
            if (countryList) {
              // Fix dropdown list styles
              countryList.style.maxHeight = '200px';
              countryList.style.overflowY = 'auto';
              countryList.style.overflowX = 'hidden';
              countryList.style.zIndex = '2000';
              countryList.style.minWidth = '240px';

              // Fix all country items
              const countryItems = countryList.querySelectorAll('.iti__country');
              countryItems.forEach(country => {
                country.style.display = 'flex';
                country.style.alignItems = 'center';
                country.style.whiteSpace = 'nowrap';
                country.style.padding = '8px 10px';
              });
              
              // Fix all country names
              const countryNames = countryList.querySelectorAll('.iti__country-name');
              countryNames.forEach(name => {
                name.style.marginLeft = '8px';
              });
              
              // Fix all dial codes
              const dialCodes = countryList.querySelectorAll('.iti__dial-code');
              dialCodes.forEach(code => {
                code.style.marginLeft = '5px';
                code.style.color = '#999';
              });
            }
          }, 100);
        });
      }
    }, 200);
    
    // Event handlers
    input.addEventListener('input', function(e) {
      // Filter out invalid characters - only allow digits (0-9)
      const validPhoneNumberChars = /^[0-9]*$/;
      if (!validPhoneNumberChars.test(input.value)) {
        // Remove invalid characters
        const cursorPos = input.selectionStart;
        const filteredValue = input.value.replace(/[^0-9]/g, '');
        input.value = filteredValue;
        
        // Restore cursor position, adjusted for removed characters
        const posDiff = input.value.length - e.target.value.length;
        input.setSelectionRange(cursorPos + posDiff, cursorPos + posDiff);
      }
      
      // If the input has a dmx-bind:value attribute, update the component's value prop
      if (input.hasAttribute('dmx-bind:value')) {
        // Instead of using the formatted international number, use the raw input value
        // This keeps the number exactly as the user entered it
        const rawNumber = input.value;
        dmx.nextTick(function () {
          self.set('value', rawNumber);
        }, self);
      }
      
      // Limit to maximum of 15 digits (E.164 standard maximum)
      if (input.value.length > 15) {
        const cursorPos = input.selectionStart;
        input.value = input.value.substring(0, 15);
        // If cursor was beyond the new end, move it to the end
        if (cursorPos > 15) {
          input.setSelectionRange(15, 15);
        }
      }
      
      // Since we now only allow digits (0-9), we don't need to fix formatting issues
      // The code for removing/handling dashes, spaces, and parentheses has been removed
      
      const isValid = self.iti.isValidNumber();
      const countryData = self.iti.getSelectedCountryData();
      const nationalNumber = self.iti.getNumber(window.intlTelInputUtils.numberFormat.NATIONAL);
      const internationalNumber = self.iti.getNumber(window.intlTelInputUtils.numberFormat.INTERNATIONAL);
      
      // Update component data
      dmx.nextTick(function () {
        self.set('phone_number', nationalNumber);
        self.set('country_code', countryData.dialCode);
        self.set('full_number', internationalNumber);
        self.set('is_valid', isValid);
      }, self);
      
      // Find DMX validator message div
      let formId = '';
      let parent = input.closest('form');
      if (parent && parent.id) {
        formId = parent.id;
      }
      
      // Look for the DMX validator message div (try both with and without form ID)
      const validatorId = 'dmxValidatorError' + (formId ? formId : '') + options.id;
      let validationDiv = document.getElementById(validatorId);
      
      if (!validationDiv) {
        const alternativeId = 'dmxValidatorError' + options.id;
        validationDiv = document.getElementById(alternativeId);
      }
      
      // Validate the input as the user types
      if (input.value.trim() !== '') { // Only validate if there's input
        if (!isValid) {
          // Show validation error
          const errorCode = self.iti.getValidationError();
          const errorMessage = errorMap[errorCode] || "Invalid number";
          
          // Add the is-invalid class to trigger DMX validation styling
          input.classList.add('is-invalid');
          
          // Create validation div if it doesn't exist
          if (!validationDiv) {
            validationDiv = document.createElement('div');
            validationDiv.id = 'dmxValidatorError' + (formId ? formId : '') + options.id;
            validationDiv.className = 'invalid-feedback';
            input.parentNode.appendChild(validationDiv);
          }
          
          validationDiv.textContent = errorMessage;
          validationDiv.style.display = 'block';
        } else {
          // Clear validation errors and add is-valid class
          input.classList.remove('is-invalid');
          input.classList.add('is-valid');

          if (validationDiv) {
            validationDiv.style.display = 'none';
          }
        }
      } else {
        // For empty input, check if it's required
        if (options.required) {
          input.classList.add('is-invalid');
          
          // Create validation div if it doesn't exist
          if (!validationDiv) {
            validationDiv = document.createElement('div');
            validationDiv.id = 'dmxValidatorError' + (formId ? formId : '') + options.id;
            validationDiv.className = 'invalid-feedback';
            input.parentNode.appendChild(validationDiv);
          }
          
          validationDiv.textContent = "This field is required.";
          validationDiv.style.display = 'block';
        } else {
          // Not required and empty, clear all validation classes
          input.classList.remove('is-invalid');
          input.classList.remove('is-valid');

          if (validationDiv) {
            validationDiv.style.display = 'none';
          }
        }
      }
      
      // Dispatch input event
      setTimeout(() => {
        self.dispatchEvent('phone_input');
      }, 100);
    });

    input.addEventListener('countrychange', function() {
      const countryData = self.iti.getSelectedCountryData();
      
      dmx.nextTick(function () {
        self.set('country_code', countryData.dialCode);
      }, self);
      
      setTimeout(() => {
        self.dispatchEvent('country_change');
      }, 100);
    });

    input.addEventListener('blur', function() {
      const isValid = self.iti.isValidNumber();
      
      // Find any parent form to get potential form ID prefix
      let formId = '';
      let parent = input.closest('form');
      if (parent && parent.id) {
        formId = parent.id;
      }
      
      // Look for the DMX validator message div
      const validatorId = 'dmxValidatorError' + (formId ? formId : '') + options.id;
      let validationDiv = document.getElementById(validatorId);
      
      // If no DMX validator message div exists, try the fallback naming pattern
      if (!validationDiv) {
        const alternativeId = 'dmxValidatorError' + options.id;
        validationDiv = document.getElementById(alternativeId);
      }
      
      // Check if the field is required but empty
      if (options.required && !input.value.trim()) {
        // Add the is-invalid class to trigger DMX validation styling
        input.classList.add('is-invalid');
        
        // Create validation div if it doesn't exist
        if (!validationDiv) {
          validationDiv = document.createElement('div');
          validationDiv.id = 'dmxValidatorError' + (formId ? formId : '') + options.id;
          validationDiv.className = 'invalid-feedback';
          input.parentNode.appendChild(validationDiv);
        }
        
        validationDiv.textContent = "This field is required.";
        validationDiv.style.display = 'block';
      }
      // Check if the value is provided but invalid
      else if (input.value && !isValid) {
        const errorCode = self.iti.getValidationError();
        const errorMessage = errorMap[errorCode] || "Invalid phone number";
        
        // Add the is-invalid class to trigger DMX validation styling
        input.classList.add('is-invalid');
        
        // Create validation div if it doesn't exist
        if (!validationDiv) {
          validationDiv = document.createElement('div');
          validationDiv.id = 'dmxValidatorError' + (formId ? formId : '') + options.id;
          validationDiv.className = 'invalid-feedback';
          input.parentNode.appendChild(validationDiv);
        }
        
        validationDiv.textContent = errorMessage;
        validationDiv.style.display = 'block';
      } else {
        if (input.value.trim()) {
          // Valid input with value - remove invalid class and add valid class
          input.classList.remove('is-invalid');
          input.classList.add('is-valid');
        } else {
          // Empty input that's not required - remove both classes
          input.classList.remove('is-invalid');
          input.classList.remove('is-valid');
        }
        
        if (validationDiv) {
          validationDiv.style.display = 'none';
        }
      }
      
      setTimeout(() => {
        self.dispatchEvent('phone_blur');
      }, 100);
    });
  },

  events: {
    phone_input: Event,
    country_change: Event,
    phone_blur: Event
  },

  render: function(node) {
    const self = this;
    
    if (this.$node) {
      this.$parse();
    }
    
    this.initializeInput();
    
    // Check if component is inside a Bootstrap modal
    const modal = this.$node.closest('.modal');
    if (modal) {      
      // Add event listeners for modal show events to clear validation on open
      modal.addEventListener('show.bs.modal', function() {
        const input = self.$node.querySelector('input');
        if (input) {
          // Clear validation state on modal open
          input.classList.remove('is-invalid');
          input.classList.remove('is-valid');
          input.classList.remove('is-invalid-field');
          input.classList.remove('is-valid-field');
          
          // Hide validation divs
          const specificDiv = document.getElementById('dmxValidatorErrorf_add_suppmobileinput1');
          if (specificDiv) {
            specificDiv.style.display = 'none';
            specificDiv.textContent = '';
          }
          
          // Try both with and without form ID
          let formId = '';
          let parent = input.closest('form');
          if (parent && parent.id) {
            formId = parent.id;
          }
          
          const validatorId = 'dmxValidatorError' + (formId ? formId : '') + self.props.id;
          let validationDiv = document.getElementById(validatorId);
          
          if (!validationDiv) {
            const alternativeId = 'dmxValidatorError' + self.props.id;
            validationDiv = document.getElementById(alternativeId);
          }
          
          if (validationDiv) {
            validationDiv.style.display = 'none';
            validationDiv.textContent = '';
          }
        }
      });
    }
  },

  update: function (props) {
    if (!dmx.equal(this.props.disabled, props.disabled)) {
      const input = this.$node.querySelector('input');
      if (input) {
        input.disabled = props.disabled;
      }
    }
    
    if (!dmx.equal(this.props.readonly, props.readonly)) {
      const input = this.$node.querySelector('input');
      if (input) {
        input.readOnly = props.readonly;
      }
    }
    
    if (!dmx.equal(this.props.value, props.value)) {
      const input = this.$node.querySelector('input');
      if (input && this.iti) {
        this.iti.setNumber(this.props.value);
      }
    }
  },
});