import { EventEmitter } from 'events';
import { MessageEmbed, WebhookClient } from 'discord.js';
import { resolve } from './url-resolve.mjs';
import { getUserAvatar } from './user-avatar.mjs';
import bind from 'ramda/src/bind.js';
import partial from 'ramda/src/partial.js';
import compose from 'ramda/src/compose.js';
import { webhookUrl, server } from './config.mjs';
import he from 'he';
const { decode } = he;

// uCoz encodes twice sometimes
const decodeTwice = compose(decode, decode);

export const events = new EventEmitter();
export const EVENT_SUCCESS = 'success';
export const EVENT_ERROR = 'error';
const emit = bind(events.emit, events);
const emitSuccess = partial(emit, [EVENT_SUCCESS]);
const emitError = partial(emit, [EVENT_ERROR]);

const hook = new WebhookClient({ url: webhookUrl });

async function createEmbedFromEntry(entry) {
  const {
    TITLE: title,
    USER_NAME: authorName,
  } = entry;

  const entryURL = resolve(server, entry.ENTRY_URL);
  const authorURL = resolve(server, `/index/8-${entry.USER_ID}`);
  const authorImageURL = await getUserAvatar(entry.USER_ID);
  const thumbnailURL = resolve(server, entry.PHOTO_URL);
  const description = decodeTwice(entry.MESSAGE).replace(/<br[\s/]*>/g, '\n');

  return new MessageEmbed({
    thumbnail: {
      width: 128,
      height: 128,
    },
  })
    .setTitle(title)
    .setURL(entryURL)
    .setAuthor(authorName, authorImageURL, authorURL)
    .setDescription(description)
    .setThumbnail(thumbnailURL);
}

export async function sendEntry(entry) {
  const embed = await createEmbedFromEntry(entry);
  const data = {
    content: ':new:',
    embeds: [embed],
  }

  const promise = hook.send(data);

  promise
    .then(() => emitSuccess(entry))
    .catch(emitError);

  return promise;
}

export async function sendEntries(entries) {
  const entry = entries.shift();

  await sendEntry(entry);

  if (entries.length > 0)
    return sendEntries(entries);
}
