var accountNameData = JSON.parse(loadAccountNameData());

// Determins if you are in the portal, card details page, or bank details page
var currentLocation = getCurrentLocation();

var accountNameGroupList = getAccountList(currentLocation);

console.log("Found", accountNameGroupList.length, "accounts!");

if(accountNameData != null) {
    for(let i = 0; i < accountNameGroupList.length; i++) {
        let accountNumber = $(accountNameGroupList[i]).children('p.card-last-digits').text().replace('(','').replace(')','').trim();
        if(accountNameData[accountNumber]) {
            $(accountNameGroupList[i]).children('p.account-name').text(accountNameData[accountNumber])
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

function loadAccountNameData() {
    return localStorage.saveData || null;
}

function getCurrentUrl() {
    return window.location.toString();
}

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