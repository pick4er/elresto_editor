import api from 'api';

import parseMapField from 'helpers/parseMapField'

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
    } else if (children.length > 0) {
      // current tag is not needed, but there is children to look in for
      level += 1
      position[level] = 0
      const result = findElementInMap(children, requiredPreciseTag, position, level)
      if (result.isFound) {
        isFound = true
      } else if (result.isExhausted) {
        position[level] = null
        level -= 1
        position[level] += 1
      }
    } else if ((map.length - 1) > position[level]) {
      // current child is not we looked for, but there are some other leaves
      position[level] += 1
    } else if ((map.length - 1) === position[level]) {
      isExhausted = true
    }
  }

  return { isFound, isExhausted, position }
}

export default {
  async GET_SITE(context, { siteName }) {
    const { commit } = context

    const url = `site?name=${siteName}`
    const { data, components, map, status } = await api(url)

    if (status !== 'ok') {
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

    commit({
      type: 'UPDATE_MODE',
      mode: 'edit',
    })
    commit({
      type: 'UPDATE_SITE',
      map,
      data,
      components,
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

    if (direction === 'top') {

    } else if (direction === 'right') {

    } else if (direction === 'bottom') {

    } else if (direction === 'left') {

    }
  }
};
