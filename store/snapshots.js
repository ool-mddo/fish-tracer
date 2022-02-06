export const state = () => ({
  networks: [],
  snapshots: {},
})

export const mutations = {
  setSnapshots(state, snapshots) {
    state.snapshots = snapshots
    state.networks = Object.keys(snapshots).sort((a, b) => a.localeCompare(b))
  },
}

export const actions = {}

export const getters = {
  getNetworks: (state) => state.networks,
  getSnapshots: (state) => (network) => state.snapshots[network],
}
