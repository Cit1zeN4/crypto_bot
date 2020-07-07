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
  createTransaction(txParams: TTransaction) {
    const tx = transfer(
      {
        amount: txParams.amount,
        recipient: txParams.recipient,
        fee: txParams.fee,
        assetId: config.waves.assetId,
        feeAssetId: config.waves.feeAssetId,
      },
      txParams.seed
    );
    console.log(`verify: ${verify(tx)}`);
    tx.amount = Number(tx.amount);
    return tx;
  }
  async sendTxRequest(tx: ITransferTransaction<string | number> & WithId): Promise<Response> {
    const res = fetch(`${config.waves.node}/transactions/broadcast`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tx),
    });
    return res as any;
  }
}
