function waitForElementToDisappear(selector, callback) {
    var element = document.querySelector(selector);
    if (!element) {
        // If the element is not found, execute the callback
        callback();
    } else {
        // Otherwise, keep checking after a short delay
        setTimeout(function() {
            waitForElementToDisappear(selector, callback);
        }, 1); // Adjust the delay as needed
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Usage
waitForElementToDisappear('div[data-testid="loading-spinner"]', function() {
    console.log('Loading spinner is gone!');
    // Perform actions after the spinner disappears

});

function getLiElements(){
    const liElements = document.querySelectorAll('li');
    return liElements;
}

function updateMainPageTheme(value) {
    if (value == 'false') {
        background = '#ffffff';
        text = '#000000';
        alt = '#F5F5F5';
    }
    else if (value == 'true') {
        background = '#212121';
        text = '#ffffff';
        alt = '#404040';
    }

    const body = document.body;
    //<div data-testid="loading-spinner" class="sc-ovuCP SBfFq"><div class="sc-jtQUzJ jdGRLd"></div><div class="sc-cEzcPc dTiTYz"></div><div></div></div>

    sleep(100).then(() => {
        const loadingSpinner = document.querySelector('div[data-testid="loading-spinner"]');
        if (loadingSpinner) {
            console.log('spinner')
            waitForElementToDisappear('div[data-testid="loading-spinner"]', function() {
                updateMainPageTheme(localStorage.getItem('ulExtTheme'));
                sleep(1000).then(() => {
                    updateMainPageTheme(localStorage.getItem('ulExtTheme'));

                    lessonsWithStatus = document.querySelectorAll('[data-testid="lesson-with-status"]');

                    for (let i = 0; i < lessonsWithStatus.length; i++){
                        lessonsWithStatus[i].children[0].style = alt;
                        lessonsWithStatus[i].children[1].style = alt;
                    }
                });
            });
        }
    });

    const swyn = document.querySelector('button[variant="primary"]');
    if (swyn) {
        swyn.parentElement.parentElement.parentElement.parentElement.style = "background-color: #212121";
    }
    sleep(1000).then(() => {
        const swyn = document.querySelector('button[variant="primary"]');
        if (swyn) {
            swyn.parentElement.parentElement.parentElement.parentElement.style = "background-color: #212121";
        }
    })

    body.style.backgroundColor = background;

    temp = document.getElementById('react-content')
    if(temp){temp.style = `background-color: ${background}`}
    temp = document.querySelector('header')
    if(temp){temp.style = `background-color: ${background}`}

    liElements = getLiElements();
    for (let i = 5; i < liElements.length; i++) {
        liElements[i].children[0].style=`background-color: ${background}`;
    }

    const elements = [];
    elements.push(document.querySelectorAll('div[role="button"]'));
    elements.push(document.querySelectorAll('div[data-testid="CurrentWeekStats-component"]'));

    for (let i = 0; i < elements.length; i++) {
        for (let j = 0; j < elements[i].length; j++){
            elements[i][j].style = `background-color: ${background}`;
        }
    }

    try{
        temp = document.getElementsByClassName('studentprogress')[0].children[0]
        if(temp){temp.style = `background-color: ${background}`}
    }catch{}

    try{
        temp = document.getElementsByClassName('dailygoal')[0].children[0]
        if(temp){temp.style = `background-color: ${background}`}
    }catch{}

    try{
        buttons = document.getElementsByClassName('buttons')[0].children[0].children;
        for(let i = 0; i < buttons.length; i++){
            buttons[i].style = `background-color: ${background}`;
        }
    }catch{}

    headings = [];
    headings.push(document.getElementsByTagName('h1'));
    headings.push(document.getElementsByTagName('h2'));
    headings.push(document.getElementsByTagName('h3'));
    headings.push(document.getElementsByTagName('h4'));
    headings.push(document.getElementsByTagName('h5'));
    headings.push(document.getElementsByTagName('p'));
    headings.push(document.getElementsByTagName('span'));
    headings.push(document.querySelectorAll('span[variant="tiny"]'));
    
    for (let i = 0; i < headings.length; i++){
        for (let j = 0; j < headings[i].length; j++){
            headings[i][j].style = `color: ${text}`;
        }
    }

    labels = document.getElementsByTagName('label');
    for (let i = 0; i < labels.length; i++){
        labels[i].style = "background-color: #212121";
    }

    try{
        temp = document.querySelectorAll('div[data-testid="a-level-active-toggle-component"]')[0].children[0].children[0];
        if(temp){temp.style=`background-color: ${background}`}
        

    }catch{}

    // const topBar = findElementByBackgroundColor('rgb(54, 169, 63)') ||
    //                findElementByBackgroundColor('rgb(16, 87, 25)');

    body.style.color = text;
    body.style.transition = 'background-color 0.3s, color 0.3s';
    
    // if(topBar){
    //     topBar.style.backgroundColor = "rgb(54, 169, 63)";
    // }

    lessonsWithStatus = document.querySelectorAll('[data-testid="lesson-with-status"]');

    for (let i = 0; i < lessonsWithStatus.length; i++){
        lessonsWithStatus[i].children[0].style = "background-color: #404040";
        lessonsWithStatus[i].children[1].style = "background-color: #404040";
    }

}
    
function findElementByBackgroundColor(color) {
    const allElements = document.querySelectorAll('*');
    
    for (let element of allElements) {
    const bgColor = window.getComputedStyle(element).backgroundColor;

    if (bgColor === color && element.role != "button") {
        //console.log('Found element with matching background color:', element);
        return element;  // Return the matching element
    }
    }

    //console.log('No element found with this background color');
    return null;  // If no element matches
}

function runScript() {
    let timeoutId;
    console.log('Uplearn Auto Quality: Injecting content.js script')
    chrome.runtime.onMessage.addListener(function(message) {
        // Handle messages from the extension's popup
        if (message.action === "updateQuality") {
            // Update the value on the main page
            localStorage.setItem('ulExtQuality', message.value);
        }
        if (message.action === "updateSpeed") {
            // Update the value on the main page
            localStorage.setItem('ulExtSpeed', message.value);

            // Clear the previous timeout
            clearTimeout(timeoutId);

            // Set a new timeout
            timeoutId = setTimeout(() => {
                var r = document.querySelectorAll('video')[0];
                r.playbackRate = message.value;
            }, 350);
        }
        if (message.action === 'updateTheme') {
            localStorage.setItem('ulExtTheme', message.value);
            if(localStorage.getItem('ulExtThemeChanger') == "true"){
                updateMainPageTheme(localStorage.getItem('ulExtTheme'));
            }
        }
        if (message.action === 'updateThemeChanger') {
            alert(message.value);
            localStorage.setItem('ulExtThemeChanger', message.value)
            updateMainPageTheme(localStorage.getItem('ulExtTheme'));
        }
    });
    
    
    quality = localStorage.getItem('ulExtQuality');
    speed = localStorage.getItem('ulExtSpeed');
    theme = localStorage.getItem('ulExtTheme');

    if(localStorage.getItem('ulExtThemeChanger') == "true"){
        updateMainPageTheme(localStorage.getItem('ulExtTheme'));
        sleep(2000).then(() => {
            updateMainPageTheme(localStorage.getItem('ulExtTheme'));
        })
    }    
    
    sleep(2000).then(() => {
        
        var r = document.querySelectorAll('video')[0];
        if (r) {

            r.addEventListener('pause', function() {
                console.log('The video has been paused.');
                //alert('paused');
                sleep(50).then(() => {
                    if(localStorage.getItem('ulExtThemeChanger') == "true"){
                        updateMainPageTheme(localStorage.getItem('ulExtTheme'));
                        try{
                            temp = r.parentElement.parentElement.children[1].children[0].children[1]
                            if(temp){
                                temp.style = "background-color: #212121; color: black";
                            }
                        }catch{}
                    }
                });
            });
            
            r.playbackRate = speed;
            console.log('=== SPEED CHANGED ===')
            
            function waitForElement(selector, callback) {
                var element = document.querySelector(selector);
                if (element) {
                    callback(element);
                } else {
                    setTimeout(function() {
                        waitForElement(selector, callback);
                    }, 1); // Adjust the delay as needed
                }
            }
            
            // First element
            waitForElement('[data-handle="settingsButton_icon_wrapper"]', function(one) {
                one.click();
            
                // Second element
                waitForElement('[data-handle="quality"]', function(two) {
                    two.click();
            
                    // Third element
                    let tempQual = '';
    
                    if (quality == 'Auto') {
                        tempQual = 'Auto'
                    }
                    else {
                        tempQual = `${quality}p`
                    }
    
                    if (quality == 'Highest') {
                        tableBox = document.getElementsByClassName('w-check-menu-body')[1].children
                        tableBox[tableBox.length-1].children[1].click() // Click the highest quality in the quality box.
                    }
                    else {
                        waitForElement(`[value="${tempQual}"]`, function(three) {
                            three.click();
                            console.log('after');
                        });
                    }
                    one.click()
                });
            });
        }
        else
        {
            console.log('Taking too long to find video, assuming no videos on page.')
            if(localStorage.getItem('ulExtThemeChanger') == "true"){
                updateMainPageTheme(localStorage.getItem('ulExtTheme'));
            }
        }
    });
}

window.addEventListener("load", () => {
    runScript();
})

// chatGPT generated jargon

// Monitor for URL changes 
// (bug with code not running properly 
// when it doens't detect a page update)
let lastUrl = location.href;
new MutationObserver(() => {
    const currentUrl = location.href;
    if (currentUrl !== lastUrl) {
        lastUrl = currentUrl;
        if(localStorage.getItem('ulExtThemeChanger') == "true"){
            updateMainPageTheme(localStorage.getItem('ulExtTheme'));
        }
        runScript();
    }
}).observe(document, { subtree: true, childList: true });

// Listen for back/forward navigation
window.addEventListener('popstate', () => {
    runScript();
});

// Override pushState and replaceState to detect URL changes
(function(history) {
    const pushState = history.pushState;
    const replaceState = history.replaceState;

    history.pushState = function(...args) {
        const result = pushState.apply(history, args);
        window.dispatchEvent(new Event('pushstate'));
        return result;
    };

    history.replaceState = function(...args) {
        const result = replaceState.apply(history, args);
        window.dispatchEvent(new Event('replacestate'));
        return result;
    };

    window.addEventListener('pushstate', () => {
        runScript();
    });

    window.addEventListener('replacestate', () => {
        runScript();
    });

})(window.history);

if(localStorage.getItem('ulExtThemeChanger') == "true"){
    updateMainPageTheme(localStorage.getItem('ulExtTheme'));
}