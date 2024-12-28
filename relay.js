/* eslint-disable no-console */

import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { circuitRelayServer } from '@libp2p/circuit-relay-v2'
import { identify } from '@libp2p/identify'
import { webSockets } from '@libp2p/websockets'
import * as filters from '@libp2p/websockets/filters'
import { createLibp2p } from 'libp2p'
import { autoNAT } from '@libp2p/autonat'     // ← from latest docs
import { dcutr } from '@libp2p/dcutr'

const node = await createLibp2p({
  addresses: {
    listen: [
      // Listen on all interfaces so NAT manager can attempt UPnP port mapping
      '/ip4/0.0.0.0/tcp/0/ws'
    ]
  },
  transports: [
    webSockets({
      filter: filters.all
    })
  ],
  connectionEncrypters: [noise()],
  streamMuxers: [yamux()],
  services: {
    identify: identify(),

    // Circuit Relay server so we can act as a relay for others
    relay: circuitRelayServer({
      reservations: {
        maxReservations: Infinity
      }
    }),

    // The "autoNAT" key from docs, enabling NAT detection
    autoNAT: autoNAT({
      // optional config
    }),

    // DCUtR for hole punching
    dcutr: dcutr()
  },

  // NAT config (UPnP / NAT-PMP)
  nat: {
    enabled: true
  }
})

await node.start()

console.log('Relay node started with peerId:', node.peerId.toString())
console.log('Listening on addresses:')
node.getMultiaddrs().forEach(ma => {
  console.log(ma.toString())
})
