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

        const toAll = function (err: any, userIndoorLocation: any): void {
            for (let callback of self.listeners) {
                callback(err, userIndoorLocation);
            }
        }

        this.connection.on('connect', function () {
            console.log('connection started');
        });

        this.connection.on('indoorLocationChange', function (userIndoorLocation: UserIndoorLocation) {
            toAll(null, userIndoorLocation);
        });
        this.connection.on('socket error', function (err: any) {
            toAll(err, null);
        });
        this.connection.on('error', function (err: any) {
            toAll(err, null);
        });

        this.connection.on('disconnect', function (reason: string) {
            console.log('connection closed', reason);
        });
    }

    public start(): void {
        console.log('connection start');
        this.connection.open();
    }
    public stop(): void {
        console.log('connection close');
        this.connection.close();
    }

    public addListener(callback: {(err: any, p: UserIndoorLocation): void}): void {
        this.listeners.push(callback);
    }
    public removeListener(callback: {(err: any, p: UserIndoorLocation): void}): void {
        let index = this.listeners.indexOf(callback, 0);
        if (index > -1) {
            this.listeners.splice(index, 1);
        }
    }

    public isStarted(): boolean {
        return !!this.connection.id;
    }

    public supportsFloor(): boolean {
        return true;
    }

    public getName(): string {
        return 'socket';
    }
}

export = SocketIndoorLocationProvider;