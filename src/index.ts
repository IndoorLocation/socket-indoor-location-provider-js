import * as io from 'socket.io-client';

interface IndoorLocation {
    latitude: number;
    longitude: number;
    floor: number;
    timestamp: number;
    accuracy: number;
}

interface UserIndoorLocation {
    userId: string;
    indoorLocation: IndoorLocation;
}

class SocketIndoorLocationProvider {
    protected connection: any;
    protected listeners: {(err: any, p: UserIndoorLocation): void}[];

    constructor(socketUrl: string, userId: string) {
        let self = this;

        self.listeners = [];
        self.connection = io(socketUrl, {
            autoConnect: false,
            query: {
                userId: userId
            }
        });

        this.connection.on('connect', function () {
            console.log('connection started');
        });

        this.connection.on('indoorLocationChange', function (userIndoorLocation: UserIndoorLocation) {
            for (let callback of self.listeners) {
                callback(null, userIndoorLocation);
            }
        });
        this.connection.on('error', function (err: any) {
            for (let callback of self.listeners) {
                callback(err, null);
            }
        });
    }

    public start() {
        console.log('start');
        this.connection.open();
    }
    public stop() {
        console.log('close');
        this.connection.close();
    }

    public addListener(callback: {(err: any, p: UserIndoorLocation): void}) {
        this.listeners.push(callback);
    }
    public removeListener(callback: {(err: any, p: UserIndoorLocation): void}) {
        let index = this.listeners.indexOf(callback, 0);
        if (index > -1) {
            this.listeners.splice(index, 1);
        }
    }

    public isStarted() {
        return !!this.connection.id;
    }

    public supportsFloor() {
        return true;
    }

    public getName() {
        return 'socket';
    }
}

export = SocketIndoorLocationProvider;