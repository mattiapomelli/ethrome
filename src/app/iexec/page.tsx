"use client";

import { useState } from "react";

import { TransactionLinkButton } from "@/components/transaction-link-button";
import { Button } from "@/components/ui/button";
import { BELLECOUR_CHAIN_ID } from "@/lib/chains";
import { useBuyData } from "@/lib/hooks/iexec/use-buy-data";
import { useCreateCollection } from "@/lib/hooks/iexec/use-create-collection";
// import { useGetContent } from "@/lib/hooks/iexec/use-get-content";
import { useSellData } from "@/lib/hooks/iexec/use-sell-data";
import { useToast } from "@/lib/hooks/use-toast";

export default function Home() {
  const { toast } = useToast();

  const [protectedDataAddress, setProtectedDataAddress] = useState<string | null>(
    // "0x175a608592184418bcc4ba9ad7ff6dc4a5164a20",
    null,
  );
  const [collectionId, setCollectionId] = useState<number | null>(null);
  const [data, setData] = useState<string | null>(null);

  const { mutate: createCollection, isPending: isCreatingCollection } = useCreateCollection({
    onSuccess(data) {
      console.log("Collection Id", data.collectionId);
      setCollectionId(data.collectionId);
    },
  });

  const { mutate: sellData, isPending: isSellPending } = useSellData({
    onSuccess(protectedDataAddress) {
      console.log("Protected Data Address", protectedDataAddress);
      setProtectedDataAddress(protectedDataAddress);
    },
  });

  const { mutate: buyData, isPending: isBuyPending } = useBuyData({
    onSuccess(data) {
      console.log("Data", data);
      setData(data.content);
    },
  });

  // const { data: content } = useGetContent(
  //   "0x1936d2fe55b0894fa63db51e8e999d08067836ab3dc4cab6e10483c1fd565e41",
  // );

  const onCreateCollection = async () => {
    createCollection();
  };

  const onSellData = async () => {
    if (!collectionId) return;

    sellData({
      collectionId,
      price: 0,
      duration: 60 * 60 * 24 * 30, // 30 days
      data: {
        // A binary "file" field must be used if you use the app provided by iExec
        file: new TextEncoder().encode("Ciao!"),
      },
      name: "Test Data",
    });
  };

  const onBuyData = async () => {
    if (!protectedDataAddress) return;

    buyData({
      protectedDataAddress,
      price: 0,
      duration: 60 * 60 * 24 * 30, // 30 days
    });
  };

  return (
    <div>
      <div>Protected Data Address: {protectedDataAddress}</div>
      <div>Collection Id: {collectionId}</div>
      <div>Data: {data}</div>
      {/* <div>Content: {content}</div> */}

      <div className="flex items-center gap-2">
        <Button
          onClick={onCreateCollection}
          loading={isCreatingCollection}
          disabled={isCreatingCollection}
        >
          Create Collection
        </Button>
        <Button onClick={onSellData} loading={isSellPending} disabled={isSellPending}>
          Sell Data
        </Button>

        <Button onClick={onBuyData} loading={isBuyPending} disabled={isBuyPending}>
          Buy Data
        </Button>

        <Button
          onClick={() => {
            toast({
              title: `${Math.random()}`,
              description: "Successfully rented protected data.",
              action: <TransactionLinkButton chainId={BELLECOUR_CHAIN_ID} txnHash={"0xoaisdn"} />,
              variant: "default",
            });
          }}
        >
          Toast
        </Button>
      </div>
    </div>
  );
}
