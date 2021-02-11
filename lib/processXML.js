function processValue({ string, i4 }) {
  if (string)
    return typeof string === 'string' ? string : '';

  if (i4)
    return Number(i4);
}

function processEntry({ name, value }) {
  return [ name, processValue(value) ];
}

export function processMember(member) {
  const entries = member.map(processEntry);
  const entry = Object.fromEntries(entries);

  return entry;
}
