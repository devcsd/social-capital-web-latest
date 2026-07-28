// import React, { useState, useCallback } from "react";
// import { FiX, FiSettings } from "react-icons/fi";
// import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";

// /* ─── Currency Configuration ──────────────────────────────────────────────── */
// const currencyMeta = {
//   INR: { symbol: "₹", flag: "IN", minAmount: 100, maxAmount: 500000 },
//   USD: { symbol: "$", flag: "US", minAmount: 5, maxAmount: 10000 },
//   AUD: { symbol: "$", flag: "AU", minAmount: 10, maxAmount: 15000 },
//   CNY: { symbol: "¥", flag: "CN", minAmount: 50, maxAmount: 100000 },
//   GBP: { symbol: "£", flag: "GB", minAmount: 5, maxAmount: 8000 },
// };

// /* ─── Number Input Component with +/- Controls ──────────────────────────── */
// const NumberInputWithControls = ({
//   label,
//   minValue,
//   setMinValue,
//   maxValue,
//   setMaxValue,
//   minLimit = 1,
//   maxLimit = 1000,
//   step = 1,
// }) => {
//   const handleMinChange = (e) => {
//     const val = parseInt(e.target.value) || 0;
//     setMinValue(Math.max(minLimit, Math.min(val, maxValue - 1)));
//   };

//   const handleMaxChange = (e) => {
//     const val = parseInt(e.target.value) || 0;
//     setMaxValue(Math.max(minValue + 1, Math.min(val, maxLimit)));
//   };

//   const decrementMin = () => {
//     setMinValue((prev) => Math.max(minLimit, prev - step));
//   };

//   const incrementMin = () => {
//     setMinValue((prev) => Math.min(prev + step, maxValue - 1));
//   };

//   const decrementMax = () => {
//     setMaxValue((prev) => Math.max(minValue + 1, prev - step));
//   };

//   const incrementMax = () => {
//     setMaxValue((prev) => Math.min(prev + step, maxLimit));
//   };

//   return (
//     <div className="space-y-4">
//       <label className="block text-sm font-semibold text-gray-800 mb-3">
//         {label}
//       </label>

//       {/* Minimum */}
//       <div className="space-y-2">
//         <label className="block text-xs font-medium text-gray-600">
//           Minimum
//         </label>
//         <div className="flex items-center gap-2">
//           <button
//             type="button"
//             onClick={decrementMin}
//             className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors flex items-center justify-center text-gray-700 hover:text-primary"
//             aria-label="Decrease minimum">
//             <AiOutlineMinus size={18} />
//           </button>

//           <input
//             type="number"
//             value={minValue}
//             onChange={handleMinChange}
//             min={minLimit}
//             max={maxValue - 1}
//             className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-center font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
//           />

//           <button
//             type="button"
//             onClick={incrementMin}
//             className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors flex items-center justify-center text-gray-700 hover:text-primary"
//             aria-label="Increase minimum">
//             <AiOutlinePlus size={18} />
//           </button>
//         </div>
//       </div>

//       {/* Maximum */}
//       <div className="space-y-2">
//         <label className="block text-xs font-medium text-gray-600">
//           Maximum
//         </label>
//         <div className="flex items-center gap-2">
//           <button
//             type="button"
//             onClick={decrementMax}
//             className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors flex items-center justify-center text-gray-700 hover:text-primary"
//             aria-label="Decrease maximum">
//             <AiOutlineMinus size={18} />
//           </button>

//           <input
//             type="number"
//             value={maxValue}
//             onChange={handleMaxChange}
//             min={minValue + 1}
//             max={maxLimit}
//             className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-center font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
//           />

//           <button
//             type="button"
//             onClick={incrementMax}
//             className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors flex items-center justify-center text-gray-700 hover:text-primary"
//             aria-label="Increase maximum">
//             <AiOutlinePlus size={18} />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* ─── Currency-Aware Fund Amount Input ──────────────────────────────────── */
// const FundAmountInput = ({
//   label,
//   currency,
//   minAmount,
//   setMinAmount,
//   maxAmount,
//   setMaxAmount,
// }) => {
//   const currencyInfo = currencyMeta[currency] || currencyMeta.INR;
//   const symbol = currencyInfo.symbol;
//   const minLimit = currencyInfo.minAmount;
//   const maxLimit = currencyInfo.maxAmount;
//   const step = currency === "INR" ? 100 : currency === "USD" ? 1 : 10;

//   const handleMinChange = (e) => {
//     const val = parseInt(e.target.value) || 0;
//     setMinAmount(Math.max(minLimit, Math.min(val, maxAmount - step)));
//   };

//   const handleMaxChange = (e) => {
//     const val = parseInt(e.target.value) || 0;
//     setMaxAmount(Math.max(minAmount + step, Math.min(val, maxLimit)));
//   };

//   const decrementMin = () => {
//     setMinAmount((prev) => Math.max(minLimit, prev - step));
//   };

//   const incrementMin = () => {
//     setMinAmount((prev) => Math.min(prev + step, maxAmount - step));
//   };

//   const decrementMax = () => {
//     setMaxAmount((prev) => Math.max(minAmount + step, prev - step));
//   };

//   const incrementMax = () => {
//     setMaxAmount((prev) => Math.min(prev + step, maxLimit));
//   };

//   return (
//     <div className="space-y-4">
//       <label className="block text-sm font-semibold text-gray-800 mb-3">
//         {label}
//       </label>

//       <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
//         <p className="text-xs text-blue-700">
//           <span className="font-semibold">Currency:</span> {currency} ({symbol})
//         </p>
//         <p className="text-xs text-blue-600 mt-1">
//           Allowed range: {symbol}
//           {minLimit.toLocaleString()} - {symbol}
//           {maxLimit.toLocaleString()}
//         </p>
//       </div>

//       {/* Minimum Amount */}
//       <div className="space-y-2">
//         <label className="block text-xs font-medium text-gray-600">
//           Minimum Amount ({symbol})
//         </label>
//         <div className="flex items-center gap-2">
//           <button
//             type="button"
//             onClick={decrementMin}
//             className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors flex items-center justify-center text-gray-700 hover:text-primary"
//             aria-label="Decrease minimum amount">
//             <AiOutlineMinus size={18} />
//           </button>

//           <div className="flex-1 relative">
//             <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 font-semibold">
//               {symbol}
//             </span>
//             <input
//               type="number"
//               value={minAmount}
//               onChange={handleMinChange}
//               min={minLimit}
//               max={maxAmount - step}
//               step={step}
//               className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg text-right font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
//             />
//           </div>

//           <button
//             type="button"
//             onClick={incrementMin}
//             className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors flex items-center justify-center text-gray-700 hover:text-primary"
//             aria-label="Increase minimum amount">
//             <AiOutlinePlus size={18} />
//           </button>
//         </div>
//       </div>

//       {/* Maximum Amount */}
//       <div className="space-y-2">
//         <label className="block text-xs font-medium text-gray-600">
//           Maximum Amount ({symbol})
//         </label>
//         <div className="flex items-center gap-2">
//           <button
//             type="button"
//             onClick={decrementMax}
//             className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors flex items-center justify-center text-gray-700 hover:text-primary"
//             aria-label="Decrease maximum amount">
//             <AiOutlineMinus size={18} />
//           </button>

//           <div className="flex-1 relative">
//             <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 font-semibold">
//               {symbol}
//             </span>
//             <input
//               type="number"
//               value={maxAmount}
//               onChange={handleMaxChange}
//               min={minAmount + step}
//               max={maxLimit}
//               step={step}
//               className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg text-right font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
//             />
//           </div>

//           <button
//             type="button"
//             onClick={incrementMax}
//             className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors flex items-center justify-center text-gray-700 hover:text-primary"
//             aria-label="Increase maximum amount">
//             <AiOutlinePlus size={18} />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* ─── Main GroupSettingsModal Component ───────────────────────────────── */
// export const GroupSettingsModal = ({
//   isOpen,
//   onClose,
//   group,
//   onSave,
//   isSubmitting = false,
// }) => {
//   const [numMembers, setNumMembers] = useState({
//     min: group?.totalMembers || 2,
//     max: group?.maxMembers || 50,
//   });

//   const [numGroups, setNumGroups] = useState({
//     min: group?.minGroups || 1,
//     max: group?.maxGroups || 100,
//   });

//   const [fundAmount, setFundAmount] = useState({
//     min: group?.minFundAmount || 1000,
//     max: group?.maxFundAmount || 100000,
//   });

//   const [successMessage, setSuccessMessage] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");

//   const handleSave = useCallback(async () => {
//     // Validation
//     if (numMembers.min >= numMembers.max) {
//       setErrorMessage("Minimum members must be less than maximum members");
//       return;
//     }

//     if (numGroups.min >= numGroups.max) {
//       setErrorMessage("Minimum groups must be less than maximum groups");
//       return;
//     }

//     if (fundAmount.min >= fundAmount.max) {
//       setErrorMessage("Minimum fund amount must be less than maximum amount");
//       return;
//     }

//     setErrorMessage("");

//     const settings = {
//       numMembers,
//       numGroups,
//       fundAmount,
//       groupId: group?.groupId,
//       currency: group?.currency,
//     };

//     try {
//       await onSave?.(settings);
//       setSuccessMessage("Settings updated successfully!");
//       setTimeout(() => {
//         onClose();
//       }, 1500);
//     } catch (error) {
//       setErrorMessage(error?.message || "Failed to save settings");
//     }
//   }, [numMembers, numGroups, fundAmount, group, onSave, onClose]);

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//       {/* Backdrop */}
//       <div
//         className="absolute inset-0 bg-black/50 backdrop-blur-sm"
//         onClick={onClose}
//       />

//       {/* Modal Container */}
//       <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">
//         {/* Header */}
//         <div className="sticky top-0 z-20 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 px-6 py-5 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-primary/10 rounded-lg">
//               <FiSettings className="text-primary" size={24} />
//             </div>
//             <div>
//               <h2 className="text-xl font-bold text-gray-900">
//                 Manage Group Settings
//               </h2>
//               <p className="text-xs text-gray-500 mt-0.5">
//                 {group?.groupName || "Configure Group"}
//               </p>
//             </div>
//           </div>
//           <button
//             onClick={onClose}
//             className="p-1 hover:bg-gray-200/50 rounded-lg transition-colors"
//             aria-label="Close modal">
//             <FiX size={24} className="text-gray-600" />
//           </button>
//         </div>

//         {/* Body */}
//         <div className="p-6 space-y-6">
//           {/* Success Message */}
//           {successMessage && (
//             <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
//               <p className="text-sm font-medium text-green-700">
//                 ✓ {successMessage}
//               </p>
//             </div>
//           )}

//           {/* Error Message */}
//           {errorMessage && (
//             <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
//               <p className="text-sm font-medium text-red-700">⚠ {errorMessage}</p>
//             </div>
//           )}

//           {/* Number of Members */}
//           <NumberInputWithControls
//             label="Number of Members"
//             minValue={numMembers.min}
//             setMinValue={(val) =>
//               setNumMembers((prev) => ({ ...prev, min: val }))
//             }
//             maxValue={numMembers.max}
//             setMaxValue={(val) =>
//               setNumMembers((prev) => ({ ...prev, max: val }))
//             }
//             minLimit={1}
//             maxLimit={500}
//             step={1}
//           />

//           {/* Divider */}
//           <div className="h-px bg-gray-200" />

//           {/* Number of Groups */}
//           <NumberInputWithControls
//             label="Number of Groups"
//             minValue={numGroups.min}
//             setMinValue={(val) =>
//               setNumGroups((prev) => ({ ...prev, min: val }))
//             }
//             maxValue={numGroups.max}
//             setMaxValue={(val) =>
//               setNumGroups((prev) => ({ ...prev, max: val }))
//             }
//             minLimit={1}
//             maxLimit={1000}
//             step={1}
//           />

//           {/* Divider */}
//           <div className="h-px bg-gray-200" />

//           {/* Fund Amount */}
//           <FundAmountInput
//             label="Fund Amount"
//             currency={group?.currency || "INR"}
//             minAmount={fundAmount.min}
//             setMinAmount={(val) =>
//               setFundAmount((prev) => ({ ...prev, min: val }))
//             }
//             maxAmount={fundAmount.max}
//             setMaxAmount={(val) =>
//               setFundAmount((prev) => ({ ...prev, max: val }))
//             }
//           />

//           {/* Summary */}
//           <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 space-y-3">
//             <h3 className="font-semibold text-gray-800 text-sm">Summary</h3>
//             <div className="grid grid-cols-3 gap-3">
//               <div className="bg-white p-3 rounded-lg border border-gray-200">
//                 <p className="text-xs text-gray-500 uppercase font-medium">
//                   Members
//                 </p>
//                 <p className="text-sm font-bold text-primary mt-1">
//                   {numMembers.min} - {numMembers.max}
//                 </p>
//               </div>
//               <div className="bg-white p-3 rounded-lg border border-gray-200">
//                 <p className="text-xs text-gray-500 uppercase font-medium">
//                   Groups
//                 </p>
//                 <p className="text-sm font-bold text-primary mt-1">
//                   {numGroups.min} - {numGroups.max}
//                 </p>
//               </div>
//               <div className="bg-white p-3 rounded-lg border border-gray-200">
//                 <p className="text-xs text-gray-500 uppercase font-medium">
//                   Currency
//                 </p>
//                 <p className="text-sm font-bold text-primary mt-1">
//                   {group?.currency || "INR"}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex gap-3 justify-end">
//           <button
//             onClick={onClose}
//             className="px-6 py-2.5 rounded-lg border border-gray-300 font-medium text-gray-700 hover:bg-gray-100 transition-colors"
//             disabled={isSubmitting}>
//             Cancel
//           </button>
//           <button
//             onClick={handleSave}
//             disabled={isSubmitting}
//             className="px-6 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
//             {isSubmitting ? (
//               <>
//                 <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                 Saving...
//               </>
//             ) : (
//               "Save Settings"
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GroupSettingsModal;

// import React, { useState, useCallback } from "react";
// import { FiX, FiSettings, FiCheck } from "react-icons/fi";
// import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// /* ─── Currency Configuration ──────────────────────────────────────────────── */
// const currencyMeta = {
//   INR: { symbol: "₹", flag: "IN", minAmount: 100, maxAmount: 500000 },
//   USD: { symbol: "$", flag: "US", minAmount: 5, maxAmount: 10000 },
//   AUD: { symbol: "$", flag: "AU", minAmount: 10, maxAmount: 15000 },
//   CNY: { symbol: "¥", flag: "CN", minAmount: 50, maxAmount: 100000 },
//   GBP: { symbol: "£", flag: "GB", minAmount: 5, maxAmount: 8000 },
// };

// /* ─── Number Input Component with +/- Controls (Min & Max side by side) ──── */
// const NumberInputWithControls = ({
//   label,
//   minValue,
//   setMinValue,
//   maxValue,
//   setMaxValue,
//   minLimit = 1,
//   maxLimit = 1000,
//   step = 1,
// }) => {
//   const handleMinChange = (e) => {
//     const val = parseInt(e.target.value) || 0;
//     setMinValue(Math.max(minLimit, Math.min(val, maxValue - 1)));
//   };

//   const handleMaxChange = (e) => {
//     const val = parseInt(e.target.value) || 0;
//     setMaxValue(Math.max(minValue + 1, Math.min(val, maxLimit)));
//   };

//   const decrementMin = () => {
//     setMinValue((prev) => Math.max(minLimit, prev - step));
//   };

//   const incrementMin = () => {
//     setMinValue((prev) => Math.min(prev + step, maxValue - 1));
//   };

//   const decrementMax = () => {
//     setMaxValue((prev) => Math.max(minValue + 1, prev - step));
//   };

//   const incrementMax = () => {
//     setMaxValue((prev) => Math.min(prev + step, maxLimit));
//   };

//   return (
//     <div className="space-y-3">
//       <label className="block text-sm font-semibold text-gray-800">
//         {label}
//       </label>

//       <div className="grid grid-cols-2 gap-4">
//         {/* Minimum */}
//         <div className="space-y-2">
//           <label className="block text-xs font-medium text-gray-600">
//             Minimum
//           </label>
//           <div className="flex items-center gap-2">
//             <button
//               type="button"
//               onClick={decrementMin}
//               className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors flex items-center justify-center text-gray-700 hover:text-primary"
//               aria-label="Decrease minimum">
//               <AiOutlineMinus size={18} />
//             </button>

//             <input
//               type="number"
//               value={minValue}
//               onChange={handleMinChange}
//               min={minLimit}
//               max={maxValue - 1}
//               className="flex-1 w-full min-w-0 px-2 py-2 border border-gray-300 rounded-lg text-center font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
//             />

//             <button
//               type="button"
//               onClick={incrementMin}
//               className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors flex items-center justify-center text-gray-700 hover:text-primary"
//               aria-label="Increase minimum">
//               <AiOutlinePlus size={18} />
//             </button>
//           </div>
//         </div>

//         {/* Maximum */}
//         <div className="space-y-2">
//           <label className="block text-xs font-medium text-gray-600">
//             Maximum
//           </label>
//           <div className="flex items-center gap-2">
//             <button
//               type="button"
//               onClick={decrementMax}
//               className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors flex items-center justify-center text-gray-700 hover:text-primary"
//               aria-label="Decrease maximum">
//               <AiOutlineMinus size={18} />
//             </button>

//             <input
//               type="number"
//               value={maxValue}
//               onChange={handleMaxChange}
//               min={minValue + 1}
//               max={maxLimit}
//               className="flex-1 w-full min-w-0 px-2 py-2 border border-gray-300 rounded-lg text-center font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
//             />

//             <button
//               type="button"
//               onClick={incrementMax}
//               className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors flex items-center justify-center text-gray-700 hover:text-primary"
//               aria-label="Increase maximum">
//               <AiOutlinePlus size={18} />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* ─── Currency-Aware Fund Amount Input ──────────────────────────────────── */
// const FundAmountInput = ({
//   label,
//   selectedCurrency,
//   setSelectedCurrency,
//   minAmount,
//   setMinAmount,
//   maxAmount,
//   setMaxAmount,
// }) => {
//   const currencyInfo = currencyMeta[selectedCurrency];
//   const symbol = currencyInfo?.symbol || "";
//   const minLimit = currencyInfo?.minAmount ?? 0;
//   const maxLimit = currencyInfo?.maxAmount ?? 0;
//   const step =
//     selectedCurrency === "INR" ? 100 : selectedCurrency === "USD" ? 1 : 10;

//   const handleCurrencySelect = (code) => {
//     const meta = currencyMeta[code];
//     setSelectedCurrency(code);
//     // Reset to sensible defaults whenever the currency changes
//     setMinAmount(meta.minAmount);
//     setMaxAmount(meta.maxAmount);
//   };

//   const handleMinChange = (e) => {
//     const val = parseInt(e.target.value) || 0;
//     setMinAmount(Math.max(minLimit, Math.min(val, maxAmount - step)));
//   };

//   const handleMaxChange = (e) => {
//     const val = parseInt(e.target.value) || 0;
//     setMaxAmount(Math.max(minAmount + step, Math.min(val, maxLimit)));
//   };

//   const decrementMin = () => {
//     setMinAmount((prev) => Math.max(minLimit, prev - step));
//   };

//   const incrementMin = () => {
//     setMinAmount((prev) => Math.min(prev + step, maxAmount - step));
//   };

//   const decrementMax = () => {
//     setMaxAmount((prev) => Math.max(minAmount + step, prev - step));
//   };

//   const incrementMax = () => {
//     setMaxAmount((prev) => Math.min(prev + step, maxLimit));
//   };

//   return (
//     <div className="space-y-4">
//       <label className="block text-sm font-semibold text-gray-800">
//         {label}
//       </label>

//       {/* Currency selection buttons */}
//       <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
//         {Object.entries(currencyMeta).map(([code, meta]) => {
//           const isSelected = selectedCurrency === code;
//           return (
//             <button
//               key={code}
//               type="button"
//               onClick={() => handleCurrencySelect(code)}
//               className={`relative text-left p-3 rounded-lg border transition-colors ${
//                 isSelected
//                   ? "border-primary bg-primary/10 ring-2 ring-primary"
//                   : "border-gray-300 hover:bg-gray-50"
//               }`}>
//               {isSelected && (
//                 <span className="absolute top-2 right-2 text-primary">
//                   <FiCheck size={16} />
//                 </span>
//               )}
//               <p className="text-sm font-bold text-gray-800">
//                 {meta.symbol} {code}
//               </p>
//               <p className="text-[11px] text-gray-500 mt-1">
//                 {meta.symbol}
//                 {meta.minAmount.toLocaleString()} - {meta.symbol}
//                 {meta.maxAmount.toLocaleString()}
//               </p>
//             </button>
//           );
//         })}
//       </div>

//       {/* Only show min/max once a currency has been chosen */}
//       {selectedCurrency && (
//         <div className="pt-2">
//           <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
//             <p className="text-xs text-blue-700">
//               <span className="font-semibold">Currency:</span>{" "}
//               {selectedCurrency} ({symbol})
//             </p>
//             <p className="text-xs text-blue-600 mt-1">
//               Allowed range: {symbol}
//               {minLimit.toLocaleString()} - {symbol}
//               {maxLimit.toLocaleString()}
//             </p>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             {/* Minimum Amount */}
//             <div className="space-y-2">
//               <label className="block text-xs font-medium text-gray-600">
//                 Minimum Amount ({symbol})
//               </label>
//               <div className="flex items-center gap-2">
//                 <button
//                   type="button"
//                   onClick={decrementMin}
//                   className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors flex items-center justify-center text-gray-700 hover:text-primary"
//                   aria-label="Decrease minimum amount">
//                   <AiOutlineMinus size={18} />
//                 </button>

//                 <div className="flex-1 relative min-w-0">
//                   <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-600 font-semibold text-sm">
//                     {symbol}
//                   </span>
//                   <input
//                     type="number"
//                     value={minAmount}
//                     onChange={handleMinChange}
//                     min={minLimit}
//                     max={maxAmount - step}
//                     step={step}
//                     className="w-full pl-6 pr-2 py-2 border border-gray-300 rounded-lg text-right font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
//                   />
//                 </div>

//                 <button
//                   type="button"
//                   onClick={incrementMin}
//                   className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors flex items-center justify-center text-gray-700 hover:text-primary"
//                   aria-label="Increase minimum amount">
//                   <AiOutlinePlus size={18} />
//                 </button>
//               </div>
//             </div>

//             {/* Maximum Amount */}
//             <div className="space-y-2">
//               <label className="block text-xs font-medium text-gray-600">
//                 Maximum Amount ({symbol})
//               </label>
//               <div className="flex items-center gap-2">
//                 <button
//                   type="button"
//                   onClick={decrementMax}
//                   className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors flex items-center justify-center text-gray-700 hover:text-primary"
//                   aria-label="Decrease maximum amount">
//                   <AiOutlineMinus size={18} />
//                 </button>

//                 <div className="flex-1 relative min-w-0">
//                   <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-600 font-semibold text-sm">
//                     {symbol}
//                   </span>
//                   <input
//                     type="number"
//                     value={maxAmount}
//                     onChange={handleMaxChange}
//                     min={minAmount + step}
//                     max={maxLimit}
//                     step={step}
//                     className="w-full pl-6 pr-2 py-2 border border-gray-300 rounded-lg text-right font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
//                   />
//                 </div>

//                 <button
//                   type="button"
//                   onClick={incrementMax}
//                   className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors flex items-center justify-center text-gray-700 hover:text-primary"
//                   aria-label="Increase maximum amount">
//                   <AiOutlinePlus size={18} />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// /* ─── Main GroupSettingsModal Component ───────────────────────────────── */
// export const GroupSettingsModal = ({
//   isOpen,
//   onClose,
//   group,
//   onSave,
//   isSubmitting = false,
// }) => {
//   const [numMembers, setNumMembers] = useState({
//     min: group?.totalMembers || 2,
//     max: group?.maxMembers || 50,
//   });

//   const [numGroups, setNumGroups] = useState({
//     min: group?.minGroups || 1,
//     max: group?.maxGroups || 100,
//   });

//   const [selectedCurrency, setSelectedCurrency] = useState(
//     group?.currency || "INR"
//   );

//   const [fundAmount, setFundAmount] = useState({
//     min: group?.minFundAmount || currencyMeta[group?.currency || "INR"].minAmount,
//     max: group?.maxFundAmount || currencyMeta[group?.currency || "INR"].maxAmount,
//   });

//   const [errorMessage, setErrorMessage] = useState("");

//   const handleSave = useCallback(async () => {
//     // Validation
//     if (numMembers.min >= numMembers.max) {
//       setErrorMessage("Minimum members must be less than maximum members");
//       return;
//     }

//     if (numGroups.min >= numGroups.max) {
//       setErrorMessage("Minimum groups must be less than maximum groups");
//       return;
//     }

//     if (!selectedCurrency) {
//       setErrorMessage("Please select a currency for the fund amount");
//       return;
//     }

//     if (fundAmount.min >= fundAmount.max) {
//       setErrorMessage("Minimum fund amount must be less than maximum amount");
//       return;
//     }

//     setErrorMessage("");

//     const settings = {
//       numMembers,
//       numGroups,
//       fundAmount,
//       groupId: group?.groupId,
//       currency: selectedCurrency,
//     };

//     try {
//       await onSave?.(settings);
//       toast.success("Settings updated successfully!");
//       setTimeout(() => {
//         onClose();
//       }, 1500);
//     } catch (error) {
//       const message = error?.message || "Failed to save settings";
//       setErrorMessage(message);
//       toast.error(message);
//     }
//   }, [numMembers, numGroups, fundAmount, selectedCurrency, group, onSave, onClose]);

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//       <ToastContainer position="top-right" autoClose={2500} />

//       {/* Backdrop */}
//       <div
//         className="absolute inset-0 bg-black/50 backdrop-blur-sm"
//         onClick={onClose}
//       />

//       {/* Modal Container */}
//       <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">
//         {/* Header */}
//         <div className="sticky top-0 z-20 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 px-6 py-5 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-primary/10 rounded-lg">
//               <FiSettings className="text-primary" size={24} />
//             </div>
//             <div>
//               <h2 className="text-xl font-bold text-gray-900">
//                 Manage Group Settings
//               </h2>
//               <p className="text-xs text-gray-500 mt-0.5">
//                 {group?.groupName || "Configure Group"}
//               </p>
//             </div>
//           </div>
//           <button
//             onClick={onClose}
//             className="p-1 hover:bg-gray-200/50 rounded-lg transition-colors"
//             aria-label="Close modal">
//             <FiX size={24} className="text-gray-600" />
//           </button>
//         </div>

//         {/* Body */}
//         <div className="p-6 space-y-6">
//           {/* Error Message */}
//           {errorMessage && (
//             <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
//               <p className="text-sm font-medium text-red-700">⚠ {errorMessage}</p>
//             </div>
//           )}

//           {/* Number of Members */}
//           <NumberInputWithControls
//             label="Number of Members"
//             minValue={numMembers.min}
//             setMinValue={(val) =>
//               setNumMembers((prev) => ({
//                 ...prev,
//                 min: typeof val === "function" ? val(prev.min) : val,
//               }))
//             }
//             maxValue={numMembers.max}
//             setMaxValue={(val) =>
//               setNumMembers((prev) => ({
//                 ...prev,
//                 max: typeof val === "function" ? val(prev.max) : val,
//               }))
//             }
//             minLimit={1}
//             maxLimit={500}
//             step={1}
//           />

//           {/* Divider */}
//           <div className="h-px bg-gray-200" />

//           {/* Number of Groups */}
//           <NumberInputWithControls
//             label="Number of Groups"
//             minValue={numGroups.min}
//             setMinValue={(val) =>
//               setNumGroups((prev) => ({
//                 ...prev,
//                 min: typeof val === "function" ? val(prev.min) : val,
//               }))
//             }
//             maxValue={numGroups.max}
//             setMaxValue={(val) =>
//               setNumGroups((prev) => ({
//                 ...prev,
//                 max: typeof val === "function" ? val(prev.max) : val,
//               }))
//             }
//             minLimit={1}
//             maxLimit={1000}
//             step={1}
//           />

//           {/* Divider */}
//           <div className="h-px bg-gray-200" />

//           {/* Fund Amount */}
//           <FundAmountInput
//             label="Fund Amount"
//             selectedCurrency={selectedCurrency}
//             setSelectedCurrency={setSelectedCurrency}
//             minAmount={fundAmount.min}
//             setMinAmount={(val) =>
//               setFundAmount((prev) => ({
//                 ...prev,
//                 min: typeof val === "function" ? val(prev.min) : val,
//               }))
//             }
//             maxAmount={fundAmount.max}
//             setMaxAmount={(val) =>
//               setFundAmount((prev) => ({
//                 ...prev,
//                 max: typeof val === "function" ? val(prev.max) : val,
//               }))
//             }
//           />

//           {/* Summary (reflects live entered values) */}
//           <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 space-y-3">
//             <h3 className="font-semibold text-gray-800 text-sm">Summary</h3>
//             <div className="grid grid-cols-3 gap-3">
//               <div className="bg-white p-3 rounded-lg border border-gray-200">
//                 <p className="text-xs text-gray-500 uppercase font-medium">
//                   Members
//                 </p>
//                 <p className="text-sm font-bold text-primary mt-1">
//                   {numMembers.min} - {numMembers.max}
//                 </p>
//               </div>
//               <div className="bg-white p-3 rounded-lg border border-gray-200">
//                 <p className="text-xs text-gray-500 uppercase font-medium">
//                   Groups
//                 </p>
//                 <p className="text-sm font-bold text-primary mt-1">
//                   {numGroups.min} - {numGroups.max}
//                 </p>
//               </div>
//               <div className="bg-white p-3 rounded-lg border border-gray-200">
//                 <p className="text-xs text-gray-500 uppercase font-medium">
//                   Fund Amount
//                 </p>
//                 <p className="text-sm font-bold text-primary mt-1">
//                   {selectedCurrency ? (
//                     <>
//                       {currencyMeta[selectedCurrency].symbol}
//                       {fundAmount.min.toLocaleString()} -{" "}
//                       {currencyMeta[selectedCurrency].symbol}
//                       {fundAmount.max.toLocaleString()}
//                     </>
//                   ) : (
//                     "Select currency"
//                   )}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex gap-3 justify-end">
//           <button
//             onClick={onClose}
//             className="px-6 py-2.5 rounded-lg border border-gray-300 font-medium text-gray-700 hover:bg-gray-100 transition-colors"
//             disabled={isSubmitting}>
//             Cancel
//           </button>
//           <button
//             onClick={handleSave}
//             disabled={isSubmitting}
//             className="px-6 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
//             {isSubmitting ? (
//               <>
//                 <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                 Saving...
//               </>
//             ) : (
//               "Save Settings"
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GroupSettingsModal; 

import React, { useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { FiX, FiSettings, FiCheck } from "react-icons/fi";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* ─── Currency Configuration ──────────────────────────────────────────────── */
const currencyMeta = {
  INR: { symbol: "₹", flag: "IN", minAmount: 100, maxAmount: 500000 },
  USD: { symbol: "$", flag: "US", minAmount: 5, maxAmount: 10000 },
  AUD: { symbol: "$", flag: "AU", minAmount: 10, maxAmount: 15000 },
  CNY: { symbol: "¥", flag: "CN", minAmount: 50, maxAmount: 100000 },
  GBP: { symbol: "£", flag: "GB", minAmount: 5, maxAmount: 8000 },
};

/* ─── Number Input Component with +/- Controls (Min & Max side by side) ──── */
const NumberInputWithControls = ({
  label,
  minValue,
  setMinValue,
  maxValue,
  setMaxValue,
  minLimit = 1,
  maxLimit = 1000,
  step = 1,
}) => {
  const handleMinChange = (e) => {
    const val = parseInt(e.target.value) || 0;
    setMinValue(Math.max(minLimit, Math.min(val, maxValue - 1)));
  };

  const handleMaxChange = (e) => {
    const val = parseInt(e.target.value) || 0;
    setMaxValue(Math.max(minValue + 1, Math.min(val, maxLimit)));
  };

  const decrementMin = () => {
    setMinValue((prev) => Math.max(minLimit, prev - step));
  };

  const incrementMin = () => {
    setMinValue((prev) => Math.min(prev + step, maxValue - 1));
  };

  const decrementMax = () => {
    setMaxValue((prev) => Math.max(minValue + 1, prev - step));
  };

  const incrementMax = () => {
    setMaxValue((prev) => Math.min(prev + step, maxLimit));
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-800">
        {label}
      </label>

      <div className="grid grid-cols-2 gap-4">
        {/* Minimum */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-gray-600">
            Minimum
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={decrementMin}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors flex items-center justify-center text-gray-700 hover:text-primary"
              aria-label="Decrease minimum">
              <AiOutlineMinus size={18} />
            </button>

            <input
              type="number"
              value={minValue}
              onChange={handleMinChange}
              min={minLimit}
              max={maxValue - 1}
              className="flex-1 w-full min-w-0 px-2 py-2 border border-gray-300 rounded-lg text-center font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />

            <button
              type="button"
              onClick={incrementMin}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors flex items-center justify-center text-gray-700 hover:text-primary"
              aria-label="Increase minimum">
              <AiOutlinePlus size={18} />
            </button>
          </div>
        </div>

        {/* Maximum */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-gray-600">
            Maximum
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={decrementMax}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors flex items-center justify-center text-gray-700 hover:text-primary"
              aria-label="Decrease maximum">
              <AiOutlineMinus size={18} />
            </button>

            <input
              type="number"
              value={maxValue}
              onChange={handleMaxChange}
              min={minValue + 1}
              max={maxLimit}
              className="flex-1 w-full min-w-0 px-2 py-2 border border-gray-300 rounded-lg text-center font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />

            <button
              type="button"
              onClick={incrementMax}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors flex items-center justify-center text-gray-700 hover:text-primary"
              aria-label="Increase maximum">
              <AiOutlinePlus size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Currency-Aware Fund Amount Input ──────────────────────────────────── */
const FundAmountInput = ({
  label,
  selectedCurrency,
  setSelectedCurrency,
  minAmount,
  setMinAmount,
  maxAmount,
  setMaxAmount,
}) => {
  const currencyInfo = currencyMeta[selectedCurrency];
  const symbol = currencyInfo?.symbol || "";
  const minLimit = currencyInfo?.minAmount ?? 0;
  const maxLimit = currencyInfo?.maxAmount ?? 0;
  const step =
    selectedCurrency === "INR" ? 100 : selectedCurrency === "USD" ? 1 : 10;

  const handleCurrencySelect = (code) => {
    const meta = currencyMeta[code];
    setSelectedCurrency(code);
    // Reset to sensible defaults whenever the currency changes
    setMinAmount(meta.minAmount);
    setMaxAmount(meta.maxAmount);
  };

  const handleMinChange = (e) => {
    const val = parseInt(e.target.value) || 0;
    setMinAmount(Math.max(minLimit, Math.min(val, maxAmount - step)));
  };

  const handleMaxChange = (e) => {
    const val = parseInt(e.target.value) || 0;
    setMaxAmount(Math.max(minAmount + step, Math.min(val, maxLimit)));
  };

  const decrementMin = () => {
    setMinAmount((prev) => Math.max(minLimit, prev - step));
  };

  const incrementMin = () => {
    setMinAmount((prev) => Math.min(prev + step, maxAmount - step));
  };

  const decrementMax = () => {
    setMaxAmount((prev) => Math.max(minAmount + step, prev - step));
  };

  const incrementMax = () => {
    setMaxAmount((prev) => Math.min(prev + step, maxLimit));
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold text-gray-800">
        {label}
      </label>

      {/* Currency selection buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {Object.entries(currencyMeta).map(([code, meta]) => {
          const isSelected = selectedCurrency === code;
          return (
            <button
              key={code}
              type="button"
              onClick={() => handleCurrencySelect(code)}
              className={`relative text-left p-3 rounded-lg border transition-colors ${
                isSelected
                  ? "border-primary bg-primary/10 ring-2 ring-primary"
                  : "border-gray-300 hover:bg-gray-50"
              }`}>
              {isSelected && (
                <span className="absolute top-2 right-2 text-primary">
                  <FiCheck size={16} />
                </span>
              )}
              <p className="text-sm font-bold text-gray-800">
                {meta.symbol} {code}
              </p>
              <p className="text-[11px] text-gray-500 mt-1">
                {meta.symbol}
                {meta.minAmount.toLocaleString()} - {meta.symbol}
                {meta.maxAmount.toLocaleString()}
              </p>
            </button>
          );
        })}
      </div>

      {/* Only show min/max once a currency has been chosen */}
      {selectedCurrency && (
        <div className="pt-2">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
            <p className="text-xs text-blue-700">
              <span className="font-semibold">Currency:</span>{" "}
              {selectedCurrency} ({symbol})
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Allowed range: {symbol}
              {minLimit.toLocaleString()} - {symbol}
              {maxLimit.toLocaleString()}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Minimum Amount */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-600">
                Minimum Amount ({symbol})
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={decrementMin}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors flex items-center justify-center text-gray-700 hover:text-primary"
                  aria-label="Decrease minimum amount">
                  <AiOutlineMinus size={18} />
                </button>

                <div className="flex-1 relative min-w-0">
                  <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-600 font-semibold text-sm">
                    {symbol}
                  </span>
                  <input
                    type="number"
                    value={minAmount}
                    onChange={handleMinChange}
                    min={minLimit}
                    max={maxAmount - step}
                    step={step}
                    className="w-full pl-6 pr-2 py-2 border border-gray-300 rounded-lg text-right font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <button
                  type="button"
                  onClick={incrementMin}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors flex items-center justify-center text-gray-700 hover:text-primary"
                  aria-label="Increase minimum amount">
                  <AiOutlinePlus size={18} />
                </button>
              </div>
            </div>

            {/* Maximum Amount */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-600">
                Maximum Amount ({symbol})
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={decrementMax}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors flex items-center justify-center text-gray-700 hover:text-primary"
                  aria-label="Decrease maximum amount">
                  <AiOutlineMinus size={18} />
                </button>

                <div className="flex-1 relative min-w-0">
                  <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-600 font-semibold text-sm">
                    {symbol}
                  </span>
                  <input
                    type="number"
                    value={maxAmount}
                    onChange={handleMaxChange}
                    min={minAmount + step}
                    max={maxLimit}
                    step={step}
                    className="w-full pl-6 pr-2 py-2 border border-gray-300 rounded-lg text-right font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <button
                  type="button"
                  onClick={incrementMax}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors flex items-center justify-center text-gray-700 hover:text-primary"
                  aria-label="Increase maximum amount">
                  <AiOutlinePlus size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── Main GroupSettingsModal Component ───────────────────────────────── */
export const GroupSettingsModal = ({
  isOpen,
  onClose,
  group,
  onSave,
  isSubmitting = false,
}) => {
  const [numMembers, setNumMembers] = useState({
    min: group?.totalMembers || 2,
    max: group?.maxMembers || 50,
  });

  const [numGroups, setNumGroups] = useState({
    min: group?.minGroups || 1,
    max: group?.maxGroups || 100,
  });

  const [selectedCurrency, setSelectedCurrency] = useState(
    group?.currency || "INR"
  );

  const [fundAmount, setFundAmount] = useState({
    min: group?.minFundAmount || currencyMeta[group?.currency || "INR"].minAmount,
    max: group?.maxFundAmount || currencyMeta[group?.currency || "INR"].maxAmount,
  });

  const [errorMessage, setErrorMessage] = useState("");

  const handleSave = useCallback(async () => {
    // Validation
    if (numMembers.min >= numMembers.max) {
      setErrorMessage("Minimum members must be less than maximum members");
      return;
    }

    if (numGroups.min >= numGroups.max) {
      setErrorMessage("Minimum groups must be less than maximum groups");
      return;
    }

    if (!selectedCurrency) {
      setErrorMessage("Please select a currency for the fund amount");
      return;
    }

    if (fundAmount.min >= fundAmount.max) {
      setErrorMessage("Minimum fund amount must be less than maximum amount");
      return;
    }

    setErrorMessage("");

    const settings = {
      numMembers,
      numGroups,
      fundAmount,
      groupId: group?.groupId,
      currency: selectedCurrency,
    };

    try {
      await onSave?.(settings);
      toast.success("Settings updated successfully!");
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      const message = error?.message || "Failed to save settings";
      setErrorMessage(message);
      toast.error(message);
    }
  }, [numMembers, numGroups, fundAmount, selectedCurrency, group, onSave, onClose]);

  return createPortal(
    <>
      {/* Mounted independently of isOpen so a toast fired right before/while the
          modal closes still has somewhere to render.
          Rendered via a portal into document.body so this component never
          becomes an extra sibling/grid-item inside whatever layout
          (e.g. a card grid) happens to render <GroupSettingsModal />. */}
      <ToastContainer position="top-right" autoClose={2500} />

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Container */}
          <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FiSettings className="text-primary" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Manage Group Settings
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {group?.groupName || "Configure Group"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200/50 rounded-lg transition-colors"
            aria-label="Close modal">
            <FiX size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Error Message */}
          {errorMessage && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm font-medium text-red-700">⚠ {errorMessage}</p>
            </div>
          )}

          {/* Number of Members */}
          <NumberInputWithControls
            label="Number of Members"
            minValue={numMembers.min}
            setMinValue={(val) =>
              setNumMembers((prev) => ({
                ...prev,
                min: typeof val === "function" ? val(prev.min) : val,
              }))
            }
            maxValue={numMembers.max}
            setMaxValue={(val) =>
              setNumMembers((prev) => ({
                ...prev,
                max: typeof val === "function" ? val(prev.max) : val,
              }))
            }
            minLimit={1}
            maxLimit={500}
            step={1}
          />

          {/* Divider */}
          <div className="h-px bg-gray-200" />

          {/* Number of Groups */}
          <NumberInputWithControls
            label="Number of Groups"
            minValue={numGroups.min}
            setMinValue={(val) =>
              setNumGroups((prev) => ({
                ...prev,
                min: typeof val === "function" ? val(prev.min) : val,
              }))
            }
            maxValue={numGroups.max}
            setMaxValue={(val) =>
              setNumGroups((prev) => ({
                ...prev,
                max: typeof val === "function" ? val(prev.max) : val,
              }))
            }
            minLimit={1}
            maxLimit={1000}
            step={1}
          />

          {/* Divider */}
          <div className="h-px bg-gray-200" />

          {/* Fund Amount */}
          <FundAmountInput
            label="Fund Amount"
            selectedCurrency={selectedCurrency}
            setSelectedCurrency={setSelectedCurrency}
            minAmount={fundAmount.min}
            setMinAmount={(val) =>
              setFundAmount((prev) => ({
                ...prev,
                min: typeof val === "function" ? val(prev.min) : val,
              }))
            }
            maxAmount={fundAmount.max}
            setMaxAmount={(val) =>
              setFundAmount((prev) => ({
                ...prev,
                max: typeof val === "function" ? val(prev.max) : val,
              }))
            }
          />

          {/* Summary (reflects live entered values) */}
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 space-y-3">
            <h3 className="font-semibold text-gray-800 text-sm">Summary</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500 uppercase font-medium">
                  Members
                </p>
                <p className="text-sm font-bold text-primary mt-1">
                  {numMembers.min} - {numMembers.max}
                </p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500 uppercase font-medium">
                  Groups
                </p>
                <p className="text-sm font-bold text-primary mt-1">
                  {numGroups.min} - {numGroups.max}
                </p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500 uppercase font-medium">
                  Fund Amount
                </p>
                <p className="text-sm font-bold text-primary mt-1">
                  {selectedCurrency ? (
                    <>
                      {currencyMeta[selectedCurrency].symbol}
                      {fundAmount.min.toLocaleString()} -{" "}
                      {currencyMeta[selectedCurrency].symbol}
                      {fundAmount.max.toLocaleString()}
                    </>
                  ) : (
                    "Select currency"
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg border border-gray-300 font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            disabled={isSubmitting}>
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              "Save Settings"
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

export default GroupSettingsModal;