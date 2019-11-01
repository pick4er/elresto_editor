
function parseComponentField(componentField) {
  const [tagName, componentName, componentIndex] = componentField;
  return { tagName, componentName, componentIndex };
}

export default parseComponentField;
