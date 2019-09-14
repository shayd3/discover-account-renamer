'use strict';

console.log('\'Allo \'Allo! Popup');

chrome.runtime.sendMessage({
    message: "account_name_group_list_request_popup"
}, function(response){
    console.log(response);
});


// chrome.runtime.onLoad.addListener(
//     function (request, sender, sendResponse) {
//         if (request.message === "account_name_group_list_popup") {
//             console.log(request.data);
//             console.log(request.data.accountNameGroupList.length)
//             // empty current inputs to avoid duplicates
//             $('#account-inputs').empty();
//             for (accountNameGroup in request.data.accountNameGroupList) {
//                 $('#account-inputs').append('<div class="input-group mb-3 mt-3"><div class="input-group-prepend"><span class="input-group-text" id="8365-addon">8365</span></div><input type="text" class="form-control" id="basic-url" aria-describedby="8365-addon"></div>');
//             }
//         }
//     }
// );