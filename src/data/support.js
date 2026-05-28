export const ContactEnquiry = {
  success: true,
  message: "Support enquiries fetched successfully",
  data: {
    enquiries: [
      {
        id: "995c7fd1-2ce3-44d6-93e8-c3eb0b2b36f4",
        name: "Priya",
        email: "priya@yopmail.com",
        mobile: "9876543210",
        message: "Test",
        category: "Account Access And Profile",
        enquirySentAt: "2026-02-18T05:36:39.824+00:00",
        status: "Pending",
      },
      {
        id: "89f830b8-530c-4bce-a3fc-b5673ec7ceec",
        name: "Shanmugapriya No name",
        email: "Shanupri.2004@gmail.com",
        mobile: "09489512161",
        message: "Message",
        category: "Technical Support",
        enquirySentAt: "2026-02-18T05:31:34.33+00:00",
        status: "Pending",
      },
      {
        id: "2d045d56-db34-4808-b6e1-63b2957cf613",
        name: "Shanmugapriya",
        email: "lala@gmail.com",
        mobile: "09489512161 ",
        message: "Testing",
        category: "Security And Fraud Reporting",
        enquirySentAt: "2026-02-18T05:21:43.594+00:00",
        status: "Pending",
      },
      {
        id: "916e4679-75bd-46b2-907d-fadca3cdb69e",
        name: "Shanmugapriya ",
        email: "malar@yopmail.com",
        mobile: "9489512161",
        message: "Tessting",
        category: "Security And Fraud Reporting",
        enquirySentAt: "2026-02-18T05:17:05.566+00:00",
        status: "Pending",
      },
      {
        id: "533b3b74-d512-4119-8130-f725257f89af",
        name: "Shanmugapriya No name",
        email: "Shanupri.2004@gmail.com",
        mobile: "09489512161",
        message: "Hello",
        category: "General Inquiry",
        enquirySentAt: "2026-02-17T07:12:24.88+00:00",
        status: "Pending",
      },
      {
        id: "768d1275-2998-48fe-97c4-d72cc79ee50e",
        name: "Aadhini",
        email: "aadhini@yopmail.com",
        mobile: "9876543210",
        message: "Testing",
        category: "Security And Fraud Reporting",
        enquirySentAt: "2026-02-17T05:53:06.061+00:00",
        status: "Pending",
      },
      {
        id: "33e9db68-6bb6-4b41-8720-ab93a6c39340",
        name: "Kavitha",
        email: "kavi@yopmail.com",
        mobile: "9876543210",
        message: "I need technical support",
        category: "Technical Support",
        enquirySentAt: "2026-02-16T13:45:25.637+00:00",
        status: "Pending",
      },
      {
        id: "bd211657-84e3-48c3-ac6d-1fe57d6553ed",
        name: "Priya",
        email: "priya@yopmail.com",
        mobile: "9876543210",
        message: "Test",
        category: "Account Access And Profile",
        enquirySentAt: "2026-02-16T13:35:10.433+00:00",
        status: "Pending",
      },
    ],
    totalEnquiries: 8,
    totalPendingEnquiries: 8,
    totalResolvedEnquiries: 0,
  },
};

export const SignUpEnquiry = {
  success: true,
  message: "Sign-up enquiries fetched successfully",
  data: [
    {
      id: "651a0183-8cb7-4000-9872-137bc47d1a69",
      name: "kavi",
      email: "kk@yopmail.com",
      mobile: "9876543212",
      signUpDate: "2026-02-18T05:03:29.658+00:00",
      message: "test",
    },
    {
      id: "befd6987-69de-4d2f-893d-d27f23fe6d4d",
      name: "Shanmugapriya",
      email: "imshunmugapriya.4527@gmail.com",
      mobile: "9489512161",
      signUpDate: "2026-02-18T04:58:32.261+00:00",
      message: "I want to create a account on The chit fund app",
    },
    {
      id: "3ee604d9-5d32-439f-887e-d22f1d4807ae",
      name: "Shanmugapriya",
      email: "priya@yopmail.com",
      mobile: "9876543210",
      signUpDate: "2026-02-17T07:06:59.93+00:00",
      message: "Hi",
    },
    {
      id: "d7ca119a-ef8f-44f4-b9b9-5f04a8ff5e6d",
      name: "Shanmugapriya",
      email: "Shanupri.2004@gmail.com",
      mobile: "0948951216",
      signUpDate: "2026-02-17T06:56:55.04+00:00",
      message: "Testing",
    },
    {
      id: "3dc02714-609a-4f8c-96d4-d2e8f40f1600",
      name: "Priya",
      email: "kavikrishnamoorthi.csd@gmail.com",
      mobile: "9876543210",
      signUpDate: "2026-02-17T06:56:05.277+00:00",
      message: "Test",
    },
  ],
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getContactEnquiries = async () => {
  await delay(800); // simulate network delay
  return ContactEnquiry;
};

export const getSignUpEnquiries = async () => {
  await delay(800);
  return SignUpEnquiry;
};
