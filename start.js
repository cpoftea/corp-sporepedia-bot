import * as timestampBound from './lib/timestamp-bound.js';
import * as Sporepedia from './lib/sporepedia.js';
import * as Discord from './lib/discord.js';
import { handleError } from './lib/error-handler.js';
import log from 'fancy-log';

const INTERVAL = process.env.INTERVAL || 60000;

const postponeNextJob = () => {
  log.info('Next job is postponed');
  setTimeout(req, INTERVAL);
}

function sortByDescTimestamp(entryA, entryB) {
  if (entryA.TIMESTAMP > entryB.TIMESTAMP)
    return -1;
  if (entryA.TIMESTAMP < entryB.TIMESTAMP)
    return 1;
  return 0;
}

function processCreations(responses) {
  let creations = [];

  for (const typedCreations of responses) {
    creations.push(...typedCreations);
  }

  creations.sort(sortByDescTimestamp);

  return creations;
}

function processResponses(results) {
  const promises = [];

  for (const { status, value } of results) {
    if (status === 'fulfilled')
      promises.push(Promise.resolve(value));
    else
      promises.push(Promise.reject(value));
  }

  return Promise.all(promises);
}

function tryAgain(error) {
  log.error(error);
  log.info('Trying again in a minute...');
  setTimeout(req, 60000);
}

async function sendCreationsToDiscord(creations) {
  if (!creations.length) {
    log.info('Nothing new');
    return;
  }

  log.info(`${creations.length} new creation${ creations.length > 1 ? 's' : '' }:`);

  timestampBound.set(creations[0].TIMESTAMP);

  await Discord.sendEntries(creations.reverse());
}

async function req() {
  const config = {
    timestampBound: timestampBound.get(),
    itemsPerPage: 50,
  }

  log.info('Sending requests...');
  log.info(`Current timestamp bound: ${config.timestampBound}`);

  await Promise
    .allSettled([
      Sporepedia.getCreatures(config),
      Sporepedia.getBuildings(config),
      Sporepedia.getVehiclesLand(config),
      Sporepedia.getVehiclesAir(config),
      Sporepedia.getVehiclesWater(config),
      Sporepedia.getVehiclesUfo(config),
      Sporepedia.getAdventures(config),
    ])
    .then(processResponses)
    .then(processCreations)
    .then(sendCreationsToDiscord)
    .then(postponeNextJob)
    .catch(tryAgain);
}

Discord.events.on(Discord.EVENT_SUCCESS, (entry) => {
  log.info(`${entry.TITLE} by ${entry.USER_NAME}`);
});

Discord.events.on(Discord.EVENT_ERROR, (error) => {
  log.error(error);
});

Sporepedia.events.on(Sporepedia.EVENT_SUCCESS, (response) => {
  log.info(`${response.status} ${response.statusText}: ${response.request.path}`);
});

Sporepedia.events.on(Sporepedia.EVENT_ERROR, (response) => {
  handleError(response);
});

log.info('Starting...');
req();

process.on('SIGINT', function() {
  process.exit(1);
});