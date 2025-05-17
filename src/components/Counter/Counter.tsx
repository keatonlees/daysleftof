"use client";

import { getCounterBySID, updateCounter } from "@/app/[...slug]/actions";
import { useAuth } from "@/contexts/AuthContext";
import { BASE_URL_DEV, BASE_URL_PROD } from "@/lib/Constants";
import { CounterType, ToastState } from "@/lib/Types";
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
import Toast from "../Toast/Toast";

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

  const [isEditingDate, setIsEditingDate] = useState<boolean>(false);

  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
  const [editedTitle, setEditedTitle] = useState<string>("");

  const [counterData, setCounterData] = useState<CounterType | null>(null);
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [dateValue, onChangeDate] = useState<Value>(new Date());
  const [timeValue, onChangeTime] = useState<string | null>("00:00");

  const isDevelopment = process.env.NODE_ENV === "development";
  const baseUrl = isDevelopment ? BASE_URL_DEV : BASE_URL_PROD;

  const [toast, setToast] = useState<ToastState>({
    isVisible: false,
    message: "",
  });

  useEffect(() => {
    const fetchCounter = async () => {
      if (!id) return;
      setLoadingCounter(true);
      const { data: counterData, error } = await getCounterBySID(id);

      if (error || !counterData) {
        router.push("/404");
      }

      if (counterData) {
        setCounterData(counterData);
        setEditedTitle(counterData.title);

        const endDate = new Date(counterData.end_date);
        setEndDate(endDate);
        onChangeDate(endDate);

        const hours = endDate.getHours().toString().padStart(2, "0");
        const minutes = endDate.getMinutes().toString().padStart(2, "0");
        onChangeTime(`${hours}:${minutes}`);
      }
      setLoadingCounter(false);
    };

    fetchCounter();
  }, [id, router]);

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

  const handleSaveTitle = async () => {
    if (!counterData) return;

    setLoadingSaveTitle(true);
    const { error } = await updateCounter(counterData.id, {
      title: editedTitle,
    });

    if (error) {
      setToast({
        isVisible: true,
        message: "Failed to update title",
      });
    } else {
      setCounterData((prev) => (prev ? { ...prev, title: editedTitle } : null));
      setIsEditingTitle(false);
      setToast({
        isVisible: true,
        message: "Title updated successfully",
      });
    }
    setLoadingSaveTitle(false);
  };

  const handleSaveDate = async () => {
    if (!counterData) return;

    setLoadingSaveDate(true);
    const { error } = await updateCounter(counterData.id, {
      end_date: endDate,
    });

    if (error) {
      setToast({
        isVisible: true,
        message: "Failed to update date",
      });
    } else {
      setCounterData((prev) => (prev ? { ...prev, end_date: endDate } : null));
      setIsEditingDate(false);
      setToast({
        isVisible: true,
        message: "Date updated successfully",
      });
    }
    setLoadingSaveDate(false);
  };

  const handleCopyLink = () => {
    if (!counterData) return;

    const shareUrl = `${baseUrl}/${getFormattedURL(counterData.title)}/${
      counterData.sid
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

  if (loadingCounter) {
    return (
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
    );
  }

  if (!counterData) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center max-h-[100svh] gap-8 xl:gap-16">
      {/* === BACK BUTTON === */}

      <div className="absolute top-20 left-4">
        {user && counterData.user_id === user?.id ? (
          <button
            className="btn btn-sm lg:btn-md"
            onClick={() => router.push("/profile")}
          >
            <ArrowLeft />
            Profile
          </button>
        ) : (
          <button
            className="btn btn-sm lg:btn-md"
            onClick={() => router.back()}
          >
            <ArrowLeft />
            Back
          </button>
        )}
      </div>

      <div className="flex flex-row justify-center items-center gap-4 relative">
        <div className="absolute w-32 lg:w-80 text-left left-[-10] lg:left-[-50] top-[-40] lg:top-[-80] -rotate-6 text-2xl lg:text-6xl damion text-primary-content">
          Days Left Of
        </div>
        {isEditingTitle ? (
          <div className="flex items-center gap-2 w-[90vw] md:w-[60vw] xl:w-[40vw]">
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="input w-[100%] input-bordered text-xl xl:text-3xl font-bold text-center"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSaveTitle();
                } else if (e.key === "Escape") {
                  setIsEditingTitle(false);
                  setEditedTitle(counterData.title);
                }
              }}
              autoFocus
            />
            <SaveButton
              onClick={handleSaveTitle}
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
            <h1 className="text-xl lg:text-6xl font-bold max-w-[70vw]">
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
        {isEditingDate ? (
          <div className="flex flex-wrap max-w-[90vw] items-center justify-center gap-2">
            <h1 className="text-2xl">Ends</h1>
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
            <SaveButton onClick={handleSaveDate} isLoading={loadingSaveDate} />
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
            <h1 className="text-lg xl:text-2xl">
              Ends{" "}
              {endDate.toLocaleString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
                timeZoneName: "short",
              })}{" "}
              {user && counterData.user_id === user?.id && (
                <EditButton onClick={() => setIsEditingDate(true)} />
              )}
            </h1>
          </>
        )}
      </div>

      {/* === SHARE === */}
      {baseUrl && counterData.title && counterData.sid && (
        <div className="absolute bottom-4 join w-[90vw] md:w-[40vw] xl:w-[25vw]">
          <input
            type="text"
            value={`${baseUrl}/${getFormattedURL(counterData.title)}/${
              counterData.sid
            }`}
            readOnly
            className="input flex-1"
          />

          <button className="btn btn-primary" onClick={handleCopyLink}>
            <Clipboard />
            Copy
          </button>
        </div>
      )}

      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        onClose={() => setToast((prev) => ({ ...prev, isVisible: false }))}
        type={toast.type}
      />
    </div>
  );
}
