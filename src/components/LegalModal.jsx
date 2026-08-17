import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { CloseOutlined } from "@ant-design/icons";

export default function LegalModal({ title, subtitle, sections, onClose }) {
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#050816]/80 backdrop-blur-xl p-6"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          relative
          w-full
          max-w-[760px]
          rounded-[30px]
          border border-white/10
          bg-[linear-gradient(180deg,#17154A_0%,#14123D_100%)]
          shadow-[0_30px_80px_rgba(0,0,0,.55)]
          backdrop-blur-2xl
          animate-[modalScale_.35s_ease]
          max-h-[85vh]
          overflow-hidden
        "
      >
        {/* Close — stays fixed in place while the body below scrolls */}
        <button
          onClick={onClose}
          className="
            absolute
            right-6
            top-6
            z-10
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
          "
        >
          <CloseOutlined className="text-lg" />
        </button>

        <div className="p-8 md:p-10 max-h-[85vh] overflow-y-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h2 className="text-[32px] md:text-[38px] font-bold leading-tight">
              <span className="text-[#FFC72C]">Social Capital</span>
              <span className="text-white"> — {title}</span>
            </h2>

            {subtitle && (
              <p className="mt-3 text-[17px] text-white/70">{subtitle}</p>
            )}
          </div>

          {/* Body */}
          <div className="space-y-7 text-left">
            {sections.map((section, idx) => (
              <div key={idx} className="border-b border-white/10 pb-6 last:border-b-0 last:pb-0">
                <h3 className="text-[#FFC72C] text-lg font-semibold mb-2">
                  {section.heading}
                </h3>

                {section.type === "paragraph" && (
                  <p className="text-white/75 text-[15px] leading-7">
                    {section.body}
                  </p>
                )}

                {section.type === "list" && (
                  <>
                    {section.intro && (
                      <p className="text-white/75 text-[15px] leading-7 mb-2">
                        {section.intro}
                      </p>
                    )}
                    <ul className="space-y-2">
                      {section.items.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 text-white/75 text-[15px] leading-6"
                        >
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FFC72C]" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    {section.note && (
                      <p className="mt-3 text-white/60 text-sm italic">
                        {section.note}
                      </p>
                    )}
                  </>
                )}

                {section.type === "contact" && (
                  <dl className="grid gap-2 sm:grid-cols-2">
                    {section.fields.map((field, i) => (
                      <div key={i}>
                        <dt className="text-white/50 text-xs uppercase tracking-wide">
                          {field.label}
                        </dt>
                        <dd className="text-white/80 text-[15px]">
                          {field.label.toLowerCase().includes("email") &&
                          !field.value.startsWith("[") ? (
                            <a
                              href={`mailto:${field.value}`}
                              className="text-[#FFC72C] underline decoration-white/20 underline-offset-2 hover:text-white transition-colors"
                            >
                              {field.value}
                            </a>
                          ) : (
                            field.value
                          )}
                        </dd>
                      </div>
                    ))}
                  </dl>
                )}
              </div>
            ))}
          </div>

          <p className="text-center text-[10px] sm:text-xs text-gray-500 mt-8">
            © {new Date().getFullYear()} Social Capital • All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );

  return typeof document !== "undefined"
    ? createPortal(modalContent, document.body)
    : null;
}
