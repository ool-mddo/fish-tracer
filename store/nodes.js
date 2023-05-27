export const state = () => ({
  nodes: [],
  nodes_cache: {},
})

export const mutations = {
  setNodes(state, { network, snapshot, nodes }) {
    if (!(network in state.nodes_cache)) {
      state.nodes_cache[network] = {}
    }
    state.nodes_cache[network][snapshot] = nodes.sort((a, b) => a.localeCompare(b))
    state.nodes = state.nodes_cache[network][snapshot]
  },
  setNodesFromCache(state, { network, snapshot }) {
    state.nodes = state.nodes_cache[network][snapshot]
  },
}

export const actions = {
  async changeSnapshot({ commit, state }, { network, snapshot }) {
    if (!(network in state.nodes_cache && snapshot in state.nodes_cache[network])) {
      const nodes = await this.$axios.$get(`/batfish/${network}/${snapshot}/nodes`)
      commit("setNodes", { network, snapshot, nodes })
    } else {
      commit("setNodesFromCache", { network, snapshot })
    }
  },
}

export const getters = {
  getNodes: (state) => state.nodes,
  getNetworkSnapshotNodes: (state) => (network, snapshot) => {
    if (!(network in state.nodes_cache) || !(snapshot in state.nodes_cache[network])) {
      return []
    } else {
      return state.nodes_cache[network][snapshot]
    }
  },
}
