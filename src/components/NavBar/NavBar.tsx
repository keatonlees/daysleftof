"use client";

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

export default function NavBar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return (
    <div className="fixed navbar bg-base-100 shadow-md">
      {/* left aligned */}
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost text-xl">
          DaysLeftOf
        </Link>
      </div>

      {/* right aligned */}
      <div className="flex-none flex gap-1">
        <Link href="/#recents" className="btn btn-ghost">
          Explore
        </Link>
        {user ? (
          <>
            <Link href="/profile" className="btn btn-ghost">
              Profile
            </Link>
            <button onClick={handleLogout} className="btn btn-ghost">
              Logout
            </button>
          </>
        ) : (
          <Link href="/login" className="btn btn-ghost">
            Login
          </Link>
        )}
      </div>
    </div>
  );
}
