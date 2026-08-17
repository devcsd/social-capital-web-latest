// Static content for the Terms & Conditions and Privacy Policy modals.
// Section "type" drives rendering in LegalModal: "paragraph" | "list" | "contact".

export const TERMS_CONTENT = {
  title: "Terms & Conditions",
  subtitle: "Important rules for using Social Capital.",
  sections: [
    {
      type: "paragraph",
      heading: "Accepting these terms",
      body: "By creating an account or using Social Capital, you agree to these Terms and Conditions and the Privacy Policy. Do not use the platform when you do not understand or accept these terms.",
    },
    {
      type: "list",
      heading: "Who can use Social Capital",
      intro: "You must:",
      items: [
        "Be at least 18 years old",
        "Provide correct account information",
        "Be legally allowed to use the platform",
        "Use the platform only for lawful personal purposes",
        "Follow these terms and the group rules",
      ],
    },
    {
      type: "paragraph",
      heading: "Your account",
      body: "You are responsible for your account. Keep your login details, mobile device, email account, and verification codes safe and private. Tell Social Capital support promptly when you notice suspicious account activity.",
    },
    {
      type: "paragraph",
      heading: "Social Capital's role",
      body: "Social Capital provides software for private group creation, invitations, schedules, reminders, payment-status tracking, and activity records. Social Capital does not handle group money and is not a party to private arrangements between users.",
    },
    {
      type: "paragraph",
      heading: "Private groups",
      body: "Users create and coordinate their own private groups. Join only with people you know and trust. Social Capital does not automatically match you with unknown members. Before joining, review the members, contribution amount, schedule, number of rounds, receiving order, payment method, and any charge shown in the app.",
    },
    {
      type: "paragraph",
      heading: "Group manager",
      body: "The group manager creates and coordinates the group. The manager must provide correct information, explain the group details, keep members informed, and use platform controls responsibly. The manager is not an employee, partner, or representative of Social Capital.",
    },
    {
      type: "list",
      heading: "Member responsibility",
      intro: "Every member must:",
      items: [
        "Review the group before joining",
        "Contribute based on the accepted schedule",
        "Check payment details before sending money",
        "Provide honest payment updates",
        "Confirm receipt only after the full amount arrives",
        "Continue contributing after receiving the group amount",
        "Complete all accepted responsibilities",
        "Respect other members and their personal information",
      ],
    },
    {
      type: "paragraph",
      heading: "Payments happen outside Social Capital",
      body: "All group payments happen outside Social Capital through a method selected by the group. Users are responsible for checking payment details. Social Capital cannot cancel, reverse, replace, or recover an outside payment.",
    },
    {
      type: "paragraph",
      heading: "Payment-status records",
      body: "Payment statuses shown in the app are based on updates made by users. Social Capital does not independently confirm every payment with a bank or payment provider. Do not mark a payment as Received until the full amount has arrived.",
    },
    {
      type: "paragraph",
      heading: "Group changes",
      body: "Important group details should not be changed after the group begins unless the app allows the change, affected members are informed, and the required members accept the change. The platform may keep the original details and a history of changes.",
    },
    {
      type: "paragraph",
      heading: "Charges",
      body: "A platform charge or manager charge, when available, must be clearly shown before a user accepts it. Do not use hidden or misleading charges.",
    },
    {
      type: "list",
      heading: "Activities that are not allowed",
      intro: "You must not:",
      items: [
        "Create fake accounts",
        "Pretend to be another person",
        "Enter false payment updates",
        "Provide fake or changed payment proof",
        "Harass, threaten, or shame users",
        "Mislead people about a group",
        "Invite unknown people through unauthorized public posts",
        "Ask for banking passwords, payment PINs, or one-time payment codes",
        "Share another person's private information without permission",
        "Use the platform for unlawful activity",
        "Damage, copy, reverse engineer, or misuse the platform",
        "Create another account to avoid a restriction",
      ],
    },
    {
      type: "paragraph",
      heading: "Complaints and account restrictions",
      body: "Social Capital may review complaints and platform records. Social Capital may send a warning, request information, limit selected features, pause group activity, suspend an account, close an account, or preserve records when reasonably needed for safety, security, rule enforcement, or legal requirements. A platform action does not decide who legally owns disputed money.",
    },
    {
      type: "paragraph",
      heading: "Leaving a group or deleting an account",
      body: "Leaving a group or deleting an account does not automatically remove responsibilities already accepted. Some records may remain when they are connected to other members, completed activity, complaints, security, or legal requirements.",
    },
    {
      type: "paragraph",
      heading: "Platform availability",
      body: "Social Capital may sometimes be unavailable because of maintenance, technical problems, security work, internet issues, outside service problems, or legal requirements. We will try to restore the service as soon as reasonably possible.",
    },
    {
      type: "paragraph",
      heading: "Outside services",
      body: "Social Capital may use outside providers for login, messages, notifications, cloud hosting, analytics, security, and customer support. Those providers may have their own terms and privacy practices.",
    },
    {
      type: "paragraph",
      heading: "Platform content and ownership",
      body: "The Social Capital name, logo, software, design, and original content belong to [LEGAL COMPANY NAME] or its licensed providers. You may use the platform only for its intended purpose. You may not copy, sell, publish, or commercially use the platform without written permission.",
    },
    {
      type: "paragraph",
      heading: "User content",
      body: "You are responsible for the information, group details, payment updates, messages, and evidence you submit. You must have the right to provide that information, and it must not be false, unlawful, or harmful to another person. Social Capital may store and show this content as needed to provide the platform, maintain records, support users, protect accounts, and enforce rules.",
    },
    {
      type: "paragraph",
      heading: "Responsibility for user decisions",
      body: "Users make their own decisions about who joins a group, how much to contribute, which outside payment method to use, the receiving order, and how private disagreements are handled. To the extent allowed by applicable law, Social Capital is not responsible for loss caused by another user's actions, incorrect payment details, an outside payment, or a private arrangement between users. Nothing in these terms removes a user right that cannot legally be removed.",
    },
    {
      type: "paragraph",
      heading: "Changes to these terms",
      body: "Social Capital may update these terms when the platform, rules, security needs, or legal requirements change. Important changes will be communicated through the app, website, email, or another suitable method.",
    },
    {
      type: "contact",
      heading: "Contact",
      fields: [
        // { label: "Company", value: "[LEGAL COMPANY NAME]" },
        // { label: "Registered address", value: "[REGISTERED ADDRESS]" },
        { label: "Support email", value: "support@socappglobal.com" },
        // { label: "Grievance email", value: "[GRIEVANCE EMAIL]" },
      ],
    },
  ],
};

export const PRIVACY_CONTENT = {
  title: "Privacy Policy",
  subtitle: "How your information is used and protected.",
  sections: [
    {
      type: "paragraph",
      heading: "What this policy explains",
      body: "This policy explains what information Social Capital may collect, why it is used, who may see it, how long it may be kept, and the choices available to users.",
    },
    {
      type: "list",
      heading: "Information we may collect",
      intro: "Depending on the features used, we may collect:",
      items: [
        "Name, mobile number, email address, date of birth, profile photo",
        "Country or region",
        "Group details and group membership",
        "Contribution schedules and receiving order",
        "Payment-status updates",
        "Invitations",
        "Support messages and complaints",
        "Device, app, login, and security information",
        "Information needed for identity or account checks, when enabled",
      ],
    },
    {
      type: "paragraph",
      heading: "Information we do not need",
      body: "Social Capital does not need your bank password, card PIN, UPI PIN, one-time payment code, or full card security code. Never share a payment PIN or one-time code with Social Capital support, a group manager, or another member.",
    },
    {
      type: "list",
      heading: "Why we use information",
      intro: "We may use information to:",
      items: [
        "Create and manage accounts",
        "Provide group features",
        "Show group activity to authorized members",
        "Send reminders and service updates",
        "Provide customer support",
        "Review complaints",
        "Protect accounts and prevent misuse",
        "Fix technical problems",
        "Improve platform performance",
        "Meet legal requirements",
      ],
    },
    {
      type: "paragraph",
      heading: "What group members may see",
      body: "Members of your group may see information needed for group coordination, such as your name and profile photo, member role, contribution status, receiving order, relevant group activity, and payment receiving details, when the feature is enabled. Do not enter information that is not needed for the group.",
    },
    {
      type: "paragraph",
      heading: "Service providers",
      body: "Social Capital may use outside companies for cloud hosting, login verification, email or text messages, notifications, customer support, security, analytics, and crash reporting. These providers may process only the information needed to provide their service to Social Capital.",
    },
    {
      type: "list",
      heading: "When information may be shared",
      intro: "Information may be shared:",
      items: [
        "When you ask us to share it",
        "With authorized members of your private group",
        "With providers helping us operate the platform",
        "To investigate misuse or protect users",
        "When required by law or an authorized request",
        "During a company reorganization or transfer",
      ],
      note: "Social Capital does not sell private group payment-status records to advertisers.",
    },
    {
      type: "paragraph",
      heading: "How long information is kept",
      body: "Information is kept only as long as reasonably needed for active groups, group records, user support, complaint handling, security, legal requirements, and responding to claims. Some group records may remain after an account is closed because they are connected to other members and shared activity.",
    },
    {
      type: "paragraph",
      heading: "Account deletion",
      body: "You may request account deletion through App: More → Account → Delete Account or by email at [PRIVACY EMAIL]. When your account has no group history, most account information may be deleted after identity and security checks. When your account has group history, some records may remain for other members' records, group history, complaints, safety, security, or legal requirements. Deleting an account does not automatically remove an accepted group responsibility or another member's record.",
    },
    {
      type: "paragraph",
      heading: "Information security",
      body: "Social Capital uses reasonable steps to protect user information. These may include secure connections, access controls, account verification, restricted staff access, monitoring, security records, and backups. No online service can promise complete security. Protect your device and report suspicious activity promptly.",
    },
    {
      type: "paragraph",
      heading: "Your choices",
      body: "Depending on applicable requirements, you may ask to view your information, correct inaccurate information, or delete eligible information.",
    },
    {
      type: "paragraph",
      heading: "Users below 18",
      body: "Social Capital is not intended for anyone under 18.",
    },
    {
      type: "paragraph",
      heading: "Changes to this policy",
      body: "This policy may be updated when the app, information practices, service providers, or legal requirements change. The updated date will appear at the top.",
    },
    {
      type: "contact",
      heading: "Contact",
      fields: [
        // { label: "Privacy email", value: "[PRIVACY EMAIL]" },
        { label: "Support email", value: "support@socappglobal.com" },
        // { label: "Company", value: "[LEGAL COMPANY NAME]" },
        // { label: "Registered address", value: "[REGISTERED ADDRESS]" },
      ],
    },
  ],
};
