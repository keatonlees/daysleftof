"use client";

import { getCounterBySID, updateCounter } from "@/app/[...slug]/actions";
import { useAuth } from "@/contexts/AuthContext";
import { CounterType } from "@/lib/Types";
import { LoaderCircle, Pencil, Save, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import DatePicker from "react-date-picker";
import TimePicker from "react-time-picker";
import FlipClock from "../FlipClock/FlipClock";

import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import "react-date-picker/dist/DatePicker.css";
import "react-time-picker/dist/TimePicker.css";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function Counter({ id }: { id: string }) {
  const { user } = useAuth();

  // const [loadingCounter, setLoadingCounter] = useState<boolean>(true);
  const [loadingSaveDate, setLoadingSaveDate] = useState<boolean>(false);
  const [loadingSaveTitle, setLoadingSaveTitle] = useState<boolean>(false);

  const [isEditingDate, setIsEditingDate] = useState<boolean>(false);

  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
  const [editedTitle, setEditedTitle] = useState<string>("");

  const [counterData, setCounterData] = useState<CounterType>(Object);
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [dateValue, onChangeDate] = useState<Value>(new Date());
  const [timeValue, onChangeTime] = useState<string | null>("00:00");

  useEffect(() => {
    const fetchCounter = async () => {
      if (!id) return;
      // setLoadingCounter(true);
      const { data: counterData, error } = await getCounterBySID(id);
      if (error) return;
      if (counterData) {
        setCounterData(counterData);
        setEditedTitle(counterData.title);

        const endDate = new Date(counterData.end_date);
        setEndDate(endDate);
        onChangeDate(endDate);

        const hours = endDate.getHours().toString();
        const minutes = endDate.getMinutes().toString();
        onChangeTime(`${hours}:${minutes}`);
      }
      // setLoadingCounter(false);
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
    });

    if (error) {
      console.error("Error updating title:", error);
      return;
    }

    setCounterData((prev) => ({ ...prev, title: editedTitle }));
    setIsEditingTitle(false);
    setLoadingSaveTitle(false);
  };

  return (
    <div className="flex flex-col items-center gap-16">
      <div className="flex flex-row justify-center items-center gap-4">
        {isEditingTitle ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="input min-w-[50vw] input-bordered text-4xl font-bold text-center"
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
            <button
              className="btn btn-circle btn-success"
              onClick={handleUpdateTitle}
              disabled={loadingSaveTitle}
            >
              {loadingSaveTitle ? "..." : <Save />}
            </button>
            <button
              className="btn btn-circle btn-error"
              onClick={() => {
                setIsEditingTitle(false);
                setEditedTitle(counterData.title);
              }}
            >
              <X />
            </button>
          </div>
        ) : (
          <>
            <h1 className="text-4xl font-bold">{counterData.title}</h1>
            {counterData.user_id === user?.id && (
              <button
                className="btn btn-circle btn-warning"
                onClick={() => setIsEditingTitle(true)}
              >
                <Pencil />
              </button>
            )}
          </>
        )}
      </div>

      <FlipClock endDate={endDate} />

      <div className="flex items-center justify-center gap-2">
        <h1 className="text-4xl font-bold">Ends </h1>
        {isEditingDate ? (
          <div className="flex items-center justify-center gap-2">
            <DatePicker
              onChange={onChangeDate}
              value={dateValue}
              calendarProps={{ calendarType: "gregory" }}
              clearIcon={null}
              className="h-[40px]"
            />
            <TimePicker
              onChange={onChangeTime}
              value={timeValue}
              clearIcon={null}
              disableClock={true}
              className="h-[40px]"
            />
            <button
              className="btn btn-circle btn-success"
              onClick={handleUpdateDate}
            >
              {loadingSaveDate ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                <Save />
              )}
            </button>
            <button
              className="btn btn-circle btn-error"
              onClick={() => setIsEditingDate(false)}
            >
              <X />
            </button>
          </div>
        ) : (
          <>
            <h1 className="text-4xl font-bold">
              {endDate.toLocaleString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
                timeZoneName: "short",
              })}
            </h1>
            {counterData.user_id === user?.id && (
              <button
                className="btn btn-circle btn-warning"
                onClick={() => setIsEditingDate(true)}
              >
                <Pencil />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
