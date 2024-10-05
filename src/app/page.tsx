"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useAddDataToCollection } from "@/lib/hooks/iexec/use-add-data-to-collection";
import { useConsumeData } from "@/lib/hooks/iexec/use-consume-data";
import { useCreateCollection } from "@/lib/hooks/iexec/use-create-collection";
import { useGetContent } from "@/lib/hooks/iexec/use-get-content";
import { useProtectData } from "@/lib/hooks/iexec/use-protect-data";
import { useRentData } from "@/lib/hooks/iexec/use-rent-data";
import { useSetDataForRenting } from "@/lib/hooks/iexec/use-set-data-for-renting";

export default function Home() {
  const [protectedDataAddress, setProtectedDataAddress] = useState<string | null>(
    "0xdDc123a50bb45861c3B2EC6717A374cAC17C6e06",
  );
  const [collectionId, setCollectionId] = useState<number | null>(null);
  const [taskId, setTaskId] = useState<string | null>(
    "0xf8763c2dde21337774fcb526b64a9f77c9d741cd8de2871144a4089b36e9edd6",
  );

  const { mutate: protectData, isPending: isProtectingData } = useProtectData({
    onSuccess(data) {
      console.log("Protected Data Address", data.address);
      setProtectedDataAddress(data.address);
    },
  });
  const { mutate: createCollection, isPending: isCreatingCollection } = useCreateCollection({
    onSuccess(data) {
      console.log("Collection Id", data.collectionId);
      setCollectionId(data.collectionId);
    },
  });
  const { mutate: addDataToCollection, isPending: isAddingDataToCollection } =
    useAddDataToCollection({
      onSuccess(data) {
        console.log("Data added to collection", data);
      },
    });
  const { mutate: setDataForRenting, isPending: isSettingDataForRenting } = useSetDataForRenting({
    onSuccess(data) {
      console.log("Data for renting set", data);
    },
  });
  const { mutate: rentData, isPending: isRentingData } = useRentData({
    onSuccess(data) {
      console.log("Data rented", data);
    },
  });
  const { mutate: consumeData, isPending: isConsumingData } = useConsumeData({
    onSuccess(data) {
      console.log("Data consumed", data);

      setTaskId(data.taskId);

      // Convert array buffer to string
      const text = new TextDecoder().decode(data.result);
      console.log("Result", text);
    },
  });

  const { data: content } = useGetContent(
    "0xf8763c2dde21337774fcb526b64a9f77c9d741cd8de2871144a4089b36e9edd6",
  );

  const onProtectData = async () => {
    protectData({
      data: {
        // A binary "file" field must be used if you use the app provided by iExec
        file: new TextEncoder().encode("DataProtector Sharing > Sandbox test!"),
      },
      name: "DataProtector Sharing Sandbox - Test protected data",
    });
  };

  const onCreateCollection = async () => {
    createCollection();
  };

  const onAddDataToCollection = async () => {
    if (!protectedDataAddress || !collectionId) return;

    addDataToCollection({
      protectedDataAddress,
      collectionId,
    });
  };

  const onSetDataForRenting = async () => {
    if (!protectedDataAddress) return;

    setDataForRenting({
      protectedData: protectedDataAddress,
      price: 0,
      duration: 60 * 60 * 24 * 30, // 30 days
    });
  };

  const onRentData = async () => {
    if (!protectedDataAddress) return;

    rentData({
      protectedDataAddress,
      price: 0,
      duration: 60 * 60 * 24 * 30,
    });
  };

  const onConsumeData = async () => {
    if (!protectedDataAddress) return;

    consumeData({
      protectedDataAddress,
    });
  };

  return (
    <div>
      <div>Protected Data Address: {protectedDataAddress}</div>
      <div>Collection Id: {collectionId}</div>
      <div>Task Id: {taskId}</div>
      <div>Content: {content}</div>
      <div className="flex items-center gap-2">
        <Button onClick={onProtectData} loading={isProtectingData} disabled={isProtectingData}>
          Protect Data
        </Button>
        <Button
          onClick={onCreateCollection}
          loading={isCreatingCollection}
          disabled={isCreatingCollection}
        >
          Create Collection
        </Button>
        <Button
          onClick={onAddDataToCollection}
          loading={isAddingDataToCollection}
          disabled={isAddingDataToCollection}
        >
          Add Data To Collection
        </Button>
        <Button
          onClick={onSetDataForRenting}
          loading={isSettingDataForRenting}
          disabled={isSettingDataForRenting}
        >
          Set Data For Renting
        </Button>
        <Button onClick={onRentData} loading={isRentingData} disabled={isRentingData}>
          Rent Data
        </Button>
        <Button onClick={onConsumeData} loading={isConsumingData} disabled={isConsumingData}>
          Consume Data
        </Button>
      </div>
    </div>
  );
}
