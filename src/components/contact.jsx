import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Modal, message } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { supportCategory, SupportEnquiry } from "../api/api";
import toast from "react-hot-toast";

export default function ContactPopup() {
  const [open, setOpen] = useState(false);
  const [reasons, setReasons] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullname: "",
    email: "",
    mobile: "",
    category: "",
    message: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchSupportCategory = async () => {
      try {
        const res = await supportCategory();
        setReasons(res.data.data.support_category);
      } catch (error) {
        console.error("Error fetching support categories:", error);
      }
    };

    fetchSupportCategory();
  }, []);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;

    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = originalOverflow;
    }

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  // useEffect(() => {
  //   console.log("The Reasons ", reasons);
  // }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // remove error when typing
    setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    let newErrors = {};

    // Fullname mandatory
    if (!form.fullname.trim()) {
      newErrors.fullname = "Fullname is required";
    }

    // Either mobile or email required
    if (!form.mobile.trim() && !form.email.trim()) {
      newErrors.mobile = "Mobile or Email is required";
      newErrors.email = "Mobile or Email is required";
    }

    // Category mandatory
    if (!form.category) {
      newErrors.category = "Please select a Reason";
    }

    // Message mandatory for all categories
    if (!form.message.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const payload = {
      name: form.fullname,
      email: form.email,
      mobile: form.mobile,
      supportCategoryId: form.category,
      message: form.message,
    };

    console.log("Payload 👉", payload);

    try {
      setLoading(true); // ✅ start loading

      const response = await SupportEnquiry(payload);

      console.log("API Response 👉", response);

      // ✅ Check API success
      if (response?.data?.success === true) {
        toast.success(
          response?.data?.message ||
            "Your enquiry has been submitted successfully!",
        );
        // Reset form
        setForm({
          fullname: "",
          email: "",
          mobile: "",
          category: "",
          message: "",
        });

        setOpen(false);
      } else {
        toast.error(response?.data?.message || "something went wrong");
      }
    } catch (error) {
      console.error("Submit error:", error.message);
      toast.error(
        error?.response?.data?.message ||
          "Server error, please try again later",
      );
    } finally {
      setLoading(false); // ✅ stop loading always
    }
  };

  const modalContent = open ? (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#050816]/80 backdrop-blur-xl p-6"
      onClick={() => setOpen(false)}>
      {/* Form Card */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="
      relative
      w-full
      max-w-[680px]
      rounded-[30px]
      border border-white/10
      bg-[linear-gradient(180deg,#17154A_0%,#14123D_100%)]
      shadow-[0_30px_80px_rgba(0,0,0,.55)]
      backdrop-blur-2xl
      p-8
      md:p-10
      animate-[modalScale_.35s_ease]
      max-h-[90vh]
      overflow-y-auto
  ">
            {/* Close */}
            <button
              onClick={() => setOpen(false)}
              className="
      absolute
      right-6
      top-6
      h-11
      w-11
      rounded-full
      bg-white/5
      border
      border-white/10
      flex
      items-center
      justify-center
      text-[#FFC72C]
      transition-all
      duration-300
      hover:bg-[#FFC72C]
      hover:text-black
      hover:rotate-90
  ">
              <CloseOutlined className="text-lg" />
            </button>

            {/* Header */}
            <div className="mb-8 text-center">
              <h2 className="text-[38px] font-bold leading-tight">
                <span className="text-[#FFC72C]">Social Capital</span>
                <span className="text-white"> — Let's Connect</span>
              </h2>

              <p className="mt-3 text-[17px] text-white/70">
                We're here to answer your questions and guide you forward.
              </p>
            </div>

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
                    placeholder="Enter your Fullname"
                    value={form.fullname}
                    onChange={handleChange}
                    className="w-full p-2.5 rounded-md bg-white/15 placeholder-gray-400 text-white focus:outline-none text-sm"
                  />
                  {errors.fullname && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.fullname}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-gray-300 text-sm mb-1 block">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full p-2.5 rounded-md bg-white/15 placeholder-gray-400 text-white focus:outline-none text-sm"
                  />
                  {errors.email && (
                    <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-300 text-sm mb-1 block">
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    name="mobile"
                    onChange={handleChange}
                    value={form.mobile}
                    placeholder="Enter your Mobile number"
                    className="w-full p-2.5 rounded-md bg-white/15 placeholder-gray-400 text-white focus:outline-none text-sm"
                  />
                  {errors.mobile && (
                    <p className="text-red-400 text-xs mt-1">{errors.mobile}</p>
                  )}
                </div>
                {/* Category */}
                <div>
                  <label className="text-gray-300 text-sm mb-1 block">
                    Choose You Category
                  </label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-white/10 text-white">
                    <option value="" className="bg-[#14123A] text-white">
                      Select Category *
                    </option>

                    {reasons?.map((item) => (
                      <option
                        key={item.id}
                        value={item.id} // ✅ ID as value
                        className="bg-[#14123A] text-white">
                        {item.label} {/* ✅ Label shown */}
                      </option>
                    ))}
                  </select>

                  {errors.category && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.category}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="text-gray-300 text-sm mb-1 block">
                  Message
                </label>
                <textarea
                  name="message"
                  onChange={handleChange}
                  value={form.message}
                  rows="3"
                  placeholder="Type your message..."
                  className="w-full p-2.5 rounded-md bg-white/15 placeholder-gray-400 text-white focus:outline-none text-sm"
                />
                {errors.message && (
                  <p className="text-red-400 text-xs mt-1">{errors.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="
      w-full
      h-[58px]
      rounded-xl
      bg-gradient-to-r
      from-[#FFD23F]
      to-[#F7B500]
      text-black
      text-[18px]
      font-semibold
      shadow-[0_15px_35px_rgba(255,199,44,.35)]
      transition-all
      duration-300
      hover:scale-[1.02]
      hover:shadow-[0_20px_45px_rgba(255,199,44,.55)]
      disabled:opacity-60
  ">
                {loading ? "Submitting..." : "Submit"}
              </button>
            </form>

            <div
              className="
      mt-8
      rounded-2xl
      border
      border-white/10
      bg-white/5
      backdrop-blur-xl
      p-6
      text-center
  ">
              <h3 className="text-[#FFC72C] text-xl font-semibold">
                Enquiries & Support
              </h3>

              <p className="mt-2 text-white/70">
                Submit your details and our team will contact you shortly.
              </p>
            </div>

            <p className="text-center text-[10px] sm:text-xs text-gray-500 mt-5">
              © {new Date().getFullYear()} Social Capital • All rights reserved.
            </p>
          </div>
        </div>
  ) : null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-5 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-semibold rounded-lg hover:brightness-110 transition text-sm sm:text-base">
        Contact us
      </button>

      {typeof document !== "undefined" && open
        ? createPortal(modalContent, document.body)
        : null}
    </>
  );
}
