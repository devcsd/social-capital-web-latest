import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import KuberaBot from "../images/coin.svg";

/* =========================================================
   SOCIAL CAPITAL KNOWLEDGE BASE
   ========================================================= */

const KNOWLEDGE_BASE = {
  metadata: {
    product: "Social Capital",
    version: "2.0",
    last_updated: "2026-03-30",
    voice: "Simple, spoken, warm, movement-driven",
    audience:
      "Trusted community members, diaspora networks, friends and family groups",
  },

  knowledge_base: [
    {
      section: "What is Social Capital",

      entries: [
        {
          id: "SC-001",
          question: "What is Social Capital?",
          short_answer:
            "Social Capital is an open platform where you and your people create your own money group.",
          full_answer:
            "Social Capital is an open platform where you and your people create your own money group. Friends, family, neighbors — your trusted circle — come together, contribute regularly, and support each other when it matters. Simple. Social. Built on trust. Your people. Your group. Your turn.",
          tags: ["basics", "intro", "what is"],
        },

        {
          id: "SC-002",
          question: "What is the bigger idea behind Social Capital?",
          short_answer:
            "It's a movement where small contributions from your trusted circle create big, life-changing money — together.",
          full_answer:
            "Social Capital is a movement for people who believe their community is their greatest financial asset. We bring trusted circles together — friends, family, colleagues, and neighbors — combining small, consistent contributions to create the kind of big, life-changing money that no one could build alone. Every member backs each other's goals, every contribution moves someone forward, and every completed group proves that when your people show up for you, anything is possible. This isn't just about money. It's about what your community can build — together.",
          tagline: "Small contributions. Trusted people. Big goals.",
          tags: ["mission", "movement", "positioning"],
        },

        {
          id: "SC-003",
          question: "What does Social Capital actually do?",
          short_answer:
            "It gives your group structure, visibility, and a track record — so everyone can move forward with confidence.",
          full_answer:
            "Social Capital coordinates your group so things run smoothly and transparently. It tracks who contributed, who received, and where the group stands — at all times. And every group your group completes builds a real reputation for everyone in it. Proof that your people show up.",
          tags: ["platform", "features", "tracking"],
        },

        {
          id: "SC-004",
          question: "Does Social Capital hold or move money?",
          short_answer:
            "No. Money moves directly between your people — outside the app.",
          full_answer:
            "Social Capital is the coordination layer, not the middleman. All payments happen directly between members — bank transfer, UPI, cash, whatever works for your group. We track it. We don't touch it. You stay in control of your money at all times.",
          tags: ["money", "payments", "platform clarity"],
        },

        {
          id: "SC-005",
          question: "Is Social Capital responsible for payments?",
          short_answer: "No. That's between you and your group.",
          full_answer:
            "Social Capital coordinates and tracks — it doesn't enforce or guarantee payments. Every member is personally responsible for sending and receiving money within their group. That's why trust is everything here. Only group with people you genuinely trust.",
          tags: ["responsibility", "payments", "trust"],
        },

        {
          id: "SC-006",
          question: "Who is Social Capital for?",
          short_answer:
            "Anyone with a trusted network and a goal they want to reach faster.",
          full_answer:
            "Social Capital is for people who already trust each other and want to put that trust to work. That could be a family spread across the US, Australia, and India supporting each other. Friends grouping together to fund a business, a trip, or a big purchase. Colleagues helping each other smooth out cash flow. Neighbors building a local support system. If you have trusted people in your life and goals you want to reach — this is for you.",
          examples: [
            "Diaspora families coordinating across countries",
            "Friend groups funding shared goals",
            "Colleagues managing cash flow together",
            "Neighbors building community support",
          ],
          tags: ["audience", "who", "use cases", "diaspora"],
        },

        {
          id: "SC-007",
          question: "Can I use this with strangers?",
          short_answer: "This isn't that kind of app.",
          full_answer:
            "Social Capital runs on real trust between real people. Your network is your power here — the stronger the trust, the better it works. We're not a marketplace or a lending platform. We're your private group, your rules, your people.",
          tags: ["trust", "strangers", "private"],
        },
      ],
    },

    {
      section: "How It's Different",

      entries: [
        {
          id: "SC-008",
          question: "How is Social Capital different from chit funds?",
          short_answer:
            "Chit funds got the idea right. Social Capital takes it further — full transparency, no middleman, and a reputation that's actually yours.",
          full_answer:
            "Chit funds have existed for generations because the core idea works — a trusted group groups money so everyone gets access faster. But traditional chit funds have real problems: a company or foreman holds your money, everything happens behind the scenes, they're local so your cousin in Melbourne can't join your Hyderabad group, and when it's done — it's done. No record. No reputation. Nothing portable. Social Capital keeps what works and fixes what doesn't. Money moves directly between members — no one holds it. Every member sees everything in real time. Your network can be anywhere in the world. And every group you complete builds your reputation — proof that your people show up.",
          key_difference:
            "A chit fund is a service you use. Social Capital is a network you own.",
          tags: ["chit fund", "comparison", "differentiation", "diaspora"],
        },

        {
          id: "SC-009",
          question:
            "How is Social Capital different from just asking friends for money?",
          short_answer:
            "It's not borrowing. Everyone contributes, everyone benefits — and it's all transparent.",
          full_answer:
            "When you ask someone for money, it creates awkwardness and imbalance. Social Capital makes it a fair, structured system where everyone's in it together. No favors. No awkwardness. No one person carrying the load. Just your network, working for everyone.",
          tags: ["comparison", "borrowing", "informal"],
        },

        {
          id: "SC-010",
          question:
            "How is Social Capital different from Splitwise or payment apps?",
          short_answer:
            "Those apps split bills. Social Capital builds financial momentum — together.",
          full_answer:
            "Payment apps and bill splitters track what you owe each other. Social Capital is about grouping together toward bigger goals. It's not reactive — it's proactive. You're not splitting last night's dinner. You're building the kind of money that changes your life.",
          tags: ["comparison", "splitwise", "payment apps"],
        },
      ],
    },

    {
      section: "Groups and Groups",

      entries: [
        {
          id: "SC-011",
          question: "How do I get started?",
          short_answer:
            "Create a group, invite your people, and pick how your group works.",
          full_answer:
            "Getting started is simple. Step 1 — Create your group and invite the people you trust. Step 2 — Set your contribution amount and pick your group type. Step 3 — Everyone starts contributing and taking turns. That's it. Your people, your rules, your group.",
          steps: [
            "Create your group and invite trusted members",
            "Set contribution amount and choose group type",
            "Everyone contributes and takes their turn",
          ],
          tags: ["onboarding", "getting started", "how to"],
        },

        {
          id: "SC-012",
          question: "How do I join a group?",
          short_answer: "Through an invite link shared by your group manager.",
          full_answer:
            "Your group manager shares a private invite link. Only people with that link can join. It's your private space — no one gets in unless your group lets them in.",
          tags: ["joining", "invite", "groups"],
        },

        {
          id: "SC-013",
          question: "Can I create my own group?",
          short_answer: "Yes. You're in charge.",
          full_answer:
            "You can create a group, invite your people, set the contribution amount, and decide how the group works. You're the manager — you set the rules, coordinate the group, and keep things moving.",
          tags: ["create", "manager", "groups"],
        },

        {
          id: "SC-014",
          question: "Can I be in multiple groups?",
          short_answer: "Yes — as many as you can handle.",
          full_answer:
            "You can be part of multiple groups at the same time. Maybe one with family, one with colleagues, one with friends. Each group runs independently.",
          tags: ["multiple groups", "membership"],
        },

        {
          id: "SC-015",
          question: "Can I leave a group after joining?",
          short_answer:
            "It depends on your group rules — and it affects everyone, so talk to your manager first.",
          full_answer:
            "Since the whole group depends on everyone showing up, leaving midway impacts the people who trust you. Always check with your group manager before making any decisions. Your group, your responsibility.",
          tags: ["leaving", "exit", "groups"],
        },

        {
          id: "SC-016",
          question: "What are the different group types?",
          short_answer:
            "There are three: Rotation, Auction, and Predefined. Each works differently depending on what your group needs.",
          full_answer:
            "Social Capital supports three group types. Rotation Group — everyone takes a turn in a set order. Simple, fair, and predictable. Auction Group — members bid for who gets the payout each round. Great for groups where urgency varies and members want flexibility. Predefined Group — members choose their preferred payout slot upfront. You know exactly when your turn is from day one. Think of it as 'Choose When You Get Paid.' Every group type keeps the same core promise — small contributions, your trusted people, big goals.",
          group_types: [
            {
              name: "Rotation Group",
              how_it_works: "Everyone takes a turn in a set order",
              best_for: "Simple, fair, predictable groups",
            },
            {
              name: "Auction Group",
              how_it_works: "Members bid for the payout each round",
              best_for: "Groups where urgency varies and flexibility matters",
            },
            {
              name: "Predefined Group",
              how_it_works: "Members choose their payout slot upfront",
              best_for:
                "Groups who want certainty — you know your turn from day one",
              plain_language: "Choose When You Get Paid",
            },
          ],
          tags: [
            "group types",
            "rotation",
            "auction",
            "predefined",
            "how it works",
          ],
        },
      ],
    },

    {
      section: "Money and Contributions",

      entries: [
        {
          id: "SC-017",
          question: "How do contributions work?",
          short_answer:
            "Every member contributes a fixed amount each round. Small and consistent — that's the power.",
          full_answer:
            "Each round, every member contributes the same fixed amount. Those small, regular contributions come together into a lump sum that goes to one member. Then the cycle continues until everyone has received their turn. Small contributions. Big goals. That's the whole idea.",
          tags: ["contributions", "how it works", "money"],
        },

        {
          id: "SC-018",
          question: "When do I receive money?",
          short_answer: "When it's your turn — based on your group type.",
          full_answer:
            "Depending on your group type, your turn could be set in advance, decided by the group, or won through a bid. Either way, when your turn comes, the full group goes to you. That's your moment — the lump sum your group built together.",
          tags: ["payout", "receiving", "turn"],
        },

        {
          id: "SC-019",
          question: "How do I send money?",
          short_answer:
            "Directly to the member whose turn it is — outside the app.",
          full_answer:
            "You send your contribution directly to the designated member using whatever works for your group — bank transfer, UPI, Zelle, PayPal, cash. Then you mark it as sent in the app. Simple.",
          tags: ["payments", "sending money", "how to"],
        },

        {
          id: "SC-020",
          question: "How is payment tracked?",
          short_answer:
            "Members mark payments as sent and received in the app. Optional proof uploads add an extra layer of trust.",
          full_answer:
            "When you send a payment, you mark it as sent. When the receiver gets it, they mark it as received. Both sides confirm — that's your dual-layer verification. Groups can also upload payment proof for extra transparency. Everything is visible to all members in real time.",
          tags: ["tracking", "verification", "proof", "transparency"],
        },

        {
          id: "SC-021",
          question: "Do I still contribute after my turn?",
          short_answer:
            "Yes. Everyone contributes every round — that's what makes it work.",
          full_answer:
            "Getting your payout doesn't mean you're done. Every member contributes in every round until the full cycle is complete. That's the commitment — and that's what makes the whole thing work. Your people showed up for you. Now you show up for them.",
          tags: ["contributions", "after payout", "commitment"],
        },

        {
          id: "SC-022",
          question: "Can I change my contribution amount later?",
          short_answer: "Usually no — it affects the whole group.",
          full_answer:
            "Contribution amounts are set at the start. Changing them mid-cycle affects every member's plan and expectations. If something changes in your situation, talk to your group manager.",
          tags: ["contribution amount", "changes", "rules"],
        },
      ],
    },

    {
      section: "Transparency and Trust",

      entries: [
        {
          id: "SC-023",
          question: "What does the app track?",
          short_answer:
            "Everything your group needs to stay honest and on track.",
          full_answer:
            "Social Capital tracks contributions, payment status (sent and received), payout history, and overall group activity. Every member sees the same information in real time. No secrets. No surprises.",
          tracks: [
            "Contributions per member per round",
            "Payment status — sent and received",
            "Payout history",
            "Group activity timeline",
          ],
          tags: ["tracking", "transparency", "features"],
        },

        {
          id: "SC-024",
          question: "Can I see who has paid?",
          short_answer: "Yes — full visibility for everyone.",
          full_answer:
            "Every member can see the full payment status in real time. Who's paid, who hasn't, and where the group stands. Transparency is the foundation.",
          tags: ["visibility", "payments", "transparency"],
        },

        {
          id: "SC-025",
          question: "What if someone marks a payment incorrectly?",
          short_answer: "Other members can flag it within the group.",
          full_answer:
            "Since everything is visible to all members, incorrect records get noticed fast. If something doesn't look right, members can raise it within the group. Transparency keeps everyone honest.",
          tags: ["disputes", "incorrect records", "transparency"],
        },

        {
          id: "SC-026",
          question: "Can the manager change records?",
          short_answer: "No. Records are shared and visible to everyone.",
          full_answer:
            "No single person — including the manager — can unilaterally change records. Everything is visible to all members. That's what makes Social Capital trustworthy.",
          tags: ["records", "manager", "transparency"],
        },
      ],
    },

    {
      section: "Trust, Risk and Responsibility",

      entries: [
        {
          id: "SC-027",
          question: "What if someone doesn't pay?",
          short_answer:
            "The group handles it — Social Capital doesn't enforce payments.",
          full_answer:
            "If a member doesn't pay, the group needs to address it internally. The manager should step in, have the conversation, and find a resolution. Social Capital doesn't enforce payments — that's why you only group with people you genuinely trust. Your network is your guarantee.",
          tags: ["non-payment", "risk", "enforcement"],
        },

        {
          id: "SC-028",
          question: "What if there's a dispute?",
          short_answer: "Disputes are resolved within the group.",
          full_answer:
            "Disagreements happen. When they do, the group — led by the manager — works it out. Social Capital provides the visibility and records to help, but the resolution lives within your group. That's the nature of a trust-based system.",
          tags: ["disputes", "conflict", "resolution"],
        },

        {
          id: "SC-029",
          question: "Does the app guarantee payments?",
          short_answer: "No. Your trust in each other is the guarantee.",
          full_answer:
            "Social Capital doesn't and can't guarantee payments. That's not how this works. The guarantee is the trust between your people — and the track record you build together every time your group shows up.",
          tags: ["guarantee", "risk", "payments"],
        },

        {
          id: "SC-030",
          question: "Is there any risk?",
          short_answer:
            "Yes — and knowing that makes you smarter about who you group with.",
          full_answer:
            "Any time money is involved between people, there's risk. Social Capital is transparent about that. The way you manage it is simple — only group with people you genuinely trust, understand your group's rules clearly, and stay engaged throughout the cycle.",
          tags: ["risk", "awareness", "trust"],
        },

        {
          id: "SC-031",
          question: "How can I reduce risk?",
          short_answer:
            "Group with people you trust. Know your group rules. Stay engaged.",
          full_answer:
            "Three things protect you: First, only invite people you genuinely trust — your real network, not acquaintances. Second, understand how your specific group works before you commit. Third, stay active and visible in the group throughout. The more engaged everyone is, the better it runs.",
          tips: [
            "Only group with people you genuinely trust",
            "Understand your group type and rules before joining",
            "Stay active and visible throughout the cycle",
          ],
          tags: ["risk", "tips", "trust"],
        },
      ],
    },

    {
      section: "Manager Role",

      entries: [
        {
          id: "SC-032",
          question: "Who is the group manager?",
          short_answer: "The person who creates and coordinates the group.",
          full_answer:
            "The manager is the one who sets things up — creates the group, invites members, defines the rules, and keeps the group moving. They're the anchor of the group. Not a boss, but a coordinator everyone can count on.",
          tags: ["manager", "role", "groups"],
        },

        {
          id: "SC-033",
          question: "Does the manager handle money?",
          short_answer:
            "Not necessarily. Money flows directly between members.",
          full_answer:
            "The manager coordinates, not controls. Money moves directly between members — the manager doesn't collect or hold it unless the group has specifically agreed to that arrangement.",
          tags: ["manager", "money", "coordination"],
        },

        {
          id: "SC-034",
          question: "Can the manager take a fee?",
          short_answer: "Only if the group agrees upfront.",
          full_answer:
            "If the group decides the manager's coordination work deserves a fee, that's the group's call. It should be agreed on transparently before the group starts — not decided unilaterally.",
          tags: ["manager", "fee", "rules"],
        },

        {
          id: "SC-035",
          question: "What should a manager do if someone doesn't pay?",
          short_answer:
            "Step in early, have the conversation, and keep the group informed.",
          full_answer:
            "Don't wait for it to spiral. If a payment is missed, the manager should reach out to the member directly and privately first. If it's not resolved, the group needs to know — transparency protects everyone. Document what happened in the app and work toward a resolution together. The group's trust is worth protecting.",
          steps: [
            "Reach out to the member directly and privately",
            "If unresolved, inform the group transparently",
            "Document everything in the app",
            "Work toward a group resolution together",
          ],
          tags: ["manager", "non-payment", "dispute resolution"],
        },
      ],
    },

    {
      section: "Edge Cases",

      entries: [
        {
          id: "SC-036",
          question: "What if I miss a payment?",
          short_answer:
            "Tell your group immediately and sort it out as fast as you can.",
          full_answer:
            "Life happens. If you miss a payment, don't go quiet — communicate with your group right away. Let the manager know, explain the situation, and make the payment as soon as possible. Your reputation in this group — and in future groups — depends on how you handle it.",
          tags: ["missed payment", "edge case", "responsibility"],
        },

        {
          id: "SC-037",
          question: "What if my payout is delayed?",
          short_answer: "Check in with your group members and manager.",
          full_answer:
            "If your payout is delayed, reach out to the members who owe contributions and loop in the manager. Use the app's activity log to see exactly what's outstanding. Stay calm, stay visible, and follow up.",
          tags: ["delayed payout", "edge case"],
        },

        {
          id: "SC-038",
          question: "What happens if someone leaves midway?",
          short_answer:
            "It impacts the whole group and needs to be handled together.",
          full_answer:
            "When someone leaves mid-cycle, it affects every other member's plan. The manager should convene the group to decide how to handle it — whether that's redistributing contributions, finding a replacement member, or adjusting the group. There's no one-size-fits-all answer, but transparency and quick action protect everyone.",
          tags: ["leaving", "exit", "edge case", "impact"],
        },

        {
          id: "SC-039",
          question: "Can rules be changed after the group starts?",
          short_answer: "Only if everyone in the group agrees.",
          full_answer:
            "Rules are set at the start for a reason — they protect every member equally. Changing them mid-cycle requires full group agreement. No one person, including the manager, can change the rules unilaterally.",
          tags: ["rules", "changes", "governance"],
        },
      ],
    },

    {
      section: "Platform Clarity",

      entries: [
        {
          id: "SC-040",
          question: "What exactly does Social Capital do?",
          short_answer:
            "It coordinates, tracks, and builds trust — so your group can move together with confidence.",
          full_answer:
            "Social Capital organizes your group, tracks every contribution and payout in real time, gives everyone full visibility, and builds a reputation for every member who shows up. It's the structure your trusted network deserves.",
          tags: ["platform", "what it does", "clarity"],
        },

        {
          id: "SC-041",
          question: "What does Social Capital NOT do?",
          short_answer:
            "It doesn't hold money, move money, enforce payments, or guarantee outcomes.",
          full_answer:
            "To be clear — Social Capital does not hold your money, does not move your money, does not enforce payments between members, and does not guarantee any financial outcome. We're a coordination platform, not a financial service. The trust lives between your people. We just give it structure.",
          does_not: [
            "Hold or store money",
            "Move or transfer money",
            "Enforce payments",
            "Guarantee financial outcomes",
            "Replace legal or financial advice",
          ],
          tags: ["platform clarity", "what it is not", "important"],
        },

        {
          id: "SC-042",
          question: "Why use Social Capital instead of chats or spreadsheets?",
          short_answer:
            "Because your goals deserve more than a WhatsApp thread.",
          full_answer:
            "WhatsApp threads get messy. Spreadsheets get ignored. Social Capital gives your group a dedicated space where everything is organized, visible, trackable, and consistent — from the first contribution to the last payout. And when it's all done, every member has a reputation they can carry into their next group. That's something a spreadsheet can never give you.",
          tags: ["comparison", "why use", "positioning"],
        },
      ],
    },
  ],
};

/* =========================================================
   CREATE FAQ LIST FROM KNOWLEDGE BASE
   ========================================================= */

const FAQS = KNOWLEDGE_BASE.knowledge_base.flatMap((section) =>
  section.entries.map((entry) => ({
    ...entry,
    section: section.section,
    keywords: [
      ...(entry.tags || []),
      ...(entry.examples || []),
      ...(entry.steps || []),
      ...(entry.tracks || []),
      ...(entry.tips || []),
      ...(entry.does_not || []),
    ],
  })),
);

/* =========================================================
   TEXT NORMALIZATION / MATCHING
   ========================================================= */

function normalizeText(text = "") {
  return text
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9₹$]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const STOP_WORDS = new Set([
  "what",
  "is",
  "are",
  "the",
  "a",
  "an",
  "this",
  "that",
  "these",
  "those",
  "how",
  "do",
  "does",
  "can",
  "could",
  "would",
  "should",
  "i",
  "we",
  "you",
  "your",
  "my",
  "me",
  "to",
  "of",
  "for",
  "in",
  "on",
  "and",
  "or",
  "with",
  "about",
  "tell",
  "please",
  "be",
  "it",
  "there",
  "from",
  "why",
  "when",
  "where",
  "who",
  "which",
  "will",
  "did",
  "just",
  "really",
  "actually",
  "than",
  "then",
  "into",
  "instead",
  "they",
  "them",
  "their",
  "our",
  "us",
  "as",
  "at",
  "by",
  "after",
  "before",
  "through",
  "more",
  "much",
  "many",
  "me",
  "than",
]);

function tokenize(text = "") {
  return normalizeText(text)
    .split(" ")
    .filter(Boolean)
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word));
}

function uniqueTokens(text = "") {
  return [...new Set(tokenize(text))];
}

/* =========================================================
   APPROVED PARAPHRASES

   These aliases ONLY point to an existing client KB entry.
   They never create a new answer.
   ========================================================= */
const FAQ_ALIASES = {
  "SC-008": [
    "how is social capital different from chit funds",
    "how is social capital different from a chit fund",
    "what is the difference between social capital and chit funds",
    "social capital vs chit funds",
    "why use social capital instead of a chit fund",
  ],

  "SC-009": [
    "how is social capital different from asking friends for money",
    "why use social capital instead of asking friends for money",
    "is social capital like borrowing money from friends",
    "why not just ask my friends for money",
  ],

  "SC-010": [
    "how is social capital different from splitwise",
    "how is social capital different from payment apps",
    "what is the difference between social capital and splitwise",
    "what is the difference between social capital and payment apps",
    "why use social capital instead of splitwise",
    "why use social capital instead of payment apps",
    "is social capital like splitwise",
    "what makes social capital different from payment apps",
  ],

  "SC-017": [
    "how do contributions work",
    "how does contribution work",
    "how does the contribution work",
    "what happens with contributions each round",
    "how much does everyone contribute",
  ],

  "SC-042": [
    "why use social capital instead of chats",
    "why use social capital instead of whatsapp",
    "why use social capital instead of spreadsheets",
    "why not use whatsapp",
    "why not use a spreadsheet",
    "what is the benefit over whatsapp",
    "what is the benefit over spreadsheets",
    "why should i use social capital instead of whatsapp",
    "why should i use social capital instead of spreadsheets",
  ],
};

const FAQ_INDEX = FAQS.map((faq) => ({
  faq,
  question: normalizeText(faq.question),
  questionTokens: new Set(uniqueTokens(faq.question)),
  aliases: [faq.question, ...(FAQ_ALIASES[faq.id] || [])].map(normalizeText),
}));

function getFAQById(id) {
  return FAQS.find((faq) => faq.id === id) || null;
}

function containsPhrase(text, phrase) {
  const normalizedText = normalizeText(text);
  const normalizedPhrase = normalizeText(phrase);

  if (!normalizedPhrase) return false;

  return (
    normalizedText === normalizedPhrase ||
    normalizedText.includes(` ${normalizedPhrase} `) ||
    normalizedText.startsWith(`${normalizedPhrase} `) ||
    normalizedText.endsWith(` ${normalizedPhrase}`)
  );
}

/* =========================================================
   DISTINCTIVE INTENT TERMS

   These are used to separate similar KB entries.
   Example:
   Splitwise/payment apps MUST NOT fall into
   friends-for-money or contributions.
   ========================================================= */
const DISTINCTIVE_TERMS = [
  "splitwise",
  "payment app",
  "payment apps",
  "whatsapp",
  "spreadsheet",
  "spreadsheets",
  "chit fund",
  "chit funds",
  "auction",
  "rotation",
  "predefined",
  "payout",
  "contribution",
  "contributions",
  "manager",
  "strangers",
  "dispute",
  "risk",
  "reputation",
  "invite",
  "upi",
  "zelle",
  "paypal",
  "miss payment",
  "missed payment",
  "delayed payout",
];

function getDistinctiveTerms(text) {
  const normalized = normalizeText(text);

  return DISTINCTIVE_TERMS.filter((term) =>
    normalized.includes(normalizeText(term)),
  );
}

/* =========================================================
   SCORE A QUESTION

   IMPORTANT:
   - Never inspect short_answer/full_answer for matching.
   - The question is the source of intent.
   - Tags are NOT used to override question intent.
   ========================================================= */
function scoreFAQMatch(query, index) {
  const normalizedQuery = normalizeText(query);

  if (!normalizedQuery || !index) return 0;

  if (normalizedQuery === index.question) return 10000;

  if (index.aliases.includes(normalizedQuery)) return 9000;

  const queryTokens = uniqueTokens(normalizedQuery);
  const questionTokens = [...index.questionTokens];

  if (!queryTokens.length || !questionTokens.length) return 0;

  const querySet = new Set(queryTokens);
  const questionSet = new Set(questionTokens);

  const matchedTokens = queryTokens.filter((token) => questionSet.has(token));

  if (!matchedTokens.length) return 0;

  const queryCoverage = matchedTokens.length / queryTokens.length;
  const questionCoverage = matchedTokens.length / questionTokens.length;

  let score = 0;

  // Strong signal: words actually appearing in the KB question.
  matchedTokens.forEach((token) => {
    score += token.length >= 8 ? 95 : token.length >= 5 ? 70 : 45;
  });

  // Query coverage is more important than raw word count.
  score += queryCoverage * 220;

  // A candidate that covers much of its own question is stronger.
  score += questionCoverage * 80;

  // Strong bonus for exact multi-word phrases shared by query/question.
  const queryDistinctive = getDistinctiveTerms(normalizedQuery);
  const questionDistinctive = getDistinctiveTerms(index.question);

  queryDistinctive.forEach((term) => {
    if (questionDistinctive.includes(term)) {
      score += 320;
    }
  });

  // If the user supplied a distinctive concept and this FAQ does not
  // contain it, penalize the candidate heavily.
  const unmatchedDistinctive = queryDistinctive.filter(
    (term) => !questionDistinctive.includes(term),
  );

  score -= unmatchedDistinctive.length * 220;

  // A single generic overlap must never answer a long question.
  if (matchedTokens.length === 1 && queryTokens.length >= 3) {
    score *= 0.25;
  }

  return Math.max(0, score);
}

/* =========================================================
   FIND BEST FAQ
   ========================================================= */
function findBestFAQ(query) {
  const normalizedQuery = normalizeText(query);

  if (!normalizedQuery) {
    return {
      faq: null,
      score: 0,
      confidence: 0,
      ambiguous: false,
    };
  }

  // 1. Exact question / approved alias.
  const exact = FAQ_INDEX.find((index) =>
    index.aliases.includes(normalizedQuery),
  );

  if (exact) {
    return {
      faq: exact.faq,
      score: 10000,
      confidence: 1,
      ambiguous: false,
      type: "exact",
    };
  }

  // 2. Intent scoring.
  const ranked = FAQ_INDEX.map((index) => ({
    faq: index.faq,
    score: scoreFAQMatch(normalizedQuery, index),
  }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  if (!ranked.length) {
    return {
      faq: null,
      score: 0,
      confidence: 0,
      ambiguous: false,
    };
  }

  const best = ranked[0];
  const second = ranked[1] || { score: 0 };
  const margin = best.score - second.score;

  // Conservative threshold. Kubera must prefer "I don't know"
  // over a wrong KB answer.
  const strongEnough = best.score >= 170;
  const clearlyBetter =
    best.score >= 520 || margin >= 130 || best.score >= second.score * 1.45;

  if (!strongEnough || !clearlyBetter) {
    return {
      faq: null,
      score: best.score,
      confidence: Math.min(1, best.score / 650),
      ambiguous: true,
      alternatives: ranked.slice(0, 3).map((item) => item.faq),
    };
  }

  return {
    faq: best.faq,
    score: best.score,
    confidence: Math.min(1, best.score / 650),
    ambiguous: false,
    type: "matched",
  };
}

/* =========================================================
   BASIC CHAT RESPONSES
   ========================================================= */
function getBasicResponse(query) {
  const q = normalizeText(query);

  if (["hi", "hello", "hey", "hai"].includes(q)) {
    return "Hi! I'm Kubera, your Social Capital assistant. Ask me anything about groups, contributions, payments, payouts, or how Social Capital works.";
  }

  if (["thanks", "thank you", "thank", "thx"].includes(q)) {
    return "You're welcome! I'm here whenever you need help understanding Social Capital.";
  }

  if (["bye", "goodbye", "see you", "see ya"].includes(q)) {
    return "See you! Keep your people close and your group transparent. 👋";
  }

  return null;
}

/* =========================================================
   FOLLOW-UP / RESPONSE MODE

   IMPORTANT:
   These are ONLY pure follow-up commands.

   "explain detailed" => follow-up
   "explain more"    => follow-up

   But:
   "Why use Social Capital instead of WhatsApp?"
   => NEW QUESTION, NOT follow-up.
   ========================================================= */
const DETAIL_FOLLOW_UP_PATTERNS = [
  // Explain
  "explain",
  "explain more",
  "explain further",
  "explain again",
  "explain detailed",
  "explain in detail",
  "explain it",
  "explain this",
  "explain that",

  // More
  "more",
  "more details",
  "more detail",
  "more detailed",
  "tell me more",
  "tell me more about this",
  "tell me in detail",
  "give me more details",
  "give me more detail",
  "give me more information",
  "give more details",
  "give more detail",
  "give me a detailed explanation",

  // Detailed
  "detailed",
  "detailed explanation",
  "detailed answer",
  "detailed version",
  "detailed information",
  "in detail",
  "in more detail",
  "in more details",

  // Elaborate
  "elaborate",
  "elaborate more",
  "elaborate on this",
  "elaborate on that",

  // Natural requests
  "please explain",
  "please explain more",
  "please explain in detail",
  "can you explain",
  "can you explain more",
  "can you explain in detail",
  "can you give more details",
  "can you tell me more",
];

const STEP_FOLLOW_UPS = new Set([
  "steps",
  "step by step",
  "what are the steps",
  "show me the steps",
  "give me the steps",
  "the process",
  "show me the process",
]);

function isPureDetailFollowUp(query = "") {
  const normalized = normalizeText(query);

  return DETAIL_FOLLOW_UP_PATTERNS.some(
    (pattern) => normalizeText(pattern) === normalized,
  );
}

function isStepFollowUp(query) {
  return STEP_FOLLOW_UPS.has(normalizeText(query));
}

function formatSteps(faq) {
  if (!faq?.steps?.length) {
    return faq?.full_answer || faq?.short_answer || "";
  }

  return [
    faq.short_answer || "",
    "",
    ...faq.steps.map((step, index) => `${index + 1}. ${step}`),
  ]
    .filter(Boolean)
    .join("\n");
}

function formatTips(faq) {
  if (!faq?.tips?.length) {
    return faq?.full_answer || faq?.short_answer || "";
  }

  return [
    faq.short_answer || "",
    "",
    ...faq.tips.map((tip, index) => `${index + 1}. ${tip}`),
  ]
    .filter(Boolean)
    .join("\n");
}

const FALLBACK_MESSAGE =
  "🤔 I'm not sure about that yet. I can help with Social Capital, groups, contributions, payments, payouts, transparency, risk, and the group manager.";

/* =========================================================
   GET BOT ANSWER
   ========================================================= */
function getBotAnswer(query, previousFAQ = null) {
  const basicResponse = getBasicResponse(query);

  if (basicResponse) {
    return {
      text: basicResponse,
      faq: null,
      mode: "basic",
    };
  }

  /* =====================================================
     1. DETAIL FOLLOW-UP
     ===================================================== */

  if (previousFAQ && isPureDetailFollowUp(query)) {
    return {
      text: previousFAQ.full_answer || previousFAQ.short_answer,
      faq: previousFAQ,
      mode: "detailed",
    };
  }

  /* =====================================================
     2. STEPS FOLLOW-UP
     ===================================================== */

  if (previousFAQ && isStepFollowUp(query)) {
    return {
      text: previousFAQ.steps?.length
        ? formatSteps(previousFAQ)
        : previousFAQ.tips?.length
          ? formatTips(previousFAQ)
          : previousFAQ.full_answer || previousFAQ.short_answer,
      faq: previousFAQ,
      mode: "steps",
    };
  }

  /* =====================================================
     3. NEW QUESTION → KNOWLEDGE BASE
     ===================================================== */

  const match = findBestFAQ(query);

  /* =====================================================
     4. NO CONFIDENT MATCH → NEVER GUESS
     ===================================================== */

  if (!match.faq) {
    return {
      text: FALLBACK_MESSAGE,
      faq: null,
      mode: "fallback",
    };
  }

  const faq = match.faq;

  /* =====================================================
     5. DEFAULT = SHORT ANSWER
     ===================================================== */

  return {
    text: faq.short_answer || faq.full_answer || "",
    faq,
    mode: "short",
    confidence: match.confidence,
  };
}

/* =========================================================
   CHATBOT
   ========================================================= */

const Chatbot = () => {
  const [chatOpen, setChatOpen] = useState(false);

  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "👋 Hello! I'm Kubera — your Social Capital assistant. Ask me anything about groups, contributions, payments, or payouts!",
    },
  ]);

  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [lastFAQ, setLastFAQ] = useState(null);
  const messagesEndRef = useRef(null);

  /* =======================================================
     AUTO SCROLL
     ======================================================= */

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  /* =======================================================
     SUGGESTIONS
     ======================================================= */

  useEffect(() => {
    const query = input.trim();

    if (!query) {
      setSuggestions([]);
      return;
    }

    const ranked = FAQ_INDEX.map((index) => ({
      faq: index.faq,
      score: scoreFAQMatch(query, index),
    }))
      .filter((item) => item.score >= 95)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((item) => item.faq);

    setSuggestions(ranked);
  }, [input]);

  /* =======================================================
     SEND MESSAGE
     ======================================================= */

  const sendMessage = (text = input) => {
    const userMessage = text.trim();

    if (!userMessage) return;

    /* =========================================
       ADD USER MESSAGE
       ========================================= */
    setMessages((prev) => [
      ...prev,
      {
        from: "user",
        text: userMessage,
      },
    ]);

    /* =========================================
       GET RESPONSE

       Important:
       - Pure detail follow-up uses lastFAQ.
       - Every real question is matched again.
       - Unknown questions never get a random FAQ.
       ========================================= */
    const result = getBotAnswer(userMessage, lastFAQ);

    /* =========================================
       SAVE FAQ CONTEXT

       Only a real KB match updates lastFAQ.
       A fallback or basic response does not.
       ========================================= */
    if (result.faq) {
      setLastFAQ(result.faq);
    }

    /* =========================================
       BOT RESPONSE
       ========================================= */
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: result.text,
        },
      ]);
    }, 500);

    setInput("");
    setSuggestions([]);
  };

  /* =======================================================
     ENTER KEY
     ======================================================= */

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  /* =======================================================
     UI
     ======================================================= */

  return (
    <div>
      <style>
        {`
          ::-webkit-scrollbar {
            display: none;
          }

          html,
          body {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
      </style>

      {/* ===================================================
          FLOATING KUBERA BUTTON
          =================================================== */}

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setChatOpen(true)}
        className="fixed bottom-6 right-12 z-50 bg-transparent border-none outline-none p-0 m-0">
        <motion.div
          className="relative group"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{
            repeat: Infinity,
            duration: 2,
          }}>
          {/* Tooltip */}

          <span
            className="
              absolute -top-10 left-1/2 -translate-x-1/2
              opacity-0 group-hover:opacity-100
              bg-black/80 text-white text-xs px-2 py-1 rounded-lg
              transition-all duration-300 whitespace-nowrap
              pointer-events-none
            ">
            Chat with Kubera
          </span>

          {/* Image */}

          <img src={KuberaBot} alt="Kubera Bot" className="w-16 h-16" />
        </motion.div>
      </motion.button>

      {/* ===================================================
          CHAT WINDOW
          =================================================== */}

      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{
              opacity: 0,
              y: 80,
              scale: 0.9,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 80,
              scale: 0.9,
            }}
            transition={{
              duration: 0.4,
            }}
            className="
              fixed bottom-6 right-6
              w-[92vw] sm:w-96
              h-[520px]
              shadow-2xl
              z-50
              flex flex-col
              transition-all duration-300
              origin-bottom-right
              backdrop-blur-2xl
              bg-gradient-to-br
              from-[#2d2390]/95
              to-[#120b55]/90
              overflow-hidden
            ">
            {/* =================================================
                HEADER
                ================================================= */}

            <div className="flex items-center justify-between p-4 bg-white/10 border-b border-white/20">
              <div className="flex items-center gap-2">
                <img src={KuberaBot} alt="Kubera Bot" className="w-8 h-8" />

                <h3 className="font-semibold text-white text-sm">
                  Chat with Kubera
                </h3>
              </div>

              <button
                onClick={() => setChatOpen(false)}
                className="text-gray-300 hover:text-white text-xl">
                &times;
              </button>
            </div>

            {/* =================================================
                MESSAGES
                ================================================= */}

            <div className="flex-1 flex flex-col gap-3 p-4 overflow-y-auto pb-24 sm:pb-20">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.3,
                  }}
                  className={`px-4 py-2 rounded-2xl max-w-[85%] text-sm shadow-md ${
                    msg.from === "bot"
                      ? "bg-white/10 backdrop-blur-md self-start text-white"
                      : "bg-yellow-400 text-gray-900 self-end"
                  }`}>
                  {msg.text}
                </motion.div>
              ))}

              <div ref={messagesEndRef} />
            </div>

            {/* =================================================
                SUGGESTIONS
                ================================================= */}

            {suggestions.length > 0 && (
              <motion.div
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                className="bg-white/10 border-t border-white/10 text-white text-sm max-h-28 overflow-y-auto backdrop-blur-md absolute bottom-14 w-full">
                {suggestions.map((faq, i) => (
                  <button
                    key={faq.id || i}
                    onClick={() => sendMessage(faq.question)}
                    className="block w-full text-left px-4 py-2 hover:bg-white/20 transition-all">
                    {faq.question}
                  </button>
                ))}
              </motion.div>
            )}

            {/* =================================================
                INPUT
                ================================================= */}

            <div className="absolute bottom-0 left-0 w-full flex items-center gap-2 p-3 border-t border-white/10 bg-white/10 backdrop-blur-md">
              <input
                type="text"
                className="flex-1 bg-transparent text-white placeholder-gray-300 outline-none text-sm"
                placeholder="Ask Kubera something..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chatbot;
