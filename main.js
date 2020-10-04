window.onload = function() {
    // const btn = document.getElementById("btn-test");
    // btn.addEventListener("click", () => {
    //     alert("hello!");
    // });

    getURLs();

    function getURLs() {
        // Get the URLs for the current window's tabs.
        chrome.tabs.query({}, tabs => {
            let _urls = [];
        
            tabs.forEach(tab => {
                _urls.push(tab.url);
            });

            // Remove duplicates.
            _urls = [...new Set(_urls)];
        
            // Save to storage.
            chrome.storage.sync.set({ urls: _urls });
        });
    }
}

// chrome.storage.sync.get(["urls"], (result) => { alert(result.urls) });