document.addEventListener("DOMContentLoaded", function() {

    const slider = document.getElementById('dynamicSlider');
    const editableSpan = document.getElementById('sliderValue');

    editableSpan.textContent = localStorage.getItem('ulExtSpeed') + "x";
    console.log(editableSpan.textContent)

    editableSpan.addEventListener('click', () => {
        editableSpan.setAttribute('contenteditable', 'true');
        editableSpan.focus();
    })
    editableSpan.addEventListener('blur', () => {
        editableSpan.removeAttribute('contenteditable');

        editableSpan.textContent = removeAllNonNums(editableSpan.textContent) + "x"

            // SEND THE THING
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "updateSpeed", value: localStorage.getItem('ulExtSpeed') });
        });


        // Optionally, save the edited content to localStorage or perform other actions
        // localStorage.setItem('editableContent', editableSpan.textContent);
    });

    editableSpan.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();  // Prevent new line
            editableSpan.blur();     // Trigger blur event to accept the value
        } else if (!isNumericKey(event)) {
            event.preventDefault();  // Prevent non-numeric characters
        }
    });

    function removeAllNonNums(textStr)
    {
        let output = textStr.replace(/[^\d.]/g, '')
        const floatValue = parseFloat(output);
    if (!isNaN(floatValue)) {
        localStorage.setItem('ulExtSpeed', floatValue.toString())
        slider.value = floatValue.toString()
        return floatValue.toString(); // Return as string to preserve decimal places
    }

    // Attempt to parse as integer
    const intValue = parseInt(output);
    if (!isNaN(intValue)) {
        localStorage.setItem('ulExtSpeed', intValue.toString())
        slider.value = intValue.toString()
        return intValue.toString(); // Return as string to remove any leading zeros
    }

        return '1.00'
    }

    function isNumericKey(event) {
        // Allow backspace, delete, arrow keys, and numeric input
        const key = event.key;
        return (key >= '0' && key <= '9') || ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'x', 'X', '.', 'Ctrl', 'a'].includes(key);
    }

    qual = localStorage.getItem('ulExtQuality')
    sped = localStorage.getItem('ulExtSpeed')
    them = localStorage.getItem('ulExtTheme')

    if (!qual)
    {
        localStorage.setItem('ulExtQuality', 'Auto')
    }

    if (!sped)
    {
        localStorage.setItem('ulExtSpeed', '1.00')
    }

    
    var qualityInput = document.getElementById("quality");
    qualityInput.value = localStorage.getItem('ulExtQuality')

    // Add event listener for the input event
    qualityInput.addEventListener("input", function(event) {
        localStorage.setItem('ulExtQuality', qualityInput.value)
        // When the input value is updated, send a message to the content script
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "updateQuality", value: qualityInput.value });
        });
    });

    
    const sliderValue = document.getElementById('sliderValue');
    slider.value = localStorage.getItem('ulExtSpeed')
    sliderValue.innerText = `${slider.value}x`;

    slider.addEventListener('input', function() {
        updateSlider(this);
    });

    slider.addEventListener('mouseup', function() {
        sendSpeed();
    })

    function updateSlider(slider) {
        let value = parseFloat(slider.value);
        
        localStorage.setItem('ulExtSpeed', value)
        // Update the slider value display
        sliderValue.innerText = `${value.toFixed(2)}x`;
    }

    function sendSpeed() {
        let value = parseFloat(slider.value);
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "updateSpeed", value: value });
        });
    }

    
});