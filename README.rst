This is a simple extension that is designed to roll uncompleted Google Tasks forward to the current date so as to appear in your Google Calendar.  The extension is available on the Chrome Web store.

Due to usage caps on the Tasks API, as the user base grows for the published version the ability to use the extension will decline.  Using the source above, and the package.py script, a version of the extension can be created for personal use by obtaining an API key for Google Tasks from the Google Developer console.  Then add a javascript file named 'oauth_credentials.js' to the top level project directory.  

The contents of the file should look like::
    
    oauth_consumer_key = ""
    oauth_consumer_secret = ""

If you have any questions, please post an issue through Github.
