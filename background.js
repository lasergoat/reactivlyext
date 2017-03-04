chrome.browserAction.onClicked.addListener(function (tab) {
  // for the current tab, inject the "inject.js" file & execute it
  chrome.tabs.executeScript(tab.ib, {
    file: 'static/js/main.js'
  });

  chrome.tabs.insertCSS(tab.id, {
    file: 'static/css/main.css'
  });

});
