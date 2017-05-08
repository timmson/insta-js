const config = require('./config');
const log = require('log4js').getLogger();
const CronJob = require('cron').CronJob;
const Client = require('instagram-private-api').V1;

const device = new Client.Device('someuser');
const storage = new Client.CookieFileStorage('./' + config.instagram.tmpDir + '/storage.json');

//getMedia();
new CronJob({cronTime: config.instagram.cron, onTick: getMedia, start: true});

log.info('Service for Instagram API has started');
log.info('Please press [CTRL + C] to stop');

process.on('SIGINT', () => {
    log.info('Service for Instagram API has stopped');
    process.exit(0);
});

process.on('SIGTERM', () => {
    log.info('Service for Instagram API has stopped');
    process.exit(0);
});


function getMedia() {

}
