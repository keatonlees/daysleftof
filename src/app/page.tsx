"use client";

import FlipClock from "@/components/FlipClock/FlipClock";
import Footer from "@/components/Footer/Footer";
import Toast from "@/components/Toast/Toast";
import { BASE_URL_DEV, BASE_URL_PROD } from "@/lib/Constants";
import { CounterType, ToastState } from "@/lib/Types";
import getFormattedURL from "@/util/getFormattedURL";
import { Clipboard, Eye } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { getRecentCounters } from "./actions";

export default function Home() {
  const router = useRouter();

  const [countersData, setCountersData] = useState<CounterType[]>([]);
  const [loadingCounters, setLoadingCounters] = useState<boolean>(true);

  const [toast, setToast] = useState<ToastState>({
    isVisible: false,
    message: "",
  });

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

  return (
    <>
      <div className="flex flex-col items-center justify-center text-center min-h-screen gap-8 lg:gap-16 p-8">
        <p className="text-5xl lg:text-9xl font-bold">
          Super Simple Countdowns
        </p>

        <FlipClock endDate={new Date("2027-08-21")} />

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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <Link
                        href={`/${getFormattedURL(counter.title)}/${
                          counter.sid
                        }`}
                        className="btn btn-sm xl:btn-md btn-primary flex-1"
                      >
                        <Eye />
                        View
                      </Link>
                      <button
                        className="btn btn-sm xl:btn-md btn-primary flex-2"
                        onClick={() => handleCopyLink(counter)}
                      >
                        <Clipboard />
                        Copy Link
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <Toast
          isVisible={toast.isVisible}
          message={toast.message}
          onClose={() => setToast((prev) => ({ ...prev, isVisible: false }))}
          type={toast.type}
        />
      </div>

      <Footer />
    </>
  );
}
