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

function runScript() {
    let timeoutId;
    console.log('Uplearn Auto Quality: Injecting content.js script')
    chrome.runtime.onMessage.addListener(function(message) {
        if (message.action === "updateSpeed") {
            localStorage.setItem('ulExtSpeed', message.value);
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                var r = document.querySelectorAll('video')[0];
                r.playbackRate = message.value;
            }, 350);
        }
    });

    speed = localStorage.getItem('ulExtSpeed');
    
    sleep(2000).then(() => {
        
        var r = document.querySelectorAll('video')[0];
        if (r) {
            r.playbackRate = speed;
            console.log('=== SPEED CHANGED ===')

            // track the amount of time saved

            let lastPlaybackRate = speed;
            let lastUpdateTime = Date.now();

            const video = document.querySelector("video");

            if (video) {
                // Monitor playback rate changes
                const trackTimeSaved = () => {
                    const currentTime = Date.now();
                    const elapsedTime = (currentTime - lastUpdateTime) / 1000;

                    if (video.playbackRate > 1) {
                        // Calculate saved time during this interval
                        const savedTime = elapsedTime * (video.playbackRate - 1);

                        // Send the saved time to the background script
                        chrome.runtime.sendMessage({ type: "updateSavedTime", savedTime }, (response) => {
                            if (response.status === "success") {
                                console.log(`Saved time sent: ${savedTime.toFixed(2)} seconds`);
                            }
                        });
                    }

                    // Update the last update time
                    lastUpdateTime = currentTime;
                    lastPlaybackRate = video.playbackRate;
                };

                // Track playback rate changes
                video.addEventListener("ratechange", trackTimeSaved);

                // Also track time saved every second while the video is playing
                setInterval(() => {
                    if (!video.paused) {
                        trackTimeSaved();
                    }
                }, 1000);
            }
        }
        else { console.log('Taking too long to find video, assuming no videos on page.')}
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