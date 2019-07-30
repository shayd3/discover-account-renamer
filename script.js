$(document).ready(function(){
    var accountNameData = JSON.parse(loadAccountNameData());
    var currentLocation = getCurrentLocation();
    var accountNameGroupList = getAccountList(currentLocation);

    console.log("Found", accountNameGroupList.length, "accounts!", accountNameGroupList);

    changeAccountNames(accountNameGroupList, accountNameData);

});

/*************************** 
        Listeners
 ***************************/
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if( request.message === "clicked_browser_action" ) {
        var firstHref = $("a[href^='http']").eq(0).attr("href");
  
        console.log(firstHref);
  
        // This line is new!
        chrome.runtime.sendMessage({"message": "open_new_tab", "url": firstHref});
      }
    }
  );

/**
 * When accountNameData exists, change account names contained in accountNameGroupList
 * @param {string[]} accountNameGroupList 
 * @param {object} accountNameData 
 */
function changeAccountNames(accountNameGroupList, accountNameData) {
    if(accountNameData != null) {
        for(let i = 0; i < accountNameGroupList.length; i++) {
            let accountNumber = $(accountNameGroupList[i]).children('p.card-last-digits').text().replace('(','').replace(')','').trim();
            console.log("accountNumber",accountNumber);
            if(accountNameData[accountNumber]) {
                $(accountNameGroupList[i]).children('p.account-name').text(accountNameData[accountNumber])
            }

        }
    }
}

// Look at local storage to see if any json exists
// If not, keep defaults

// This will be in popup.js
// Popup.js should probably include reset individual, reset all
function saveAccountNameData(obj) {
    saveData = obj;
    localStorage.saveData = JSON.stringify(saveData);
}

/**
 * When page loads, load saveData object from localStorage
 */
function loadAccountNameData() {
    return localStorage.saveData || null;
}

/**
 * When getCurrentLocation() is called, determine what portal page user is on
 */
function getCurrentUrl() {
    return window.location.toString();
}

/**
 * Since there is different pages where user can see bank accounts,
 * we need to a way to quickly identify what elements to look for
 */
function getCurrentLocation() {
    let currentUrl = getCurrentUrl();
    if(currentUrl.includes("portal"))
        return "portal";
    else if (currentUrl.includes("cardmembersvcs"))
        return "cardmembersvcs";
    else if (currentUrl.includes("bankac"))
        return "bankac";
    else 
        return null;
}

/**
 * Based on what page user is on, look for different elements to retrieve account list
 * @param {String} location 
 */
function getAccountList(location) {
    switch(location){
        // Contains p.account-name and p.card-last-digits
        case "portal":
            return $('div.account-name-group').toArray();
            break;
        // TODO - Credit Card page
        case "cardmembersvcs":
            break;
        // TODO - Savings Account page
        case "bankac":
            break;
        default:
            return null;
    }
}