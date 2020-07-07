import rc from "rc";

export type ConfigT = {
  bot: {
    botToken: string;
  };
  waves: {
    node: string;
    assetId: string;
    feeAssetId: string;
    minFee: number;
  };
};

export function getConfig(name: string): ConfigT {
  const config = rc(name);
  if (!config) throw new Error(`Config by name: ${name} not found`);

  return config as ConfigT;
}
