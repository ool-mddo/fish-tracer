export const state = () => ({
  nodes: [],
})

export const mutations = {
  setNodes (state, nodes) {
    state.nodes = nodes.sort((a, b) => a.localeCompare(b))
  },
}

export const actions = {
}

export const getters = {
  getNodes: (state) => state.nodes,
}
