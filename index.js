#!/usr/bin/env -S node

const TelegramBot = require('node-telegram-bot-api');
const config = require("./config.js");
const bot = new TelegramBot(config.TELE_TOKEN, {polling: true});

var ping = require('ping');

var astate=true;
var aoldstate=[];
var alosses=[];
var adownsent=[];

var state=true;
var oldstate=[];
var losses=[];

var startup=true;

bot.on('message', (msg) => {
	console.log("MSG:" + JSON.stringify(msg));

	if (msg.text.indexOf('/ping') === 0) {
		if (config.AllowedChats.includes(msg.chat.id)) {
			let targets=msg.text.split(' ');
			if (targets[1].indexOf('44') === 0) {
				pingo(targets[1],msg.chat.id);
			} else {
				bot.sendMessage(msg.chat.id, 'Alive checks ausserhalb HAMNet nicht unterstützt');
			}
		} else {
			bot.sendMessage(msg.chat.id, "Sorry "+msg.from.first_name+", keine Berechtigung vorhanden, bitte @DJ7NT anschreiben");
		}
	}
});

setInterval(autopingo, 10000);

function pingo(host,chatId) {
	ping.sys.probe(host, function(isAlive){
		state=isAlive;
		if ( (state != oldstate[host]) ) {
			oldstate[host]=state;
			var msg = '';
			if (isAlive) {
				msg=host + ' ist erreichbar ✅';
				losses[host]=0;
			} else {
				msg=host + ' ist nicht erreichbar ❌';
				losses[host]++;
			}
			if (startup) {
				startup=false;
			} else {
				bot.sendMessage(chatId,msg);
			}
			console.log(msg + ' Timeouts: '+losses[host]);
		}
	});
}

function autopingo(host = config.hostcheck,chatId = config.defaultChat) {
	ping.sys.probe(host, function(isAlive){
		astate=isAlive;
		if ( (astate != aoldstate[host]) || alosses[host]>0 ) {	// Alter Status weicht vom neuen ab ODER wir haben vorher ein LOSS gezaehlt
			aoldstate[host]=astate;		// Alten Status auf neuen setzen
			var msg = '';
			if (isAlive) {			// Anpingbar? Message vorbereiten und zähler auf 0
				msg=host + ' ist erreichbar ✅';
				alosses[host]=0;
			} else {			// Nicht erreichbar? Message vorbereiten und zähler inkrementieren
				msg=host + ' ist nicht erreichbar ❌';
				alosses[host]++;
			}
			if (startup) {			// Erster Start?
				startup=false;		// Ok, jetzt nicht mehr der erste Start
			} else {			// Und wenn es > erster Start ist dann:
				if ((alosses[host]>5) && (!(adownsent[host]))) {	// Zähler >5 UND noch nichts versendet?
					bot.sendMessage(chatId,msg);			// Versenden
					adownsent[host]=true;				// Und merken das was versendet wurde
				} else {
					if (isAlive && (adownsent[host])) {				// Downmeldung schon mal versendet UND wieder up?
						bot.sendMessage(chatId,msg);				// Versenden
						adownsent[host]=false;					// Und Down wieder auf nicht versendet setzen
					}
				}
			}
			console.log(msg + ' Timeouts: '+alosses[host]);
		}
	});
}
