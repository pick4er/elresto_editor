import api from 'api';

import parseMapField from 'helpers/parseMapField';
import parseComponentField from 'helpers/parseComponentField';
import parsePreciseTag from 'helpers/parsePreciseTag';

const CHILDREN_INDEX = 1;
const SYSTEM_GRID_COMMON_TAG_NAME = 'system-grid';

function findElementInMap(map, requiredPreciseTag, position = [0], level = 0) {
  let isFound = false;
  let isExhausted = false;
  while (!isFound && !isExhausted) {
    const { preciseTag, children = [] } = parseMapField(map[position[level]]);
    if (preciseTag === requiredPreciseTag) {
      // if current tag is the one we looked for
      isFound = true;
      break;
    } else if (children.length > 0) {
      // current tag is not needed, but there are children to look in for
      level += 1;
      position[level] = 0;
      const result = findElementInMap(children, requiredPreciseTag, position, level);
      if (result.isFound) {
        isFound = true;
        break;
      } else if (result.isExhausted) {
        position[level] = null;
        level -= 1;
      }
    }

    if ((map.length - 1) > position[level]) {
      // current child is not the one we looked for, but there are some other leaves too
      position[level] += 1;
    } else if ((map.length - 1) === position[level]) {
      isExhausted = true;
    }
  }

  return { isFound, isExhausted, position };
}

function getComponentParentPosition(componentPosition) {
  const componentLevel = componentPosition.length;
  // we need to get a parent position, which level is higher
  return componentPosition.slice(0, componentLevel - 1);
}

function sanitizePosition(position) {
  const sanitizedPosition = [];

  for (let i = 0; i < position.length; i++) {
    if (typeof position[i] === 'number') {
      sanitizedPosition.push(position[i]);
    }
  }

  return sanitizedPosition;
}

function getMapFieldOnPosition(map, position) {
  let mapField = map;

  for (let level = 0; level < position.length; level += 1) {
    mapField = mapField[position[level]];
  }  

  return mapField
}

function getCommonTagNameByMapField(mapField) {
  const { preciseTag } = parseMapField(mapField)
  const { commonTagName } = parsePreciseTag(preciseTag)

  return commonTagName
}

function isGridComponent(map, preciseTag) {
  const { parentPosition } = getPositionsByPreciseTag(map, preciseTag)
  const mapField = getMapFieldOnPosition(map, parentPosition)
  const commonTagName = getCommonTagNameByMapField(mapField)

  return commonTagName === SYSTEM_GRID_COMMON_TAG_NAME;
}

function wrapMapFieldInGrid(mapField, components, data) {
  // add grid child properties to component's data
  const { preciseTag: componentPreciseTag } = parseMapField(mapField);
  const currentComponentData = data[componentPreciseTag];
  const nextComponentData = {
    ...currentComponentData,
    style: {
      ...currentComponentData.style,
      'grid-row': 1,
      'grid-column': 1,
    },
  };
  updateComponentData(data, componentPreciseTag, nextComponentData);

  const gridComponentIndex = findComponentIndex(components, SYSTEM_GRID_COMMON_TAG_NAME);
  // create grid component
  const nextComponentIndex = gridComponentIndex + 1;
  const preciseTagName = `${SYSTEM_GRID_COMMON_TAG_NAME}_${nextComponentIndex}`;
  const nextGridComponentData = {
    props: {
      rows: 1,
      columns: 1,
    },
  };
  updateComponentData(data, preciseTagName, nextGridComponentData);
  updateComponentIndex(components, positionIndex, nextComponentIndex);

  // wrap it finally
  const wrappedMapField = [preciseTagName, [mapField]];
  return wrappedMapField;
}

function wrapInGrid(map, components, data, preciseTag) {
  const { position, parentPosition } = getPositionsByPreciseTag(clonedMap, preciseTag)

  const parentMapField = getMapFieldOnPosition(map, parentPosition)
  const { children: parentFieldChildren } = parseMapField(parentMapField);

  const mapField = getMapFieldOnPosition(map, position)
  const fieldInGrid = wrapMapFieldInGrid(mapField, components, data);

  // every preciseTag in map is someone's child
  parentFieldChildren.splice(position[position.length - 1], 1, fieldInGrid);
}

function addChildrenIndexesToPosition(position) {
  const positionWithChildIndexes = [];
  // the last is tag itself
  for (let i = 0; i < position.length; i += 1) {
    positionWithChildIndexes.push(position[i]);
    if (i < (position.length - 1)) {
      positionWithChildIndexes.push(CHILDREN_INDEX);
    }
  }

  return positionWithChildIndexes;
}

function findComponentPositionIndexInComponents(components, commonTagName) {
  for (let i = 0; i < components.length; i += 1) {
    const { tagName, componentIndex } = parseComponentField(components[i]);
    if (commonTagName === tagName) {
      return i;
    }
  }

  return null;
}

function findComponentIndex(components, commonTagName) {
  const positionIndex = findComponentPositionIndexInComponents(components, commonTagName)
  const { componentIndex } = parseComponentField(components[positionIndex])

  return componentIndex
}

function updateComponentIndex(components, componentPositionIndex, nextComponentIndex) {
  components[componentPositionIndex][2] = nextComponentIndex;
}

function updateComponentData(data, preciseTag, componentData) {
  data[preciseTag] = { ...componentData };
}

function getGridRowsAndColumns(data, preciseGridTag) {
  const { props: { rows, columns } } = data[preciseGridTag];
  return { rows, columns };
}

function getComponentRowAndColumn(data, preciseTag) {
  const { style } = data[preciseTag];
  const row = style['grid-row'];
  const column = style['grid-column'];
  return { row, column };
}

function updateGridRowsAndColumns(data, preciseGridTag, gridChildren) {
  const { maxColumn, maxRow } = getMaxColumnAndRow(data, gridChildren)

  const currentGridData = data[preciseGridTag];
  const nextGridData = {
    ...currentGridData,
    props: {
      ...currentGridData.props,
      rows: maxRow,
      columns: maxColumn,
    },
  };

  updateComponentData(data, preciseGridTag, nextGridData);
}

function defineByCoordsIsPositionBusy(data, children, row, column) {
  let isBusy = false
  for (let i = 0; i < children.length; i += 1) {
    const childMapField = children[i]
    const { preciseTag } = parseMapField(childMapField)
    const { row: currentRow, column: currentColumn } = getComponentRowAndColumn(data, preciseTag)

    if (currentRow === row && currentColumn === column) {
      isBusy = true
      break
    }
  }

  return isBusy
}

function getMaxColumnAndRow(data, children) {
  let maxRow = 0
  let maxColumn = 0
  for (let i = 0; i < children.length; i += 1) {
    const childMapField = children[i]
    const { preciseTag } = parseMapField(childMapField)
    const { row: currentRow, column: currentColumn } = getComponentRowAndColumn(data, preciseTag)

    if (currentRow > maxRow) {
      maxRow = currentRow
    }

    if (currentColumn > maxColumn) {
      maxColumn = currentColumn
    }
  }

  return { maxRow, maxColumn }
}

function shiftGridComponentsPositions(direction, data, gridChildren, newComponentRow, newComponentColumn) {
  const isPositionBusy = defineByCoordsIsPositionBusy(data, gridChildren, newComponentRow, newComponentColumn);
  if (!isPositionBusy) {
    return
  }

  for (let i = 0; i < gridChildren.length; i++) {
    const childMapField = gridChildren[i];
    const { preciseTag } = parseMapField(childMapField);
    const { row, column } = getComponentRowAndColumn(data, preciseTag);

    let nextRow = row;
    let nextColumn = column;
    if ((direction === 'top' || direction === 'bottom') && row >= newComponentRow) {
      nextRow += 1;
    } else if ((direction === 'left' || direction === 'right') && column >= newComponentColumn) {
      nextColumn += 1;
    }

    const currentData = data[preciseTag];
    const nextData = {
      ...currentData,
      style: {
        ...currentData.style,
        'grid-row': nextRow,
        'grid-column': nextColumn,
      },
    };

    updateComponentData(data, preciseTag, nextData);
  }
}

function createBlockRowAndColumnByDirection(direction, centerRow, centerColumn) {
  let row;
  let column;
  if (direction === 'top') {
    column = centerColumn;
    row = centerRow - 1;
  } else if (direction === 'right') {
    row = centerRow;
    column = centerColumn + 1;
  } else if (direction === 'bottom') {
    row = centerRow + 1;
    column = centerColumn;
  } else if (direction === 'left') {
    column = centerColumn - 1;
    row = centerRow;
  }

  // keep it in the grid boundaries
  if (row < 1) row = 1
  if (column < 1) column = 1

  return { row, column };
}

function insertIntoMap(direction, map, components, data, preciseTag) {
  const { position, parentPosition } = getPositionsByPreciseTag(map, preciseTag)

  const gridMapField = getMapFieldOnPosition(map, parentPosition)
  const { preciseTag: preciseGridTag, children: gridChildren } = parseMapField(gridMapField);

  const { row: centerRow, column: centerColumn } = getComponentRowAndColumn(data, preciseTag);
  const { row: newComponentRow, column: newComponentColumn } = createBlockRowAndColumnByDirection(direction, centerRow, centerColumn);
  shiftGridComponentsPositions(direction, data, gridChildren, newComponentRow, newComponentColumn);
  updateGridRowsAndColumns(data, preciseGridTag, gridChildren);

  // create new component block
  const componentPositionIndex = findComponentPositionIndexInComponents(components, 'base-block')
  const { componentIndex } = parseComponentField(components[componentPositionIndex])

  const newComponentIndex = componentIndex + 1;
  const newPreciseTag = `base-block_${newComponentIndex}`;
  const newComponentData = {
    props: {
      index: newComponentIndex,
    },
    style: {
      'grid-row': newComponentRow,
      'grid-column': newComponentColumn,
    },
  };

  updateComponentData(data, newPreciseTag, newComponentData);
  updateComponentIndex(components, componentPositionIndex, newComponentIndex);

  gridChildren.splice(position[position.length - 1] + 1, 0, [newPreciseTag]);
}

function getPositionsByPreciseTag(map, preciseTag) {
  const { position } = findElementInMap(map, preciseTag);

  const sanitizedPosition = sanitizePosition(position);
  const preparedPosition = addChildrenIndexesToPosition(sanitizedPosition);
  const preparedParentPosition = addChildrenIndexesToPosition(getComponentParentPosition(sanitizedPosition));

  return { position: preparedPosition, parentPosition: preparedParentPosition }
}

function deepCloneSiteFields(state) {
  const { map: rawMap, components: rawComponents, data: rawData } = state

  const map = JSON.parse(JSON.stringify(rawMap));
  const components = JSON.parse(JSON.stringify(rawComponents));
  const data = JSON.parse(JSON.stringify(rawData));

  return { map, components, data }
}

export default {
  async GET_SITE(context, { siteName }) {
    const { commit } = context;

    const url = `site?name=${siteName}`;
    const { data, components, map, status } = await api(url);

    if (status === 'error') {
      commit({
        type: 'UPDATE_MODE',
        mode: 'create',
      });
      commit({
        type: 'UPDATE_SITE',
        map: [],
        data: {},
        components: [],
      });

      return;
    }

    if (status === 'ok') {
      commit({
        type: 'UPDATE_MODE',
        mode: 'edit',
      });
    }

    if (status === 'new') {
      commit({
        type: 'UPDATE_MODE',
        mode: 'create',
      });
    }

    commit({
      type: 'UPDATE_SITE',
      map,
      data,
      components,
    });
  },

  async SAVE_SITE(context, { siteName }) {
    const { state: { map, data, components, mode }, commit } = context;

    let url;
    if (mode === 'create') {
      url = 'add_site';
    } else if (mode === 'edit') {
      url = 'update_site';
    }

    const response = await api(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        siteName,
        map,
        data,
        components,
      },
    });

    commit({
      type: 'UPDATE_MODE',
      mode: 'edit',
    });
  },

  ADD_BLOCK({ commit, state }, { direction, preciseTag }) {
    const { map, components, data } = deepCloneSiteFields(state)

    if (!isGridComponent(map, preciseTag)) {
      // grid allows to position elements on each side of preciseTag
      wrapInGrid(map, components, data, preciseTag);
    }

    insertIntoMap(direction, map, components, data, preciseTag);

    commit({
      type: 'UPDATE_SITE',
      map,
      data,
      components,
    });
  },
};
