"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useRentData } from "@/lib/hooks/iexec/use-rent-data";
import { useSetDataForRenting } from "@/lib/hooks/iexec/use-set-data-for-renting";
import { useSetDataToSubscription } from "@/lib/hooks/iexec/use-set-data-to-subscription.tsx";
import { useSubscribeToCollection } from "@/lib/hooks/iexec/use-subscribe-to-collection";

export default function Home() {
  const [protectedDataAddress, setProtectedDataAddress] = useState<string | null>(
    // "0x175a608592184418bcc4ba9ad7ff6dc4a5164a20",
    null,
  );
  const [collectionId, setCollectionId] = useState<number | null>(null);
  const [data, setData] = useState<string | null>(null);

  // const { mutate: createCollection, isPending: isCreatingCollection } = useCreateCollection({
  //   onSuccess(data) {
  //     console.log("Collection Id", data.collectionId);
  //     setCollectionId(data.collectionId);
  //   },
  // });

  const { mutate: setDataForRenting, isPending: isSellPending } = useSetDataForRenting({
    onSuccess({ protectedDataAddress, collectionId }) {
      console.log("Protected Data Address", protectedDataAddress);
      console.log("Collection Id", collectionId);

      setCollectionId(collectionId);
      setProtectedDataAddress(protectedDataAddress);
    },
  });

  const { mutate: rentData, isPending: isBuyPending } = useRentData({
    onSuccess(data) {
      console.log("Data", data);
      setData(data.content);
    },
  });

  const { mutate: setDataToSubscription, isPending: isSetDataToSubscriptionPending } =
    useSetDataToSubscription({
      onSuccess({ protectedDataAddress, collectionId }) {
        console.log("Protected Data Address", protectedDataAddress);
        console.log("Collection Id", collectionId);

        setCollectionId(collectionId);
        setProtectedDataAddress(protectedDataAddress);
      },
    });

  const { mutate: subscribeToCollection, isPending: isSubscribePending } = useSubscribeToCollection(
    {
      onSuccess(data) {
        console.log("Data", data);
        setData(data.content);
      },
    },
  );

  // const { data: content } = useGetContent(
  //   "0x1936d2fe55b0894fa63db51e8e999d08067836ab3dc4cab6e10483c1fd565e41",
  // );

  // const onCreateCollection = async () => {
  //   createCollection();
  // };

  const onSetDataForRenting = async () => {
    setDataForRenting({
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

  const onRentData = async () => {
    if (!protectedDataAddress) return;

    rentData({
      protectedDataAddress,
      price: 0,
      duration: 60 * 60 * 24 * 30, // 30 days
    });
  };

  const onSetDataToSubscription = async () => {
    setDataToSubscription({
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

  const onSubscribeToCollection = async () => {
    if (!collectionId || !protectedDataAddress) return;

    subscribeToCollection({
      collectionId,
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

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          {/* <Button
          onClick={onCreateCollection}
          loading={isCreatingCollection}
          disabled={isCreatingCollection}
        >
          Create Collection
        </Button> */}

          <Button onClick={onSetDataForRenting} loading={isSellPending} disabled={isSellPending}>
            Set Data For Renting
          </Button>

          <Button onClick={onRentData} loading={isBuyPending} disabled={isBuyPending}>
            Rent Data
          </Button>
        </div>

        <div className="h-px w-full bg-gray-200" />

        <div className="flex items-center gap-2">
          <Button
            onClick={onSetDataToSubscription}
            loading={isSetDataToSubscriptionPending}
            disabled={isSetDataToSubscriptionPending}
          >
            Set Data To Subscription
          </Button>

          <Button
            onClick={onSubscribeToCollection}
            loading={isSubscribePending}
            disabled={isSubscribePending}
          >
            Subscribe To Collection
          </Button>
        </div>
      </div>
    </div>
  );
}
