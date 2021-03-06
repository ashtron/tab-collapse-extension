window.onload = function() {
    init();

    function init() {
        const saveButton = document.getElementById("save-btn");
        const clearButton = document.getElementById("clear-btn");
        
        saveButton.addEventListener("click", () => {        
            update();
        });
    
        clearButton.addEventListener("click", () => {
            // Reset list of saved URLs.
            chrome.storage.sync.set({ tabs: [] });
    
            // Clear DOM.
            const urlList = document.getElementById("urls");
            urlList.innerHTML = "";
        });

        update();
    }

    function update() {
        chrome.storage.sync.get(["tabs"], (result) => {

            // Concatenate saved tabs with open tabs.
            chrome.tabs.query({}, openTabs => {
                let newTabs = result.tabs || [];                
            
                openTabs.forEach(tab => {
                    const isTabSaver = tab.title === "Tab Saver";
                    const isHTTP = tab.url.slice(0, 4) === "http";
                    const isUnique = newTabs.findIndex(savedTab => {
                        return tab.url === savedTab.url;
                    }) === -1;
    
                    if (!isTabSaver && isHTTP && isUnique) {
                        newTabs.push({
                            title: tab.title,
                            url: tab.url,
                            id: tab.id
                        });
                    }
                });

                // Remove duplicates.
                newTabs = [...new Set(newTabs)];
            
                chrome.storage.sync.set({ tabs: newTabs }, buildUrlList);
            });
        });        
    }

    function buildUrlList() {
        chrome.storage.sync.get(["tabs"], result => {
            const urlList = document.getElementById("urls");
            urlList.innerHTML = "";

            // Add a new li for each saved tab.
            result.tabs.forEach((tab) => {
                const li = document.createElement("li");
                li.innerHTML = `<img src="${getFaviconUrl(tab)}"><a href="${tab.url}" target="_blank">${tab.title}</a>`;
                li.addEventListener("click", removeUrl);
                urlList.append(li);

                // Close open tab.
                chrome.tabs.remove(tab.id);
            });
        });
    }

    function removeUrl(event) {
        const url = event.target.href;
        
        chrome.storage.sync.get(["tabs"], result => {
            const tabToRemove = result.tabs.filter((tab) => {
                return url === tab.url;
            });

            const tabToRemoveIndex = result.tabs.indexOf(tabToRemove[0]);
            let newTabs = result.tabs.slice();
            newTabs.splice(tabToRemoveIndex, 1);

            chrome.storage.sync.set({ tabs: newTabs }, buildUrlList);
        });
    }

    function getFaviconUrl(tab) {
        const re = /https:\/\/(.+?)\//;
        return `https://favicons.githubusercontent.com/${tab.url.match(re)[1]}`;
    }
}