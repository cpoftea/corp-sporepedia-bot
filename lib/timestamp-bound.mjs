import { writeFile } from 'fs/promises';
import { readFileSync } from 'fs';
import path from 'path';
import partial from 'ramda/src/partial.js';
import compose from 'ramda/src/compose.js';
import log from 'fancy-log';

const timestampFilePath = path.resolve(process.cwd(), 'timestamp.txt');

const writeTimestamp = partial(writeFile, [timestampFilePath]);

const validateTimestamp = compose(isNaN, Number);

const currentTimestampMs = () => Date.now();
const currentTimestampSec = compose(Math.floor, currentTimestampMs);

let timestamp = readFileSync(timestampFilePath, 'utf-8');

export const get = () => timestamp;

export const set = (value) => {
  timestamp = value;

  writeTimestamp(value.toString())
    .catch(log.error);
}

if (validateTimestamp(timestamp)) {
  set(currentTimestampSec());
}
