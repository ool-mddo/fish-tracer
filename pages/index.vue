<template>
  <div>
    <div class="container">
      <div class="row">
        <div class="col">
          network
          <b-list-group style="max-height: 10em; overflow: scroll;">
            <b-list-group-item
              v-for="item in this.$store.getters['snapshots/getNetworks']"
              :key="item"
              :variant="item == network ? 'success' : 'light'"
              button
              @click="network = item"
            >
              {{ item }}
            </b-list-group-item>
          </b-list-group>
        </div>
        <div class="col">
          snapshot
          <b-list-group style="max-height: 10em; overflow: scroll;">
            <b-list-group-item
              v-for="item in this.$store.getters['snapshots/getSnapshots']((network = network))"
              :key="item"
              :variant="item == snapshot ? 'success' : 'light'"
              button
              @click="set_snapshot(item)"
            >
              {{ item }}
            </b-list-group-item>
          </b-list-group>
        </div>
      </div>
      <div class="row">
        <div class="col">
          source node
          <b-list-group style="max-height: 15em; overflow: scroll;">
            <b-list-group-item
              v-for="item in this.$store.getters['nodes/getNodes']"
              :key="item"
              :variant="item == src_node ? 'success' : 'light'"
              button
              @click="src_node = item"
            >
              {{ item }}
            </b-list-group-item>
          </b-list-group>
        </div>
        <div class="col">
          source interface
          <b-list-group style="max-height: 15em; overflow: scroll;">
            <b-list-group-item
              v-for="item in this.$store.getters['interfaces/getNodeInterfaces'](
                (node = src_node),
                (onlyL3 = true)
              )"
              :key="item['interface']"
              :variant="item['interface'] == src_intf && item['addresses'][0] == src_address? 'success' : 'light'"
              button
              @click="
                src_intf = item['interface']
                src_address = item['addresses'][0]
              "
            >
            {{ `${item["interface"]} (${item["addresses"][0]})` }}
            </b-list-group-item>
          </b-list-group>
        </div>
        <div class="col">
          destination node
          <b-list-group style="max-height: 15em; overflow: scroll;">
            <b-list-group-item
              v-for="item in this.$store.getters['nodes/getNodes']"
              :key="item"
              :variant="item == dst_node ? 'success' : 'light'"
              button
              @click="dst_node = item"
            >
              {{ item }}
            </b-list-group-item>
          </b-list-group>
        </div>
        <div class="col">
          destination interface
          <b-list-group style="max-height: 15em; overflow: scroll;">
            <b-list-group-item
              v-for="item in this.$store.getters['interfaces/getNodeInterfaces'](
                (node = dst_node),
                (onlyL3 = true)
              )"
              :key="item['interface']"
              :variant="item['interface'] == dst_intf && item['addresses'][0] == dst_address ? 'success' : 'light'"
              button
              @click="
                dst_intf = item['interface']
                dst_address = item['addresses'][0]
              "
            >
            {{ `${item["interface"]} (${item["addresses"][0]})` }}
            </b-list-group-item>
          </b-list-group>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <b-button @click="traceroute" variant="success"> traceroute at all snapshots </b-button>
        </div>
      </div>
    </div>
    <pre>
      {{ this.condition }}
    </pre>
    <pre>
      TRACEROUTE SIMULATION:
    </pre>
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
