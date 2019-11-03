import api from 'api';

import parseMapField from 'helpers/parseMapField'
import parseComponentField from 'helpers/parseComponentField'
import parsePreciseTag from 'helpers/parsePreciseTag'

const CHILDREN_INDEX = 1
const SYSTEM_GRID_COMMON_TAG_NAME = 'system-grid'

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
  let isFound = false
  let isExhausted = false
  while (!isFound && !isExhausted) {
    debugger
    const { preciseTag, children = [] } = parseMapField(map[position[level]])
    debugger
    if (preciseTag === requiredPreciseTag) {
      // if current tag is the one we looked for
      debugger
      isFound = true
      break
    } else if (children.length > 0) {
      // current tag is not needed, but there are children to look in for
      debugger
      level += 1
      position[level] = 0
      debugger
      const result = findElementInMap(children, requiredPreciseTag, position, level)
      debugger
      if (result.isFound) {
        debugger
        isFound = true
        break
      } else if (result.isExhausted) {
        debugger
        position[level] = null
        level -= 1
      }
    } 

    if ((map.length - 1) > position[level]) {
      // current child is not we looked for, but there are some other leaves
      debugger
      position[level] += 1
    } else if ((map.length - 1) === position[level]) {
      debugger
      isExhausted = true
    }
  }

  debugger
  return { isFound, isExhausted, position }
}

function getComponentParentPosition(componentPosition) {
  const componentLevel = componentPosition.length
  debugger;
  // we need to get a parent position, which level is higher
  return componentPosition.slice(0, componentLevel - 1)
}

function sanitizePosition(position) {
  const sanitizedPosition = []

  for (let i = 0; i < position.length; i++) {
    if (typeof position[i] === 'number') {
      sanitizedPosition.push(position[i])
    }
  }

  return sanitizedPosition
}

function isGridComponent(map, position) {
  let mapField = map
  for (let level = 0; level < position.length; level += 1) {
    mapField = mapField[position[level]]
  }

  const { preciseTag = '' } = parseMapField(mapField)
  const { commonTagName } = parsePreciseTag(preciseTag)

  return commonTagName === SYSTEM_GRID_COMMON_TAG_NAME
}

function wrapMapFieldInGrid(mapField, components) {
  const positionIndex = findComponentPositionIndexInComponents(components, SYSTEM_GRID_COMMON_TAG_NAME)
  const { componentIndex } = parseComponentField(components[positionIndex])

  const nextComponentIndex = componentIndex + 1
  const preciseTagName = `${SYSTEM_GRID_COMMON_TAG_NAME}_${nextComponentIndex}`

  updateComponentIndex(components, positionIndex, nextComponentIndex)
  const wrappedMapField = [preciseTagName, [mapField]]

  return wrappedMapField
}

function wrapInGridAndUpdatePosition(map, components, data, parentPosition, position) {
  debugger
  let parentMapField = map
  for (let level = 0; level < parentPosition.length; level += 1) {
    parentMapField = map[parentPosition[level]]
  }
  const { children: parentFieldChildren } = parseMapField(parentMapField)

  debugger
  let mapField = map
  for (let level = 0; level < position.length; level += 1) {
    mapField = mapField[position[level]]
  }

  debugger
  const fieldIndexInMap = position[position.length - 1]
  debugger
  const fieldInGrid = wrapMapFieldInGrid(mapField, components)
  debugger
  parentFieldChildren.splice(fieldIndexInMap, 1, fieldInGrid)

  // update position
  debugger
  position.splice(position.length - 1, 0, 0, 1)
}

function addChildrenIndexesToPosition(position) {
  const positionWithChildIndexes = []
  // the last is tag itself
  for (let i = 0; i < position.length; i += 1) {
    positionWithChildIndexes.push(position[i])
    if (i < (position.length - 1)) {
      positionWithChildIndexes.push(CHILDREN_INDEX)
    }
  }

  return positionWithChildIndexes
}

function findComponentPositionIndexInComponents(components, commonTagName) {
  for (let i = 0; i < components.length; i += 1) {
    const { tagName, componentIndex } = parseComponentField(components[i])
    if (commonTagName === tagName) {
      return i
    }
  }

  return null  
}

function updateComponentIndex(components, componentPositionIndex, nextComponentIndex) {
  components[componentPositionIndex][2] = nextComponentIndex
}

function updateComponentData(data, preciseTag, componentData) {
  data[preciseTag] = { ...componentData }
}

function insertIntoMapWithPreparedPosition(direction, map, components, data, position, i = 0) {
  if (i < (position.length - 1)) {
    insertIntoMapWithPreparedPosition(direction, map[position[i]], components, data, position, i += 1)
  } else {
    const componentPositionIndex = findComponentPositionIndexInComponents(components, 'base-block')
    const { componentIndex } = parseComponentField(components[componentPositionIndex])

    const nextComponentIndex = componentIndex + 1
    const nextPreciseTagName = `base-block_${nextComponentIndex}`
    const nextComponentData = {
      "props": {
        "index": nextComponentIndex
      }
    }

    updateComponentData(data, nextPreciseTagName, nextComponentData)
    updateComponentIndex(components, componentPositionIndex, nextComponentIndex)
    map.splice(position[i] + 1, 0, [nextPreciseTagName])
  }
}

export default {
  async GET_SITE(context, { siteName }) {
    const { commit } = context

    const url = `site?name=${siteName}`
    const { data, components, map, status } = await api(url)

    if (status === 'error') {
      commit({
        type: 'UPDATE_MODE',
        mode: 'create',
      })
      commit({
        type: 'UPDATE_SITE',
        map: [],
        data: {},
        components: [],
      })

      return
    }

    if (status === 'ok') {
      commit({
        type: 'UPDATE_MODE',
        mode: 'edit',
      })
    }

    if (status === 'new') {
      commit({
        type: 'UPDATE_MODE',
        mode: 'create',
      })
    }

    commit({
      type: 'UPDATE_SITE',
      map,
      data,
      components,
    })
  },

  async SAVE_SITE(context, { siteName }) {
    const { state: { map, data, components, mode }, commit } = context

    let url
    if (mode === 'create') {
      url = 'add_site'
    } else if (mode === 'edit') {
      url = 'update_site'
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
      }
    })

    commit({
      type: 'UPDATE_MODE',
      mode: 'edit',
    })
  },

  ADD_BLOCK(context, { direction, preciseTag }) {
    const { 
      commit,
      state: {
        map,
        data,
        components,
      }
    } = context

    const { position } = findElementInMap(map, preciseTag)

    const sanitizedPosition = sanitizePosition(position)
    const preparedPosition = addChildrenIndexesToPosition(sanitizedPosition)

    const clonedMap = JSON.parse(JSON.stringify(map))
    const clonedComponents = JSON.parse(JSON.stringify(components))
    const clonedData = JSON.parse(JSON.stringify(data))

    debugger;
    const parentPosition = getComponentParentPosition(sanitizedPosition)
    const preparedParentPosition = addChildrenIndexesToPosition(parentPosition)
    debugger;
    const isGrid = isGridComponent(map, preparedParentPosition)
    if (!isGrid) {
      debugger
      wrapInGridAndUpdatePosition(clonedMap, clonedComponents, clonedData, preparedParentPosition, preparedPosition)
      debugger
    }

    insertIntoMapWithPreparedPosition(direction, clonedMap, clonedComponents, clonedData, preparedPosition)

    commit({
      type: 'UPDATE_SITE',
      map: clonedMap,
      data: clonedData,
      components: clonedComponents,
    })
  }
};
