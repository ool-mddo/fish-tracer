<template>
  <div>
    network
    <b-dropdown :text="network" variant="outline-secondary">
      <b-dropdown-item
        v-for="network_name in this.$store.getters['snapshots/getNetworks']"
        :key="network_name"
        @click="network = network_name"
      >
        {{ network_name }}
      </b-dropdown-item>
    </b-dropdown>
    snapshot
    <b-dropdown :text="snapshot" variant="outline-secondary">
      <b-dropdown-item
        v-for="snapshot_name in this.$store.getters['snapshots/getSnapshots']((network = network))"
        :key="snapshot_name"
        @click="set_snapshot(snapshot_name)"
      >
        {{ snapshot_name }}
      </b-dropdown-item>
    </b-dropdown>
    src
    <b-dropdown :text="src_node" variant="outline-secondary">
      <b-dropdown-item
        v-for="node_name in this.$store.getters['nodes/getNodes']"
        :key="node_name"
        @click="src_node = node_name"
      >
        {{ node_name }}
      </b-dropdown-item>
    </b-dropdown>
    <b-dropdown :text="src_intf" variant="outline-secondary">
      <b-dropdown-item
        v-for="intf in this.$store.getters['interfaces/getNodeInterfaces'](
          (node = src_node),
          (onlyL3 = true)
        )"
        :key="intf['interface']"
        @click="
          src_intf = intf['interface']
          src_address = intf['addresses'][0]
        "
      >
        {{ `${intf["interface"]} (${intf["addresses"][0]})` }}
      </b-dropdown-item>
    </b-dropdown>
    dst
    <b-dropdown :text="dst_node" variant="outline-secondary">
      <b-dropdown-item
        v-for="node_name in this.$store.getters['nodes/getNodes']"
        :key="node_name"
        @click="dst_node = node_name"
      >
        {{ node_name }}
      </b-dropdown-item>
    </b-dropdown>
    <b-dropdown :text="dst_intf" variant="outline-secondary">
      <b-dropdown-item
        v-for="intf in this.$store.getters['interfaces/getNodeInterfaces'](
          (node = dst_node),
          (onlyL3 = true)
        )"
        :key="intf['interface']"
        @click="
          dst_intf = intf['interface']
          dst_address = intf['addresses'][0]
        "
      >
        {{ `${intf["interface"]} (${intf["addresses"][0]})` }}
      </b-dropdown-item>
    </b-dropdown>
    <b-button @click="traceroute" variant="success"> traceroute at all snapshots </b-button>
    <pre>
    {{ this.condition }}
  </pre
    >
    <pre>
    TRACEROUTE SIMULATION:
  </pre
    >
    <b-table striped hover :items="this.$store.getters['traceroute/getResults']"> </b-table>
  </div>
</template>

<script>
export default {
  name: "fish-tracer",
  methods: {
    node_intf_str(node, intf, addr) {
      return `${node}[${intf}] ${addr}`
    },
    set_snapshot(snapshot) {
      this.snapshot = snapshot
      this.$store.dispatch("nodes/changeSnapshot", {
        network: this.network,
        snapshot: this.snapshot,
      })
      this.$store.dispatch("interfaces/changeSnapshot", {
        network: this.network,
        snapshot: this.snapshot,
      })
    },
    traceroute() {
      this.$store.commit("traceroute/clear")
      const src_str = this.node_intf_str(this.src_node, this.src_intf, this.src_address)
      const dst_str = this.node_intf_str(this.dst_node, this.dst_intf, this.dst_address)
      this.condition = `${src_str} -> ${dst_str}`
      for (const snapshot of this.$store.getters["snapshots/getSnapshots"](this.network)) {
        this.$store.dispatch("traceroute/traceroute", {
          network: this.network,
          snapshot: snapshot,
          node: this.src_node,
          intf: this.src_intf,
          dst: this.dst_address,
        })
      }
    },
  },
  data() {
    return {
      network: "network_name",
      snapshot: "snapshot_name",
      src_node: "source node",
      src_intf: "source interface",
      src_address: "source address",
      dst_node: "destination node",
      dst_intf: "destination interface",
      dst_address: "destination address",
      condition: "",
    }
  },
  computed: {},
  async fetch({ app, store }) {
    const all_snapshots = await app.$axios.$get("/api/snapshots")
    store.commit("snapshots/setSnapshots", all_snapshots)
  },
}
</script>
