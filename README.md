# Interactive Form

## Exceeds Expectations

### Number 2 - Real-Time Error Messages

1. (Line 262) Firstly, I created an event listener to listen for the 'input' event on the form. This relied on input events in the fields bubbling up to the form itself, thus preventing the need for separate listeners for each field.
2. (Line 246) Since having a second listener (as well as submit) to run the same checks on the same fields, I created a 'checkField' function for each time a field needed to be checked, thus reducing the need to repeat code.
3. (Lines 160-211) Since the particclar fields had different rules for validity, I created 'test' functions to run the particular tests for each field. These functions were defined immediately after the fields were saved to a variable.
4. Each time a field needed to be tested, the particular field was passed into the 'checkField' function, as well as the particular test function that relates to that field. The test function was then run inside checkField. If the test was false, then we could display the relevant error visuals and message. If true, then the error visuals/message could be removed. This displaying and hiding of the visuals was done separately in the 'valid' function (line 220).
5. Additionally, since there were now two types of event that we were running the tests on (submit and input), we needed to adapt for the fact we only want to run 'preventDefault()' on the submit evevnt type. Therefore the event itself and the event type were also passed into 'checkField', and if the event was 'submit', then preventDefault() could be run on the passed in event.
6. Finally, when the input event was triggered, e.target was used to check which field triggered the event. This ensured that 'checkField' could be called on the correct field, and prevent unnessessary checks on the other fields. 
