import React, { useState, useRef, useEffect } from "react";
import { IoCloseSharp } from "react-icons/io5";

export default function PauseGroupCard({
  title = "Pause Group",
  subtitle = "Provide reason for pausing the group.",
  onCancel = () => {},
  onConfirm = (payload) => {},
  initialGroupName = "",
  initialReason = "",
  warning = "",
  warningColor = "pause",
  buttonTitle,
  isSubmitting,
  buttonColor,
  icon: IconComponent,
}) {
  const [groupName] = useState(initialGroupName); // read-only
  const [reason, setReason] = useState(initialReason || "");
  const [errors, setErrors] = useState({ groupName: "", reason: "" });

  const reasonRef = useRef(null);

  // autofocus reason when component mounts
  useEffect(() => {
    reasonRef.current?.focus();
  }, []);

  // map semantic variants to Tailwind classes (matches your tailwind config)
  const variantStyles = {
    pause: {
      border: "border-pause",
      bg: "bg-pause/10",
      text: "text-pauseText",
      icon: "text-pause",
      buttonBg: "bg-pause",
      buttonHover: "hover:bg-pause/90",
    },
    resume: {
      border: "border-resume",
      bg: "bg-resume/10",
      text: "text-resumeText",
      icon: "text-resume",
      buttonBg: "bg-resume",
      buttonHover: "hover:bg-resume/90",
    },
  };

  const warnStyle = variantStyles[warningColor] ?? variantStyles.pause;
  const btnColor =
    buttonColor ??
    (title.toLowerCase().includes("resume") ? "resume" : "pause");
  const btnStyle = variantStyles[btnColor] ?? variantStyles.pause;

  function validate() {
    const next = { groupName: "", reason: "" };
    if (!groupName || !groupName.toString().trim()) {
      next.groupName = "Group name is required.";
    }
    if (!reason || !reason.toString().trim()) {
      next.reason = "Please provide a reason.";
    }
    setErrors(next);
    return !next.groupName && !next.reason;
  }

  function handleConfirm() {
    if (!validate()) {
      // focus first invalid (groupName is readOnly so focus reason)
      reasonRef.current?.focus();
      return;
    }
    const payload = reason.trim();

    onConfirm(payload);
  }

  const isDisabled = !groupName || !reason.trim();
  const finalButtonTitle =
    buttonTitle ??
    (title.toLowerCase().includes("resume")
      ? "Confirm Resume"
      : "Confirm Pause");

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <IconComponent size={24} className={warnStyle.icon} />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <p className="text-sm text-slate-500">{subtitle}</p>
        </div>

        <button
          aria-label="close"
          onClick={onCancel}
          className="text-slate-400 hover:text-slate-600 ml-3">
          <IoCloseSharp size={20} />
        </button>
      </div>

      {/* Form */}
      <div className="space-y-4">
        {/* Group Name (read-only) */}
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Group name <span className="text-amber-600">*</span>
          </label>

          <input
            value={groupName}
            readOnly
            placeholder="Select or enter group name"
            aria-required="true"
            aria-invalid={errors.groupName ? "true" : "false"}
            aria-describedby={errors.groupName ? "groupName-error" : undefined}
            className={`mt-2 w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 ${
              errors.groupName
                ? "border-red-400 bg-red-50"
                : "border border-gray-200 bg-gray-50 cursor-not-allowed"
            }`}
          />

          {errors.groupName && (
            <p id="groupName-error" className="mt-1 text-xs text-red-600">
              {errors.groupName}
            </p>
          )}
        </div>

        {/* Reason */}
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Reason <span className="text-amber-600">*</span>
          </label>

          <textarea
            ref={reasonRef}
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              if (errors.reason) setErrors((s) => ({ ...s, reason: "" }));
            }}
            placeholder="Add any additional notes about the pause..."
            rows={4}
            aria-required="true"
            aria-invalid={errors.reason ? "true" : "false"}
            aria-describedby={errors.reason ? "reason-error" : undefined}
            className={`mt-2 w-full rounded-lg border px-4 py-3 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-amber-300 ${
              errors.reason
                ? "border-red-400 bg-red-50"
                : "border border-gray-200"
            }`}
          />

          {errors.reason && (
            <p id="reason-error" className="mt-1 text-xs text-red-600">
              {errors.reason}
            </p>
          )}
        </div>

        {/* Warning banner */}
        <div
          className={`rounded-lg border ${warnStyle.border} ${warnStyle.bg} px-4 py-3 flex items-start gap-3`}>
          <div className="flex-shrink-0 mt-0.5">
            <IconComponent size={24} className={warnStyle.icon} />
          </div>

          <div>
            <p className={`${warnStyle.text} text-sm`}>{warning}</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 flex items-center justify-end gap-3">
        <button
          onClick={onCancel}
          className="rounded-full border border-gray-200 px-6 py-2 text-sm text-slate-700 hover:bg-gray-50">
          Cancel
        </button>

        <button
          onClick={handleConfirm}
          disabled={isDisabled}
          aria-disabled={isDisabled}
          className={`rounded-full px-6 py-2 text-sm font-medium text-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed
            ${btnStyle.buttonBg} ${btnStyle.buttonHover}`}>
          {isSubmitting ? (
            <>
              {/* small spinner (SVG) */}
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                Processing...
              </div>
            </>
          ) : (
            finalButtonTitle
          )}
        </button>
      </div>
    </div>
  );
}
