import { EventEmitter } from 'events';
import { MessageEmbed, WebhookClient } from 'discord.js';
import url from 'url';
import { getUserAvatar } from './user-avatar';
import { decode } from 'he';

export const EVENT_SUCCESS = 'success';
export const EVENT_ERROR = 'error';

const {
  WEBHOOK_ID: webhookId,
  WEBHOOK_TOKEN: webhookToken,
  SERVER: server,
} = process.env;

export const events = new EventEmitter();
const hook = new WebhookClient(webhookId, webhookToken);

async function createEmbedFromEntry(entry) {
  const {
    TITLE: title,
    USER_NAME: authorName,
  } = entry;

  const entryURL = url.resolve(server, entry.ENTRY_URL);
  const authorURL = url.resolve(server, `/index/8-${entry.USER_ID}`);
  const authorImageURL = await getUserAvatar(entry.USER_ID);
  const thumbnailURL = url.resolve(server, entry.PHOTO_URL);
  const description = decode(decode(entry.MESSAGE)).replace(/<br[\s/]*>/g, '\n');

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

/**
 * Sends an array of entries to discord server
 */
export async function sendEntries(entries) {
  for (const entry of entries) {
    let success;
    const embed = await createEmbedFromEntry(entry);
    const data = {
      content: ':new:',
      embeds: [embed],
    }

    do {
      try {
        const response = await hook.send('Test', data);

        success = true;
        events.emit(EVENT_SUCCESS, entry);
      } catch (error) {
        events.emit(EVENT_ERROR, error);
      }
    } while (success !== true)
  }
}
