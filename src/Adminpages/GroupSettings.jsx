import { useState, useEffect, useCallback } from "react";
import {
  FiSettings,
  FiSave,
  FiRefreshCw,
  FiPlus,
  FiMinus,
  FiUsers,
  FiLayers,
  FiDollarSign,
  FiAlertCircle,
  FiRotateCcw,
  FiPercent,
  FiTrendingUp,
  FiTrendingDown,
  FiActivity,
  FiShuffle,
} from "react-icons/fi";
import toast from "react-hot-toast";
import ReactCountryFlag from "react-country-flag";
import { getMasterTypes, updateMasterType } from "../api/api"; // adjust path as needed

const currencyMeta = {
  inr: { symbol: "₹", flag: "IN", name: "Indian Rupee" },
  usd: { symbol: "$", flag: "US", name: "US Dollar" },
  aud: { symbol: "$", flag: "AU", name: "Australian Dollar" },
  cny: { symbol: "¥", flag: "CN", name: "Chinese Yuan" },
  gbp: { symbol: "£", flag: "GB", name: "British Pound" },
};

/* Single-value master types edited on this page, grouped by section. */
const LIMIT_FIELDS = [
  {
    type: "total_member",
    tint: "bg-indigo-50 text-indigo-600",
    label: "Total members",
    hint: "Max members in a group",
    icon: FiUsers,
    min: 1,
    max: 1000,
  },
  {
    type: "total_no_of_groups",
    tint: "bg-indigo-50 text-indigo-600",
    label: "Limited groups",
    hint: "Max limited groups per user",
    icon: FiLayers,
    min: 1,
    max: 1000,
  },
];

const BID_FIELDS = [
  {
    type: "commission_percentage",
    tint: "bg-indigo-50 text-indigo-600",
    label: "Commission",
    hint: "Charged on each payout",
    icon: FiPercent,
    min: 0,
    max: 100,
  },
  {
    type: "min_bid_percentage",
    tint: "bg-emerald-50 text-emerald-600",
    label: "Min bid",
    hint: "Lowest allowed bid",
    icon: FiShuffle,
    min: 0,
    max: 100,
  },
  {
    type: "max_bid_percentage",
    tint: "bg-blue-50 text-blue-600",
    label: "Max bid",
    hint: "Highest allowed bid",
    icon: FiTrendingUp,
    min: 0,
    max: 100,
  },
  {
    type: "bid_step_value_percentage",
    tint: "bg-orange-50 text-orange-500",
    label: "Bid step",
    hint: "Increment between bids",
    icon: FiActivity,
    min: 1,
    max: 100,
  },
];

const VALUE_FIELDS = [...LIMIT_FIELDS, ...BID_FIELDS];

const round2 = (n) => Math.round(n * 100) / 100;

/* ─── Stepper number input ────────────────────────────────────────────── */
const StepperInput = ({ value, onChange, min = 0, max = Infinity, step = 1, prefix = "", suffix = "" }) => {
  const safeValue = Number.isFinite(value) ? value : 0;
  const clamp = (v) => Math.max(min, Math.min(max, v));
  const [draft, setDraft] = useState(String(safeValue));

  // Sync from the parent only when the value really differs from what's typed,
  // so in-progress input like "10." isn't overwritten.
  useEffect(() => {
    setDraft((d) => (parseFloat(d) === safeValue ? d : String(safeValue)));
  }, [safeValue]);

  // Report typed values immediately so unsaved changes are tracked live.
  const handleType = (e) => {
    const next = e.target.value;
    setDraft(next);
    const raw = parseFloat(next);
    if (!Number.isNaN(raw) && raw !== safeValue) onChange(round2(raw));
  };

  // Clamp to the allowed range when they leave the field.
  const commit = () => {
    const raw = parseFloat(draft);
    const next = round2(clamp(Number.isNaN(raw) ? min : raw));
    setDraft(String(next));
    if (next !== safeValue) onChange(next);
  };

  const bump = (dir) => onChange(round2(clamp(safeValue + dir * step)));

  const stepBtn =
    "w-7 h-7 my-auto shrink-0 rounded-md flex items-center justify-center bg-white ring-1 ring-slate-200 shadow-sm text-blue-700 hover:bg-blue-50 hover:ring-blue-200 transition-colors disabled:opacity-30 disabled:hover:bg-white disabled:hover:ring-slate-200";

  return (
    <div className="flex items-stretch h-11 gap-1 px-1.5 text-sm rounded-xl border border-slate-200 bg-white transition-all focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 hover:border-slate-300">
      <button
        type="button"
        onClick={() => bump(-1)}
        disabled={safeValue <= min}
        className={stepBtn}
        aria-label="Decrease">
        <FiMinus size={14} strokeWidth={2.5} />
      </button>

      <div className="flex-1 relative min-w-0 flex items-center">
        {prefix && <span className="absolute left-3 text-slate-500 font-medium pointer-events-none">{prefix}</span>}
        <input
          type="number"
          value={draft}
          onChange={handleType}
          onBlur={commit}
          onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
          min={min}
          max={max}
          style={{ color: "#0f172a", WebkitTextFillColor: "#0f172a" }}
          className={`w-full h-full bg-transparent text-center text-[16px] font-bold tabular-nums tracking-tight focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${
            prefix ? "pl-6" : "pl-1"
          } ${suffix ? "pr-6" : "pr-1"}`}
        />
        {suffix && <span className="absolute right-2 text-slate-500 font-medium pointer-events-none">{suffix}</span>}
      </div>

      <button
        type="button"
        onClick={() => bump(1)}
        disabled={safeValue >= max}
        className={stepBtn}
        aria-label="Increase">
        <FiPlus size={14} strokeWidth={2.5} />
      </button>
    </div>
  );
};

/* ─── Section card shell ──────────────────────────────────────────────── */
const Section = ({ icon: Icon, title, description, children, aside, tint = "bg-indigo-50 text-indigo-600", glow = "", className = "" }) => (
  <section
    className={`relative overflow-hidden bg-white rounded-2xl ring-1 ring-slate-100 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.08)] flex flex-col ${className}`}>
    {glow && <div className={`pointer-events-none absolute -top-24 right-0 w-2/3 h-48 blur-3xl ${glow}`} />}
    <div className="relative flex items-center justify-between gap-3 px-5 pt-5 pb-4">
      <div className="flex items-center gap-4 min-w-0">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${tint}`}>
          <Icon size={22} />
        </div>
        <div className="min-w-0">
          <h3 className="text-[17px] font-bold text-slate-900 tracking-tight">{title}</h3>
          <p className="text-[13px] text-slate-500 truncate">{description}</p>
        </div>
      </div>
      {aside}
    </div>
    <div className="relative px-5 pb-5 flex-1">{children}</div>
  </section>
);

/* ─── Compact value tile ──────────────────────────────────────────────── */
const ValueTile = ({ field, value, onChange, suffix, invalid, horizontal = false }) => {
  const Icon = field.icon;
  const tileCls = `rounded-xl border bg-white p-3.5 transition-all ${
    invalid
      ? "border-red-200 ring-4 ring-red-50"
      : "border-slate-200/80 hover:border-blue-200 hover:shadow-[0_4px_16px_-4px_rgba(31,79,229,0.12)]"
  }`;
  const header = (
    <div className="flex items-center gap-3 min-w-0">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${field.tint}`}>
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <p className="text-[14px] font-semibold text-slate-900 leading-tight truncate">{field.label}</p>
        <p className="text-[12px] text-slate-500 leading-tight mt-0.5 truncate">{field.hint}</p>
      </div>
    </div>
  );

  if (horizontal) {
    return (
      <div className={`${tileCls} flex flex-col sm:flex-row sm:items-center gap-3`}>
        <div className="flex-1 min-w-0">{header}</div>
        <div className="sm:w-40 shrink-0">
          <StepperInput value={value} onChange={onChange} min={field.min} max={field.max} suffix={suffix} />
        </div>
      </div>
    );
  }

  return (
    <div className={`${tileCls} flex flex-col gap-4`}>
      {header}
      <div className="mt-auto">
        <StepperInput value={value} onChange={onChange} min={field.min} max={field.max} suffix={suffix} />
      </div>
    </div>
  );
};

/* ─── Currency row (compact) ──────────────────────────────────────────── */
const formatAmount = (n) => (Number.isFinite(n) ? n.toLocaleString() : "0");

const CurrencyRow = ({ code, data, onChange }) => {
  const meta = currencyMeta[code] || {};
  const step = code === "usd" || code === "aud" ? 1 : 100;
  const invalid = data.min >= data.max;

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)] items-center gap-x-8 gap-y-3 px-4 py-3 transition-colors ${
        invalid ? "bg-red-50/50" : "hover:bg-slate-50/60"
      }`}>
      <div className="flex items-center gap-4 min-w-0">
        <div className="w-10 h-10 rounded-full overflow-hidden ring-1 ring-slate-200 shadow-sm shrink-0 flex items-center justify-center bg-slate-50">
          {meta.flag ? (
            <ReactCountryFlag countryCode={meta.flag} svg style={{ width: "40px", height: "40px", objectFit: "cover", transform: "scale(1.35)" }} />
          ) : (
            <span className="text-xs font-semibold text-slate-500">{code.slice(0, 2).toUpperCase()}</span>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-[15px] font-semibold text-slate-900 truncate">{meta.name || data.label}</p>
          <p className={`text-[13px] tabular-nums truncate ${invalid ? "text-red-600" : "text-slate-500"}`}>
            {invalid
              ? "Min must be less than max"
              : `${code.toUpperCase()} • ${meta.symbol || ""}${formatAmount(data.min)} – ${meta.symbol || ""}${formatAmount(
                  data.max
                )}`}
          </p>
        </div>
      </div>
      <StepperInput
        value={data.min}
        onChange={(v) => onChange(code, "min", v)}
        min={0}
        max={data.max - 1}
        step={step}
        prefix={meta.symbol}
      />
      <StepperInput
        value={data.max}
        onChange={(v) => onChange(code, "max", v)}
        min={data.min + 1}
        max={10000000}
        step={step}
        prefix={meta.symbol}
      />
    </div>
  );
};

/* ─── Group Settings Page ──────────────────────────────────────────────── */
// masterType may come back grouped ({ total_member: [...] }) or as a flat
// list of records ([{ type: "total_member", ... }]); normalize to grouped.
// Some keys come back with invisible characters (e.g. "⁠commission_percentage"),
// so strip zero-width/format chars before matching.
const cleanKey = (key) => String(key).replace(/[​-‍⁠﻿]/g, "").trim();

const groupByType = (data) => {
  if (!Array.isArray(data)) {
    return Object.fromEntries(Object.entries(data || {}).map(([k, v]) => [cleanKey(k), v]));
  }
  return data.reduce((acc, row) => {
    const key = row.type ?? row.master_type ?? row.key;
    if (key) (acc[cleanKey(key)] ||= []).push(row);
    return acc;
  }, {});
};

const emptyValues = () =>
  Object.fromEntries(VALUE_FIELDS.map((f) => [f.type, { id: null, value: 0 }]));

const GroupSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [values, setValues] = useState(emptyValues);
  const [currencies, setCurrencies] = useState({});
  const [original, setOriginal] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const res = await getMasterTypes();
      // Support both axios-style ({ data }) and raw-json apiService returns.
      const json = res?.data ?? res;
      console.log("GroupSettings: loaded masterTypes", json?.data || json);

      if (!json?.success) {
        throw new Error(json?.message || "Failed to load master settings");
      }

      const data = groupByType(json.data);

      const valueMap = {};
      VALUE_FIELDS.forEach(({ type }) => {
        const entry = data[type]?.[0];
        valueMap[type] = {
          id: entry?.id ?? null,
          value: parseFloat(entry?.value) || 0,
        };
      });

      const currencyMap = {};
      (data.country || []).forEach((c) => {
        currencyMap[c.value] = {
          id: c.id,
          label: c.label,
          min: parseFloat(c.min_fund_amount) || 0,
          max: parseFloat(c.max_fund_amount) || 0,
        };
      });

      const missing = VALUE_FIELDS.filter(({ type }) => !valueMap[type].id).map((f) => f.label);
      if (missing.length) {
        console.warn("GroupSettings: no masterType record for", missing, data);
      }

      setValues(valueMap);
      setCurrencies(currencyMap);
      setOriginal({ values: valueMap, currencies: currencyMap });
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Failed to load master settings";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const setValue = (type, value) => {
    setValues((prev) => ({ ...prev, [type]: { ...prev[type], value } }));
  };

  const updateCurrencyField = (code, field, value) => {
    setCurrencies((prev) => ({
      ...prev,
      [code]: { ...prev[code], [field]: value },
    }));
  };

  const v = (type) => values[type]?.value ?? 0;
  const minBid = v("min_bid_percentage");
  const maxBid = v("max_bid_percentage");
  const bidStep = v("bid_step_value_percentage");
  const bidRangeInvalid = minBid >= maxBid;
  const bidStepInvalid = bidStep <= 0 || bidStep > maxBid - minBid;

  const changedValues = original
    ? VALUE_FIELDS.filter(({ type }) => values[type].id && values[type].value !== original.values[type]?.value)
    : [];
  const changedCurrencies = original
    ? Object.entries(currencies).filter(([code, c]) => {
        const o = original.currencies[code];
        return !o || o.min !== c.min || o.max !== c.max;
      })
    : [];
  const changeCount = changedValues.length + changedCurrencies.length;
  const isDirty = !loading && changeCount > 0;

  const handleSave = useCallback(async () => {
    if (v("total_member") <= 0) {
      setErrorMessage("Total members must be greater than 0");
      return;
    }
    if (v("total_no_of_groups") <= 0) {
      setErrorMessage("Total number of groups must be greater than 0");
      return;
    }
    if (bidRangeInvalid) {
      setErrorMessage("Min bid percentage must be less than max bid percentage");
      return;
    }
    if (bidStepInvalid) {
      setErrorMessage("Bid step must be greater than 0 and within the min–max bid range");
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
      // Only send records that actually changed.
      const requests = [
        ...changedValues.map(({ type }) =>
          updateMasterType(values[type].id, { value: String(values[type].value) })
        ),
        ...changedCurrencies.map(([, c]) =>
          updateMasterType(c.id, { min_fund_amount: c.min, max_fund_amount: c.max })
        ),
      ];

      await Promise.all(requests);

      toast.success("Group settings updated successfully!");
      await loadData();
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Failed to save settings";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }, [values, currencies, changedValues, changedCurrencies, bidRangeInvalid, bidStepInvalid, loadData]);

  const currencyCount = Object.keys(currencies).length;

  return (
    <div className="pt-8 pb-24 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-[30px] leading-tight font-extrabold text-slate-900 tracking-tight">Group Settings</h1>
            {isDirty && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 ring-1 ring-amber-200 px-2.5 py-0.5 text-[12px] font-medium text-amber-700">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                {changeCount} unsaved
              </span>
            )}
          </div>
          <p className="text-[15px] text-slate-500 mt-1">
            Group limits, bidding rules, commission and group amounts per currency.
          </p>
        </div>
        <button
          onClick={loadData}
          disabled={loading || saving}
          className="self-start sm:self-auto inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-white ring-1 ring-slate-200 shadow-sm text-[15px] font-semibold text-slate-800 hover:bg-slate-50 transition-colors disabled:opacity-50"
          title="Reload settings">
          <FiRefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="space-y-5 animate-pulse">
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-5">
            <div className="h-64 rounded-2xl border border-gray-200/70 bg-white" />
            <div className="h-64 rounded-2xl border border-gray-200/70 bg-white" />
          </div>
          <div className="h-72 rounded-2xl border border-gray-200/70 bg-white" />
        </div>
      ) : (
        <>
          {errorMessage && (
            <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50/70 px-4 py-3">
              <FiAlertCircle className="text-red-500 mt-0.5 shrink-0" size={16} />
              <p className="text-sm font-medium text-red-700">{errorMessage}</p>
            </div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-5">
            <Section icon={FiLayers} title="Group limits" description="Set default limits for new groups.">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-3">
                {LIMIT_FIELDS.map((f) => (
                  <ValueTile key={f.type} field={f} value={v(f.type)} horizontal onChange={(val) => setValue(f.type, val)} />
                ))}
              </div>
            </Section>

            <Section
              icon={FiPercent}
              title="Bidding & commission"
              description="Percentages applied to auction rounds."
              tint="bg-amber-50 text-amber-500"
              glow="bg-amber-100/50">
              <div className="space-y-3">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {BID_FIELDS.map((f) => (
                    <ValueTile
                      key={f.type}
                      field={f}
                      value={v(f.type)}
                      suffix="%"
                      onChange={(val) => setValue(f.type, val)}
                      invalid={
                        (bidRangeInvalid && (f.type === "min_bid_percentage" || f.type === "max_bid_percentage")) ||
                        (bidStepInvalid && f.type === "bid_step_value_percentage")
                      }
                    />
                  ))}
                </div>
              </div>
            </Section>
          </div>

          <Section
            icon={FiDollarSign}
            title="Group amount by currency"
            description="Allowed minimum and maximum group amount for each currency."
            tint="bg-rose-50 text-rose-500"
            aside={
              <span className="hidden sm:inline-flex items-center rounded-lg bg-blue-50 px-3 py-1.5 text-[13px] font-semibold text-slate-700">
                {currencyCount} {currencyCount === 1 ? "currency" : "currencies"}
              </span>
            }>
            {currencyCount === 0 ? (
              <p className="text-sm text-gray-500 text-center py-6">No currencies configured.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                <div className="hidden sm:grid grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)] gap-x-8 px-4 py-3 rounded-xl bg-slate-50 text-[12px] font-medium uppercase tracking-wide text-slate-600">
                  <span>Currency</span>
                  <span>Minimum</span>
                  <span>Maximum</span>
                </div>
                {Object.entries(currencies).map(([code, c]) => (
                  <CurrencyRow key={code} code={code} data={c} onChange={updateCurrencyField} />
                ))}
              </div>
            )}
          </Section>
        </>
      )}

      {/* Floating action bar */}
      {!loading && (
        <div className="sticky bottom-4 z-20">
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-gray-200/80 bg-white/85 backdrop-blur-xl px-4 py-2.5 sm:px-5 shadow-[0_8px_30px_-6px_rgba(16,24,40,0.18)]">
            <p className="text-sm text-gray-500 hidden sm:block">
              {isDirty
                ? `${changeCount} ${changeCount === 1 ? "setting" : "settings"} changed.`
                : "All changes saved."}
            </p>
            <div className="flex gap-2 ml-auto">
              <button
                onClick={loadData}
                disabled={saving || !isDirty}
                className="inline-flex items-center gap-2 h-9 px-4 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                <FiRotateCcw size={14} />
                Reset
              </button>
              <button
                onClick={handleSave}
                disabled={saving || loading || !isDirty}
                className="inline-flex items-center gap-2 h-9 px-5 rounded-xl bg-gradient-to-b from-primary to-sc-blue-700 text-white text-sm font-medium shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/30 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-40 disabled:shadow-none disabled:cursor-not-allowed">
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>
                    <FiSave size={15} />
                    Save changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupSettings;
