// Elite Academy - Form Validation JavaScript

// Form validation utilities
const FormValidator = {
  // Email validation regex
  emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

  // Phone validation regex (Indian format)
  phoneRegex: /^[6-9]\d{9}$/,

  // Name validation regex (only letters and spaces)
  nameRegex: /^[a-zA-Z\s]{2,50}$/,

  // Validate email
  validateEmail(email) {
    return this.emailRegex.test(email);
  },

  // Validate phone
  validatePhone(phone) {
    const cleanPhone = phone.replace(/\D/g, "");
    return this.phoneRegex.test(cleanPhone);
  },

  // Validate name
  validateName(name) {
    return this.nameRegex.test(name.trim());
  },

  // Validate required field
  validateRequired(value) {
    return value.trim().length > 0;
  },

  // Show error message
  showError(input, message) {
    const errorElement = input.parentNode.querySelector(".error-message");
    if (errorElement) {
      errorElement.remove();
    }

    const error = document.createElement("div");
    error.className = "error-message text-danger mt-1";
    error.style.fontSize = "0.875rem";
    error.textContent = message;
    input.parentNode.appendChild(error);
    input.classList.add("is-invalid");
  },

  // Show success
  showSuccess(input) {
    const errorElement = input.parentNode.querySelector(".error-message");
    if (errorElement) {
      errorElement.remove();
    }
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
  },

  // Clear validation
  clearValidation(input) {
    const errorElement = input.parentNode.querySelector(".error-message");
    if (errorElement) {
      errorElement.remove();
    }
    input.classList.remove("is-invalid", "is-valid");
  },
};

// Real-time validation for inputs
function setupRealTimeValidation() {
  document.querySelectorAll("input, select, textarea").forEach((input) => {
    input.addEventListener("blur", function () {
      validateField(this);
    });

    input.addEventListener("input", function () {
      if (this.classList.contains("is-invalid")) {
        validateField(this);
      }
    });
  });
}

// Validate individual field
function validateField(input) {
  const value = input.value.trim();
  const type = input.type;
  const required = input.hasAttribute("required");

  // Clear previous validation
  FormValidator.clearValidation(input);

  // Check required fields
  if (required && !FormValidator.validateRequired(value)) {
    FormValidator.showError(input, "This field is required");
    return false;
  }

  // Skip validation for empty non-required fields
  if (!required && value === "") {
    return true;
  }

  // Validate based on input type
  switch (type) {
    case "email":
      if (!FormValidator.validateEmail(value)) {
        FormValidator.showError(input, "Please enter a valid email address");
        return false;
      }
      break;

    case "tel":
      if (!FormValidator.validatePhone(value)) {
        FormValidator.showError(
          input,
          "Please enter a valid 10-digit phone number"
        );
        return false;
      }
      break;

    case "text":
      if (
        input.name === "firstName" ||
        input.name === "lastName" ||
        input.id.includes("Name") ||
        input.id.includes("name")
      ) {
        if (!FormValidator.validateName(value)) {
          FormValidator.showError(
            input,
            "Please enter a valid name (letters only)"
          );
          return false;
        }
      }
      break;

    case "number":
      const num = parseInt(value);
      if (input.min && num < parseInt(input.min)) {
        FormValidator.showError(input, `Value must be at least ${input.min}`);
        return false;
      }
      if (input.max && num > parseInt(input.max)) {
        FormValidator.showError(input, `Value must not exceed ${input.max}`);
        return false;
      }
      break;
  }

  // Show success
  FormValidator.showSuccess(input);
  return true;
}

// Validate entire form
function validateForm(form) {
  let isValid = true;
  const inputs = form.querySelectorAll("input, select, textarea");

  inputs.forEach((input) => {
    if (!validateField(input)) {
      isValid = false;
    }
  });

  return isValid;
}

// Handle form submissions
function handleFormSubmission(
  formId,
  successMessage = "Form submitted successfully!"
) {
  const form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Validate form
    if (!validateForm(form)) {
      // Scroll to first error
      const firstError = form.querySelector(".is-invalid");
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
        firstError.focus();
      }
      return;
    }

    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Submitting...";
    submitBtn.disabled = true;
    submitBtn.classList.add("loading");

    try {
      // Simulate API call (replace with actual endpoint)
      await simulateAPICall(form);

      // Show success message
      showAlert("success", successMessage);

      // Reset form
      form.reset();
      form.querySelectorAll("input, select, textarea").forEach((input) => {
        FormValidator.clearValidation(input);
      });

      // Close modal if form is in modal
      const modal = form.closest(".modal");
      if (modal) {
        const modalInstance = bootstrap.Modal.getInstance(modal);
        if (modalInstance) {
          modalInstance.hide();
        }
      }
    } catch (error) {
      console.error("Form submission error:", error);
      showAlert("error", "Failed to submit form. Please try again.");
    } finally {
      // Reset button state
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      submitBtn.classList.remove("loading");
    }
  });
}

// Simulate API call (replace with actual implementation)
async function simulateAPICall(form) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate random success/failure for demo
      if (Math.random() > 0.1) {
        // 90% success rate
        resolve({ success: true });
      } else {
        reject(new Error("Simulated API error"));
      }
    }, 2000);
  });
}

// Show alert messages
function showAlert(type, message) {
  // Remove existing alerts
  document.querySelectorAll(".custom-alert").forEach((alert) => alert.remove());

  const alertDiv = document.createElement("div");
  alertDiv.className = `alert alert-${
    type === "success" ? "success" : "danger"
  } custom-alert`;
  alertDiv.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 1060;
        min-width: 300px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        border-radius: 10px;
        border: none;
    `;

  alertDiv.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas fa-${
              type === "success" ? "check-circle" : "exclamation-circle"
            } me-2"></i>
            <span>${message}</span>
            <button type="button" class="btn-close ms-auto" onclick="this.parentElement.parentElement.remove()"></button>
        </div>
    `;

  document.body.appendChild(alertDiv);

  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (alertDiv.parentNode) {
      alertDiv.remove();
    }
  }, 5000);

  // Fade in animation
  setTimeout(() => {
    alertDiv.style.opacity = "1";
    alertDiv.style.transform = "translateX(0)";
  }, 100);

  alertDiv.style.opacity = "0";
  alertDiv.style.transform = "translateX(100%)";
  alertDiv.style.transition = "all 0.3s ease";
}

// Phone number formatting
function formatPhoneNumber(input) {
  let value = input.value.replace(/\D/g, "");

  if (value.length > 10) {
    value = value.slice(0, 10);
  }

  if (value.length >= 6) {
    value = value.replace(/(\d{5})(\d{5})/, "$1-$2");
  }

  input.value = value;
}

// Setup phone formatting
function setupPhoneFormatting() {
  document.querySelectorAll('input[type="tel"]').forEach((input) => {
    input.addEventListener("input", function () {
      formatPhoneNumber(this);
    });

    input.addEventListener("keypress", function (e) {
      // Only allow numbers
      if (
        !/\d/.test(e.key) &&
        !["Backspace", "Delete", "Tab", "Enter"].includes(e.key)
      ) {
        e.preventDefault();
      }
    });
  });
}

// Setup form auto-save (for longer forms)
function setupAutoSave(formId) {
  const form = document.getElementById(formId);
  if (!form) return;

  const saveKey = `autosave_${formId}`;

  // Load saved data
  const savedData = localStorage.getItem(saveKey);
  if (savedData) {
    try {
      const data = JSON.parse(savedData);
      Object.keys(data).forEach((key) => {
        const input = form.querySelector(`[name="${key}"], #${key}`);
        if (input && input.type !== "password") {
          input.value = data[key];
        }
      });
    } catch (e) {
      console.error("Error loading auto-saved data:", e);
    }
  }

  // Save data on input
  form.addEventListener(
    "input",
    debounce(function () {
      const formData = new FormData(form);
      const data = {};

      for (let [key, value] of formData.entries()) {
        const input = form.querySelector(`[name="${key}"]`);
        if (input && input.type !== "password") {
          data[key] = value;
        }
      }

      localStorage.setItem(saveKey, JSON.stringify(data));
    }, 1000)
  );

  // Clear saved data on successful submission
  form.addEventListener("submit", function () {
    localStorage.removeItem(saveKey);
  });
}

// Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Character counter for textareas
function setupCharacterCounter() {
  document.querySelectorAll("textarea").forEach((textarea) => {
    const maxLength = textarea.getAttribute("maxlength");
    if (maxLength) {
      const counter = document.createElement("div");
      counter.className = "character-counter text-muted mt-1";
      counter.style.fontSize = "0.875rem";
      counter.style.textAlign = "right";

      const updateCounter = () => {
        const remaining = maxLength - textarea.value.length;
        counter.textContent = `${remaining} characters remaining`;

        if (remaining < 50) {
          counter.classList.add("text-warning");
        } else {
          counter.classList.remove("text-warning");
        }

        if (remaining < 10) {
          counter.classList.add("text-danger");
          counter.classList.remove("text-warning");
        } else {
          counter.classList.remove("text-danger");
        }
      };

      textarea.parentNode.appendChild(counter);
      textarea.addEventListener("input", updateCounter);
      updateCounter(); // Initial count
    }
  });
}

// Initialize all form validation features
document.addEventListener("DOMContentLoaded", function () {
  // Setup real-time validation
  setupRealTimeValidation();

  // Setup phone formatting
  setupPhoneFormatting();

  // Setup character counters
  setupCharacterCounter();

  // Handle all forms
  const forms = [
    {
      id: "applyForm",
      message:
        "Application submitted successfully! Our team will contact you soon.",
    },
    {
      id: "contactForm",
      message:
        "Message sent successfully! We will get back to you within 24 hours.",
    },
    {
      id: "demoForm",
      message:
        "Demo class booked successfully! We will confirm the details with you soon.",
    },
    {
      id: "courseApplicationForm",
      message:
        "Course application submitted successfully! Our counselor will contact you soon.",
    },
  ];

  forms.forEach((form) => {
    handleFormSubmission(form.id, form.message);

    // Setup auto-save for longer forms
    if (form.id === "courseApplicationForm" || form.id === "contactForm") {
      setupAutoSave(form.id);
    }
  });
});

// Custom form validation rules
const CustomValidators = {
  // Validate if student is eligible for course based on class
  validateCourseEligibility(courseSelect, classSelect) {
    const course = courseSelect.value;
    const currentClass = classSelect.value;

    const eligibilityRules = {
      "iit-jee": ["11th", "12th", "12th-pass", "dropper"],
      neet: ["11th", "12th", "12th-pass", "dropper"],
      eamcet: ["11th", "12th", "12th-pass", "dropper"],
      foundation: ["8th", "9th", "10th"],
      olympiad: ["8th", "9th", "10th", "11th", "12th"],
    };

    if (course && currentClass) {
      const eligibleClasses = eligibilityRules[course];
      if (eligibleClasses && !eligibleClasses.includes(currentClass)) {
        return false;
      }
    }

    return true;
  },

  // Validate date is not in the past
  validateFutureDate(dateInput) {
    const selectedDate = new Date(dateInput.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return selectedDate >= today;
  },
};

// Add custom validation to course forms
document.addEventListener("DOMContentLoaded", function () {
  const courseForm = document.getElementById("courseApplicationForm");
  if (courseForm) {
    const courseSelect = courseForm.querySelector("#courseName");
    const classSelect = courseForm.querySelector("#currentClass");

    if (courseSelect && classSelect) {
      [courseSelect, classSelect].forEach((select) => {
        select.addEventListener("change", function () {
          if (
            !CustomValidators.validateCourseEligibility(
              courseSelect,
              classSelect
            )
          ) {
            FormValidator.showError(
              classSelect,
              "Selected class is not eligible for this course"
            );
          } else {
            FormValidator.showSuccess(classSelect);
          }
        });
      });
    }
  }

  // Validate demo date
  const demoForm = document.getElementById("demoForm");
  if (demoForm) {
    const dateInput = demoForm.querySelector("#demoDate");
    if (dateInput) {
      dateInput.addEventListener("change", function () {
        if (!CustomValidators.validateFutureDate(this)) {
          FormValidator.showError(this, "Please select a future date");
        } else {
          FormValidator.showSuccess(this);
        }
      });

      // Set minimum date to today
      const today = new Date().toISOString().split("T")[0];
      dateInput.setAttribute("min", today);
    }
  }
});

// Export for global use
window.FormValidator = FormValidator;
window.CustomValidators = CustomValidators;
