document.addEventListener('DOMContentLoaded', () => {
    const folderNameInput = document.getElementById('folderName');
    const saveButton = document.getElementById('save');
  
    // Load the saved folder name
    chrome.storage.sync.get(['folderName'], (result) => {
      if (result.folderName) {
        folderNameInput.value = result.folderName;
      }
    });
  
    // Save the folder name
    saveButton.addEventListener('click', () => {
      const folderName = folderNameInput.value;
      chrome.storage.sync.set({ folderName }, () => {
        alert('Folder name saved!');
      });
    });
  });
  