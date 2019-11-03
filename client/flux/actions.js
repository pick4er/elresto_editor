import api from 'api';

import parseMapField from 'helpers/parseMapField';
import parseComponentField from 'helpers/parseComponentField';
import parsePreciseTag from 'helpers/parsePreciseTag';

const CHILDREN_INDEX = 1;
const SYSTEM_GRID_COMMON_TAG_NAME = 'system-grid';

/*
  "map": [
    [
      "base-block_1", [
        ["base-block_2", [["base-button_2"], ["base-block_3"]]],
        ["base-button_3"]
      ]
    ],
    ["base-button_1"]
  ],
*/

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
      // current child is not we looked for, but there are some other leaves
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

function isGridComponent(map, position) {
  let mapField = map;
  for (let level = 0; level < position.length; level += 1) {
    mapField = mapField[position[level]];
  }

  const { preciseTag = '' } = parseMapField(mapField);
  const { commonTagName } = parsePreciseTag(preciseTag);

  return commonTagName === SYSTEM_GRID_COMMON_TAG_NAME;
}

function wrapMapFieldInGrid(mapField, components, data) {
  const positionIndex = findComponentPositionIndexInComponents(components, SYSTEM_GRID_COMMON_TAG_NAME);
  const { componentIndex } = parseComponentField(components[positionIndex]);

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

  const nextComponentIndex = componentIndex + 1;
  const preciseTagName = `${SYSTEM_GRID_COMMON_TAG_NAME}_${nextComponentIndex}`;
  const nextGridComponentData = {
    props: {
      rows: 1,
      columns: 1,
    },
  };
  updateComponentIndex(components, positionIndex, nextComponentIndex);
  updateComponentData(data, preciseTagName, nextGridComponentData);
  const wrappedMapField = [preciseTagName, [mapField]];

  return wrappedMapField;
}

function wrapInGridAndUpdatePosition(map, components, data, parentPosition, position) {
  let parentMapField = map;
  for (let level = 0; level < parentPosition.length; level += 1) {
    parentMapField = parentMapField[parentPosition[level]];
  }
  const { children: parentFieldChildren } = parseMapField(parentMapField);

  let mapField = map;
  for (let level = 0; level < position.length; level += 1) {
    mapField = mapField[position[level]];
  }

  const fieldIndexInMap = position[position.length - 1];
  const fieldInGrid = wrapMapFieldInGrid(mapField, components, data);
  parentFieldChildren.splice(fieldIndexInMap, 1, fieldInGrid);

  // update positions
  position.splice(position.length - 1, 0, 0, 1);
  parentPosition.push(1, 0);
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

function updateGridRowsAndColumns(direction, data, preciseGridTag) {
  const { rows: currentRows, columns: currentColumns } = getGridRowsAndColumns(data, preciseGridTag);

  let nextRows = currentRows;
  let nextColumns = currentColumns;

  if (direction === 'left' || direction === 'right') {
    nextColumns += 1;
  } else if (direction === 'top' || direction === 'bottom') {
    nextRows += 1;
  }

  const currentGridData = data[preciseGridTag];
  const nextGridData = {
    ...currentGridData,
    props: {
      ...currentGridData.props,
      rows: nextRows,
      columns: nextColumns,
    },
  };

  updateComponentData(data, preciseGridTag, nextGridData);
}

function shiftGridComponentsPositions(direction, data, gridChildren) {
  for (let i = 0; i < gridChildren.length; i++) {
    const childMapField = gridChildren[i];
    const { preciseTag } = parseMapField(childMapField);
    const { row, column } = getComponentRowAndColumn(data, preciseTag);

    let nextRow = row;
    let nextColumn = column;
    if (direction === 'top') {
      nextRow += 1;
    } else if (direction === 'left') {
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

function createBlockRowAndColumnByDirection(direction, gridRows, gridColumns, centerRow, centerColumn) {
  let row;
  let column;
  if (direction === 'top') {
    column = centerColumn;
    row = 1;
  } else if (direction === 'right') {
    row = centerRow;
    column = gridColumns + 1;
  } else if (direction === 'bottom') {
    row = gridRows + 1;
    column = centerColumn;
  } else if (direction === 'left') {
    column = 1;
    row = centerRow;
  }

  return { row, column };
}

function insertIntoMapWithPreparedPosition(direction, map, components, data, parentPosition, position) {
  let gridMapField = map;
  for (let i = 0; i < parentPosition.length; i += 1) {
    gridMapField = gridMapField[parentPosition[i]];
  }

  let mapField = map;
  for (let i = 0; i < position.length; i += 1) {
    mapField = mapField[position[i]];
  }

  const componentPositionIndex = findComponentPositionIndexInComponents(components, 'base-block');
  const { componentIndex } = parseComponentField(components[componentPositionIndex]);

  const { preciseTag } = parseMapField(mapField);
  const { preciseTag: preciseGridTag, children: gridChildren } = parseMapField(gridMapField);

  const { row: centerRow, column: centerColumn } = getComponentRowAndColumn(data, preciseTag);
  const { rows: gridRows, columns: gridColumns } = getGridRowsAndColumns(data, preciseGridTag);

  const { row: newComponentRow, column: newComponentColumn } = createBlockRowAndColumnByDirection(direction, gridRows, gridColumns, centerRow, centerColumn);
  updateGridRowsAndColumns(direction, data, preciseGridTag);
  shiftGridComponentsPositions(direction, data, gridChildren);

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

  const lastPositionLevel = position.length - 1;
  gridChildren.splice(position[lastPositionLevel] + 1, 0, [newPreciseTag]);
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

  ADD_BLOCK(context, { direction, preciseTag }) {
    const {
      commit,
      state: {
        map,
        data,
        components,
      },
    } = context;

    const { position } = findElementInMap(map, preciseTag);

    const sanitizedPosition = sanitizePosition(position);
    const preparedPosition = addChildrenIndexesToPosition(sanitizedPosition);

    const clonedMap = JSON.parse(JSON.stringify(map));
    const clonedComponents = JSON.parse(JSON.stringify(components));
    const clonedData = JSON.parse(JSON.stringify(data));

    const parentPosition = getComponentParentPosition(sanitizedPosition);
    const preparedParentPosition = addChildrenIndexesToPosition(parentPosition);
    const isGrid = isGridComponent(map, preparedParentPosition);
    if (!isGrid) {
      wrapInGridAndUpdatePosition(clonedMap, clonedComponents, clonedData, preparedParentPosition, preparedPosition);
    }

    insertIntoMapWithPreparedPosition(direction, clonedMap, clonedComponents, clonedData, preparedParentPosition, preparedPosition);

    commit({
      type: 'UPDATE_SITE',
      map: clonedMap,
      data: clonedData,
      components: clonedComponents,
    });
  },
};
