
// get the text input, then give it focus
const text = document.getElementById('name');
console.log(text);
text.focus();

// get and hide the 'other-job-role' field
const otherRoleField = document.getElementById('other-job-role');
otherRoleField.hidden = true;

// listen 
const jobRole = document.getElementById('title');
jobRole.addEventListener('change', (e) => {
    console.log(e.target.value);
    // If the jobRole field is set to 'other', display the 'Other Job Role' field
    if(e.target.value === 'other') {
        otherRoleField.hidden = false;
    } else {
        // if not, set it to hidden
        otherRoleField.hidden = true;
    }
});
console.log(otherRoleField);

// get and disable the 'Color' dropdown. Also get its children
const color = document.getElementById('color');
color.setAttribute('disabled', 'true'); 
colorChildren = color.children;

// get the 'Design' dropdown, and listen for changes. 
const design = document.getElementById('design');
design.addEventListener('change', (e) => {
    // enable the 'color' dropdown
    color.removeAttribute('disabled');
    // var to record whether the firstOption of the displayed colors group has been selected...
    // ... in the dropdown. It is false until we set it to true
    let firstOption = false;
    // loop through the color options - if data-theme attribute matches the value of the design...
    // ...dropdown, then show the color option. Otherwise hide it
    for (i = 0; i < colorChildren.length; i++) {
        if (colorChildren[i].dataset.theme === e.target.value) {
            // display the option
            colorChildren[i].hidden = false;
            // if the firstOption in the group hasn't already been selected, then select it
            if (!firstOption) {
                colorChildren[i].selected = true;
                // record that firstOption has been selected, so no need to do it again
                firstOption = true;
            }
        } else {
            // else, hide it
            colorChildren[i].hidden = true;
        }
    }
    
});

/*** 
* ACTIVITIES
***/

// store the element which displays the total, + create variable to track the total
const displayTotal = document.getElementById('activities-cost');
let total = 0;
// get the activities fieldset, then listen for change
const activities = document.getElementById('activities');
// get the checkbox elements inside the 'activities' box
const checkboxes = activities.querySelectorAll('[type="checkbox"]');
// variable to record the activity time as we loop through activities checked
let activityTime = '';

// function which checks if there are conflicts in the day and time of activities
// we pass in the element checked/unchecked, plus it's activityTIme
function checkConflicts(element, time) {
    // loop through the activities to check their are no time clashes. Start at 1
    for (i = 0; i < checkboxes.length; i++) {
        // if there's a conflict (ie if the checkboxes are not the same, and the ...
        // ... activityTime matches another checkboxes day and time)
        if (element !== checkboxes[i] && time === checkboxes[i].dataset.dayAndTime) {
            // if the element passed in was checked, disable the conflicts
            if(element.checked) {
                // disable the conflicting checkbox & add disabled class to parent
                checkboxes[i].disabled = true;
                checkboxes[i].parentElement.classList.add('disabled');                   
            } else {
                // if it was unchecked, enable the conflicts
                checkboxes[i].disabled = false;
                checkboxes[i].parentElement.classList.remove('disabled');                      
            }
        }     
    }
}

// listen for a change in one of the activities checkboxes
activities.addEventListener('change', (e) => {
    // if the event target was a checkbox
    if (e.target.type === 'checkbox') {
        // get the value of the checkboxes item from data-cost attr, converting it to a number 
        const fieldCost = parseInt(e.target.dataset.cost);
        // store the date/time of the checkbox label using the data attribute
        activityTime = e.target.dataset.dayAndTime;
        // if the checkbox is checked, add to total. If not, subtract from total
        if (e.target.checked === true)  {
            total += fieldCost;
            // DISABLE CONFLICTS
            checkConflicts(e.target, activityTime);

        // if the checkbox was uncheed
        } else {
            // reduce total from cost
            total = total - fieldCost;
            // enable conflicts
            checkConflicts(e.target, activityTime);
        }
        // update the display of the total cost
        displayTotal.textContent = `Total: $${total}`;
    }
});

/***
 * PAYMENT METHODS
 ***/

// get payment method box, + the sections for each of the 3 payment methods
const paymentMethod = document.getElementById('payment');
creditCard = document.getElementById('credit-card');
payPal = document.getElementById('paypal');
bitCoin = document.getElementById('bitcoin');

// select the credit card payment option as default (which is the second child element)
paymentMethod.children[1].selected = true;
// display only the credit card section by default, by hiding the other
payPal.hidden = true;
bitCoin.hidden = true;

// function to check if the id of the payment section matches the value of the changed element
function displayPaymentSection(section, changedElement) {
    // if so display it, if not hide it
    if (section.getAttribute('id') === changedElement) {
        section.hidden = false;
    } else {
        section.hidden = true;
    }
}
// listen for the payment methods box being changed
paymentMethod.addEventListener('change', (e) => {
    // run the function for each of the payment sections, to display or hide them
    displayPaymentSection(creditCard, e.target.value);
    displayPaymentSection(payPal, e.target.value);
    displayPaymentSection(bitCoin, e.target.value);
});

/***
 * FORM VALIDATION
 ***/

// store the regex for testing the email. This will be used in emailTest function
const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i;

/***
 * STORE FIELD ELEMENTS WE WANT TO CHECK, + DEFINE FUNCTIONS TO TEST THEIR VALIDITY
 ***/ 

// save name element to variable, and create function to test validity of it's input 
const nameField = document.getElementById('name');
// function to test whether the nameField is valid
function nameTest() {
    // if the nameField has no input, then test fails & return false; else return true
    if (!nameField.value) {
        return false;
    } else {
        return true;
    }
}

// save email field, and also get the element that displays the email message
const emailField = document.getElementById('email');
const emailMessage = document.getElementById('email-hint');
console.log(emailMessage);
// define function to test email's validity
function emailTest() {
    // if the email field is empty, then ask the user to enter email address, and return false
    if(!emailField.value) {
        emailMessage.textContent = 'Please enter an email address.';
        return false;
    }
    // if it is not empty, then test if the entered text matches the desired format
    else {
        // If email not valid, set the message to the appropriate one, and return false; else true
        if(!emailRegex.test(emailField.value)) {
            emailMessage.textContent = 'Email address must be formatted correctly.';
            return false;
        } else {
            return true;
        }
    }
  
}


// repeat for credit card detail elements, starting with card number
const cardNumber = document.getElementById('cc-num');
// test card number
function cardNumberTest() {
    // if the card number doesn't have 13-16 numbers without spaces/other chars, return false
    if(!/^\d{13,16}$/.test(cardNumber.value)) {
        return false;
    // else true
    } else {
        return true;
    }
}

// save zipCode element, and define function to test it's validity
const zipCode = document.getElementById('zip');
function zipCodeTest() {
    // if the zipCode isn't 5 digits, return false; else true
    if(!/^\d{5}$/.test(zipCode.value)) {
        return false;
    } else {
        return true;
    }
}
// save cvv element to variable, + define functio to test validity of it's input
const cvv = document.getElementById('cvv');
function cvvTest() {
    // if the cvv field doesn't have 3 numbers, return false; else true
    if(!/^\d{3}$/.test(cvv.value)) {
        return false;
    } else {
        return true;
    }
}

// function to add and remove valid/not valid classes + hint, depending if field is valid
function valid(element, valid) {
    // we passed in the parent element for each input field
    // the 'hint' element for each field is the previous Sibling of the lastChild in all cases
    // if element is valid
    if(valid) {
        // replace the 'valid' class with the 'not-valid' class
        element.classList.add('valid');
        element.classList.remove('not-valid');
        console.log('valid', element, element.lastChild); 
        // hide the hint element by adding the 'hint' class, if not already present
        element.lastChild.previousElementSibling.classList.add('hint');
    } else {
        // replace the 'valid' class with the 'not-valid' class on the parentElement 'activities'
        element.classList.add('not-valid');
        element.classList.remove('valid');
        // display the hint element by removing the 'hint' class which hides it
        if(element.lastChild.previousElementSibling.classList.contains('hint')) {
            element.lastChild.previousElementSibling.classList.remove('hint');
        }
    }
}

// function for checking whether the a field is valid. 
// We pass in the field, and the test for that particular field, + the event
function checkField(field, test, e) {
    // for all runs of the valid function, we pass in the parentElement of the input field
    // if the validation test returns false
    console.log(e);
    if (!test()) {
        // if the event was submit, then prevent default
        if (e.type === 'submit') {
            e.preventDefault();
        }
        valid(field.parentElement, false);
    } else {
        // if field is not empty, run valid function to remove hint
        valid(field.parentElement, true);
    }
}

// listen for the input event on the form
document.querySelector('form').addEventListener('input', (e) => {
    console.log('form heard input');
    // if the field was one of the required fields, check whether it was valid
        // if not, display/hide the error/hint 
    // if the name field triggered the event, check name field
    if (e.target === nameField) {
        checkField(nameField, nameTest, e);
    }
    // if email field triggered the event, check email field
    if (e.target === emailField) {
        checkField(emailField, emailTest, e,);
    }
    // repeat for card related fields
    if (e.target === cardNumber) {
        checkField(cardNumber, cardNumberTest, e);
    }
    if (e.target === zipCode) {
        checkField(zipCode, zipCodeTest, e);
    }
    if (e.target === cvv) {
        checkField(cvv, cvvTest, e);
    }
});

// listen for the form's submit event
document.querySelector('form').addEventListener('submit', (e) => {
    // run checkField function on name and email fields
    // Pass in the field to check, the test to run, the event, and event type
    checkField(nameField, nameTest, e);
    checkField(emailField, emailTest, e);
    // variable to record whether a checkbox has been checked
    let checkboxChecked;
    // loop through the checkboxes to check that at least one is checked
    for (i = 0; i < checkboxes.length; i++) {
        // if a checkbox is checked, record this, + break the loop 
        if (checkboxes[i].checked) {
            checkboxChecked = true;
            break;
        }
    }
    // if a checkbox isn't checked, prevent submit, add not-valid class + ...
    // ... show error/hint using valid unction
    if (!checkboxChecked) {
        e.preventDefault();
        valid(activities, false);
    // if one is valid, run vavlid function to hide errors/hint
    } else {
        valid(activities, true);
    }
    // if 'credit card' is the selected payment method, check it's sub-fields
    if(paymentMethod.value === 'credit-card') {
        checkField(cardNumber, cardNumberTest, e);
        checkField(zipCode, zipCodeTest, e);
        checkField(cvv, cvvTest, e);
    }
});

/**
 * ACTIVITIES
 */

// loop through checkboxes to add focus and blur listeners
for (i = 0; i < checkboxes.length; i++) {
    // add listener for focus event. When triggered, add 'focus' class to parent
    checkboxes[i].addEventListener('focus', (e) => {
        e.target.parentElement.classList.add('focus');
    });
    // add listener for blur event. When triggered, remove 'focus' class label currently...
    // ...in possession of it
    checkboxes[i].addEventListener('blur', (e) => {
        document.querySelector('.focus').classList.remove('focus');
    });
}
