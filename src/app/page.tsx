"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { getDataProtectorCore, getDataProtectorSharing } from "@/lib/iexec";

const DATA_DELIVERY_WHITELIST_ADDRESS = "0x256bcd881c33bdf9df952f2a0148f27d439f2e64";
const DEMO_WORKERPOOL_ADDRESS = "prod-v8-learn.main.pools.iexec.eth";

export default function Home() {
  const [protectedDataAddress, setProtectedDataAddress] = useState<string | null>(null);
  const [collectionId, setCollectionId] = useState<number | null>(null);

  const onClick = async () => {
    const dataProtectorCore = getDataProtectorCore();
    const protectedData = await dataProtectorCore.protectData({
      data: {
        email: "example@gmail.com",
      },
    });

    setProtectedDataAddress(protectedData.address);
    console.log(protectedData);
  };

  const onCreateCollection = async () => {
    const dataProtectorSharing = getDataProtectorSharing();
    const createCollectionResult = await dataProtectorSharing.createCollection();

    setCollectionId(createCollectionResult.collectionId);
    console.log(createCollectionResult);
  };

  const addDataToCollection = async () => {
    if (!protectedDataAddress || !collectionId) return;

    const dataProtectorSharing = getDataProtectorSharing();
    const addToCollectionResult = await dataProtectorSharing.addToCollection({
      protectedData: protectedDataAddress,
      collectionId,
      // Give a whitelist of apps allowed to consume this protected data
      // This whitelist is a smart contract managed by iExec Team
      addOnlyAppWhitelist: DATA_DELIVERY_WHITELIST_ADDRESS,
    });

    console.log(addToCollectionResult);
  };

  const setDataForRenting = async () => {
    if (!protectedDataAddress) return;

    const dataProtectorSharing = getDataProtectorSharing();

    const setProtectedDataToRentingResult = await dataProtectorSharing.setProtectedDataToRenting({
      protectedData: protectedDataAddress,
      price: 1,
      duration: 60 * 60 * 24 * 30, // 30 days
    });

    console.log(setProtectedDataToRentingResult);
  };

  const rentData = async () => {
    if (!protectedDataAddress) return;

    const dataProtectorSharing = getDataProtectorSharing();

    const rentProtectedDataResult = await dataProtectorSharing.rentProtectedData({
      protectedData: protectedDataAddress,
      price: 1,
      duration: 60 * 60 * 24 * 30,
    });

    console.log(rentProtectedDataResult);
  };

  const consumeData = async () => {
    if (!protectedDataAddress) return;

    const dataProtectorSharing = getDataProtectorSharing();

    const consumeProtectedDataResult = await dataProtectorSharing.consumeProtectedData({
      protectedData: protectedDataAddress,
      app: DATA_DELIVERY_WHITELIST_ADDRESS,
      workerpool: DEMO_WORKERPOOL_ADDRESS,
      onStatusUpdate: (status) => {
        console.log("[consumeProtectedData] status", status);
      },
    });

    console.log(consumeProtectedDataResult);
  };

  return (
    <div>
      <div>Protected Data Address: {protectedDataAddress}</div>
      <div>Collection Id: {collectionId}</div>
      <div className="flex items-center gap-2">
        <Button onClick={onClick}>Protect Data</Button>
        <Button onClick={onCreateCollection}>Create Collection</Button>
        <Button onClick={addDataToCollection}>Add Data To Collection</Button>
        <Button onClick={setDataForRenting}>Set Data For Renting</Button>
        <Button onClick={rentData}>Rent Data</Button>
        <Button onClick={consumeData}>Consume Data</Button>
      </div>
    </div>
  );
}
