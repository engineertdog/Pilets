# Pilets
A react native built app that communicates with a NodeJS server through PHP to command outlets that are controlled by relays and a Raspberry PI 3.

# TO-DO - API Server
Change server setup to remove the middleman PHP API Server and turn the NodeJS server from a simple MySQL and GPIO manipulation server into a JSON RESTful API that handles changing the GPIO outpuets for the outlets.

# TO-DO - App
Add comments and go through code to see if it can be reduced further and made more efficient.

# MSOutletApp
This folder contains the necessary React Native files to build the app on your phone.

# API Server
This folder contains the PHP server that is ran to communicate between the phone app and the local Raspberry PI computer running a NodeJS server. You must create an API key and API token, and use these values in the app.

# Node Server
This folder contains the NodeJS file used on the Raspberry PI computer to listen real time to changes to the local MySQL database in order to update the outlets, or to reboot.
