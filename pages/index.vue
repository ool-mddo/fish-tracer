<template>
<div>
  network
  <b-dropdown
    :text=network
    variant="outline-secondary"
    >
    <b-dropdown-item
      v-for="network_name in this.$store.getters['snapshots/getNetworks']"
      :key="network_name"
      @click="network = network_name"
      >
      {{ network_name }}
    </b-dropdown-item>
  </b-dropdown>
  snapshot
  <b-dropdown
    :text=snapshot
    variant="outline-secondary"
    >
    <b-dropdown-item
      v-for="snapshot_name in this.$store.getters['snapshots/getSnapshots'](network = network)"
      :key="snapshot_name"
      @click="set_snapshot(snapshot_name)"
      >
      {{ snapshot_name }}
    </b-dropdown-item>
  </b-dropdown>
  src
  <b-dropdown
    :text=src_node
    variant="outline-secondary"
    >
    <b-dropdown-item
      v-for="node_name in this.$store.getters['nodes/getNetworkSnapshotNodes'](network=network, snapshot=snapshot)"
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
      v-for="intf in this.$store.getters['interfaces/getNodeInterfaces'](network=network, snapshot=snapshot, node=src_node, onlyL3=true)"
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
      v-for="node_name in this.$store.getters['nodes/getNetworkSnapshotNodes'](network=network, snapshot=snapshot)"
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
      v-for="intf in this.$store.getters['interfaces/getNodeInterfaces'](network=network, snapshot=snapshot, node=dst_node, onlyL3=true)"
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
    set_snapshot(snapshot){
      this.snapshot = snapshot
      this.$store.dispatch("nodes/changeSnapshot", {
        network: this.network,
        snapshot: this.snapshot,
      })
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
      network: "pushed_configs",
      snapshot: "mddo_network",
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
    const snapshots = await app.$axios.$get('/api/snapshots')
    store.commit("snapshots/setSnapshots", snapshots)
    const nodes = await app.$axios.$get("/api/networks/pushed_configs/snapshots/mddo_network/nodes")
    store.commit("nodes/setNodes", {network: "pushed_configs", snapshot: "mddo_network", nodes: nodes})
    const interfaces = await app.$axios.$get("/api/networks/pushed_configs/snapshots/mddo_network/interfaces")
    store.commit("interfaces/setInterfaces", {network: "pushed_configs", snapshot: "mddo_network", interfaces: interfaces})
  },
}
</script>
