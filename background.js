chrome.browserAction.onClicked.addListener(() => {
    chrome.tabs.create({ url: "/home.html" });
});