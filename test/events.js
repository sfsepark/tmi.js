var should = require('should');
var tmi = require('../index.js');

var events = [{
    name: 'action',
    data: "@badges=broadcaster/1,warcraft/horde;color=#0D4200;display-name=Schmoopiie;emotes=25:0-4,12-16/1902:6-10;subscriber=0;turbo=1;user-type=global_mod :schmoopiie!~schmoopiie@schmoopiie.tmi.twitch.tv PRIVMSG #schmoopiie :\u0001ACTION Hello :)\u0001",
    expected: [
        '#schmoopiie',
        {
            badges: { broadcaster: '1', warcraft: 'horde' },
            color: '#0D4200',
            'display-name': 'Schmoopiie',
            emotes: {
                '25': ['0-4', '12-16'],
                '1902': ['6-10']
            },
            subscriber: false,
            turbo: true,
            'user-type': 'global_mod',
            'emotes-raw': '25:0-4,12-16/1902:6-10',
            'badges-raw': 'broadcaster/1,warcraft/horde',
            username: 'schmoopiie',
            'message-type': 'action'
        },
        'Hello :)'
    ]
}, {
    name: 'automod',
    data: "@msg-id=msg_rejected :tmi.twitch.tv NOTICE #schmoopiie :Hey! Your message is being checked by mods and has not been sent.",
    expected: [
        '#schmoopiie',
        'msg_rejected',
        'Hey! Your message is being checked by mods and has not been sent.'
    ]
}, {
    name: 'automod',
    data: "@msg-id=msg_rejected_mandatory :tmi.twitch.tv NOTICE #schmoopiie :Your message wasn't posted due to conflicts with the channel's moderation settings.",
    expected: [
        '#schmoopiie',
        'msg_rejected_mandatory',
        "Your message wasn't posted due to conflicts with the channel's moderation settings."
    ]
}, {
    name: 'ban',
    data: '@room-id=20624989;target-user-id=20624989 :tmi.twitch.tv CLEARCHAT #schmoopiie :schmoopiie',
    expected: [
        '#schmoopiie',
        'schmoopiie',
        null,
        {
            'room-id': '20624989',
            'target-user-id': '20624989'
        }
    ]
}, {
    name: 'chat',
    // data: "@badges=broadcaster/1,warcraft/horde;color=#0D4200;display-name=Schmoopiie;emotes=25:0-4,12-16/1902:6-10;subscriber=0;turbo=1;user-type=global_mod :schmoopiie!~schmoopiie@schmoopiie.tmi.twitch.tv PRIVMSG #schmoopiie :Hello :)",
    data: "@badge-info=subscriber/21;badges=broadcaster/1,subscriber/12,overwatch-league-insider_2019A/1;color=#177DE3;display-name=Alca;emotes=499:3-4;flags=;id=c5ddcb05-85ae-4a60-91bc-7704c7031257;mod=0;room-id=7676884;subscriber=1;tmi-sent-ts=1554296462753;turbo=0;user-id=7676884;user-type= :alca!alca@alca.tmi.twitch.tv PRIVMSG #alca :Hi :)",
    expected: [
        '#alca',
        {
            'badge-info': { subscriber: '21' },
            badges: {
                broadcaster: '1',
                subscriber: '12',
                'overwatch-league-insider_2019A': '1'
            },
            color: '#177DE3',
            'display-name': 'Alca',
            emotes: { '499': [ '3-4' ] },
            flags: null,
            id: 'c5ddcb05-85ae-4a60-91bc-7704c7031257',
            mod: false,
            'room-id': '7676884',
            subscriber: true,
            'tmi-sent-ts': '1554296462753',
            turbo: false,
            'user-id': '7676884',
            'user-type': null,
            'emotes-raw': '499:3-4',
            'badge-info-raw': 'subscriber/21',
            'badges-raw': 'broadcaster/1,subscriber/12,overwatch-league-insider_2019A/1',
            username: 'alca',
            'message-type': 'chat'
        },
        'Hi :)'
    ]
}, {
    name: 'cheer',
    data: '@badges=broadcaster/1,warcraft/horde;color=#0D4200;bits=100;display-name=Schmoopiie;emotes=;subscriber=0;turbo=1;user-type=global_mod :schmoopiie!~schmoopiie@schmoopiie.tmi.twitch.tv PRIVMSG #schmoopiie :cheer100 Hello :)',
    expected: [
        '#schmoopiie',
        {
            badges: { broadcaster: '1', warcraft: 'horde' },
            bits: '100',
            color: '#0D4200',
            'display-name': 'Schmoopiie',
            emotes: null,
            subscriber: false,
            turbo: true,
            'user-type': 'global_mod',
            'emotes-raw': null,
            'badges-raw': 'broadcaster/1,warcraft/horde',
            username: 'schmoopiie'
        },
        'cheer100 Hello :)'
    ]
}, {
    name: 'clearchat',
    data: ':tmi.twitch.tv CLEARCHAT #schmoopiie',
    expected: [
        '#schmoopiie'
    ]
}, {
    name: 'connected',
    data: ':tmi.twitch.tv 372 schmoopiie :You are in a maze of twisty passages, all alike.'
}, {
    name: 'emotesets',
    data: '@color=#1E90FF;display-name=Schmoopiie;emote-sets=0;turbo=0;user-type= :tmi.twitch.tv GLOBALUSERSTATE',
    expected: [
        '0'
    ]
}, {
    name: 'hosted',
    data: ":jtv!~jtv@jtv.tmi.twitch.tv PRIVMSG #schmoopiie :Username is now hosting you for 11 viewers.",
    expected: [
        '#schmoopiie',
        'username',
        11
    ]
}, {
    name: 'hosting',
    data: ':tmi.twitch.tv HOSTTARGET #schmoopiie :schmoopiie 3',
    expected: [
        '#schmoopiie',
        'schmoopiie',
        3
    ]
}, {
    name: 'join',
    data: ':schmoopiie!schmoopiie@schmoopiie.tmi.twitch.tv JOIN #schmoopiie',
    expected: [
        '#schmoopiie',
        'schmoopiie',
        false
    ]
}, {
    name: 'mod',
    data: ':jtv MODE #schmoopiie +o schmoopiie',
    expected: [
        '#schmoopiie',
        'schmoopiie'
    ]
}, {
    name: 'mods',
    data: '@msg-id=room_mods :tmi.twitch.tv NOTICE #schmoopiie :The moderators of this room are: user1, user2, user3',
    expected: [
        '#schmoopiie',
        ['user1', 'user2', 'user3']
    ]
},  {
    name: 'mods',
    data: '@msg-id=no_mods :tmi.twitch.tv NOTICE #schmoopiie :There are no moderators of this channel.',
    expected: [
        '#schmoopiie',
        []
    ]
}, {
    name: 'part',
    data: ':schmoopiie!schmoopiie@schmoopiie.tmi.twitch.tv PART #schmoopiie',
    expected: [
        '#schmoopiie',
        'schmoopiie',
        false
    ]
}, {
    name: 'ping',
    data: 'PING :tmi.twitch.tv'
}, {
    name: 'pong',
    data: 'PONG :tmi.twitch.tv'
}, {
    name: 'r9kbeta',
    data: '@msg-id=r9k_on :tmi.twitch.tv NOTICE #schmoopiie :This room is now in r9k mode.',
    expected: [
        '#schmoopiie',
        true
    ]
}, {
    name: 'r9kbeta',
    data: '@msg-id=r9k_off :tmi.twitch.tv NOTICE #schmoopiie :This room is no longer in r9k mode.',
    expected: [
        '#schmoopiie',
        false
    ]
}, {
    name: 'roomstate',
    data: '@broadcaster-lang=;r9k=0;slow=0;subs-only=0 :tmi.twitch.tv ROOMSTATE #schmoopiie',
    expected: [
        '#schmoopiie',
        {
            'broadcaster-lang': null,
            r9k: false,
            slow: false,
            'subs-only': false,
            channel: '#schmoopiie'
        }
    ]
}, {
    name: 'slowmode',
    data: '@slow=8 :tmi.twitch.tv ROOMSTATE #schmoopiie',
    expected: [
        '#schmoopiie',
        true,
        8
    ]
}, {
    name: 'slowmode',
    data: '@slow=0 :tmi.twitch.tv ROOMSTATE #schmoopiie',
    expected: [
        '#schmoopiie',
        false,
        0
    ]
}, {
    name: 'subanniversary',
    data: '@badges=staff/1,subscriber/6,turbo/1;color=#008000;display-name=Schmoopiie;emotes=;flags=;id=00000000-0000-0000-0000-000000000000;login=schmoopiie;mod=0;msg-id=resub;msg-param-cumulative-months=7;msg-param-should-share-streak=0;msg-param-sub-plan-name=Channel\\sSubscription\\s(Schmoopiie);msg-param-sub-plan=Prime;room-id=20624989;subscriber=1;system-msg=Schmoopiie\\sSubscribed\\swith\\sTwitch\\sPrime.;tmi-sent-ts=1500000000000;turbo=0;user-id=20624989;user-type=staff :tmi.twitch.tv USERNOTICE #schmoopiie :Great stream -- keep it up!',
    expected: [
        '#schmoopiie',
        'Schmoopiie',
        0,
        'Great stream -- keep it up!',
        {
            badges: { staff: '1', subscriber: '6', turbo: '1' },
            'badges-raw': 'staff/1,subscriber/6,turbo/1',
            color: '#008000',
            'display-name': 'Schmoopiie',
            emotes: null,
            'emotes-raw': null,
            flags: null,
            id: '00000000-0000-0000-0000-000000000000',
            login: 'schmoopiie',
            'message-type': 'resub',
            mod: false,
            'msg-id': 'resub',
            'msg-param-cumulative-months': '7',
            'msg-param-should-share-streak': false,
            'msg-param-sub-plan': 'Prime',
            'msg-param-sub-plan-name': 'Channel Subscription (Schmoopiie)',
            'room-id': '20624989',
            subscriber: true,
            'system-msg': 'Schmoopiie Subscribed with Twitch Prime.',
            'tmi-sent-ts': '1500000000000',
            turbo: false,
            'user-id': '20624989',
            'user-type': 'staff'
        },
        {
          prime: true,
          plan: 'Prime',
          planName: 'Channel Subscription (Schmoopiie)'
        }
    ]
}, {
    name: 'resub',
    data: '@badges=staff/1,subscriber/6,turbo/1;color=#008000;display-name=Schmoopiie;emotes=;flags=;id=00000000-0000-0000-0000-000000000000;login=schmoopiie;mod=0;msg-id=resub;msg-param-cumulative-months=7;msg-param-should-share-streak=1;msg-param-streak-months=6;msg-param-sub-plan-name=Channel\\sSubscription\\s(Schmoopiie);msg-param-sub-plan=Prime;room-id=20624989;subscriber=1;system-msg=Schmoopiie\\sSubscribed\\swith\\sTwitch\\sPrime.;tmi-sent-ts=1500000000000;turbo=0;user-id=20624989;user-type=staff :tmi.twitch.tv USERNOTICE #schmoopiie :Great stream -- keep it up!',
    expected: [
        '#schmoopiie',
        'Schmoopiie',
        6,
        'Great stream -- keep it up!',
        {
            badges: { staff: '1', subscriber: '6', turbo: '1' },
            'badges-raw': 'staff/1,subscriber/6,turbo/1',
            color: '#008000',
            'display-name': 'Schmoopiie',
            emotes: null,
            'emotes-raw': null,
            flags: null,
            id: '00000000-0000-0000-0000-000000000000',
            login: 'schmoopiie',
            'message-type': 'resub',
            mod: false,
            'msg-id': 'resub',
            'msg-param-cumulative-months': '7',
            'msg-param-should-share-streak': true,
            'msg-param-streak-months': '6',
            'msg-param-sub-plan': 'Prime',
            'msg-param-sub-plan-name': 'Channel Subscription (Schmoopiie)',
            'room-id': '20624989',
            subscriber: true,
            'system-msg': 'Schmoopiie Subscribed with Twitch Prime.',
            'tmi-sent-ts': '1500000000000',
            turbo: false,
            'user-id': '20624989',
            'user-type': 'staff'
        },
        {
          prime: true,
          plan: 'Prime',
          planName: 'Channel Subscription (Schmoopiie)'
        }
    ]
}, {
    name: 'subscribers',
    data: '@msg-id=subs_on :tmi.twitch.tv NOTICE #schmoopiie :This room is now in subscribers-only mode.',
    expected: [
        '#schmoopiie',
        true
    ]
}, {
    name: 'subscribers',
    data: '@msg-id=subs_off :tmi.twitch.tv NOTICE #schmoopiie :This room is no longer in subscribers-only mode.',
    expected: [
        '#schmoopiie',
        false
    ]
}, {
    name: 'subscription',
    data: '@badges=staff/1,subscriber/1,turbo/1;color=#008000;display-name=Schmoopiie;emotes=;mod=0;msg-id=sub;room-id=20624989;subscriber=1;msg-param-sub-plan=Prime;msg-param-sub-plan-name=Channel\\sSubscription\\s(Schmoopiie);system-msg=Schmoopiie\\sjust\\ssubscribed!;login=schmoopiie;turbo=1;user-id=20624989;user-type=staff :tmi.twitch.tv USERNOTICE #schmoopiie :Great stream -- keep it up!',
    expected: [
        '#schmoopiie',
        'Schmoopiie',
        {
          'prime': true,
          'plan': 'Prime',
          'planName': 'Channel Subscription (Schmoopiie)'
        },
        'Great stream -- keep it up!',
        {
            badges: { staff: '1', subscriber: '1', turbo: '1' },
            'badges-raw': 'staff/1,subscriber/1,turbo/1',
            color: '#008000',
            'display-name': 'Schmoopiie',
            emotes: null,
            'emotes-raw': null,
            login: 'schmoopiie',
            'message-type': 'sub',
            mod: false,
            'msg-id': 'sub',
            'msg-param-sub-plan': 'Prime',
            'msg-param-sub-plan-name': 'Channel Subscription (Schmoopiie)',
            'room-id': '20624989',
            subscriber: true,
            'system-msg': 'Schmoopiie just subscribed!',
            turbo: true,
            'user-id': '20624989',
            'user-type': 'staff'
        }
    ]
}, {
    name: 'timeout',
    data: '@ban-duration=60;room-id=20624989;target-user-id=20624989 :tmi.twitch.tv CLEARCHAT #schmoopiie :schmoopiie',
    expected: [
        '#schmoopiie',
        'schmoopiie',
        null,
        60,
        {
            'ban-duration': '60',
            'room-id': '20624989',
            'target-user-id': '20624989'
        }
    ]
}, {
    name: 'unhost',
    data: ':tmi.twitch.tv HOSTTARGET #schmoopiie :- 0',
    expected: [
        '#schmoopiie',
        0
    ]
}, {
    name: 'unmod',
    data: ':jtv MODE #schmoopiie -o schmoopiie',
    expected: [
        '#schmoopiie',
        'schmoopiie'
    ]
}, {
    name: 'whisper',
    data: '@color=#FFFFFF;display-name=Schmoopiie;emotes=;turbo=1;user-type= :schmoopiie!schmoopiie@schmoopiie.tmi.twitch.tv WHISPER martinlarouche :Hello! ;-)',
    expected: [
        '#schmoopiie',
        {
            color: '#FFFFFF',
            'display-name': 'Schmoopiie',
            emotes: null,
            turbo: true,
            'user-type': null,
            'emotes-raw': null,
            username: 'schmoopiie',
            'message-type': 'whisper'
        },
        'Hello! ;-)',
        false
    ]
}];

describe('client events', function() {
    events.forEach(function(e) {
        var name = e.name;
        var data = e.data;
        var expected = e.expected;
        it(`emit ${name}`, function(cb) {
            var client = new tmi.client();

            client.on(name, function(...args) {
                'Reach this callback'.should.be.ok();
                expected && expected.forEach(function(data, index) {
                    // console.log({ a: args[index], data });
                    if(data === null) {
                        should.not.exist(args[index]);
                    }
                    else {
                        args[index].should.eql(data);
                    }
                });
                cb();
            });

            client._onMessage({data: data});
        });
    });

    it('emits disconnected', function(cb) {
        var client = new tmi.client();

        client.on("disconnected", function(reason) {
            reason.should.be.exactly("Connection closed.").and.be.a.String();
            cb();
        });

        client.log.error = function noop() {};
        client._onError();
    });
});
