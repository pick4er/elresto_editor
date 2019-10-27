
function parseMapField(mapField) {
  const preciseTag = mapField[0];
  const children = mapField[1];

  return { preciseTag, children };
}

export default parseMapField;
