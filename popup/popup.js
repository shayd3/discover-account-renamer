chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(request.message === "account_name_group_list_popup"){
            console.log(request.data);
            console.log(request.data.accountNameGroupList.length)
        }
    }
)