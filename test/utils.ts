import { WalletTypes, toNano, getRandomNonce } from "locklift";
import { Account } from "everscale-standalone-client/nodejs";

const logger = require("mocha-logger");
const { expect } = require("chai");

export const random = (min: number, max: number) => Math.round(Math.random() * (max - min) + min);

export const someNonce = () => random(100000, 1000000);

export async function deployAccount(keyNumber = 0, initialBalance = 5): Promise<Account> {
  const signer = (await locklift.keystore.getSigner(keyNumber.toString()))!;
  const { account } = (await locklift.factory.accounts.addNewAccount({
    type: WalletTypes.EverWallet,
    value: toNano(initialBalance),
    publicKey: signer!.publicKey,
    nonce: getRandomNonce(),
  }));

  await locklift.provider.sendMessage({
    sender: account.address,
    recipient: account.address,
    amount: toNano(0.1),
    bounce: false,
  });
  const accountBalance = await locklift.provider.getBalance(account.address);
  expect(Number(accountBalance)).to.be.above(0, "Bad user balance");
  logger.log(`User address: ${account.address.toString()}`);

  return account;
}