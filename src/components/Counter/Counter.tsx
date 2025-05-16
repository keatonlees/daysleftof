"use client";

import { getCounterBySID, updateCounter } from "@/app/[...slug]/actions";
import { useAuth } from "@/contexts/AuthContext";
import { BASE_URL_DEV, BASE_URL_PROD } from "@/lib/Constants";
import { CounterType } from "@/lib/Types";
import getFormattedURL from "@/util/getFormattedURL";
import { ArrowLeft, Clipboard } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import DatePicker from "react-date-picker";
import TimePicker from "react-time-picker";
import CancelButton from "../Buttons/CancelButton";
import EditButton from "../Buttons/EditButton";
import SaveButton from "../Buttons/SaveButton";
import FlipClock from "../FlipClock/FlipClock";

import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import "react-date-picker/dist/DatePicker.css";
import "react-time-picker/dist/TimePicker.css";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function Counter({ id }: { id: string }) {
  const router = useRouter();
  const { user } = useAuth();

  const [loadingCounter, setLoadingCounter] = useState<boolean>(true);
  const [loadingSaveDate, setLoadingSaveDate] = useState<boolean>(false);
  const [loadingSaveTitle, setLoadingSaveTitle] = useState<boolean>(false);
  const [loadingVisibility, setLoadingVisibility] = useState<boolean>(false);

  const [isEditingDate, setIsEditingDate] = useState<boolean>(false);

  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
  const [editedTitle, setEditedTitle] = useState<string>("");
  const [isPublic, setIsPublic] = useState<boolean>(true);

  const [counterData, setCounterData] = useState<CounterType>(Object);
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [dateValue, onChangeDate] = useState<Value>(new Date());
  const [timeValue, onChangeTime] = useState<string | null>("00:00");

  useEffect(() => {
    const fetchCounter = async () => {
      if (!id) return;
      setLoadingCounter(true);
      const { data: counterData, error } = await getCounterBySID(id);
      if (error) return;
      if (counterData) {
        setCounterData(counterData);
        setEditedTitle(counterData.title);
        setIsPublic(counterData.is_public);

        const endDate = new Date(counterData.end_date);
        setEndDate(endDate);
        onChangeDate(endDate);

        const hours = endDate.getHours().toString();
        const minutes = endDate.getMinutes().toString();
        onChangeTime(`${hours}:${minutes}`);
      }
      setLoadingCounter(false);
    };

    fetchCounter();
  }, [id]);

  useEffect(() => {
    if (dateValue && timeValue) {
      const date = dateValue instanceof Date ? dateValue : new Date();
      const [hours, minutes] = timeValue.split(":").map(Number);

      const combinedDate = new Date(date);
      combinedDate.setHours(hours);
      combinedDate.setMinutes(minutes);
      combinedDate.setSeconds(0);
      combinedDate.setMilliseconds(0);

      setEndDate(combinedDate);
    }
  }, [dateValue, timeValue]);

  const handleUpdateDate = async () => {
    console.log("Saving...");
    setLoadingSaveDate(true);
    if (!id) return;
    const { error } = await updateCounter(id, {
      end_date: endDate,
      modified_at: new Date(),
    });
    if (error) {
      console.error("Error updating date:", error);
      return;
    }

    setIsEditingDate(false);
    setLoadingSaveDate(false);
  };

  const handleUpdateTitle = async () => {
    if (!id) return;
    setLoadingSaveTitle(true);

    const { error } = await updateCounter(id, {
      title: editedTitle,
      modified_at: new Date(),
    });

    if (error) {
      console.error("Error updating title:", error);
      return;
    }

    setCounterData((prev) => ({ ...prev, title: editedTitle }));
    setIsEditingTitle(false);
    setLoadingSaveTitle(false);
  };

  const handleUpdateVisibility = async (isPublic: boolean) => {
    if (!id) return;
    setLoadingVisibility(true);

    const { error } = await updateCounter(id, {
      is_public: isPublic,
      modified_at: new Date(),
    });

    if (error) {
      console.error("Error updating visibility:", error);
      setIsPublic(!isPublic);
      setLoadingVisibility(false);
      return;
    }

    setCounterData((prev) => ({ ...prev, is_public: isPublic }));
    setLoadingVisibility(false);
  };

  const handleCopyLink = () => {
    const isDevelopment = process.env.NODE_ENV === "development";
    const baseUrl = isDevelopment ? BASE_URL_DEV : BASE_URL_PROD;

    const shareUrl = `${baseUrl}/${getFormattedURL(counterData.title)}/${
      counterData.sid
    }`;

    navigator.clipboard.writeText(shareUrl).catch((err) => {
      console.error("Failed to copy link:", err);
    });
  };

  return (
    <div className="flex flex-col items-center gap-16">
      {/* === BACK BUTTON === */}
      <div className="absolute top-20 left-4">
        <button className="btn" onClick={() => router.back()}>
          <ArrowLeft />
          Back
        </button>
      </div>

      {/* === TOGGLE === */}
      {user && counterData.user_id === user?.id && (
        <div className="absolute top-20 flex items-center justify-center gap-2">
          {isPublic ? (
            <span>Private</span>
          ) : (
            <span className="font-bold">Private</span>
          )}
          <input
            type="checkbox"
            checked={isPublic}
            disabled={loadingVisibility}
            onChange={(e) => {
              setIsPublic(e.target.checked);
              handleUpdateVisibility(e.target.checked);
            }}
            className={"toggle border-black text-black"}
          />
          {isPublic ? (
            <span className="font-bold">Public</span>
          ) : (
            <span>Public</span>
          )}
        </div>
      )}

      {loadingCounter ? (
        <div className="flex flex-col justify-center items-center gap-16">
          <div className="skeleton w-96 h-14"></div>
          <div className="flex items-center gap-16 mb-8">
            {[...Array(4)].map((e, i) => (
              <div key={i} className="skeleton w-44 h-32">
                {e}
              </div>
            ))}
          </div>
          <div className="skeleton w-96 h-8"></div>
        </div>
      ) : (
        <>
          <div className="flex flex-row justify-center items-center gap-4 relative">
            <div className="absolute left-[-60] top-[-30] -rotate-6 text-2xl">
              DaysLeftOf
            </div>
            {isEditingTitle ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="input min-w-[40vw] input-bordered text-3xl font-bold text-center"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUpdateTitle();
                    } else if (e.key === "Escape") {
                      setIsEditingTitle(false);
                      setEditedTitle(counterData.title);
                    }
                  }}
                  autoFocus
                />
                <SaveButton
                  onClick={handleUpdateTitle}
                  isLoading={loadingSaveTitle}
                />
                <CancelButton
                  onClick={() => {
                    setIsEditingTitle(false);
                    setEditedTitle(counterData.title);
                  }}
                />
              </div>
            ) : (
              <>
                <h1 className="text-6xl font-bold max-w-[70vw]">
                  {counterData.title}
                </h1>
                {user && counterData.user_id === user?.id && (
                  <EditButton onClick={() => setIsEditingTitle(true)} />
                )}
              </>
            )}
          </div>

          <FlipClock endDate={endDate} />

          <div className="flex items-center justify-center gap-2">
            <h1 className="text-2xl">Ends </h1>
            {isEditingDate ? (
              <div className="flex items-center justify-center gap-2">
                <DatePicker
                  onChange={onChangeDate}
                  value={dateValue}
                  calendarProps={{ calendarType: "gregory" }}
                  clearIcon={null}
                  className="h-[40px]"
                />
                <h1 className="text-2xl">at</h1>
                <TimePicker
                  onChange={onChangeTime}
                  value={timeValue}
                  clearIcon={null}
                  disableClock={true}
                  className="h-[40px]"
                />
                <h1 className="text-2xl">
                  {endDate
                    .toLocaleString(undefined, {
                      minute: "2-digit",
                      timeZoneName: "short",
                    })
                    .slice(-3)}
                </h1>
                <SaveButton
                  onClick={handleUpdateDate}
                  isLoading={loadingSaveDate}
                />
                <CancelButton
                  onClick={() => {
                    setIsEditingDate(false);

                    const endDate = new Date(counterData.end_date);
                    setEndDate(endDate);
                    onChangeDate(endDate);

                    const hours = endDate.getHours().toString();
                    const minutes = endDate.getMinutes().toString();
                    onChangeTime(`${hours}:${minutes}`);
                  }}
                />
              </div>
            ) : (
              <>
                <h1 className="text-2xl">
                  {endDate.toLocaleString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    timeZoneName: "short",
                  })}
                </h1>
                {user && counterData.user_id === user?.id && (
                  <EditButton onClick={() => setIsEditingDate(true)} />
                )}
              </>
            )}
          </div>
        </>
      )}

      {/* === SHARE === */}
      <div className="absolute bottom-4">
        <button className="btn btn-primary" onClick={handleCopyLink}>
          <Clipboard />
          Copy Link
        </button>
      </div>
    </div>
  );
}
