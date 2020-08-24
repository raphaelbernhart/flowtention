const title = document.getElementById("blockedSite");

chrome.storage.sync.get(['blockedSite'], (result) => {
    title.innerHTML = result.blockedSite.name + " wurde geblockt"
})