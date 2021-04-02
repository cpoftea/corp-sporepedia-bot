import { convert } from 'xmlbuilder2';
import partial from 'ramda/src/partial';
import partialRight from 'ramda/src/partialRight';
import path from 'ramda/src/path';
import map from 'ramda/src/map';
import compose from 'ramda/src/compose';

function processValue({ string, i4 }) {
  if (string)
    return typeof string === 'string' ? string : '';

  if (i4)
    return Number(i4);
}

function processEntry({ name, value }) {
  return [ name, processValue(value) ];
}

function processMember(member) {
  const entries = member.map(processEntry);
  const entry = Object.fromEntries(entries);

  return entry;
}

const structArrayPath = [
  'methodResponse',
  'params',
  'param',
  'value',
  'array',
  'data',
  'value',
];

const memberPath = [
  'struct',
  'member',
];

const convertConfig = { format: 'object' }

const xmlToObject = partialRight(convert, [convertConfig]);
const structArray = partial(path, [structArrayPath]);
const member = partial(path, [memberPath]);
const entry = compose(processMember, member);
const entries = partial(map, [entry]);
export const getEntries = compose(
  entries,
  structArray,
  xmlToObject,
);
