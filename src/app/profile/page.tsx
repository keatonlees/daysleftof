"use client";

import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/util/supabase";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface Counter {
  id: string;
  title: string;
  description: string;
}

export default function Profile() {
  const { user } = useAuth();
  const [data, setData] = useState<Counter[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) fetchCounters();
  }, [user]);

  const fetchCounters = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("Counters")
        .select("*")
        .eq("user_id", user?.uid);

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      if (!data) {
        throw new Error("No data returned");
      }

      console.log("Fetched data:", data);
      setData(data);
    } catch (e) {
      console.error("Error fetching counters:", e);
      setError(e instanceof Error ? e.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-24">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <div className="mb-4">
        <p>ID: {user?.uid}</p>
        <p>Email: {user?.email}</p>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Your Counters</h2>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <div className="alert alert-error">
            <p>Error: {error}</p>
          </div>
        ) : data.length === 0 ? (
          <p>No counters found.</p>
        ) : (
          <div className="grid gap-4">
            {data.map((counter) => (
              <div key={counter.id} className="card bg-base-200">
                <div className="card-body">
                  <h3 className="card-title">{counter.id}</h3>
                  <h3 className="card-title">{counter.title}</h3>
                  <h3 className="card-title">{counter.description}</h3>
                  <Link href={`/${counter.id}`} className="btn btn-primary">
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
