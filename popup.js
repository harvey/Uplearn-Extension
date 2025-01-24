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

        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "updateSpeed", value: localStorage.getItem('ulExtSpeed') });
        });
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

    sped = localStorage.getItem('ulExtSpeed');

    if (!sped)
    {
        localStorage.setItem('ulExtSpeed', '1.00');
    }

    const sliderValue = document.getElementById('sliderValue');
    slider.value = localStorage.getItem('ulExtSpeed');
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