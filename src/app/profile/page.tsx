"use client";

import { useAuth } from "@/contexts/AuthContext";
import { CounterType } from "@/lib/Types";
import getFormattedURL from "@/util/getFormattedURL";
import { Trash2 } from "lucide-react";
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

  const handleDelete = async (id: string) => {
    console.log("Deleting counter...");
    if (!id) return;
    const { error } = await deleteCounter(id);
    if (error) return;

    setCountersData(countersData.filter((counter) => counter.id !== id));
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
        {loadingNew ? "Creating..." : "New Counter +"}
      </button>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Your Counters</h2>
        {loadingCounters ? (
          <p>Loading...</p>
        ) : countersData.length === 0 ? (
          <p>No counters found.</p>
        ) : (
          <div className="grid gap-4">
            {countersData.map((counter) => (
              <div key={counter.id} className="card bg-base-200">
                <div className="card-body">
                  <h3 className="card-title">{counter.title}</h3>
                  <h3 className="card-title">{counter.end_date.toString()}</h3>
                  <div className="flex gap-2">
                    <Link
                      href={`/${getFormattedURL(counter.title)}/${counter.sid}`}
                      className="btn btn-primary flex-1"
                    >
                      View
                    </Link>
                    <button
                      className="btn btn-circle btn-error"
                      onClick={() => handleDelete(counter.id)}
                    >
                      <Trash2 />
                    </button>
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
