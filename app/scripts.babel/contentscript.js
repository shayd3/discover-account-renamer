'use strict';

console.log('\'Allo \'Allo! Content script...test? ohhhhhh');

var accountNameData;
var currentLocation;
var accountNameGroupList;

$(document).ready(function () {
    // Load account data if exists
    accountNameData = JSON.parse(loadAccountNameData());

    // Grab current url 
    currentLocation = getCurrentLocation();

    // Based on url, find accounts on page
    accountNameGroupList = getAccountList(currentLocation);

    console.log("Found", accountNameGroupList.length, "accounts!", accountNameGroupList);

    // Inject edit buttons next to accounts
    injectEditButtons(accountNameGroupList, currentLocation);

    changeAccountNames(accountNameGroupList, accountNameData);
});

/**
 * When accountNameData exists, change account names contained in accountNameGroupList
 * @param {string[]} accountNameGroupList 
 * @param {object} accountNameData 
 */
function changeAccountNames(accountNameGroupList, accountNameData) {
    if (accountNameData != null) {
        for (let i = 0; i < accountNameGroupList.length; i++) {
            let accountNumber = $(accountNameGroupList[i]).children('p.card-last-digits').text().replace('(', '').replace(')', '').trim();
            console.log("accountNumber", accountNumber);
            if (accountNameData[accountNumber]) {
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
    //return localStorage.saveData || null;
    // For testing purposes
    return "{\"8139\":\"test-1\",\"5309\":\"test-2\",\"3168\":\"test-3\",\"8798\":\"test-4\"}";
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
        $(this).append(`<input type="button" class="btn btn-primary" value="Edit" id="btn-edit-${index}" style="margin-top:5px;"/>`)
        
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

    let save = function() {
        let $p = $elOriginal.text($input.val())
        $input.replaceWith( $p );
    };

    $input.one('blur', save).focus();
}

function getAccountNameNode(node, location) {
    let accountName = $(node).siblings('a').children('.account-name-group').children('.account-name').text()
    console.log(accountName);
}