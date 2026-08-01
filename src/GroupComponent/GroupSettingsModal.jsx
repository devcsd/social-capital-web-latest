import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { FiX, FiSettings, FiSave, FiRefreshCw } from "react-icons/fi";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { toast, ToastContainer } from "react-toastify";
import ReactCountryFlag from "react-country-flag";
import "react-toastify/dist/ReactToastify.css";
import { getMasterTypes, updateTotalMember, updateTotalGroups, updateCurrencyFundRange } from "../api/api"; // adjust path as needed

const currencyMeta = {
  inr: { symbol: "₹", flag: "IN", name: "Indian Rupee" },
  usd: { symbol: "$", flag: "US", name: "US Dollar" },
  aud: { symbol: "$", flag: "AU", name: "Australian Dollar" },
  cny: { symbol: "¥", flag: "CN", name: "Chinese Yuan" },
  gbp: { symbol: "£", flag: "GB", name: "British Pound" },
};

/* ─── Simple stepper number input ─────────────────────────────────────── */
const StepperInput = ({ value, onChange, min = 0, max = Infinity, step = 1, prefix = "" }) => {
  const safeValue = Number.isFinite(value) ? value : 0;
  const clamp = (v) => Math.max(min, Math.min(max, v));

  const handleTextChange = (e) => {
    const raw = parseInt(e.target.value, 10);
    onChange(clamp(Number.isNaN(raw) ? min : raw));
  };

  return (
    <div className="flex items-center gap-2">
     

      <div className="flex-1 relative min-w-0">
        {prefix && (
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-600 font-semibold text-sm pointer-events-none">
            {prefix}
          </span>
        )}
        <input
          type="number"
          value={safeValue}
          onChange={handleTextChange}
          min={min}
          max={max}
          style={{ color: "#1f2937", backgroundColor: "#ffffff", WebkitTextFillColor: "#1f2937" }}
          className={`w-full py-2 border border-gray-300 rounded-lg text-center font-semibold focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow ${
            prefix ? "pl-7 pr-2" : "px-2"
          }`}
        />
      </div>

      
    </div>
  );
};

/* ─── Currency Fund Card (with flag) ───────────────────────────────────── */
const CurrencyFundCard = ({ code, data, onChange }) => {
  const meta = currencyMeta[code] || {};
  const step = code === "usd" || code === "aud" ? 1 : 100;

  return (
    <div className="border border-gray-200 rounded-xl p-4 space-y-3 bg-white hover:shadow-md hover:border-primary/30 transition-all">
      {/* Header: flag badge + label, styled like the GroupCard currency pill */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-3 py-1">
          {meta.flag && (
            <ReactCountryFlag
              countryCode={meta.flag}
              svg
              style={{ width: "18px", height: "18px", borderRadius: "999px" }}
            />
          )}
          <span className="text-xs font-semibold text-gray-700">{code.toUpperCase()}</span>
        </div>
        <p className="text-xs text-gray-500">{meta.name || data.label}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-600">Minimum</label>
          <StepperInput
            value={data.min}
            onChange={(v) => onChange(code, "min", v)}
            min={0}
            max={data.max - 1}
            step={step}
            prefix={meta.symbol}
          />
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-600">Maximum</label>
          <StepperInput
            value={data.max}
            onChange={(v) => onChange(code, "max", v)}
            min={data.min + 1}
            max={10000000}
            step={step}
            prefix={meta.symbol}
          />
        </div>
      </div>
    </div>
  );
};

/* ─── Master Settings Modal ────────────────────────────────────────────── */
export const MasterSettingsModal = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [totalMember, setTotalMember] = useState({ id: null, value: 0 });
  const [totalGroups, setTotalGroups] = useState({ id: null, value: 0 });
  const [currencies, setCurrencies] = useState({});

  const loadData = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const res = await getMasterTypes();
      // Support both axios-style ({ data }) and raw-json apiService returns.
      const json = res?.data ?? res;

      if (!json?.success) {
        throw new Error(json?.message || "Failed to load master settings");
      }

      const data = json.data;

      const memberEntry = data.total_member?.[0];
      const groupsEntry = data.total_no_of_groups?.[0];

      setTotalMember({
        id: memberEntry?.id ?? null,
        value: parseInt(memberEntry?.value, 10) || 0,
      });

      setTotalGroups({
        id: groupsEntry?.id ?? null,
        value: parseInt(groupsEntry?.value, 10) || 0,
      });

      const currencyMap = {};
      (data.country || []).forEach((c) => {
        currencyMap[c.value] = {
          id: c.id,
          label: c.label,
          min: c.min_fund_amount ?? 0,
          max: c.max_fund_amount ?? 0,
        };
      });
      setCurrencies(currencyMap);
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Failed to load master settings";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen, loadData]);

  const updateCurrencyField = (code, field, value) => {
    setCurrencies((prev) => ({
      ...prev,
      [code]: { ...prev[code], [field]: value },
    }));
  };

  const handleSave = useCallback(async () => {
    if (totalMember.value <= 0) {
      setErrorMessage("Total members must be greater than 0");
      return;
    }
    if (totalGroups.value <= 0) {
      setErrorMessage("Total number of groups must be greater than 0");
      return;
    }
    for (const c of Object.values(currencies)) {
      if (c.min >= c.max) {
        setErrorMessage(`${c.label}: minimum Group amount must be less than maximum`);
        return;
      }
    }

    setErrorMessage("");
    setSaving(true);

    try {
      const requests = [];

      if (totalMember.id) {
        requests.push(updateTotalMember(totalMember.id, totalMember.value));
      }
      if (totalGroups.id) {
        requests.push(updateTotalGroups(totalGroups.id, totalGroups.value));
      }
      Object.values(currencies).forEach((c) => {
        requests.push(updateCurrencyFundRange(c.id, c.min, c.max));
      });

      await Promise.all(requests);

      toast.success("Master settings updated successfully!");
      await loadData();
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Failed to save settings";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }, [totalMember, totalGroups, currencies, loadData]);

  return createPortal(
    <>
      <ToastContainer position="top-right" autoClose={2500} />

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />

          <div className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl ring-1 ring-black/5">
            {/* Header */}
            <div className="sticky top-0 z-20 bg-gradient-to-r from-primary/10 via-indigo-50 to-blue-50 border-b border-gray-200 px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary/10 rounded-xl">
                  <FiSettings className="text-primary" size={22} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 tracking-tight">Master Settings</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Group limits &amp; Group amount configuration
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={loadData}
                  className="p-2 hover:bg-white/70 rounded-lg transition-colors"
                  aria-label="Refresh">
                  <FiRefreshCw size={18} className="text-gray-600" />
                </button>
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-white/70 rounded-lg transition-colors"
                  aria-label="Close modal">
                  <FiX size={24} className="text-gray-600" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center gap-3 py-16">
                  <FiRefreshCw className="animate-spin text-primary" size={28} />
                  <p className="text-xs text-gray-400">Loading settings…</p>
                </div>
              ) : (
                <>
                  {errorMessage && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
                      <span className="text-red-500 mt-0.5">⚠</span>
                      <p className="text-sm font-medium text-red-700">{errorMessage}</p>
                    </div>
                  )}

                  {/* Group limits: members + groups side by side */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-800">
                        Total Members (default)
                      </label>
                      <StepperInput
                        value={totalMember.value}
                        onChange={(v) => setTotalMember((prev) => ({ ...prev, value: v }))}
                        min={1}
                        max={1000}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-800">
                        Total No. of Groups (default)
                      </label>
                      <StepperInput
                        value={totalGroups.value}
                        onChange={(v) => setTotalGroups((prev) => ({ ...prev, value: v }))}
                        min={1}
                        max={1000}
                      />
                    </div>
                  </div>

                  <div className="h-px bg-gray-200" />

                  {/* Fund Amount per currency — grid of flag cards */}
                  <div className="space-y-4">
                    <label className="block text-sm font-semibold text-gray-800">
                      Group Amount by Currency
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                      {Object.entries(currencies).map(([code, c]) => (
                        <CurrencyFundCard
                          key={code}
                          code={code}
                          data={c}
                          onChange={updateCurrencyField}
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gray-50/95 backdrop-blur border-t border-gray-200 px-6 py-4 flex gap-3 justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-lg border border-gray-300 font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                disabled={saving}>
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || loading}
                className="px-6 py-2.5 rounded-lg bg-primary text-white font-medium shadow-sm hover:bg-primary/90 hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FiSave size={16} />
                    Save Settings
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>,
    document.body
  );
};

export default MasterSettingsModal; 