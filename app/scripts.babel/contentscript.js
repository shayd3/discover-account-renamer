'use strict';

var savedAccountNameData; // 4 digit account number:account name pair structure found in localstorage
var currentLocation; // keyword describing page location
var accountNameGroupList;// accountNameGroup dom nodes found on page

$(document).ready(function() {
    chrome.storage.sync.get(['saveData'], function(result) {
        savedAccountNameData = result.saveData;
        // Grab current url 
        currentLocation = getCurrentLocation();

        // Based on url, find accounts on page
        accountNameGroupList = getAccountList(currentLocation);

        console.log("Found", accountNameGroupList.length, "accounts!", accountNameGroupList);
        
        // Inject edit buttons next to accounts
        injectEditButtons(accountNameGroupList, currentLocation);
        
        // Change Account Names
        changeAccountNames(accountNameGroupList, savedAccountNameData);
    });
});

/**
 * When savedAccountNameData exists, change account names contained in accountNameGroupList
 * @param {string[]} accountNameGroupList 
 * @param {object} savedAccountNameData 
 */
function changeAccountNames(accountNameGroupList, savedAccountNameData) {
    if (savedAccountNameData != null) {
        for (let i = 0; i < accountNameGroupList.length; i++) {
            let accountNumber = $(accountNameGroupList[i]).children('p.card-last-digits').text().replace('(', '').replace(')', '').trim();
            console.log("accountNumber", accountNumber);
            if (savedAccountNameData[accountNumber]) {
                $(accountNameGroupList[i]).children('p.account-name').text(savedAccountNameData[accountNumber])
            }

        }
    }
}

// Look at local storage to see if any json exists
// If not, keep defaults

// This will be in popup.js
// Popup.js should probably include reset individual, reset all
function saveAccountNameData(obj) {
    chrome.storage.sync.clear(function() {
        console.log("sync storage cleared");
    })
    chrome.storage.sync.set({"saveData": obj}, function(){
        console.log("Successfully saved account name data!", obj);
    })

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
    if (currentUrl.includes("portal"))
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
    switch (location) {
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

/**
 * Inject edit buttons wuth event handlers next to accounts
 * @param {Object} accountList 
 * @param {String} location 
 */
function injectEditButtons(accountList, location) {

    $('.col-account-name').each(function(index){
        $(this).append(`<input type="button" class="btn btn-primary" value="Edit" id="btn-edit-${index}" data-index="${index}" style="margin-top:5px;"/>`)
        
        // TODO: Turn account name node into input and vice versa. When done, save to local storage
        $(`#btn-edit-${index}`).click(function(){ toggleEditAccountName($(this), location)});
    })
}

/**
 * From the context of the injected 'Edit' button, find the account name near the button and
 * turn into input. Save account name on blur
 * @param {Object} node 
 * @param {String} location 
 */
function toggleEditAccountName(node, location){
    let $elOriginal = node.siblings('a').children('.account-name-group').children('.account-name');
    let $el = $elOriginal
    let $input = $('<input/>').val($el.text());
    $el.replaceWith($input);


    // clear and save to localstorage each time
    let save = function() {
        let $p = $elOriginal.text($input.val())
        $input.replaceWith( $p );

        // Regenerate accountNameGroupList
        accountNameGroupList = getAccountList(currentLocation);
        let savedDataJson = generateDigitAccountNamePair(accountNameGroupList, location);
        saveAccountNameData(savedDataJson);
    };

    $input.one('blur', save).focus();
}

function generateDigitAccountNamePair(accountNameGroupList, location) {
    console.log("Inside of generateDigitAccountNamePair",accountNameGroupList, location)
    let obj = {}
    switch(location){
        case "portal":
            for(let i = 0; i < accountNameGroupList.length; i++) {
                let accountName = $(accountNameGroupList[i]).children('.account-name').text().trim()
                let accountNumber = $(accountNameGroupList[i]).children('.card-last-digits').text().replace('(', '').replace(')', '').trim()
                obj[accountNumber] = accountName;
            }
            console.log("generate obj", obj)
            return obj;
            break;
        default:
            console.log("You are in a location with no account lists!")

    }

}

chrome.storage.onChanged.addListener(function(changes, namespace) {
    for (var key in changes) {
      var storageChange = changes[key];
      console.log('Storage key "%s" in namespace "%s" changed. ' +
                  'Old value was "%s", new value is "%s".',
                  key,
                  namespace,
                  storageChange.oldValue,
                  storageChange.newValue);
    }
  });