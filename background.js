chrome.browserAction.onClicked.addListener(() => {
    let tabSaverOpen = false;

    chrome.tabs.query({}, tabs => {
        let previousTabId = -1;

        tabs.forEach(tab => {
            if (tab.title === "Tab Saver") {
                previousTabId = tab.id;
            }
        });
        
        chrome.tabs.create({ url: "/home.html" }, closePrevious.bind(null, previousTabId));
    });
});

function closePrevious(previousTabId) {
    chrome.tabs.remove(previousTabId);
}