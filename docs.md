Setup
Install example dependencies
$ npm install
Open 2 terminal windows in the ./src directory.
Running
This example has three components. Two browser windows which will send pubsub messages and a relay server that they will use to establish the initial connection.

Why do I need a Relay Server?
The only transport available to browser nodes that lets them be dialed by remote peers is the WebRTC transport.

This transport requires an initial handshake to be done out-of-band, during which the two peers exchange their capabilities, addresses and open ports.

We use a Circuit Relay server to establish an initial communication channel between the two browsers for this process, after which they will have negotiated a peer-to-peer connection and the relay will no longer be used.


Start the Relay Server
For browsers to communicate, we first need to run the libp2p relay server:

$ npm run relay
Copy one of the multiaddresses in the output.

Running the Example
Start the Vite server:

$ npm start
A browser window will automatically open. Let's call this Browser A.

Paste the copied multiaddress from the relay server, paste it into the Dial MultiAddr input and click the Connect button
Browser A is now connected to the relay server
Copy the multiaddress located after the Listening on message
Now open a second browser with the url http://localhost:5173/. Let's call this Browser B.

Using the copied multiaddress from Listening on section in Browser A, paste it into the Remote MultiAddress input and click the Connect button
Browser B is now connected to Browser A
You can now shut down the relay server if you wish.

In both Browser A and Browser B, enter the same topic name in the "Subscribe to topic" input and click the "Subscribe" button
In either browser, enter a message in the Send Message to Topic field and click "Send"
You should see the message appear in the output section towards the bottom of the other browser window.

Need help?
Read the js-libp2p documentation
Check out the js-libp2p API docs
Check out the general libp2p documentation for tips, how-tos and more
Read the libp2p specs
Ask a question on the js-libp2p discussion board