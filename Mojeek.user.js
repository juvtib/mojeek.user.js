
/*

   Copyright 2022 Michael Mientus

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

*/


// ==UserScript==
// @name         Mojeek
// @description  Number search results and provide temporary anchors. 
// @namespace    https://github.com/juvtib/mojeek.user.js
// @match        https://www.mojeek.com/search*
// @version      1.1
// @grant        none
// ==/UserScript==

// Run the main code once the page has loaded. 
document.addEventListener('readystatechange', eventHandler);

// Document.readyState | MDN
// https://developer.mozilla.org/en-US/docs/Web/API/Document/readyState


// Make sure the eventHandler() runs at least once. 
// The page might not fire any further readystatechange events if it is loaded
// by the time this code runs. 
eventHandler();  

// Execute at document-idle time | Greasemonkey | GitHub
// https://github.com/greasemonkey/greasemonkey/issues/2525


// Main code. 
function eventHandler() {
  if (document.readyState === 'complete') 
  {
    // Clean up EventListener. 
    document.removeEventListener('readystatechange', eventHandler);

    ///////////////////////////////////////
    // Greasemonkey changes to the page. //
    ///////////////////////////////////////

    // Reference to Mojeek search results. 
    const mjkscp_ul = document.querySelector(".results-standard"); 
    
    // Exit early if there are no search results. 
    if (mjkscp_ul === null)
    {
       return 0; 
    }


    // Add CSS Rule
    
    // Create a style element. 
    const mjkscp_style = document.createElement("style");
    
    // Add CSS rule to style elment. 
    mjkscp_style.innerHTML = "\nli::marker, .mjkscp-link { \n  font-size: 1.5em; \n}\n\n"; 
    
    // Add style to DOM. 
    document.head.appendChild(mjkscp_style); 
    
    
    // Copy s parameter from URL. 
    
    // New URLSearchParams object. 
    const mjkscp_params = new URLSearchParams(window.location.search);
    
    // Save the value of the s parameter as an integer. 
    const mjkscp_s_parameter = parseInt(mjkscp_params.get("s")); 
    
    // Declare counting variable. 
    let mjkscp_value = -1; 
    
    // Validate the range of the s parameter. 
    if (isNaN(mjkscp_s_parameter))
    {  mjkscp_value = 1;  } 
    else if (mjkscp_s_parameter < 1)
    {  mjkscp_value = 1;  } 
    else if (mjkscp_s_parameter > 1000)
    {  mjkscp_value = 1000;  } 
    else
    {  mjkscp_value = mjkscp_s_parameter;  }


    // Switch from an HTML <ul> to <ol>
    
    // Create ordered list outside the DOM. 
    const mjkscp_ol = document.createElement("ol");

    // Copy the list items from the unordered list to the ordered list. 
    mjkscp_ol.innerHTML = mjkscp_ul.innerHTML; 
    

    // Add links. 

    // Loop over list elements in the ordered list. 
    for (const item of (mjkscp_ol.getElementsByTagName('li'))) 
    {
       // Number each list element. 
       item.value = mjkscp_value; 
    
       // Create link element. 
       const a = document.createElement("a");
    
       // Create id. 
       const id = "mjkscp-" + mjkscp_value;
    
       // Add id. 
       a.id = id; 
    
       // Add href. 
       a.href = "#" + id; 
    
       // Add class. 
       a.className = "mjkscp-link"; 
    
       // Add link symbol. 
       a.innerHTML = "&#x1f517;"; 

       // Remove the link from the tab order. 
       a.tabIndex = -1; 
    
       // Add link to list element. 
       item.insertBefore(a,item.firstChild); 
    
       // Increment value. 
       mjkscp_value += 1; 
    }

    // Update the page with the ordered list.  
    mjkscp_ul.parentElement.replaceChild(mjkscp_ol, mjkscp_ul);
  }
}

