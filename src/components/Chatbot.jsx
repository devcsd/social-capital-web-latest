import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaRobot } from "react-icons/fa";
import KuberaBot from "../images/coin.svg";

/* ---------- SOCIAL CAPITAL - COMPLETE FAQ DATASET ---------- */
const FAQS = [
  {
    question: "What is Social Capital?",
    answer:
      "Social Capital is a digital community savings platform that enables people to join or create chit groups. Members contribute regularly and receive pooled funds based on auction, rotation, or predefined schedules.",
    keywords: [
      "social capital",
      "chit",
      "community savings",
      "digital app",
    ],
  },
  {
    question: "Hi",
    answer:
      "Hi! I'm Kubera, your Social Capital assistant. Ask me anything about chit groups, auctions, or payouts!",
    keywords: ["hi", "hello", "hey"],
  },
  {
    question: "How does a chit work in Social Capital?",
    answer:
      "Members contribute a fixed amount each month. One member receives the total collected fund through an auction or rotation draw. This continues until every member has received their turn.",
    keywords: ["how it works", "chit", "monthly contribution", "cycle"],
  },
  {
    question: "What are the fund types available in Social Capital?",
    answer:
      "Fund types represent the purpose of each group, such as Wedding Fund, Dream House Fund, Education Fund, Emergency Fund, or Business Fund. Each helps users achieve specific financial goals.",
    keywords: [
      "fund types",
      "wedding",
      "education",
      "dream house",
      "emergency",
    ],
  },
  {
    question: "What is a rotation Fund?",
    answer:
      "In a rotation Fund, each month’s recipient is chosen randomly. All members contribute equally, and one member is selected via a transparent digital draw until everyone has received their share.",
    keywords: ["rotation", "random", "draw", "lucky draw", "winner"],
  },
  {
    question: "What is an Auction Fund?",
    answer:
      "In an Auction Fund, members bid for the lowest amount they wish to take. The lowest bidder wins that cycle’s fund, and the remaining amount (discount) is shared as dividends among all members.",
    keywords: ["auction", "bidding", "lowest bid", "dividend", "fund"],
  },
  {
    question: "What is a Predefined Fund?",
    answer:
      "A Predefined Fund follows a fixed payout schedule decided when the group is created. Members receive the pooled amount in a predefined order — no auction or rotation involved.",
    keywords: ["predefined", "fixed order", "schedule", "payout sequence"],
  },
  {
    question: "Who manages the chit groups in Social Capital?",
    answer:
      "Each group is managed by an authorized admin or foreman who oversees auctions, payments, member approvals, and ensures transparency through the app’s dashboard.",
    keywords: ["foreman", "admin", "manager", "group head"],
  },
  {
    question: "What is a Prized Member?",
    answer:
      "A Prized Member is one who has already received their chit amount through an auction or rotation but continues to pay monthly contributions until the cycle ends.",
    keywords: ["prized", "winner", "received", "fund"],
  },
  {
    question: "What is a Non-Prized Member?",
    answer:
      "A Non-Prized Member is a participant who has not yet received their chit amount and is still eligible for future payouts.",
    keywords: ["non-prized", "not won", "waiting", "pending"],
  },
  {
    question: "What is a dividend in Auction Funds?",
    answer:
      "A dividend is the discount from an auction’s winning bid, distributed equally among all members. It reduces each member’s effective monthly contribution.",
    keywords: ["dividend", "discount", "benefit", "auction"],
  },
  {
    question: "Can I join multiple chit groups?",
    answer:
      "Yes. You can join multiple groups if you can manage the monthly contributions for each. Your dashboard allows you to track all your groups in one place.",
    keywords: ["multiple groups", "join", "dashboard", "participate"],
  },
  {
    question: "How do I create a chit group?",
    answer:
      "Verified users can create new groups by choosing a fund type, mechanism (auction, rotation, or predefined), chit amount, and duration from the admin dashboard.",
    keywords: ["create group", "start", "new group", "admin"],
  },
  {
    question: "How is the chit amount decided?",
    answer:
      "The chit amount is predefined during group creation. For example, a ₹1,00,000 chit with 20 members means each pays ₹5,000 per month.",
    keywords: ["chit value", "group amount", "total fund"],
  },
  {
    question: "How are winners selected in rotation Funds?",
    answer:
      "In rotation Funds, a secure algorithm randomly selects one eligible member as the monthly winner. The process is automated and logged for transparency.",
    keywords: ["rotation", "draw", "winner", "random selection"],
  },
  {
    question: "How does the auction process ensure fairness?",
    answer:
      "Auctions are automated and timestamped in the app. All members can view bids in real-time to ensure transparency and prevent manipulation.",
    keywords: ["fair", "auction", "bidding", "transparency"],
  },
  {
    question: "What happens if I miss a payment?",
    answer:
      "If you miss a payment, penalties may apply, and you might be ineligible for that cycle’s auction or rotation. The system automatically sends payment reminders.",
    keywords: ["missed payment", "penalty", "reminder", "default"],
  },
  {
    question: "Can I withdraw from a group before completion?",
    answer:
      "You may request to withdraw early, but it depends on the group admin’s policy. Some groups allow replacements to take your place.",
    keywords: ["withdraw", "exit", "cancel", "leave group"],
  },
  {
    question: "Can I use UPI or bank transfer for payments?",
    answer:
      "Yes. Social Capital supports UPI, debit/credit cards, and bank transfers for all contributions and payouts.",
    keywords: ["upi", "bank transfer", "payment", "methods"],
  },
  {
    question: "Is Social Capital secure?",
    answer:
      "Absolutely. Social Capital uses encrypted transactions, verified admins, and transparent ledgers to ensure every payment is safe and traceable.",
    keywords: ["secure", "safe", "digital", "encryption", "trust"],
  },
  {
    question: "Is Social Capital legal and compliant?",
    answer:
      "Yes. Social Capital operates under the regulations of India’s chits Act and digital financial compliance standards.",
    keywords: ["legal", "law", "regulation", "compliance"],
  },
  {
    question: "What are the benefits of using Social Capital?",
    answer:
      "Social Capital brings transparency, digital record-keeping, secure payments, reminders, and community-based savings all in one place.",
    keywords: ["benefits", "advantages", "why use", "features"],
  },
  {
    question: "Can chits be used for emergencies or business?",
    answer:
      "Yes. Many members use their chit winnings for emergencies, weddings, education, or starting a business.",
    keywords: ["emergency", "business", "wedding", "loan"],
  },
  {
    question: "What is the duration of a chit group?",
    answer:
      "The duration depends on the number of members. For example, a 20-member group typically lasts 20 months, with one payout per cycle.",
    keywords: ["duration", "months", "group cycle", "tenure"],
  },
  {
    question: "Can I view group activity and history?",
    answer:
      "Yes. Every auction, payout, and contribution is logged in the app. You can view all activities and reports from your dashboard.",
    keywords: ["activity", "history", "records", "transparency"],
  },
  {
    question: "What if the admin defaults or mismanages funds?",
    answer:
      "Social Capital has verification and monitoring systems in place. If a foreman defaults, the support team investigates and takes action immediately.",
    keywords: ["foreman default", "fraud", "report", "support"],
  },
  {
    question: "How is my monthly contribution calculated?",
    answer:
      "Your contribution is fixed based on the total chit value and duration. For auction funds, dividends from previous rounds may reduce your effective amount.",
    keywords: ["monthly contribution", "installment", "payment", "calculation"],
  },
  {
    question: "Can I pause or skip a month’s contribution?",
    answer:
      "Generally, contributions cannot be paused since payouts depend on every member’s participation. You may contact your group admin for special cases.",
    keywords: ["pause payment", "skip month", "contribution", "policy"],
  },
  {
    question: "How do I contact Social Capital support?",
    answer:
      "You can contact the support team via the in-app Help Center or email support@socappglobal.com for assistance.",
    keywords: ["support", "help", "contact", "customer care"],
  },
];

/* ---------- Match Scorer ---------- */
function scoreFAQMatch(query, faq) {
  if (!query) return 0;
  const q = query.toLowerCase().trim();
  const qTokens = q
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
  const text = `${faq.question} ${faq.answer} ${(faq.keywords || []).join(
    " "
  )}`.toLowerCase();

  let score = 0;
  for (const t of qTokens) {
    if (t.length > 1 && text.includes(t)) score++;
  }

  if (faq.keywords?.includes(q)) score += 3;
  if (faq.question.toLowerCase() === q) score += 4;

  return score;
}

const Chatbot = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "👋 Hello! I'm Kubera — your Social Capital assistant. Ask me anything about chits, auctions, or payouts!",
    },
  ]);
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const q = input.trim();
    if (!q) return setSuggestions([]);
    const qLower = q.toLowerCase();
    const ranked = FAQS.map((faq) => {
      const base = scoreFAQMatch(q, faq);
      const bonus = faq.question.toLowerCase().includes(qLower) ? 2 : 0;
      return { faq, score: base + bonus };
    })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((x) => x.faq);
    setSuggestions(ranked);
  }, [input]);

  const sendMessage = (text = input) => {
    if (!text.trim()) return;
    const userMessage = text.trim();
    setMessages((prev) => [...prev, { from: "user", text: userMessage }]);

    let best = null;
    let bestScore = 0;
    for (const f of FAQS) {
      const s = scoreFAQMatch(userMessage, f);
      if (s > bestScore) {
        bestScore = s;
        best = f;
      }
    }

    const reply =
      best && bestScore > 0
        ? best.answer
        : "🤔 Hmm, I’m not sure about that. Please contact your Admin for more help.";

    setTimeout(() => {
      setMessages((prev) => [...prev, { from: "bot", text: reply }]);
    }, 500);

    setInput("");
    setSuggestions([]);
  };

  const handleKeyPress = (e) => e.key === "Enter" && sendMessage();

  return (
    <div>
      <style>
        {`
        ::-webkit-scrollbar { display: none; }
        html, body { -ms-overflow-style: none; scrollbar-width: none; }
      `}
      </style>

      {/* Floating Kubera Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setChatOpen(true)}
        className="fixed bottom-6 right-12 z-50 bg-transparent border-none outline-none p-0 m-0">
        <motion.div
          className="relative group"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}>
          {/* Tooltip */}
          <span
            className="absolute -top-10 left-1/2 -translate-x-1/2 
                     opacity-0 group-hover:opacity-100 
                     bg-black/80 text-white text-xs px-2 py-1 rounded-lg
                     transition-all duration-300 whitespace-nowrap 
                     pointer-events-none">
            Chat with Kubera
          </span>

          {/* Image */}
          <img src={KuberaBot} alt="Kubera Bot" className="w-16 h-16" />
        </motion.div>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 80, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 80, scale: 0.9 }}
            transition={{ duration: 0.4 }}
            className="
    fixed bottom-6 right-6 w-[92vw] sm:w-96 h-[520px] shadow-2xl z-50 flex flex-col transition-all duration-300 origin-bottom-right
    backdrop-blur-2xl 
    bg-gradient-to-br from-[#2d2390]/95 to-[#120b55]/90 
    overflow-hidden
  ">
            {/* Header */}
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

            {/* Messages */}
            <div className="flex-1 flex flex-col gap-3 p-4 overflow-y-auto pb-24 sm:pb-20">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
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

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white/10 border-t border-white/10 text-white text-sm max-h-28 overflow-y-auto backdrop-blur-md absolute bottom-14 w-full">
                {suggestions.map((faq, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(faq.question)}
                    className="block w-full text-left px-4 py-2 hover:bg-white/20 transition-all">
                    {faq.question}
                  </button>
                ))}
              </motion.div>
            )}

            {/* Input */}
            <div className="absolute bottom-0 left-0 w-full flex items-center gap-2 p-3 border-t border-white/10 bg-white/10 backdrop-blur-md">
              <input
                type="text"
                className="flex-1 bg-transparent text-white placeholder-gray-300 outline-none text-sm"
                placeholder="Ask Kubera something..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                // onKeyDown={handleKeyPress}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chatbot;
