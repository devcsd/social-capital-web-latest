import React, { useState } from "react";
import { Modal, message } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { createSignUp } from "../api/api";
import toast from "react-hot-toast";

export default function JoinPlatformPopup() {
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    fullname: "",
    email: "",
    mobile: "",
    message: "",
    type: "signUp",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  // Validation
  const validate = () => {
    let newErrors = {};

    if (!form.fullname.trim()) {
      newErrors.fullname = "Fullname is required";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (form.mobile && !/^[0-9]{10}$/.test(form.mobile)) {
      newErrors.mobile = "Enter valid 10 digit mobile number";
    }

    if (!form.message.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const payload = {
      name: form.fullname,
      email: form.email,
      mobile: form.mobile,
      message: form.message,
      type: form.type,
    };

    try {
      setLoading(true);

      const response = await createSignUp(payload);

      if (response?.data?.success === true) {
        toast.success(
          response?.data?.message ||
            "Your enquiry has been submitted successfully!",
        );

        setForm({
          fullname: "",
          email: "",
          mobile: "",
          message: "",
          type: "signUp",
        });

        setOpen(false);
      } else {
        toast.error(
          response?.data?.message || "Something went wrong. Please try again.",
        );
      }
    } catch (error) {
      console.error("Submit error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-semibold rounded-lg hover:brightness-110 transition text-sm sm:text-base">
        Join Our Platform
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          {/* Card container */}
          <div className="relative bg-gradient-to-b from-[#0C0A30] to-[#1B1650] text-white rounded-2xl shadow-2xl w-full max-w-[550px] p-5 sm:p-8 max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-amber-400 bg-white/10 p-1.5 rounded-full hover:bg-white/20 transition-all hover:rotate-90">
              <CloseOutlined className="text-lg" />
            </button>

            {/* Header */}
            <h1 className="text-xl sm:text-2xl font-semibold text-center mb-2">
              <span className="text-amber-400">Social Capital</span> — Join Our
              Platform
            </h1>

            <p className="text-center text-gray-300 text-sm sm:text-base mb-6">
              Fill in your details to unlock access to our private network.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-300 text-sm mb-1 block">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="fullname"
                    value={form.fullname}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="w-full p-3 rounded-md bg-white/15 placeholder-gray-400 text-white focus:outline-none text-sm"
                  />

                  {errors.fullname && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.fullname}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-gray-300 text-sm mb-1 block">
                    Mobile Number
                  </label>

                  <input
                    type="text"
                    name="mobile"
                    value={form.mobile}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    className="w-full p-3 rounded-md bg-white/15 placeholder-gray-400 text-white focus:outline-none text-sm"
                  />

                  {errors.mobile && (
                    <p className="text-red-400 text-xs mt-1">{errors.mobile}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="text-gray-300 text-sm mb-1 block">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full p-3 rounded-md bg-white/15 placeholder-gray-400 text-white focus:outline-none text-sm"
                />

                {errors.email && (
                  <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="text-gray-300 text-sm mb-1 block">
                  Message
                </label>

                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Type your message..."
                  className="w-full p-3 rounded-md bg-white/15 placeholder-gray-400 text-white focus:outline-none text-sm"
                />

                {errors.message && (
                  <p className="text-red-400 text-xs mt-1">{errors.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-semibold p-3 rounded-lg hover:brightness-110 transition text-sm sm:text-base ${
                  loading ? "opacity-60 cursor-not-allowed" : ""
                }`}>
                {loading ? "Submitting..." : "Request Access"}
              </button>
            </form>

            {/* Footer Box */}
            <div className="bg-white/10 p-4 rounded-lg mt-6 text-center">
              <h3 className="text-amber-400 font-semibold text-sm sm:text-base mb-1">
                Exclusive Access
              </h3>

              <p className="text-gray-300 text-xs sm:text-sm">
                Join our private platform to create and manage trusted community
                groups.
              </p>
            </div>
            <p className="text-center text-[10px] sm:text-xs text-gray-500 mt-5">
              © {new Date().getFullYear()} Social Capital • All rights reserved.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
