import { Address, toNano } from "locklift";
import { Migration } from "./migration";

const migration = new Migration();

const network = locklift.context.network.name;

async function main() {
  const nonce = process.env[`${network.toUpperCase()}_RANDOM_NONCE`] || "0";
  const signer = (await locklift.keystore.getSigner("0"))!;
  const { contract: random, tx } = await locklift.factory.deployContract({
    contract: "Random",
    publicKey: signer.publicKey,
    initParams: { nonce },
    constructorParams: {
      data: JSON.parse(process.env[`${network.toUpperCase()}_RANDOM_DATA`]!),
      config: {
        deadline: Date.parse(process.env[`${network.toUpperCase()}_RANDOM_DEADLINE`]!) / 1000,
        operator: new Address(process.env[`${network.toUpperCase()}_RANDOM_OPERATOR`]!),
      },
    },
    value: toNano(0.5),
  });

  console.log(`Random #${nonce} deployed at: ${random.address.toString()}`);
  migration.store(random, `Random_${nonce}`);
}

main().then(() => process.exit(0)).catch((error) => {
  if (error instanceof Error) {
    console.log(error.message);
  } else {
    console.log(error);
  }
  process.exit(1);
});
