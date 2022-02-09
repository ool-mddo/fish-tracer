export const state = () => ({
  interfaces: [],
  interfaces_cache: {},
})

export const mutations = {
  setInterfaces(state, { network, snapshot, interfaces }) {
    if (!(network in state.interfaces)) {
      state.interfaces_cache[network] = {}
    }
    state.interfaces_cache[network][snapshot] = interfaces
    state.interfaces = interfaces
  },
  setInterfacesFromCache(state, { network, snapshot }) {
    state.interfaces = state.interfaces_cache[network][snapshot]
  },
}

export const actions = {
  async changeSnapshot({ commit, state }, { network, snapshot }) {
    if (!(network in state.interfaces && snapshot in state.interfaces[network])) {
      const interfaces = await this.$axios.$get(`/api/networks/${network}/snapshots/${snapshot}/interfaces`)
      commit("setInterfaces", { network, snapshot, interfaces })
    } else {
      commit("setInterfacesFromCache", { network, snapshot })
    }
  },
}

export const getters = {
  getNodeInterfaces: (state) => (node, onlyL3 = true) => {
    return state.interfaces.filter(
      (intf) => intf.addresses.length > 0 == onlyL3 && intf.node == node
    )
  },
}
