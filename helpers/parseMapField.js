
function parseMapField(mapField) {
  const [preciseTag, children] = mapField;
  return { preciseTag, children };
}

export default parseMapField;
