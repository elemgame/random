import * as dotenv from "dotenv";
import { lockliftChai, LockliftConfig } from "locklift";
import "@broxus/locklift-verifier";
import { FactorySource } from "./build/factorySource";
import chai from "chai";

dotenv.config();
chai.use(lockliftChai);

declare global {
  const locklift: import("locklift").Locklift<FactorySource>;
}

const config: LockliftConfig = {
  compiler: {
    version: "0.70.0",
  },
  linker: {
    version: "0.20.3",
  },
  verifier: {
    verifierVersion: "latest", // contract verifier binary, see https://github.com/broxus/everscan-verify/releases
    apiKey: process.env.VERIFIER_API_KEY ?? "",
    secretKey: process.env.VERIFIER_SECRET_KEY ?? "",
  },
  networks: {
    locklift: {
      giver: {
        address: process.env.LOCAL_GIVER_ADDRESS!,
        key: process.env.LOCAL_GIVER_KEY!,
      },
      connection: {
        id: 1001,
        type: "proxy",
        // @ts-ignore
        data: {},
      },
      keys: {
        phrase: process.env.LOCAL_PHRASE,
        amount: 20,
      },
    },
    local: {
      connection: {
        id: 1337,
        group: "localnet",
        type: "graphql",
        data: {
          endpoints: [process.env.LOCAL_NETWORK_ENDPOINT!],
          latencyDetectionInterval: 1000,
          local: true,
        },
      },
      giver: {
        address: "0:ece57bcc6c530283becbbd8a3b24d3c5987cdddc3c8b7b33be6e4a6312490415",
        key: "172af540e43a524763dd53b26a066d472a97c4de37d5498170564510608250c3",
      },
      keys: {
        phrase: "action inject penalty envelope rabbit element slim tornado dinner pizza off blood",
        amount: 20,
      },
    },
    main: {
      connection: {
        id: 1,
        type: "jrpc",
        group: "main",
        data: {
          endpoint: process.env.MAIN_ENDPOINT_RPC!,
        },
      },
      giver: {
        address: process.env.MAIN_GIVER_ADDRESS!,
        phrase: process.env.MAIN_GIVER_PHRASE!,
        accountId: parseInt(process.env.MAIN_GIVER_ACCOUNT_ID || "0"),
      },
      keys: {
        phrase: process.env.MAIN_PHRASE!,
        amount: 20,
      },
    },
    test: {
      connection: {
        id: 1002,
        type: "jrpc",
        group: "dev",
        data: {
          endpoint: process.env.TEST_ENDPOINT_RPC!,
        },
      },
      giver: {
        address: process.env.TEST_GIVER_ADDRESS!,
        phrase: process.env.TEST_GIVER_PHRASE!,
        accountId: parseInt(process.env.TEST_GIVER_ACCOUNT_ID || "0"),
      },
      keys: {
        phrase: process.env.TEST_PHRASE!,
        amount: 20,
      },
    },
  },
  mocha: {
    timeout: 2000000,
  },
};

export default config;
