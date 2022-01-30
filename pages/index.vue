<template>
<div>
  src
  <b-dropdown
    :text=src_node
    variant="outline-secondary"
    >
    <b-dropdown-item
      v-for="node_name in this.$store.getters['nodes/getNodes']"
      :key="node_name"
      @click="src_node = node_name"
      >
      {{ node_name }}
    </b-dropdown-item>
  </b-dropdown>
  <b-dropdown
    :text=src_intf
    variant="outline-secondary"
    >
    <b-dropdown-item
      v-for="intf in this.$store.getters['interfaces/getNodeInterfaces'](node=src_node, onlyL3=true)"
      :key="intf['interface']"
      @click="src_intf = intf['interface']; src_address = intf['addresses'][0]"
      >
      {{ `${intf["interface"]} (${intf["addresses"][0]})` }}
    </b-dropdown-item>
  </b-dropdown>
  dst
  <b-dropdown
    :text=dst_node
    variant="outline-secondary"
    >
    <b-dropdown-item
      v-for="node_name in this.$store.getters['nodes/getNodes']"
      :key="node_name"
      @click="dst_node = node_name"
      >
      {{ node_name }}
    </b-dropdown-item>
  </b-dropdown>
  <b-dropdown
    :text=dst_intf
    variant="outline-secondary"
    >
    <b-dropdown-item
      v-for="intf in this.$store.getters['interfaces/getNodeInterfaces'](node=dst_node, onlyL3=true)"
      :key="intf['interface']"
      @click="dst_intf = intf['interface']; dst_address = intf['addresses'][0]"
      >
      {{ `${intf["interface"]} (${intf["addresses"][0]})` }}
    </b-dropdown-item>
  </b-dropdown>
  <b-button @click="traceroute" variant="success">
    traceroute
  </b-button>
  <pre>
    {{ this.condition }}
  </pre>
  <pre>
    ORIGINAL:
    <b-form-textarea
      :value=original_result>
    </b-form-textarea>
  </pre>
  <pre>
    FAILURE SIMULATION:
    <b-form-textarea
      :value=failure_sim_result>
    </b-form-textarea>
  </pre>
</div>
</template>

<script>
export default {
  name: 'fish-tracer',
  methods: {
    node_intf_str(node, intf, addr) {
      return `${node}[${intf}] ${addr}`
    },
    traceroute(){
      this.$store.commit("traceroute/clear")
      const src_str = this.node_intf_str(this.src_node, this.src_intf, this.src_address)
      const dst_str = this.node_intf_str(this.dst_node, this.dst_intf, this.dst_address)
      this.condition = `${src_str} -> ${dst_str}`
      this.$store.dispatch("traceroute/traceroute_original", {
        node: this.src_node,
        intf: this.src_intf,
        dst: this.dst_address,
      })
      this.$store.dispatch("traceroute/traceroute_failure", {
        node: this.src_node,
        intf: this.src_intf,
        dst: this.dst_address,
      })
    }
  },
  data() {
    return {
      src_node: "source node",
      src_intf: "source interface",
      src_address: "source address",
      dst_node: "destination node",
      dst_intf: "destination interface",
      dst_address: "destination address",
      condition: "",
    }
  },
  computed: {
    original_result() {
      return this.$store.getters['traceroute/getOriginal']
    },
    failure_sim_result() {
      return this.$store.getters['traceroute/getFailure']
    },
  },
  async fetch ({ app, store, params }) {
    const nodes = await app.$axios.$get('/api/nodes')
    store.commit("nodes/setNodes", nodes.result)
    const interfaces = await app.$axios.$get('/api/interfaces')
    store.commit("interfaces/setInterfaces", interfaces.result)
  },
}
</script>
