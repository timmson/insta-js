const config = require('./config');
const log = require('log4js').getLogger();
const sleep = require('system-sleep');
const CronJob = require('cron').CronJob;
const Client = require('instagram-private-api').V1;

const device = new Client.Device(config.device);
const storage = new Client.CookieFileStorage('./' + config.tmpDir + '/storage.json');


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

config.promotion.forEach(promo => {
        log.info('Promotion[#' + promo.tag + ']: ' + promo.date);
        new CronJob({cronTime: promo.date, onTick: () => promotion(promo.tag), start: true});
    }
);

log.info('Demotion: ' + config.demotion.date);
new CronJob({cronTime: config.demotion.date, onTick: () => demotion(), start: true});


function promotion(hashTag) {
    Client.Session.create(device, storage, config.user, config.password)
        .then(session => {
            return [session, new Client.Feed.TaggedMedia(session, hashTag, 2).get()];
        })
        .spread((session, medias) =>
            medias.slice(0, config.limit).forEach(media => {
                    log.info('Follow and like ' + media.account._params.username);
                    Client.Like.create(session, media._params.id);
                    Client.Relationship.create(session, media.account._params.id);
                    sleep(config.delay);
                }
            )
        );
}

function demotion() {
    Client.Session.create(device, storage, config.user, config.password)
        .then(session => {
            return [session, new Client.Feed.AccountFollowing(session, config.userId, 10).get()]
        })
        .spread((session, accounts) =>
            accounts.slice(0, config.demotion.limit).forEach(account => {
                Client.Relationship.get(session, account._params.id)
                    .then(relationship => {
                        if (!relationship._params.followedBy) {
                            log.info('Unfollow ' + account._params.username);
                            Client.Relationship.destroy(session, account._params.id);
                            sleep(config.delay);
                        }
                    });
            })
        );
}