export const state = () => ({
  interfaces: {},
  network: "",
  snapshot: "",
})
  
export const mutations = {
  setInterfaces (state, {network, snapshot, interfaces}) {
    if(!(network in state.interfaces)) {
      state.interfaces[network] = {}
    }
    state.interfaces[network][snapshot] = interfaces
  },
  setNetwork: (state, network) => state.network = network,
  setSnapshot: (state, snapshot) => state.snapshot = snapshot,
}

export const actions = {
  async changeSnapshot ({commit, state}, {network, snapshot}) {
    if(!(network in state.interfaces && snapshot in state.interfaces[network])){
      const interfaces = await this.$axios.$get(`/api/networks/${network}/snapshots/${snapshot}/interfaces`)
      commit("setInterfaces", {network, snapshot, interfaces})
    }
    commit("setNetwork", network)
    commit("setSnapshot", snapshot)
  },
}

export const getters = {
  getNodeInterfaces: (state) => (network, snapshot, node, onlyL3=true) => {
    if(!(network in state.interfaces) || !(snapshot in state.interfaces[network])) {
      return []
    } else {
      return state.interfaces[network][snapshot].filter(intf => (intf.addresses.length > 0 == onlyL3) && (intf.node == node))
    }
  },
}
