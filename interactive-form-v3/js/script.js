console.log('Test ');

// 1. Name Field
// Grabbing the name input and setting focus immediately. 
// I want this to be a frictionless user experience. I can save them a click right off the bat.
const nameInput = document.getElementById('name');
nameInput.focus();

// 2. "Job Role" Section
// Keeping it clean by hiding the "Other" job role field by default
const jobRole = document.getElementById('title');
const otherJobRole = document.getElementById('other-job-role');
otherJobRole.style.display = 'none';

// Listening for changes on the dropdown. If they select "other", it will reveal the text field.
// Otherwise, it stays tucked away so we don't clutter the form.
jobRole.addEventListener('change', (e) => {
    if (e.target.value === 'other') {
        otherJobRole.style.display = 'block';
    } else {
        otherJobRole.style.display = 'none';
    }
});

// 3. "T-shirt" Section
// The color menu should'nt be active until a theme is selected.
const designMenu = document.getElementById('design');
const colorMenu = document.getElementById('color');
const colorOptions = colorMenu.children;
colorMenu.disabled = true;

designMenu.addEventListener('change', (e) => {
   colorMenu.disabled = false;

// Looping through the available color options to see what matches the selected theme.
for (let i = 0; i < colorOptions.length; i++) {
    const targetValue = e.target.value;
    const optionTheme = colorOptions[i].getAttribute('data-theme');

// If the data-theme matches the selected design, we unhhide it and set as the active choice.
if (targetValue === optionTheme) {
        colorOptions[i].hidden = false;
        colorOptions[i].setAttribute('selected', 'true');
    } else {
        colorOptions[i].hidden = true;
        colorOptions[i].removeAttribute('selected');
    }   
    }
});

// 4. "Register for Activities" Section
const activitiesFieldset = document.getElementById('activities');
const activitiesCost = document.getElementById('activities-cost');
let totalCost = 0;

activitiesFieldset.addEventListener('change', (e) => {
    // Using the unary operator to convert the string value to a number
    const clickedCost = +e.target.getAttribute('data-cost');

    // Adjust the total based on whether they are checking or unchecking the box
    if (e.target.checked) {
        totalCost += clickedCost;
    } else {
        totalCost -= clickedCost;
    }
// Updating the DOM so the user can see the total
    activitiesCost.innerHTML = `Total: $${totalCost}`;
});

// 5. "Payment Info" Section
// Setting up the payment infrastructure. CC is primary so we can hide Paypal and Bitcoin.
const paymentMenu = document.getElementById('payment');
const creditCard = document.getElementById('credit-card');
const paypal = document.getElementById('paypal');
const bitcoin = document.getElementById('bitcoin');

paypal.style.display = 'none';
bitcoin.style.display = 'none';
paymentMenu.children[1].setAttribute('selected', 'true');

// Routing the user to the correct payment method based on their selection
paymentMenu.addEventListener('change', (e) => {
    if (e.target.value === 'paypal') {
        creditCard.style.display = 'none';
        paypal.style.display = 'block';
        bitcoin.style.display = 'none';
    } else if (e.target.value === 'bitcoin') {
        creditCard.style.display = 'none';
        paypal.style.display = 'none';
        bitcoin.style.display = 'block';
    } else {
        creditCard.style.display = 'block';
        paypal.style.display = 'none';
        bitcoin.style.display = 'none';
    }
});

// 6. "Form Validation" Section
const form = document.querySelector('form');
const emailInput = document.getElementById('email');
const ccNum = document.getElementById('cc-num');
const zipCode = document.getElementById('zip');
const cvv = document.getElementById('cvv');

// Using Regex to ensure the the input matches the expected format
function isValidName(name) {
    return /^[a-zA-Z\s]+$/.test(name) && name.trim() !== '';
}
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidCCNum(ccNum) {
    return /^\d{13,16}$/.test(ccNum);
}

function isValidZipCode(zipCode) {
    return /^\d{5}(-\d{4})?$/.test(zipCode);
}

function isValidCVV(cvv) {
    return /^\d{3,4}$/.test(cvv);
}

// Centralizing the valid/invalid state toggling into a single helper function (this keeps it DRY)
function validateField(element, isValid) {
    if (!isValid) {
        element.parentElement.classList.add('not-valid');
        element.parentElement.classList.remove('valid');
        element.parentElement.lastElementChild.style.display = 'block';
    } else {
        element.parentElement.classList.add('valid');
        element.parentElement.classList.remove('not-valid');
        element.parentElement.lastElementChild.style.display = 'none';
    }
}

// The submit listener acts as gatekeeper so that no bad data gets through.
form.addEventListener('submit', (e) => {
    const isNameValid = isValidName(nameInput.value);
    const isEmailValid = isValidEmail(emailInput.value);

    // Making sure at least one activity is selected
    const activitiesCheckboxes = document.querySelectorAll('#activities input');
    let isActivitiesValid = false;
  for (let i = 0; i < activitiesCheckboxes.length; i++) {
    if (activitiesCheckboxes[i].checked) {
      isActivitiesValid = true;
      break;
        }
    }

    validateField(nameInput, isNameValid);
    validateField(emailInput, isEmailValid);
 
    const activitiesBox = document.getElementById('activities-box');
    const activitiesHint = document.getElementById('activities-hint');
   if (!isActivitiesValid) {
    activitiesBox.classList.add('not-valid');
    activitiesBox.classList.remove('valid');
    activitiesHint.style.display = 'block'; 
  } else {
    activitiesBox.classList.add('valid');
    activitiesBox.classList.remove('not-valid');
    activitiesHint.style.display = 'none';
    }

    // We only want to enforce cc validation if they actually chose to pay that way.
    let isCcValid = true;
    let isZipValid = true;
    let isCvvValid = true;

    if (paymentMenu.value === 'credit-card') {
        isCcValid = isValidCCNum(ccNum.value);
        isZipValid = isValidZipCode(zipCode.value);
        isCvvValid = isValidCVV(cvv.value);

        validateField(ccNum, isCcValid);
        validateField(zipCode, isZipValid);
        validateField(cvv, isCvvValid); 
    }

// If any of our data checks fail, we prevent form submission
    if (!isNameValid || !isEmailValid || !isActivitiesValid || !isCcValid || !isZipValid || !isCvvValid) {
    e.preventDefault(); 
  }
});

// 7. "Accessibility" Section
// Ensuring everyone can navigate the form by adding clear visual focus indicators for keyboard users.
const checkboxes = document.querySelectorAll('#activities input[type="checkbox"]');
for (let i = 0; i < checkboxes.length; i++) {
    checkboxes[i].addEventListener('focus', (e) => {
        e.target.parentElement.classList.add('focus');
    });

    checkboxes[i].addEventListener('blur', () => {
        checkboxes[i].parentElement.classList.remove('focus');
    });
}