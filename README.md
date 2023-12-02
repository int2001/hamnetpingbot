# hamnetpingbot
Bot which checks if HamNet-Host is alive

## Purpose
* Script will check if a host is alive. If it isn't for more than 5 times it'll post a message to a defined Telegram-Channel.
* If Host is back, it'll post that
* Interaction is possible, too: simply text (in an allowed Channel - see config.js) the command `/ping [hostname]`

It's the first version. Checking is allowed to hamnet-IPs (starting with 44.). Yes i know, a netmask would be nicer - in a future version...

## SetUp:

```
git clone https://github.com/int2001/hamnetpingbot.git
cd hamnetpingbot
npm install
```
now rename `config.sample.js` to config.js
Edit config.js and fill in Telegram-Token, Check-IP and so on.
Launch via `node ./index.js` or with your favourite starter like `pm2`

### Hints:
* Telegram-Token HowTo: https://www.siteguarding.com/en/how-to-get-telegram-bot-api-token
* ChatIDs are displayed, whenever somebbody texts to the bot (See console - json-payload)
* bot needs to be set to "Group Privacy == off" (todo at botFather - SetUp)
