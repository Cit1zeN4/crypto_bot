import { libs, transfer, verify, ITransferTransaction, WithId } from "@waves/waves-transactions";
import fetch from "node-fetch";
import { getConfig } from "../config";

const config = getConfig("config");

export type TTransaction = {
  recipient: string;
  amount: number;
  fee?: number;
  seed: string;
};

export class Waves {
  async createTransaction(txParams: TTransaction) {
    let tx = transfer({
      amount: txParams.amount,
      recipient: txParams.recipient,
      fee: txParams.fee,
      assetId: config.waves.assetId,
      feeAssetId: config.waves.feeAssetId,
      senderPublicKey: libs.crypto.publicKey(txParams.seed),
    });
    const feeObj = await this.calcFee(tx);
    console.log(feeObj);
    tx.fee = feeObj.feeAmount;
    tx = transfer(tx, txParams.seed);
    console.log(`verify: ${verify(tx)}`);
    tx.amount = Number(tx.amount);
    return tx;
  }
  async sendTxRequest(tx: ITransferTransaction<string | number> & WithId): Promise<Response> {
    const res = await fetch(`${config.waves.node}/transactions/broadcast`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tx),
    });
    return res as any;
  }
  async calcFee(tx: ITransferTransaction<string | number> & WithId) {
    const res = await fetch(`${config.waves.node}/transactions/calculateFee`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tx),
    });
    if (res.ok) return await res.json();
    else throw new Error(await res.text());
  }

  async wavesTest() {
    const address = libs.crypto.address(config.waves.seed);
    const verifyAddress = libs.crypto.verifyAddress(address, {
      chainId: libs.crypto.MAIN_NET_CHAIN_ID,
    });
    if (!verifyAddress) throw new Error("Wrong seed");
    const verifyFee = this.calcFee(
      transfer({
        amount: 1,
        recipient: address,
        senderPublicKey: libs.crypto.publicKey(config.waves.seed),
        feeAssetId: config.waves.feeAssetId,
      })
    );
  }
}
