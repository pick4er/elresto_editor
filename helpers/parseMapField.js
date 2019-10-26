
function parseMapField(mapField) {
  const preciseTag = mapField[0];
  const componentName = mapField[1];

  return { preciseTag, componentName };
}

export default parseMapField;
