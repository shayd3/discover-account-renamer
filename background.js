  // chrome.runtime.onMessage.addListener(
  //   function(request, sender, sendResponse) {
  //     if( request.message === "account_name_group_list" ) {
  //       chrome.runtime.sendMessage({
  //         message: "account_name_group_list_popup",
  //         data: request.data
  //       });
  //     }
  //   }
  // );

  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      // Send request to script.js for account_name_group_list
      console.log("I received this!");
      if( request.message === "account_name_group_list_request_popup" ) {
        chrome.runtime.sendMessage({
          message: "account_name_group_list_request"
        }, function(response){
          console.log(response);
          sendResponse(response);
        });
      }
    }
  );
  