import { IExecDataProtector } from "@iexec/dataprotector";

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
