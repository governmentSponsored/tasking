# Tasking
Google Apps Script (GAS) based tasking application with a Parse cloud NoSQL database, and jQuery.

#Demo
[Here is the latest stable version of the code](https://script.google.com/macros/s/AKfycbzyVLq-EpbqWmYDdzUbMNPxMbXNPt3GjEL6WBcol4WAQRChDC8/exec)

# Overview
Originally this application used google's built-in NoSQL database ScriptDB, but as Google removed that service, this application needed to undergo a massive overhaul.


# Installation
Moving scripts without tons of copy/paste into Google Drive can be relatively tricky. Please follow these instructions:

1. Create an Apps Script Project on your Drive (you may need to connect Apps Script to Drive)
2. Create an account on [Parse](https://www.parse.com/). This will be your NoSQL data store.
3. Create an application, then a class within that application, then be sure to add at least column to it.
4. Copy the following keys under Settings --> Keys
  * Application ID
  * REST API Key
5. Store them as key/value pairs in your script's project properties by opening your project in Google Drive, Selecting File --> Project Properties, and then selecting the Script Properties tab.
  * appId : Application ID
  * restApi : REST API Key
  * class : Class
6. Follow [these instructions on how to connect Eclipse with Google Apps Script](http://googledevelopers.blogspot.com/2013/10/total-eclipse-of-apps-script.html)
7. More Instructions to follow!
