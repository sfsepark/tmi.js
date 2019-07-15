var WebSocketServer = require('ws').Server;
var tmi = require('../index.js');

var catchConnectError = err => {
    if(err !== 'Connection closed.') {
        console.error(err);
    }
};

describe('websockets', function() {
    before(function() {
        // Initialize websocket server
        this.server = new WebSocketServer({port: 7000});
        this.client = new tmi.client({
            connection: {
                server: 'localhost',
                port: 7000
            }
        });
    });

    it('handles join & part commands', function(cb) {
        var client = this.client;
        var server = this.server;

        server.on('connection', function(ws) {
            ws.on('message', function(message) {
                // Ensure that the message starts with NICK
                if (message.indexOf('NICK')) {
                    return;
                }
                var user = client.getUsername();
                ws.send(`:${user}! JOIN #local7000`);
                ws.send(`:${user}! PART #local7000`);
            });
        });

        client.on('join', function() {
            client.channels.should.eql(['#local7000']);
        });

        client.on('part', function() {
            client.channels.should.eql([]);
            client.disconnect();
            cb();
        });

        client.connect().catch(catchConnectError);
    });

    after(function() {
        // Shut down websocket server
        this.server.close();
    });
});

describe('server crashed, with reconnect: false (default)', function() {
    before(function() {
        // Initialize websocket server
        this.server = new WebSocketServer({port: 7000});
        this.client = new tmi.client({
            connection: {
                server: 'localhost',
                port: 7000
            }
        });
    });

    it('gracefully handle the error', function(cb) {
        this.timeout(15000);
        var client = this.client;
        var server = this.server;

        server.on('connection', function(ws) {
            // Uh-oh, the server dies
            server.close();
        });

        client.on('disconnected', function() {
            'Test that we reached this point'.should.be.ok();
            cb();
        });

        client.connect().catch(catchConnectError);
    });
});

describe('server crashed, with reconnect: true', function() {
    before(function() {
        // Initialize websocket server
        this.server = new WebSocketServer({port: 7000});
        this.client = new tmi.client({
            connection: {
                server: 'localhost',
                port: 7000,
                reconnect: true
            }
        });
    });

    it('attempt to reconnect', function(cb) {
        this.timeout(15000);
        var client = this.client;
        var server = this.server;

        server.on('connection', function(ws) {
            // Uh-oh, the server dies
            server.close();
        });

        client.on('disconnected', function() {
            setTimeout(function() {
                'Test that we reached this point'.should.be.ok();
                cb();
            }, client.reconnectTimer);
        });

        client.connect().catch(catchConnectError);
    });
});
