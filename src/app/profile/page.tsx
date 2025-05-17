"use client";

import DeleteButton from "@/components/Buttons/DeleteButton";
import Toast from "@/components/Toast/Toast";
import { useAuth } from "@/contexts/AuthContext";
import { BASE_URL_DEV, BASE_URL_PROD } from "@/lib/Constants";
import { CounterType, ToastState } from "@/lib/Types";
import getFormattedURL from "@/util/getFormattedURL";
import { Clipboard, Eye, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { updateCounter } from "../[...slug]/actions";
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

  const [toast, setToast] = useState<ToastState>({
    isVisible: false,
    message: "",
  });

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user, router]);

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

  const handleUpdateVisibility = async (
    counterId: string,
    isPublic: boolean
  ) => {
    if (!counterId) return;

    const { error } = await updateCounter(counterId, {
      is_public: isPublic,
      modified_at: new Date(),
    });

    if (error) {
      console.error("Error updating visibility:", error);
      return;
    }

    setCountersData((prev) =>
      prev.map((counter) =>
        counter.sid === counterId
          ? { ...counter, is_public: isPublic }
          : counter
      )
    );
  };

  const handleCopyLink = (counter: CounterType) => {
    const isDevelopment = process.env.NODE_ENV === "development";
    const baseUrl = isDevelopment ? BASE_URL_DEV : BASE_URL_PROD;

    const shareUrl = `${baseUrl}/${getFormattedURL(counter.title)}/${
      counter.sid
    }`;

    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        setToast({
          isVisible: true,
          message: "Link copied to clipboard!",
        });
      })
      .catch((err) => {
        console.error("Failed to copy link:", err);
        setToast({
          isVisible: true,
          message: "Failed to copy link",
          type: "error",
        });
      });
  };

  if (!user) return null;

  return (
    <div className="pt-20 px-4 md:px-12 xl:px-24">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <div className="mb-4">
        <p>ID: {user?.id}</p>
        <p>Email: {user?.email}</p>
      </div>

      <button
        className="btn btn-sm xl:btn-md btn-success"
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
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {countersData.map((counter) => (
              <div
                key={counter.id}
                className="card bg-base-200 overflow-hidden"
              >
                <div className="card-body justify-between">
                  <div className="flex flex-col justify-between">
                    <h1>Days Left Of</h1>
                    <h1 className="text-xl font-bold">{counter.title}</h1>
                  </div>
                  <div>
                    <div className="flex gap-8 justify-between items-center mb-4">
                      <h1 className="text-md">
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

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={counter.is_public}
                          onChange={(e) => {
                            handleUpdateVisibility(
                              counter.sid,
                              e.target.checked
                            );
                          }}
                          className={"toggle toggle-sm border-black text-black"}
                        />
                        {counter.is_public ? (
                          <span className="font-bold">Public</span>
                        ) : (
                          <span className="font-bold">Private</span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <Link
                        href={`/${getFormattedURL(counter.title)}/${
                          counter.sid
                        }`}
                        className="btn btn-sm xl:btn-md btn-primary flex-2"
                      >
                        <Eye />
                        View & Edit
                      </Link>
                      <button
                        className="btn btn-sm xl:btn-md btn-primary flex-2"
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
              </div>
            ))}
          </div>
        )}
      </div>

      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        onClose={() => setToast((prev) => ({ ...prev, isVisible: false }))}
        type={toast.type}
      />
    </div>
  );
}
