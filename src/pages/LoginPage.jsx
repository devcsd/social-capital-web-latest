"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Login from "../images/login.svg";
import { useNavigate } from "react-router-dom";
import localforage from "localforage";
import { useAuth } from "../Auth/AuthContext";
import { loginApi, verifyOtpApi } from "../api/api";
import { SiCashapp } from "react-icons/si";
import { FaRegCopyright } from "react-icons/fa";

export default function EmailOtpLogin() {
  const [formData, setFormData] = useState({ email: "", otp: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [userId, setUserId] = useState("");

  const otpRef = useRef([]);
  const navigate = useNavigate();
  const { setUser, login } = useAuth(); // from AuthContext

  useEffect(() => {
    if (otpSent && otpRef.current[0]) otpRef.current[0].focus();
  }, [otpSent]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateEmail = () => {
    if (!formData.email) return "Email is required";
    if (!/\S+@\S+\.\S+/.test(formData.email)) return "Enter a valid email";
    return "";
  };

  const handleGetOtp = async (e) => {
    e.preventDefault();
    const emailError = validateEmail();
    if (emailError)
      return setErrors({ email: emailError, message: "Invalid Email" });

    try {
      setLoading(true);
      const { data } = await loginApi({
        emailId: formData.email,
        platform: "web",
      });

      if (!data?.userId) throw new Error("Failed to send OTP");

      const userData = {
        emailId: data.emailId || "",
        firstName: data.firstName || "",
        fullName: data.fullName || "",
        profileImage: data.profileImage || "",
        profileName: data.profileName || "",
        userId: data.userId || "",
        token: data.token || "",
      };
      setUser(userData);
      await localforage.setItem("user", userData);
      setUserId(data.userId);

      setOtpSent(true);
      setErrors({});
    } catch (err) {
      setErrors({
        email: err.message || "Failed to send OTP",
        message: "Failed to send OTP",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, "");
    const otpArray = formData.otp.padEnd(4, "").split("");
    otpArray[index] = value;
    const newOtp = otpArray.join("").slice(0, 4);
    setFormData((prev) => ({ ...prev, otp: newOtp }));

    if (value && index < 3 && otpRef.current[index + 1])
      otpRef.current[index + 1].focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !formData.otp[index] && index > 0) {
      otpRef.current[index - 1]?.focus();
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (formData.otp.length !== 4)
      return setErrors({ otp: "Enter 4-digit OTP" });

    try {
      setLoading(true);
      const { data } = await verifyOtpApi({
        userId,
        otpCode: formData.otp,
      });

      if (!data?.token) throw new Error("Invalid OTP");
      const storedUser = (await localforage.getItem("user")) || {};
      const updatedUser = { ...storedUser, token: data.token };

      // Save updated user with token
      await localforage.setItem("user", updatedUser);
      setUser(updatedUser);
      login();

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      setErrors({
        otp: err.message || "OTP verification failed",
        message: "Invalid OTP",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <section className="bg-primary min-h-screen flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-6xl bg-gray-900/40 backdrop-blur-xl border border-gray-700/30 shadow-2xl rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
          {/* Left Panel - Image */}
          <div
            className="hidden md:block bg-cover bg-center"
            style={{ backgroundImage: `url(${Login})` }}>
            <div className="h-full w-full" />
          </div>

          {/* Right Panel - Login Form */}
          <motion.form
            onSubmit={otpSent ? handleLogin : handleGetOtp}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full p-8 md:p-12 space-y-6">
            <h2 className="text-2xl font-bold text-center text-white">
              {otpSent ? "Enter 4-digit OTP" : "Login to Social Capital"}
            </h2>

            {/* Email */}
            <div>
              <label className="block text-sm text-gray-200">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={otpSent}
                className={`mt-1 w-full p-3 rounded-xl bg-gray-800/50 border text-white focus:outline-none focus:ring-2 ${
                  errors.email
                    ? "border-error focus:ring-red-400"
                    : "border-gray-600 focus:ring-secondary/60"
                }`}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="text-sm text-error mt-1">{errors.message}</p>
              )}
            </div>

            {/* OTP Inputs */}
            {otpSent && (
              <div>
                <label className="block text-sm text-gray-200 mb-2">OTP</label>
                <div className="flex justify-center gap-2 sm:gap-3">
                  {[0, 1, 2, 3].map((i) => (
                    <input
                      key={i}
                      ref={(el) => (otpRef.current[i] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={formData.otp[i] || ""}
                      onChange={(e) => handleOtpChange(e, i)}
                      onKeyDown={(e) => handleKeyDown(e, i)}
                      className={`w-12 h-12 sm:w-14 sm:h-14 text-center text-xl sm:text-2xl font-semibold rounded-lg sm:rounded-xl bg-gray-800/50 border text-white focus:outline-none focus:ring-2 ${
                        errors.otp
                          ? "border-error focus:ring-red-400"
                          : "border-gray-600 focus:ring-secondary/60"
                      }`}
                    />
                  ))}
                </div>

                {errors.otp && (
                  <p className="text-sm text-error mt-2">{errors.message}</p>
                )}
              </div>
            )}

            {/* Buttons */}
            <div className="space-y-3">
              {!otpSent && (
                <motion.button
                  type={otpSent ? "submit" : "button"}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={otpSent ? undefined : handleGetOtp}
                  disabled={loading || otpSent}
                  className={`w-full py-3 rounded-xl font-semibold shadow-md text-primary ${
                    otpSent
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-secondary hover:bg-[#ffd633]"
                  }`}>
                  {loading
                    ? "Please wait..."
                    : otpSent
                    ? "OTP Sent"
                    : "Get OTP"}
                </motion.button>
              )}

              {otpSent && (
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading || formData.otp.length < 4}
                  className="w-full py-3 rounded-xl font-semibold shadow-md bg-secondary text-primary hover:bg-[#ffd633]">
                  {loading ? "Verifying..." : "Login"}
                </motion.button>
              )}
            </div>
          </motion.form>
        </div>
      </section>

      {/* Footer Section */}
      <div className="mt-[-50px] ml-5 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <SiCashapp className="text-white h-8 w-8" />
          <span className="ml-[-5px] font-semibold tracking-wide font-inter">
            <span className="text-white">ocial</span>
            <span className="text-secondary">Capital</span>
          </span>
        </div>
        <div className="space-y-2">
          <p className="text-white flex items-center gap-2 font-inter text-sm">
            <FaRegCopyright />
            2025 Copyright | Social Capital
          </p>
        </div>
      </div>
    </section>
  );
}
