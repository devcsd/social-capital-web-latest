import axios from "axios";
import { message } from "antd";
import localforage from "localforage";

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: "https://api.socappglobal.com/api/v1/", // Your API base URL
  timeout: 10000, // Optional timeout
});

// Request interceptor — automatically attach token
axiosInstance.interceptors.request.use(async (config) => {
  const user = await localforage.getItem("user");
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  config.headers["X-Service-Auth-Token"] = import.meta.env.VITE_SERVICE_AUTH_TOKEN;
  return config;
});

// Response interceptor — handle errors globally
const errorTracker = new Set();

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorKey = error.response?.status || "unknown";

    if (!errorTracker.has(errorKey)) {
      errorTracker.add(errorKey);

      if (error.response && error.response.status === 403) {
        message.error("Session Expired. Please login again.");
        // window.location.href = "/login"; // optional redirect
      }

      setTimeout(() => errorTracker.delete(errorKey), 1000);
    }

    return Promise.reject(error);
  },
);

// Standardized API service
const apiService = {
  get: (url, config = {}) => axiosInstance.get(url, config),
  post: (url, data, config = {}) => axiosInstance.post(url, data, config),
  put: (url, data, config = {}) => axiosInstance.put(url, data, config),
  delete: (url, config = {}) => axiosInstance.delete(url, config),
};

// Auth APIs
export const loginApi = async (data) => apiService.post("auth/login", data);
export const verifyOtpApi = async (data) =>
  apiService.post("auth/verify-otp", data);

// Get All Group categories
export const getAllGroupCategoriesData = async () => {
  return apiService.get("admin/getAllGroupData");
};

// Get All Groups
export const getAllGroups = async () => {
  return apiService.get("group");
};

// Get Groups by Group Type ID
export const getGroupByTypeId = async (typeId) => {
  return apiService.get(`admin/getGroupByTypeId/${typeId}`);
};

//Get Group Data by ID
export const getGroupDataById = async (groupId) => {
  return apiService.get(`admin/getGroupDataById/${groupId}`);
};

//Get member Data by page id
export const getAllMemberPageId = async (pageId, filters = {}) => {
  return apiService.post(`admin/getAllMemberData`, {
    filters,
    page: pageId,
  });
};

// post group pause/resume activity
export const postGroupActivity = async (payload) => {
  return apiService.post("admin/groupActivity", payload);
};

// send BoardCast
export const createBroadcast = async (payload) => {
  return apiService.post("admin/createBroadcast", payload);
};

export const getBoardcastMasterData = async () => {
  return apiService.get("admin/getBroadcastMasterData");
};

// Get All Fund Manager
export const getAllFundManager = async () => {
  return apiService.get("admin/getFundManagerMasterData");
};

//get Fund Manager by ID
export const getFundManagerByID = async (managerId) => {
  return apiService.get(`admin/getDataByFundManagerId/${managerId}`);
};

export const getGroupByID = async (groupID) => {
  return apiService.get(`group/getById/${groupID}`);
};

//Get Transcation
export const getTransactionByRoundID = async (roundID) => {
  return apiService.get(`admin/getRoundAndTransactionDataByRoundId/${roundID}`);
};

//Get Aution Groups
export const getAuctionGroups = async () => {
  return apiService.get("admin/getDataByGroupType/auction");
};

//Get Rotation Groups
export const getRotationGroups = async () => {
  return apiService.get("admin/getDataByGroupType/rotation");
};

//Get support_category
export const supportCategory = async () => {
  return apiService.get("masterType", {
    headers: {
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmNWMwMTdjNy1jZjVmLTQ1ZmQtOTUyZi04Mjg0NDdhNzNhZDciLCJlbWFpbCI6InN1cGVyYWRtaW5AeW9wbWFpbC5jb20iLCJyb2xlX2lkIjoxLCJpYXQiOjE3ODAwMzM4MTl9.QXX2bRb_9nj7GweYYdGtwgXoZ-xe2zD1E0Srr6-6AEw`,
      "X-Service-Auth-Token": import.meta.env.VITE_SERVICE_AUTH_TOKEN,
    },
  });
};

// Post SupportEnquiry
export const SupportEnquiry = async (payload) => {
  return apiService.post("admin/createSupportEnquiry", payload);
};

// Post createSignUp
export const createSignUp = async (payload) => {
  return apiService.post("admin/createSignUp", payload);
};

//Get Contact_Enquiry
export const getContactEnquiries = async () => {
  return apiService.get("admin/fetchAllSupportEnquiries");
};

//Get SignUP_Enquiry
export const getSignUpEnquiries = async () => {
  return apiService.get("admin/fetchAllSignUpEnquiries");
};

//update Contact_Enquiry
export const updateContactEnquiries = async (id) => {
  return apiService.put(`admin/updateSupportEnquiryStatus/${id}`, {
    status: "Resolved",
  });
};

//Dashboard Analytics
export const getDashboardData = async (filters) => {
  return apiService.post("admin/dashboardAnalytics", filters);
};

export const getMasterTypes = async () => {
  return apiService.get("masterType");
};

/* ─── Update a single master type record by id ─────────────────────────── */
export const updateMasterType = async (id, body) => {
  return apiService.put(`masterType/${id}`, body);
};

/* ─── Convenience wrappers (optional, but keeps call-sites readable) ───── */
export const updateTotalMember = async (id, value) =>
  updateMasterType(id, { value: String(value) });

export const updateTotalGroups = async (id, value) =>
  updateMasterType(id, { value: String(value) });

export const updateCurrencyFundRange = async (
  id,
  minFundAmount,
  maxFundAmount,
) =>
  updateMasterType(id, {
    min_fund_amount: minFundAmount,
    max_fund_amount: maxFundAmount,
  });

export default apiService;
