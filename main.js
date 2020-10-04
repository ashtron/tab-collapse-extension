window.onload = function() {

    const collapseBtn = document.getElementById("collapse-btn");
    collapseBtn.addEventListener("click", () => {
        setURLs();
    });

    const clearBtn = document.getElementById("clear-btn");
    clearBtn.addEventListener("click", () => {
        chrome.storage.sync.set({ tabs: [] });
        const urlList = document.getElementById("urls");
        urlList.innerHTML = "";
    });

    buildUrlList();

    // function updateURLs() {
    //     chrome.storage.sync.get(["urls"], (res) => {
    //         setURLs(res.urls);
    //     });

    // }

    function setURLs(currentURLs) {

        // Get the URLs of the current window's tabs.
        chrome.tabs.query({}, tabs => {
            let _tabs = [];
        
            tabs.forEach(tab => {
                _tabs.push({
                    title: tab.title,
                    url: tab.url
                });
            });

            // Remove duplicates.
            _tabs = [...new Set(_tabs)];
        
            // Save to storage.
            chrome.storage.sync.set({ tabs: _tabs });

            buildUrlList();
        });
        
    }

    function buildUrlList() {
        chrome.storage.sync.get(["tabs"], (result) => {
            const urlList = document.getElementById("urls");

            result.tabs.forEach((tab) => {
                const li = document.createElement("li");
                li.innerHTML = `<a href="${tab.url}" target="_blank">${tab.title}</a>`
                urlList.append(li);
            });
        });
    }
}

// chrome.storage.sync.get(["urls"], (result) => { alert(result.urls) });