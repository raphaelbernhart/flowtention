// First start of Extension
chrome.runtime.onInstalled.addListener(function() {
    // Goto startup page of FlowTention
    // chrome.tabs.create({
    //     active: true,
    //     url: "first-run.html"
    // });

    // Default sites to block and default active state
    chrome.storage.sync.set({blockedSite: "YouTube", active: true, sitesToBlock: [
        "youtube.com",
        "twitter.com",
        "facebook.com",
        "twitch.tv",
        "reddit.com",
        "instagram.com"
    ]});
});

let active = true;

// Check tabs on urls to block
    // Listen on Tab Update Event
chrome.tabs.onUpdated.addListener((_, update, tab) => {
    chrome.storage.sync.get(['active'], storage => {
        active = storage.active;
    });
    // Checks if site blocking is activated
    if(active) {
        // Check if state of tab is already with url
        if(update.url){
            // Get the sites to block
            chrome.storage.sync.get(["sitesToBlock"], data => {
                // Run threw all active sites to block
                data.sitesToBlock.forEach(blockUrl => {
                    // Check if tab url contains site to block url | check if it is not a google search
                    if(update.url.includes(blockUrl) && !update.url.includes("google.com/search")) {
                        // Set the blocked site url to storage
                        chrome.storage.sync.set({blockedSite: {
                            url: update.url,
                            name: blockUrl
                        }})
                        // Go to block site
                        chrome.tabs.update(tab.id, {
                            url: "block.html"
                        })
                    }
                });
            })
        }
    }
})