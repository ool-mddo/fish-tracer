export const state = () => ({
  nodes: {},
  network: "",
  snapshot: "",
})

export const mutations = {
  setNodes (state, {network, snapshot, nodes}) {
    if(!(network in state.nodes)) {
      state.nodes[network] = {}
    }
    state.nodes[network][snapshot] = nodes.sort((a, b) => a.localeCompare(b))
  },
  setNetwork: (state, network) => state.network = network,
  setSnapshot: (state, snapshot) => state.snapshot = snapshot,
}

export const actions = {
  async changeSnapshot ({commit, state}, {network, snapshot}) {
    if(!(network in state.nodes && snapshot in state.nodes[network])){
      const nodes = await this.$axios.$get(`/api/networks/${network}/snapshots/${snapshot}/nodes`)
      commit("setNodes", {network, snapshot, nodes})
    }
    commit("setNetwork", network)
    commit("setSnapshot", snapshot)
  },
}

export const getters = {
  getNodes: (state) => {
    if(state.network == "") {
      return []
    } else {
      return state.nodes[state.network][state.snapshot]
    }
  },
  getNetworkSnapshotNodes: (state) => (network, snapshot) => {
    if(!(network in state.nodes) || !(snapshot in state.nodes[network])) {
      return []
    } else {
      return state.nodes[network][snapshot]
    }
  },
}
