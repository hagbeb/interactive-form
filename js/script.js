
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
// we pass in the element checked/unchecked, it's activityTIme, + whether it was checked or unchkcd
function checkConflicts(element, time, checked) {
    // loop through the activities to check their are no time clashes. Start at 1
    for (i = 0; i < checkboxes.length; i++) {
        // if there's a conflict (ie if the checkboxes are not the same, and the ...
        // ... activityTime matches another checkboxes day and time)
        if (element !== checkboxes[i] && time === checkboxes[i].dataset.dayAndTime) {
            // if the element passed in was checked, disable the conflicts
            if(checked) {
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
            checkConflicts(e.target, activityTime, true);

        // if the checkbox was uncheed
        } else {
            // reduce total from cost
            total = total - fieldCost;
            // enable conflicts
            checkConflicts(e.target, activityTime, false);
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

// store the regex for testing the email
const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i;
// get and store the credit card detail elements
const cardNumber = document.getElementById('cc-num');
const zipCode = document.getElementById('zip');
const cvv = document.getElementById('cvv');

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
        if(element.lastChild.previousElementSibling.classList.contains('hint')) {
          element.lastChild.previousElementSibling.classList.add('hint');
        }
    } else {
        // replace the 'valid' class with the 'not-valid' class on the parentElement 'activities'
        element.classList.add('not-valid');
        element.classList.remove('valid');
        // display the hint element by removing the 'hint' class which hides it
        element.lastChild.previousElementSibling.classList.remove('hint');
    }
}

// listen for the form's submit event
document.querySelector('form').addEventListener('submit', (e) => {
    console.log(e);
    // if the name field is empty, prevent submit + run 'valid' function with 'false' value
    // for all runs of the valid function, we pass in the parentElement of the input field
    if (!e.target[1].value) {
        e.preventDefault();
        valid(e.target[1].parentElement, false);
    } else {
        // if field is not empty, run valid function to remove hint
        valid(e.target[1].parentElement, true);
    }
    // check the email field is formatted correctly. 
    // If not, prevent default + show error + hint using valid function
    if(!emailRegex.test(e.target[2].value)) {
        e.preventDefault();
        valid(e.target[2].parentElement, false);
    // if it's correct, hide error + hint
    } else {
        valid(e.target[2].parentElement, true);
    }
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
        // if the card number doesn't have 13-16 numbers without spaces/other chars, prevent submt
        // + run valid function to show error/hint
        if(!/^\d{13,16}$/.test(cardNumber.value)) {
            e.preventDefault();
            valid(cardNumber.parentElement, false);
        // if correct, run valid function to hide error/hint
        } else {
            valid(cardNumber.parentElement, true);
        }
        // prevent default if the submit field doesn't have 5 numbers,
        // + run valid function to show error/hint
        if(!/^\d{5}$/.test(zipCode.value)) {
            e.preventDefault();
            valid(zipCode.parentElement, false);
        // if correct, hide error/hint
        } else {
            valid(zipCode.parentElement, true);
        }
        // prevent default if the cvv field doesn't have 3 numbers + run valid function
        if(!/^\d{3}$/.test(cvv.value)) {
            e.preventDefault();
            valid(cvv.parentElement, false);
        // if correct, run valid function to hide error/hint
        } else {
            valid(cvv.parentElement, true);
        }
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
