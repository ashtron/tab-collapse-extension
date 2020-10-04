window.onload = function() {

    const collapseBtn = document.getElementById("collapse-btn");
    collapseBtn.addEventListener("click", () => {
        setURLs();
        buildUrlList();
    });

    // function updateURLs() {
    //     chrome.storage.sync.get(["urls"], (res) => {
    //         setURLs(res.urls);
    //     });

    // }

    function setURLs(currentURLs) {

        // Get the URLs of the current window's tabs.
        chrome.tabs.query({}, tabs => {
            alert(tabs[0].title)
            let newURLs = [];
        
            tabs.forEach(tab => {
                newURLs.push(tab.url);
            });

            // Remove duplicates.
            newURLs = [...new Set(newURLs)];
        
            // Save to storage.
            chrome.storage.sync.set({ urls: newURLs });
        });

    }

    function buildUrlList() {
        chrome.storage.sync.get(["urls"], (result) => {
            const urlList = document.getElementById("urls");

            result.urls.forEach((url) => {
                const li = document.createElement("li");
                li.innerHTML = url;
                urlList.append(li);
            });
        });
    }
}

// chrome.storage.sync.get(["urls"], (result) => { alert(result.urls) });