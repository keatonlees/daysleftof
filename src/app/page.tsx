"use client";

import FlipClock from "@/components/FlipClock/FlipClock";
import { CounterType } from "@/lib/Types";
import getFormattedURL from "@/util/getFormattedURL";
import { Eye } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { getRecentCounters } from "./actions";

export default function Home() {
  const router = useRouter();

  const [countersData, setCountersData] = useState<CounterType[]>([]);
  const [loadingCounters, setLoadingCounters] = useState<boolean>(true);

  useEffect(() => {
    const fetchCounters = async () => {
      const { data: countersData, error } = await getRecentCounters();
      if (error) return;
      if (countersData) setCountersData(countersData);
      setLoadingCounters(false);
    };

    fetchCounters();
  }, []);

  const handleExplore = () => {
    const element = document.getElementById("recents");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center text-center min-h-screen gap-8 lg:gap-16 p-8">
        <p className="text-5xl lg:text-9xl font-bold">
          Super Simple Countdowns
        </p>

        <FlipClock endDate={new Date("2027-05-24")} />

        <div className="flex gap-2">
          <button
            className="btn btn-md lg:btn-lg btn-neutral btn-outline"
            onClick={handleExplore}
          >
            Explore
          </button>
          <button
            className="btn btn-md lg:btn-lg btn-primary"
            onClick={() => router.push("/profile")}
          >
            Create
          </button>
        </div>
      </div>

      <div className="pb-24 px-4 md:px-12 xl:px-24" id="recents">
        <h1 className="text-2xl font-bold mb-4 px">
          Recently Created Counters
        </h1>
        {loadingCounters ? (
          <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((e, i) => (
              <div key={i} className="skeleton h-40 flex-1">
                {e}
              </div>
            ))}
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
                  <div className="w-full ">
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
                    </div>

                    <Link
                      href={`/${getFormattedURL(counter.title)}/${counter.sid}`}
                      className="btn btn-sm xl:btn-md btn-primary w-full"
                    >
                      <Eye />
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
