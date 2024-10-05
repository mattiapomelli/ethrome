import { getWeb3Provider, IExecDataProtector } from "@iexec/dataprotector";
// import { EIP1193Provider } from "@privy-io/react-auth";

export const PROTECTED_DATA_DELIVERY_WHITELIST_ADDRESS =
  "0x256bcd881c33bdf9df952f2a0148f27d439f2e64";
export const PROTECTED_DATA_DELIVERY_DAPP_ADDRESS = "0x1cb7D4F3FFa203F211e57357D759321C6CE49921";
export const DEMO_WORKERPOOL_ADDRESS = "prod-v8-bellecour.main.pools.iexec.eth";

// export function getDataProtectorCore(web3Provider: EIP1193Provider) {
export function getDataProtectorCore(privateKey: string) {
  const web3Provider = getWeb3Provider(privateKey);

  const dataProtector = new IExecDataProtector(web3Provider);

  return dataProtector.core;
}

// export function getDataProtectorSharing(web3Provider: EIP1193Provider) {
export function getDataProtectorSharing(privateKey: string) {
  const web3Provider = getWeb3Provider(privateKey);

  const dataProtector = new IExecDataProtector(web3Provider);

  return dataProtector.sharing;
}
