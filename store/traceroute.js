export const state = () => ({
  results: [],
})

export const mutations = {
  addResult (state, {snapshot, result}) {
    state.results.push({snapshot: snapshot, result: result})
  },
  clear (state) {
    state.results = []
  },
}

export const actions = {
  async traceroute({commit}, {network, snapshot, node, intf, dst}) {
    const api = `/api/networks/${network}/snapshots/${snapshot}/nodes/${node}/traceroute`
    const params = {'interface': intf, 'destination': dst}
    const param_str = Object.keys(params).map(key => `${key}=${params[key]}`).join('&')
    const result = await this.$axios.$get(`${api}?${param_str}`)
    commit("addResult", {snapshot, result})
  },
}

export const getters = {
  getResults: (state) => {
    return state.results.map((item) => {
      if(!Object.keys(item.result).length){
        return {snapshot:item.snapshot, result: "processing..."}
      }
      if(item.result["Traces"].filter(x=>x.disposition=="ACCEPTED").length>0){
        return {snapshot:item.snapshot, result: "reachable"}
      } else {
        return {snapshot:item.snapshot, result: "U N R E A C H A B L E"}
      }
    })
  },
}
