# literary-chat

# Description

This a "chat" app where the participants feed in a text file as a [one time pads](https://en.wikipedia.org/wiki/One-time_pad) to encrypt the conversation. The idea is that as you type, you'd see the source text and know the other participant is seeing the same thing. You could use classics works of literature to encrypt your conversation. NOTE, this is obviously not a great design from a security stand point.

# Usage

This is a node app, on Linux you can install with `sudo apt install nodejs npm`

First install the dependencies with `npm install`

Run with `node main.js`

This starts a web server on port 1337 which can then be joined by the participants.

The two participants choose a name, and a room to join. Note, to understand each other, the transmit pad for each user must match the receive pad of the other.
