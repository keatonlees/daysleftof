"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeClosed } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function SignUpPage() {
  const { user, signUp } = useAuth();
  const router = useRouter();

  const [error, setError] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length <= 8) {
      setError("Password must be longer than 8 characters");
      return;
    }
    if (!password.match(/[a-z]/g)) {
      setError("Password must contain lowercase letters");
      return;
    }
    if (!password.match(/[A-Z]/g)) {
      setError("Password must contain uppercase letters");
      return;
    }
    if (!password.match(/[0-9]/g)) {
      setError("Password must contain numbers");
      return;
    }
    if (!password.match(/[!@#$%^&*]/g)) {
      setError("Password must contain special characters");
      return;
    }

    // Sign Up
    try {
      setLoading(true);
      setError("");
      await signUp(email, password);
      router.push("/");
    } catch (e: unknown) {
      setError((e as Error).message || "Failed to create your account.");
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
          <h1 className="card-title text-2xl font-bold">Sign Up</h1>

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

            {/* Confirm Password Input */}
            <div className="form-control">
              <h1 className="label">
                <span className="label-text">
                  Confirm Password<span className="text-error">*</span>
                </span>
              </h1>
              <label className="input w-full rounded-xl">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Mypassword123"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <span
                  className="btn btn-sm btn-circle bg-transparent border-none"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <Eye size={16} />
                  ) : (
                    <EyeClosed size={16} />
                  )}
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
                {loading ? "Creating Account..." : "Sign Up"}
              </button>
            </div>
          </form>

          <div className="text-center mt-2 ">
            <p>Already have an account?</p>
            <Link href="/login" className="link">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
