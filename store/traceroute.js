export const state = () => ({
  results: [],
})

export const mutations = {
  addResult(state, { network, snapshot, description, result }) {
    state.results.push({ network, snapshot, description, result })
  },
  clear(state) {
    state.results = []
  },
}

export const actions = {
  async traceroute({ commit }, { network, snapshot, node, intf, dst }) {
    const api = `/api/networks/${network}/snapshots/${snapshot}/nodes/${node}/traceroute`
    const params = { interface: intf, destination: dst }
    const param_str = Object.keys(params)
      .map((key) => `${key}=${params[key]}`)
      .join("&")
    const trace_answer = await this.$axios.$get(`${api}?${param_str}`)
    const description = trace_answer.snapshot_info.description
    const result = trace_answer.result[0]
    commit("addResult", { network, snapshot, description, result })
  },
}

export const getters = {
  getResults: (state) => {
    return state.results.map((item) => {
      if (!Object.keys(item.result).length) {
        return { network: item.network, snapshot: item.snapshot, description: "processing...", result: "processing..." }
      }
      if (item.result["Traces"].filter((x) => x.disposition == "ACCEPTED").length > 0) {
        return { network: item.network, snapshot: item.snapshot, description: item.description, result: "reachable" }
      } else if (item.result["Traces"].filter((x) => x.disposition == "DISABLED").length > 0) {
        return { network: item.network, snapshot: item.snapshot, description: item.description, result: "DISABLED" }
      } else {
        return {
          network: item.network,
          snapshot: item.snapshot,
          description: item.description,
          result: "U N R E A C H A B L E",
        }
      }
    })
  },
}
