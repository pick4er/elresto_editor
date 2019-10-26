import uniqby from 'lodash.uniqby';

import parsePreciseTag from 'helpers/parsePreciseTag'
import parseMapField from 'helpers/parseMapField'

function getComponentsFromMap(map) {
  const uniqMapFields = uniqby(
    map,
    mapField => parseMapField(mapField || []).componentName,
  );

  const components = [];
  for (let i = 0; i < uniqMapFields.length; i += 1) {
    const { preciseTag, componentName } = parseMapField(uniqMapFields[i]);
    const { commonTagName } = parsePreciseTag(preciseTag);

    components.push([commonTagName, componentName]);
  }

  return components;
}

export default getComponentsFromMap;
