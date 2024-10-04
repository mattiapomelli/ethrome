import { IExecDataProtector, getWeb3Provider } from "@iexec/dataprotector";
import { NextResponse } from "next/server";

const privateKey = "8b627bd03db5a0f05cfd2154361e2468db36cfae67986252c55e13e351f2d1e2";

// Get Web3 provider from a private key
const web3Provider = getWeb3Provider(privateKey);

// Instantiate using the umbrella module for full functionality
const dataProtector = new IExecDataProtector(web3Provider);

const dataProtectorCore = dataProtector.core; // access to core methods
// const dataProtectorSharing = dataProtector.sharing; // access to methods

export async function GET() {
  try {
    const protectedData = await dataProtectorCore.protectData({
      data: {
        email: "example@gmail.com",
      },
    });

    console.log(protectedData);

    return NextResponse.json({ protectedData });
  } catch (error) {
    console.log(">> error", error);

    return NextResponse.json({ error }, { status: 500 });
  }
}
