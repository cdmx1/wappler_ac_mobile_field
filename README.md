# Wappler App Connect Mobile Field Module

A custom App Connect module for Wappler specifically designed for mobile phone number fields that provides an international phone number input field with country code selection and validation. This module was created to enhance form handling with specialized mobile phone number inputs across your Wappler applications.

## Features

- **Custom Mobile Field Component**: Specifically designed for handling mobile phone number input
- **International Phone Number Support**: Supports phone numbers from all countries with proper formatting
- **Country Code Selection**: Interactive country flag dropdown with dial codes
- **Real-time Validation**: Validates mobile phone numbers as users type
- **Custom Styling**: Fully customizable with CSS classes and Bootstrap integration
- **Mobile-Optimized Events**: Comprehensive event system for input, country change, and validation
- **Responsive Mobile Design**: Works seamlessly on desktop and mobile devices with optimized mobile experience
- **Accessibility**: Full accessibility support with proper ARIA attributes for better mobile usability

## Installation

1. Copy the module files to your Wappler extensions directory
2. The module will automatically include the required intl-tel-input library from CDN
3. Restart Wappler to load the new module
4. The custom mobile field component will be available in your component palette

## Usage

### Basic Implementation

```html
<dmx-mobile-input id="phoneInput1" 
                  placeholder="Enter your mobile number"
                  initial_country="us">
</dmx-mobile-input>
```

### Advanced Mobile Field Configuration

```html
<dmx-mobile-input id="phoneInput2"
                  placeholder="Enter mobile number"
                  initial_country="gb"
                  preferred_countries="us,gb,ca,au"
                  separate_dial_code="true"
                  national_mode="false"
                  input_class="form-control form-control-lg mobile-custom-input"
                  container_class="mb-3 mobile-field-container"
                  required="true">
</dmx-mobile-input>
```

## Configuration Options

### General Properties
- **id**: Unique identifier for the mobile input field
- **placeholder**: Placeholder text for the mobile number input
- **input_class**: CSS classes for the mobile input element (default: "form-control")
- **custom_class**: Additional custom CSS classes for mobile optimization
- **container_class**: CSS classes for the mobile field container element

### Country Settings
- **initial_country**: Default country to be selected (ISO 3166-1 alpha-2 code, default: "us")
- **preferred_countries**: Comma-separated list of preferred countries (e.g., "us,gb,ca")
- **only_countries**: Restrict to specific countries only
- **exclude_countries**: Exclude specific countries

### Mobile Display Options
- **separate_dial_code**: Display dial code separately from the flag (boolean)
- **show_selected_dial_code**: Show dial code in the mobile input field (boolean)
- **allow_dropdown**: Enable/disable country dropdown (boolean, default: true)
- **national_mode**: Format mobile numbers in national vs international format (boolean, default: true)
- **format_on_display**: Format mobile numbers as user types (boolean, default: true)
- **use_full_screen_popup**: Use full screen popup on mobile devices (boolean, default: true)
- **auto_placeholder**: Mobile placeholder behavior ("aggressive", "polite", "off", default: "polite")

### Input States
- **disabled**: Disable the input field (boolean)
- **readonly**: Make input read-only (boolean)
- **required**: Mark field as required (boolean)

### Advanced Settings
- **utils_script**: URL for intl-tel-input utils script
- **validation_error_map**: JSON object for custom error messages

## Data Schema

The custom mobile field component exposes the following data properties:

- **phone_number**: The formatted mobile phone number in national format
- **country_code**: The selected country's dial code for the mobile number
- **full_number**: The complete international mobile phone number
- **is_valid**: Boolean indicating if the current mobile number is valid according to international standards

## Mobile-Optimized Events

### phone_input
Triggered when the user types in the mobile phone number field.

```html
<dmx-mobile-input id="phoneInput" 
                  dmx-on:phone_input="validateMobileNumber()">
</dmx-mobile-input>
```

### country_change
Triggered when the user changes the selected country for the mobile number.

```html
<dmx-mobile-input id="phoneInput" 
                  dmx-on:country_change="updateMobileCountry()">
</dmx-mobile-input>
```

### phone_blur
Triggered when the mobile input field loses focus.

```html
<dmx-mobile-input id="phoneInput" 
                  dmx-on:phone_blur="finalMobileValidation()">
</dmx-mobile-input>
```

## Mobile Field Methods

### getNumber()
Returns the formatted mobile phone number.

### getSelectedCountryData()
Returns data about the currently selected country for the mobile number.

### isValidNumber()
Returns boolean indicating if the current mobile number is valid according to international standards.

### setCountry(countryCode)
Programmatically set the selected country for the mobile field.

### setNumber(number)
Programmatically set the mobile phone number.

## Mobile Field Data Binding Examples

### Accessing Mobile Number Data
```html
<!-- Display the formatted mobile phone number -->
<p>Mobile: {{phoneInput.phone_number}}</p>

<!-- Display the country code for the mobile number -->
<p>Country Code: +{{phoneInput.country_code}}</p>

<!-- Display the full international mobile number -->
<p>Full Mobile Number: {{phoneInput.full_number}}</p>

<!-- Show mobile number validation status -->
<div dmx-show="phoneInput.is_valid" class="text-success">
  ✓ Valid mobile number
</div>
<div dmx-show="!phoneInput.is_valid" class="text-danger">
  ✗ Invalid mobile number
</div>
```

### Conditional Logic
```html
<!-- Enable submit button only if phone is valid -->
<button type="submit" 
        dmx-bind:disabled="!phoneInput.is_valid"
        class="btn btn-primary">
  Submit
</button>

<!-- Show different content based on country -->
<div dmx-show="phoneInput.country_code == '1'">
  US/Canada specific content
</div>
```

## Styling

The module includes comprehensive CSS for styling and supports:

- Bootstrap integration
- Dark mode support
- Responsive design
- Custom validation styling
- Animation effects

### Custom CSS Classes

```css
/* Custom container styling */
.my-phone-container {
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* Custom input styling */
.my-phone-input {
    font-size: 18px;
    padding: 12px;
    border: 2px solid #007bff;
}

/* Custom validation styling */
.my-phone-input.is-invalid {
    border-color: #dc3545;
    animation: shake 0.5s;
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
}
```

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Dependencies

- **intl-tel-input**: 18.2.1+ (automatically loaded from CDN)
- **Wappler App Connect**: Latest version

## License

MIT License - feel free to use in your projects.

## Support

For issues and feature requests, please create an issue in the repository or contact the author.