// background.js

// // Called when the user clicks on the browser action.
// chrome.browserAction.onLoad.addListener(function(tab) {
//     // Send a message to the active tab
//     chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//       var activeTab = tabs[0];
//       chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
//     });
//   });
  
  // This block is new!
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if( request.message === "account_name_group_list" ) {
        chrome.runtime.sendMessage({
          message: "account_name_group_list_popup",
          data: request.data
        });
      }
    }
  );