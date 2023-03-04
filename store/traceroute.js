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
    const api = `/batfish/${network}/${snapshot}/nodes/${node}/traceroute`
    const params = { interface: intf, destination: dst }
    const param_str = Object.keys(params)
      .map((key) => `${key}=${params[key]}`)
      .join("&")
    const trace_answer = await this.$axios.$get(`${api}?${param_str}`)
    let description = 'Origin snapshot'
    if (trace_answer.snapshot_pattern) {
      description = trace_answer.snapshot_pattern.description
    }
    const result = trace_answer.result[0]
    commit("addResult", { network, snapshot, description, result })
  },
}

const trace2hops_str = (trace) => {
  return trace.hops
    .map((hop) => {
      const step = hop.steps.find((step) => step.action == "RECEIVED")
      return `${hop.node}[${step.detail.inputInterface}]`
    })
    .join(" -> ")
}

const item2table = (item, result_string, hops) => {
  return {
    network: item.network,
    snapshot: item.snapshot,
    description: item.description,
    result: result_string,
    hops: hops,
  }
}

const find_trace_by_disposition = (item, disposition) => {
  return item.result.Traces.find((trace) => trace.disposition == disposition)
}

const is_trace_result = (item, disposition) => {
  return !!find_trace_by_disposition(item, disposition)
}

export const getters = {
  getResults: (state) => {
    return state.results.map((item) => {
      if (!Object.keys(item.result).length) {
        return item2table(item, "processing", "")
      }
      if (is_trace_result(item, "ACCEPTED")) {
        const hops_str = trace2hops_str(find_trace_by_disposition(item, "ACCEPTED"))
        return item2table(item, "Reachable", hops_str)
      }
      if (is_trace_result(item, "DISABLED")) {
        const hops_str = trace2hops_str(find_trace_by_disposition(item, "DISABLED"))
        return item2table(item, "DISABLED", hops_str)
      }
      const hops_str = item.result?.Traces?.length > 0 ? trace2hops_str(item.result.Traces[0]) : ""
      return item2table(item, "U N R E A C H A B L E", hops_str)
    })
  },
}
