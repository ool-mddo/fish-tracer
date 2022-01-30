export const state = () => ({
    original: [],
    failure: [],
})

export const mutations = {
    addOriginal (state, result) {
        state.original.push(result)
    },
    addFailure (state, result) {
        state.failure.push(result)
    },
    clear (state) {
        state.original = []
        state.failure = []
    },
}

export const actions = {
    async traceroute_original(context, {node, intf, dst}) {
        const api = `/api/nodes/${node}/traceroute`
        const params = {'interface': intf, 'destination': dst, 'network': 'pushed_configs'}
        const param_str = Object.keys(params).map(key => `${key}=${params[key]}`).join('&')
        const original = await this.$axios.$get(`${api}?${param_str}`)
        context.commit("addOriginal", original[0])
    },
    async traceroute_failure(context, {node, intf, dst}) {
        const api = `/api/nodes/${node}/traceroute`
        const params = {'interface': intf, 'destination': dst, 'network': 'pushed_configs_linkdown'}
        const param_str = Object.keys(params).map(key => `${key}=${params[key]}`).join('&')
        const failure = await this.$axios.$get(`${api}?${param_str}`)
        context.commit("addFailure", failure)
    },
}

export const getters = {
    getOriginal: (state) => {
        if(state.original.length == 0) return ""
        var res = ""
        const accepted = state.original[0]["result"][0]["Traces"].filter(x=>x.disposition=="ACCEPTED")
        if(accepted.length > 0){
            res += "reachable\n\n"
        }
        res += "path(s):\n"
        res += accepted.map(x=>x.hops.map(y=>y.node).join(" -> ")).join("\n")
        return res
    },
    getFailure: (state) => {
        if(state.failure.length == 0) return ""
        var res = ""
        state.failure[0].forEach((elem, index) => {
            const accepted = elem["result"][0]["Traces"].filter(x=>x.disposition=="ACCEPTED")
            if(accepted.length > 0){
                res += elem.snapshot + ": reachable\n"
            } else {
                res += elem.snapshot + ": U N R E A C H A B L E\n"
            }
        })
        return res
    },
}
