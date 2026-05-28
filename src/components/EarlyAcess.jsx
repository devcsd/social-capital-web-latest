import React, { useState } from "react";
import { Modal, Tooltip } from "antd";
import { CloseOutlined } from "@ant-design/icons";

export default function EarlyAccessPopup() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    type: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const whatsappNumber = "";
    const msg = `Hi Social Capital team, I’m ${form.name}.
Role: ${form.type === "community" ? "Chit-fund Company" : "Individual Member"}
Email: ${form.email}
Phone: ${form.phone}
Message: ${form.message}`;

    const encodedMsg = encodeURIComponent(msg);
    const url = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodedMsg}`;

    window.open(url, "_blank");
    setOpen(false);
  };

  return (
    <>
      <Tooltip title="Join now for early access to our community funding platform.">
        <button
          onClick={() => setOpen(true)}
          className="px-5 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-semibold rounded-lg hover:brightness-110 transition text-sm sm:text-base">
          Get Early Access
        </button>
      </Tooltip>

      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        centered
        width="100%"
        closable={false} // Disable default close icon
        className="p-0"
        styles={{
          content: {
            background: "transparent",
            boxShadow: "none",
            border: "none",
          },
        }}>
        {/* Outer wrapper */}
        <div className="flex justify-center items-center">
          {/* Card container */}
          <div className="relative bg-gradient-to-b from-[#0C0A30] to-[#1B1650] text-white rounded-2xl shadow-xl mx-auto w-[95%] sm:w-[85%] md:w-[75%] lg:w-[550px] p-5 sm:p-8 max-h-[90vh] overflow-y-auto">
            {/* Custom Close Button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-amber-400 bg-white/10 p-1.5 rounded-full hover:bg-white/20 transition-transform hover:rotate-90">
              <CloseOutlined className="text-lg" />
            </button>

            {/* Header */}
            <h1 className="text-xl sm:text-2xl font-semibold text-center mb-2">
              <span className="text-amber-400">Social Capital</span> — Build and
              Grow Together
            </h1>
            <p className="text-center text-gray-300 text-sm sm:text-base mb-6">
              Join the movement for transparent, community-driven funds.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-300 text-sm mb-1 block">
                    Company / Manager Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="w-full p-2.5 rounded-md bg-white/15 placeholder-gray-400 text-white focus:outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="text-gray-300 text-sm mb-1 block">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full p-2.5 rounded-md bg-white/15 placeholder-gray-400 text-white focus:outline-none text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-300 text-sm mb-1 block">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phone"
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    className="w-full p-2.5 rounded-md bg-white/15 placeholder-gray-400 text-white focus:outline-none text-sm"
                  />
                </div>

                <div>
                  <span className="text-gray-300 text-sm mb-1 block">
                    I am a:
                  </span>
                  <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-300">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="type"
                        value="community"
                        onChange={handleChange}
                        className="accent-amber-400"
                      />
                      <span>Chit-fund Company</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="type"
                        value="individual"
                        onChange={handleChange}
                        className="accent-amber-400"
                      />
                      <span>Individual Member</span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-gray-300 text-sm mb-1 block">
                  Share your thoughts or goals
                </label>
                <textarea
                  name="message"
                  onChange={handleChange}
                  rows="3"
                  placeholder="Type your message..."
                  className="w-full p-2.5 rounded-md bg-white/15 placeholder-gray-400 text-white focus:outline-none text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-semibold p-2.5 rounded-lg hover:brightness-110 transition text-sm sm:text-base">
                Get in Touch
              </button>
            </form>

            <div className="bg-white/10 p-4 rounded-lg mt-6 text-center">
              <h3 className="text-amber-400 font-semibold text-sm sm:text-base mb-1">
                Investors & Partners
              </h3>
              <p className="text-gray-300 text-xs sm:text-sm">
                Explore community fund innovations & impact financing.
              </p>
            </div>

            <p className="text-center text-[10px] sm:text-xs text-gray-500 mt-5">
              © 2025 Social Capital • All rights reserved.
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
}
