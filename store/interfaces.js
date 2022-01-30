export const state = () => ({
    interfaces: [],
  })
  
export const mutations = {
    setInterfaces (state, interfaces) {
        state.interfaces = interfaces
    },
}

export const actions = {
}

export const getters = {
    getInterfaces: (state) => (onlyL3=true) => {
        return state.interfaces.filter(intf => intf.addresses.length > 0 == onlyL3)},
    getNodeInterfaces: (state) => (node, onlyL3=true) => {
        return state.interfaces.filter(intf => (intf.addresses.length > 0 == onlyL3) && (intf.node == node))},
}
