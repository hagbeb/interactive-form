
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

// ACTIVITIES

// store the element which displays the total, + create variable to track the total
const displayTotal = document.getElementById('activities-cost');
let total = 0;
// get the activities fieldset, then listen for change
const activities = document.getElementById('activities');
activities.addEventListener('change', (e) => {
    // if the event target was a checkbox
    if (e.target.type === 'checkbox') {
        // get the value of the checkboxes item from data-cost attr, converting it to a number 
        const fieldCost = parseInt(e.target.dataset.cost);
        // if the checkbox is checked, add to total. If not, subtract from total
        if (e.target.checked === true)  {
            total += fieldCost;
        } else {
            total = total - fieldCost;
        }
        // update the display of the total cost
        displayTotal.textContent = `Total: $${total}`;
    }
});

// PAYMENT METHODS
// get payment method box, + the sections for each of the 3 payment methods
const paymentMethod = document.getElementById('payment');

const paymentSections = [
    creditCard = document.getElementById('credit-card'),
    payPal = document.getElementById('paypal'),
    bitCoin = document.getElementById('bitcoin')
]
console.log(paymentSections[0]);
console.log(paymentSections[1]);
console.log(paymentSections[2]);

// select the credit card payment option as default (which is the second child element)
paymentMethod.children[1].selected = true;
// display only the credit card section by default, by hiding the other
paymentSections[1].hidden = true;
paymentSections[2].hidden = true;
// listen for the payment methods box being changed
paymentMethod.addEventListener('change', (e) => {
    console.log(e.target.value);
    // loop through the paymentSections array, if it's id attribute matches...
    // ... the target value, then display the section, hide the others
    for (i = 0; i < paymentSections.length; i++) {
        console.log(paymentSections[i].getAttribute('id'));
        if (paymentSections[i].getAttribute('id') === e.target.value) {
            paymentSections[i].hidden = false;
        } else {
            paymentSections[i].hidden = true;
        }

    }

});