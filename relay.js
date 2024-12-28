/* eslint-disable no-console */

import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { circuitRelayServer } from '@libp2p/circuit-relay-v2'
import { identify } from '@libp2p/identify'
import { webSockets } from '@libp2p/websockets'
import * as filters from '@libp2p/websockets/filters'
import { createLibp2p } from 'libp2p'
import { autoNAT } from '@libp2p/autonat'
import { dcutr } from '@libp2p/dcutr'

const node = await createLibp2p({
  addresses: {
    // 1) Listen on TCP port 4001 for WebSockets on all interfaces
    listen: [
      '/ip4/0.0.0.0/tcp/4001/ws'
    ],

    // 2) Explicitly announce your public IP so remote peers can dial it
    //    Replace with your actual public IP or domain.
    announce: [
      '/ip4/78.43.40.133/tcp/4001/ws'
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

    // AutoNAT for NAT detection
    autoNAT: autoNAT({
      // (optional) further config
    }),

    // DCUtR for hole punching
    dcutr: dcutr()
  },

  // NAT config (UPnP / NAT-PMP)
  nat: {
    enabled: true,

    // (optional) Force Libp2p to assume this is our external IP.
    // If UPnP fails, we’ll still advertise this address.
    // externalAddress: 'YOUR.PUBLIC.IP'
  }
})

await node.start()

console.log('Relay node started with peerId:', node.peerId.toString())
console.log('Listening on addresses:')
node.getMultiaddrs().forEach(ma => {
  console.log(ma.toString())
})
