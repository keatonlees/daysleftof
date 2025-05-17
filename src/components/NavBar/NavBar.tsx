"use client";

import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

import logo from "@/../public/logo.png";

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
    <div className="fixed navbar max-w-screen bg-base-100 shadow-md z-100">
      {/* left aligned */}
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost text-xl">
          <Image src={logo} alt="website-logo" className="w-12 h-12" />
        </Link>
      </div>

      {/* right aligned */}
      <div className="flex-none flex gap-1">
        <Link href="/#recents" className="btn btn-sm lg:btn-md btn-ghost">
          Explore
        </Link>
        {user ? (
          <>
            <Link href="/profile" className="btn btn-sm lg:btn-md btn-ghost">
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="btn btn-sm lg:btn-md btn-ghost"
            >
              Logout
            </button>
          </>
        ) : (
          <Link href="/login" className="btn btn-sm lg:btn-md btn-ghost">
            Login
          </Link>
        )}
      </div>
    </div>
  );
}
