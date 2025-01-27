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

            // Inside the video detection block where video is defined:
            if (video) {
                let lastCurrentTime = video.currentTime;
                let lastRealTime = Date.now();
                let isTracking = false;

                const trackTimeSaved = () => {
                    const currentRealTime = Date.now();
                    const currentCurrentTime = video.currentTime;

                    // Update last times if paused
                    if (video.paused) {
                        lastCurrentTime = currentCurrentTime;
                        lastRealTime = currentRealTime;
                        return;
                    }

                    // Calculate deltas
                    const realTimeDelta = (currentRealTime - lastRealTime) / 1000; // Seconds
                    const currentTimeDelta = currentCurrentTime - lastCurrentTime;

                    // Calculate saved time only if playing faster than 1x
                    if (video.playbackRate > 1) {
                        const savedTime = currentTimeDelta - realTimeDelta;
                        
                        if (savedTime > 0) {
                            chrome.runtime.sendMessage(
                                { type: "updateSavedTime", savedTime },
                                (response) => {
                                    if (response.status === "success") {
                                        console.log(`Saved time: ${savedTime.toFixed(2)}s`);
                                    }
                                }
                            );
                        }
                    }

                    // Update tracking markers
                    lastCurrentTime = currentCurrentTime;
                    lastRealTime = currentRealTime;
                };

                // Start tracking when video plays
                video.addEventListener("play", () => {
                    if (!isTracking) {
                        // Reset markers on play
                        lastCurrentTime = video.currentTime;
                        lastRealTime = Date.now();
                        isTracking = true;
                    }
                });

                // Handle pause events
                video.addEventListener("pause", () => {
                    isTracking = false;
                    trackTimeSaved(); // Final update when paused
                });

                // Track changes continuously
                setInterval(trackTimeSaved, 1000);
                video.addEventListener("ratechange", trackTimeSaved);
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