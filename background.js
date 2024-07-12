chrome.action.onClicked.addListener((tab) => {
  captureAndSaveScreenshot();
});

function captureAndSaveScreenshot() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    let activeTab = tabs[0];
    if (activeTab) {
      chrome.tabs.captureVisibleTab(activeTab.windowId, { format: 'png' }, (dataUrl) => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError.message);
          return;
        }

        const url = activeTab.url;
        const sanitizedFilename = sanitizeFilename(url);

        // Get the saved folder name and construct the filename
        chrome.storage.sync.get(['folderName'], (result) => {
          const folderName = result.folderName || 'Screenshots';
          const filename = `${folderName}/${sanitizedFilename}.png`;

          saveScreenshot(dataUrl, filename);
        });
      });
    } else {
      console.error('No active tab found.');
    }
  });
}

function sanitizeFilename(filename) {
  // Replace characters with their textual representation
  return filename.replace(/:/g, 'colon')
                 .replace(/\//g, 'slash')
                 .replace(/\\/g, 'backslash')
                 .replace(/"/g, 'quote')
                 .replace(/</g, 'lt')
                 .replace(/>/g, 'gt')
                 .replace(/\|/g, 'pipe')
                 .replace(/\?/g, 'question')
                 .replace(/\*/g, 'asterisk');
}

function saveScreenshot(dataUrl, filename) {
  // Save screenshot with specified filename
  chrome.downloads.download({
    url: dataUrl,
    filename: filename,
    saveAs: true
  });
}
