# socket-indoor-location-provider-js
IndoorLocationProvider using websockets to retrieve the user position from a server

IndoorLocationProvider is write in `typescript 2.5.3` and compiled with `webpack 3.8.1`

## Requirements

- Node.js
- npm
- webpack

## Installation

- Clone repo
- run `cd /path/to/project/socket-indoor-location-provider-js`
- run `npm install`

## Use

- run `cd /path/to/project/socket-indoor-location-provider-js`
- run `webpack` if you only want to build it
- run `webpack --progress --colors --watch` to rebuild on each file update


- Import `dist/socketIndoorLocationProvider[.min].js` in you project:   
`<script charset="utf-8" type="text/javascript" src="dist/socketIndoorLocationProvider.min.js"></script>`
- Create new instance of `SocketIndoorLocationProvider` class
````javascript
var socketIndoorLocationProvider = new SocketIndoorLocationProvider('http://localhost:3003', '127.0.0.1');
// Available params:
// socketUrl: Socket emitter url
// userId: String to identifie an user
````

When you crate an instance of`SocketIndoorLocationProvider`, connection is initialized but not starded.   
you have to start and stop it manually:
````javascript
socketIndoorLocationProvider.start();
socketIndoorLocationProvider.stop();

socketIndoorLocationProvider.isStarted(); // return boolean
````

`SocketIndoorLocationProvider` works with listeners, you've to subscribe to events:
````javascript
var listener = function (err, indoorLocation) {
    // Do whatever you want with it
};

socketIndoorLocationProvider.addListener(listener);
socketIndoorLocationProvider.removeListener(listener);
````

Listener function as two params, first is an error if any, second contain user Indoor Location:
````javascript
{
    userId: String,
    indoorLocation: {
        latitude: Float,
        longitude: Float,
        floor: Int,
        timestamp: Int,
        accuracy: Int
    }
}
````

For more details, see in `test/index.html` file.

## Todo

- onStart callback
- onStop callback
- NodeJs compatibility
