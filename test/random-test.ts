import { expect } from "chai";
import { Contract, Signer } from "locklift";
import { Account } from "everscale-standalone-client/nodejs";
import { FactorySource } from "../build/factorySource";
import { deployAccount, someNonce } from "./utils";

let random: Contract<FactorySource["Random"]>;
let signer: Signer;
let operator: Account;

describe("Test Random contract", async function() {
  before(async () => {
    signer = (await locklift.keystore.getSigner("0"))!;
    operator = (await deployAccount(0))!;
  });
  describe("Contracts", async function() {
    it("Load contract factory", async function() {
      const randomData = await locklift.factory.getContractArtifacts("Random");
      expect(randomData.code).not.to.equal(undefined, "Code should be available");
      expect(randomData.abi).not.to.equal(undefined, "ABI should be available");
      expect(randomData.tvc).not.to.equal(undefined, "tvc should be available");
    });

    it("Deploy contract", async function() {

      const result = await locklift.factory.deployContract({
        contract: "Random",
        publicKey: signer.publicKey,
        initParams: {
          nonce: someNonce(),
        },
        constructorParams: {
          data: ["foo", "bar"],
          config: {
            deadline: Date.parse("18 May 2024 23:59:59 GMT+2") / 1000,
            operator: operator.address,
          },
        },
        value: locklift.utils.toNano(2),
      });
      random = result.contract;
      expect(await locklift.provider.getBalance(random.address).then(balance => Number(balance))).to.be.above(0);
      expect(await random.methods.getItem({ n: 0 }).call().then(v => v.item)).to.be.equal("foo");
      expect(await random.methods.getItem({ n: 1 }).call().then(v => v.item)).to.be.equal("bar");
      expect(await random.methods.total({}).call().then(v => v.total)).to.be.equal("2");
      expect(await random.methods.winner({}).call().then(v => v.winner)).to.be.equal("");
      const data = (await random.getPastEvents({ filter: (e) => e.transaction.id.hash == result.tx.transaction.id.hash })).events.shift();
      // @ts-ignore
      expect(data.event).to.be.equal("NewSessionRandom");
      // @ts-ignore
      expect(data.data.total).to.be.equal("2");
    });
  });
});
