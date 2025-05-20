"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeClosed } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function LoginPage() {
  const { user, signIn } = useAuth();
  const router = useRouter();

  const [error, setError] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Login
    try {
      setLoading(true);
      setError("");
      await signIn(email, password);
      router.push("/");
    } catch (e: unknown) {
      setError((e as Error).message || "Failed to login.");
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  // if user is already logged in, don't render
  if (user) return null;

  return (
    <div className="flex w-full h-screen justify-center items-center">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="card-title text-2xl font-bold">Login</h1>

          {error && (
            <div className="alert alert-error text-white">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            {/* Email Input */}
            <div className="form-control">
              <h1 className="label">
                <span className="label-text">
                  Email<span className="text-error">*</span>
                </span>
              </h1>
              <label className="input w-full rounded-xl">
                <input
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>
            </div>

            {/* Password Input */}
            <div className="form-control">
              <h1 className="label">
                <span className="label-text">
                  Password<span className="text-error">*</span>
                </span>
              </h1>
              <label className="input w-full rounded-xl">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Mypassword123"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span
                  className="btn btn-sm btn-circle bg-transparent border-none"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <Eye size={16} /> : <EyeClosed size={16} />}
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="form-control mt-4">
              <button
                type="submit"
                className="btn btn-primary rounded-xl w-full"
                disabled={loading}
              >
                {loading ? "Logging In..." : "Login"}
              </button>
            </div>
          </form>

          <div className="text-center mt-2 ">
            <p>Don&apos;t have an account?</p>
            <Link href="/signup" className="link">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
