# Pilets
A react native built app that communicates with a NodeJS server through PHP to command outlets.

# MSOutletApp
This folder contains the necessary React Native files to build the app on your phone.

# API Server
This folder contains the PHP server that is ran to communicate between the phone app and the local Raspberry PI computer running a NodeJS server. You must create an API key and API token, and use these values in the app.

# Node Server
This folder contains the NodeJS file used on the Raspberry PI computer to listen real time to changes to the local MySQL database in order to update the outlets, or to reboot.
