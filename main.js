window.onload = function() {
    chrome.storage.sync.get(["isOpen"], (result) => {
        if (!result.isOpen)
            chrome.tabs.create({ url: "popup.html" }, setOpenStatus);
    });

    const collapseBtn = document.getElementById("collapse-btn");
    const clearBtn = document.getElementById("clear-btn");
    
    collapseBtn.addEventListener("click", () => {        
        setURLs();
    });

    clearBtn.addEventListener("click", () => {
        chrome.storage.sync.set({ tabs: [] });
        const urlList = document.getElementById("urls");
        urlList.innerHTML = "";
    });

    function setOpenStatus() {
        chrome.storage.sync.set({ isOpen: true });
        setURLs();
    }

    function setURLs() {
        chrome.storage.sync.get(["tabs"], (result) => {
            // Get the URLs of all open tabs.
            chrome.tabs.query({}, tabs => {
                let _tabs = result.tabs;
            
                tabs.forEach(tab => {
                    _tabs.push({
                        title: tab.title,
                        url: tab.url,
                        id: tab.id
                    });
                });

                // Remove duplicates.
                _tabs = [...new Set(_tabs)];
            
                // Save to storage.
                chrome.storage.sync.set({ tabs: _tabs }, buildUrlList);
            });
        });        
    }

    function buildUrlList() {
        chrome.storage.sync.get(["tabs"], (result) => {
            const urlList = document.getElementById("urls");
            urlList.innerHTML = "";

            const saverUrl = "chrome-extension://jgcminoplfldknphjiehhofjjlkenaod/popup.html";
            result.tabs.forEach((tab) => {
                if (tab.url !== saverUrl) {
                    const li = document.createElement("li");
                    li.innerHTML = `<a href="${tab.url}" target="_blank">${tab.title}</a>`;
                    li.addEventListener("click", removeURL);
                    urlList.append(li);
                    chrome.tabs.remove(tab.id);
                }
            });
        });
    }

    function removeURL(event) {
        const url = event.target.href;
        
        chrome.storage.sync.get(["tabs"], (result) => {
            const tabToRemove = result.tabs.filter((tab) => {
                return url === tab.url;
            });

            const tabToRemoveIndex = result.tabs.indexOf(tabToRemove[0]);
            let newTabs = result.tabs.slice();
            newTabs.splice(tabToRemoveIndex, 1);

            chrome.storage.sync.set({ tabs: newTabs }, buildUrlList);
        });
    }

    function closeTabs() {
        const saverUrl = "chrome-extension://jgcminoplfldknphjiehhofjjlkenaod/popup.html";

        chrome.tabs.query({}, tabs => {
            tabs.forEach((tab, index) => {
                if (tab.url !== saverUrl) {
                    chrome.tabs.remove(tab.id);
                }
            });
        });
    }
}

// chrome.storage.sync.get(["urls"], (result) => { alert(result.urls) });