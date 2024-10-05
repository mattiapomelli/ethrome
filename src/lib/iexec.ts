import { IExecDataProtector } from "@iexec/dataprotector";

export const PROTECTED_DATA_DELIVERY_WHITELIST_ADDRESS =
  "0x256bcd881c33bdf9df952f2a0148f27d439f2e64";
export const PROTECTED_DATA_DELIVERY_DAPP_ADDRESS = "0x1cb7D4F3FFa203F211e57357D759321C6CE49921";
export const DEMO_WORKERPOOL_ADDRESS = "prod-v8-learn.main.pools.iexec.eth";

export function getDataProtectorCore() {
  const web3Provider = window.ethereum;
  const dataProtector = new IExecDataProtector(web3Provider);

  const dataProtectorCore = dataProtector.core;

  return dataProtectorCore;
}

export function getDataProtectorSharing() {
  const web3Provider = window.ethereum;
  const dataProtector = new IExecDataProtector(web3Provider);

  const dataProtectorSharing = dataProtector.sharing;

  return dataProtectorSharing;
}
