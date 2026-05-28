import React, { useState, useEffect } from "react";
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

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-5 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-semibold rounded-lg hover:brightness-110 transition text-sm sm:text-base">
        Contact us
      </button>

      {open && (
        <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center -top-8">
          {/* Form Card */}
          <div className="relative bg-gradient-to-b from-[#0C0A30] to-[#1B1650] text-white rounded-2xl shadow-2xl w-[95%] sm:w-[85%] md:w-[75%] lg:w-[550px] p-5 sm:p-8 max-h-[90vh] overflow-y-auto">
            {/* Close */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-amber-400 bg-white/10 p-1.5 rounded-full hover:bg-white/20 transition-transform hover:rotate-90">
              <CloseOutlined className="text-lg" />
            </button>

            {/* Header */}
            <h1 className="text-xl sm:text-2xl font-semibold text-center mb-2">
              <span className="text-amber-400">Social Capital</span> — Let’s
              Connect
            </h1>

            <p className="text-center text-gray-300 text-sm sm:text-base mb-6">
              We’re here to answer your questions and guide you forward.
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
                className={`w-full bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-semibold p-2.5 rounded-lg hover:brightness-110 transition text-sm sm:text-base ${loading ? "opacity-60 cursor-not-allowed" : ""}`}>
                {loading ? "Submitting..." : "Submit"}
              </button>
            </form>

            <div className="bg-white/10 p-4 rounded-lg mt-6 text-center">
              <h3 className="text-amber-400 font-semibold text-sm sm:text-base mb-1">
                Enquiries & Support
              </h3>

              <p className="text-gray-300 text-xs sm:text-sm">
                Submit your details and we’ll get back to you shortly.
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
