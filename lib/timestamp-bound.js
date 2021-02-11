import fs from 'fs';
import path from 'path';

const fileName = 'timestamp.txt';
const filePath = path.resolve(process.cwd(), fileName);
let timestampBound = fs.readFileSync(filePath, 'utf-8');
let timestampStream = fs.createWriteStream(filePath);

if (!timestampBound) {
  set(Math.floor(Date.now() / 1000));
}

export function get() {
  return timestampBound;
}

export function set(value) {
  timestampBound = value;
  timestampStream.write(value.toString());
}

process.on('SIGINT', () => {
  timestampStream.end();
});
