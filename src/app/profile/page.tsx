"use client";

import DeleteButton from "@/components/Buttons/DeleteButton";
import { useAuth } from "@/contexts/AuthContext";
import { BASE_URL_DEV, BASE_URL_PROD } from "@/lib/Constants";
import { CounterType } from "@/lib/Types";
import getFormattedURL from "@/util/getFormattedURL";
import { Clipboard, Eye, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { addNewCounter, deleteCounter, getCountersByUID } from "./actions";

export default function Profile() {
  const router = useRouter();
  const { user } = useAuth();

  const [countersData, setCountersData] = useState<CounterType[]>([]);
  const [loadingCounters, setLoadingCounters] = useState<boolean>(true);
  const [loadingNew, setLoadingNew] = useState<boolean>(false);
  const [loadingDelete, setLoadingDelete] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    const fetchCounters = async () => {
      if (!user) return;
      const { data: countersData, error } = await getCountersByUID(user.id);
      if (error) return;
      if (countersData) setCountersData(countersData);
      setLoadingCounters(false);
    };

    fetchCounters();
  }, [user]);

  const handleNew = async () => {
    console.log("Creating new counter");
    setLoadingNew(true);
    if (!user) return;
    const { data: newCounter, error } = await addNewCounter(user.id);
    if (error) return;
    if (newCounter)
      router.push(`/${getFormattedURL(newCounter.title)}/${newCounter.sid}`);

    setLoadingNew(false);
  };

  const handleDelete = async (counterId: string) => {
    setLoadingDelete((prev) => ({ ...prev, [counterId]: true }));

    const { error } = await deleteCounter(counterId);

    if (error) {
      console.error("Error deleting counter:", error);
      setLoadingDelete((prev) => ({ ...prev, [counterId]: false }));
      return;
    }

    setCountersData((prev) =>
      prev.filter((counter) => counter.id !== counterId)
    );
    setLoadingDelete((prev) => ({ ...prev, [counterId]: false }));
  };

  const handleCopyLink = (counter: CounterType) => {
    const isDevelopment = process.env.NODE_ENV === "development";
    const baseUrl = isDevelopment ? BASE_URL_DEV : BASE_URL_PROD;

    const shareUrl = `${baseUrl}/${getFormattedURL(counter.title)}/${
      counter.sid
    }`;

    navigator.clipboard.writeText(shareUrl).catch((err) => {
      console.error("Failed to copy link:", err);
    });
  };

  return (
    <div className="p-24">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <div className="mb-4">
        <p>ID: {user?.id}</p>
        <p>Email: {user?.email}</p>
      </div>

      <button
        className="btn btn-success"
        onClick={handleNew}
        disabled={loadingNew}
      >
        {loadingNew ? (
          "Creating..."
        ) : (
          <>
            <Plus />
            New Counter
          </>
        )}
      </button>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Your Counters</h2>
        {loadingCounters ? (
          <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((e, i) => (
              <div key={i} className="skeleton h-40 flex-1">
                {e}
              </div>
            ))}
          </div>
        ) : countersData.length === 0 ? (
          <div className="p-32 flex flex-col gap-4 justify-center items-center">
            <h1 className="text-4xl font-bold">
              Create a new counter to get started!
            </h1>
            <button
              className="btn btn-success"
              onClick={handleNew}
              disabled={loadingNew}
            >
              {loadingNew ? (
                "Creating..."
              ) : (
                <>
                  <Plus />
                  New Counter
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {countersData.map((counter) => (
              <div key={counter.id} className="card bg-base-200">
                <div className="card-body">
                  <div className="flex justify-between">
                    <h1 className="text-xl font-bold">{counter.title}</h1>
                    <h1 className="text-md font-bold">
                      {counter.is_public ? "Public" : "Private"}
                    </h1>
                  </div>
                  <h1 className="text-md mb-2">
                    Ends{" "}
                    {new Date(counter.end_date).toLocaleString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                      timeZoneName: "short",
                    })}
                  </h1>
                  <div className="flex gap-2">
                    <Link
                      href={`/${getFormattedURL(counter.title)}/${counter.sid}`}
                      className="btn btn-primary flex-1"
                    >
                      <Eye />
                      View
                    </Link>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleCopyLink(counter)}
                    >
                      <Clipboard />
                      Copy Link
                    </button>
                    <DeleteButton
                      onDelete={() => handleDelete(counter.id)}
                      itemName={counter.title}
                      isLoading={loadingDelete[counter.id]}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
