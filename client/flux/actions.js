import api from 'api';

import parseMapField from 'helpers/parseMapField'
import parseComponentField from 'helpers/parseComponentField'

const CHILDREN_INDEX = 1

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
    const { preciseTag, children = [] } = parseMapField(map[position[level]])
    if (preciseTag === requiredPreciseTag) {
      // if current tag is the one we looked for
      isFound = true
      break
    } else if (children.length > 0) {
      // current tag is not needed, but there are children to look in for
      level += 1
      position[level] = 0
      const result = findElementInMap(children, requiredPreciseTag, position, level)
      if (result.isFound) {
        isFound = true
        break
      } else if (result.isExhausted) {
        position[level] = null
        level -= 1
      }
    } 

    if ((map.length - 1) > position[level]) {
      // current child is not we looked for, but there are some other leaves
      position[level] += 1
    } else if ((map.length - 1) === position[level]) {
      isExhausted = true
    }
  }

  return { isFound, isExhausted, position }
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

function inserIntoMapWithPosition(map, components, data, position, i = 0) {
  if (i < (position.length - 1)) {
    inserIntoMapWithPosition(map[position[i]], components, data, position, i += 1)
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
    map.splice(map[position[i]] + 1, 0, [nextPreciseTagName])
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
    const { state: { map, data, components, mode } } = context

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
    const preparedPosition = addChildrenIndexesToPosition(sanitizePosition(position))
    const clonedMap = JSON.parse(JSON.stringify(map))
    const clonedComponents = JSON.parse(JSON.stringify(components))
    const clonedData = JSON.parse(JSON.stringify(data))
    inserIntoMapWithPosition(clonedMap, clonedComponents, clonedData, preparedPosition)

    commit({
      type: 'UPDATE_SITE',
      map: clonedMap,
      data: clonedData,
      components: clonedComponents,
    })
  }
};
