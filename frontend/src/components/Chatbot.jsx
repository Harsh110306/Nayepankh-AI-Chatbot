import React, { useState, useEffect, useRef } from "react";

function VolunteerForm({ onSubmitSuccess }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", city: "", interests: "" });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("http://localhost:8000/api/volunteer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) {
        setStatus({ type: "success", message: "Thank you! Your registration as a volunteer is successful." });
        onSubmitSuccess();
      } else {
        setStatus({ type: "error", message: data.detail || "Registration failed." });
      }
    } catch (err) {
      setStatus({ type: "error", message: "Unable to reach server." });
    }
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3 p-4 bg-slate-50 dark:bg-brand-darkBg border border-slate-200 dark:border-brand-darkBorder rounded-lg space-y-3 max-w-sm text-slate-800 dark:text-slate-100">
      <h4 className="font-bold text-xs uppercase tracking-wider text-brand-green">Volunteer Registration</h4>
      <div>
        <label className="block text-xxs font-semibold text-slate-500 dark:text-slate-400 mb-1">Full Name</label>
        <input
          type="text"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full text-xs px-2.5 py-1.5 border border-slate-300 dark:border-brand-darkBorder rounded bg-white dark:bg-brand-darkCard focus:outline-none focus:ring-1 focus:ring-brand-green"
        />
      </div>
      <div>
        <label className="block text-xxs font-semibold text-slate-500 dark:text-slate-400 mb-1">Email Address</label>
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full text-xs px-2.5 py-1.5 border border-slate-300 dark:border-brand-darkBorder rounded bg-white dark:bg-brand-darkCard focus:outline-none focus:ring-1 focus:ring-brand-green"
        />
      </div>
      <div>
        <label className="block text-xxs font-semibold text-slate-500 dark:text-slate-400 mb-1">Phone Number</label>
        <input
          type="tel"
          required
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="w-full text-xs px-2.5 py-1.5 border border-slate-300 dark:border-brand-darkBorder rounded bg-white dark:bg-brand-darkCard focus:outline-none focus:ring-1 focus:ring-brand-green"
        />
      </div>
      <div>
        <label className="block text-xxs font-semibold text-slate-500 dark:text-slate-400 mb-1">City</label>
        <input
          type="text"
          required
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
          className="w-full text-xs px-2.5 py-1.5 border border-slate-300 dark:border-brand-darkBorder rounded bg-white dark:bg-brand-darkCard focus:outline-none focus:ring-1 focus:ring-brand-green"
        />
      </div>
      <div>
        <label className="block text-xxs font-semibold text-slate-500 dark:text-slate-400 mb-1">Areas of Interest</label>
        <input
          type="text"
          required
          placeholder="e.g. Teaching, Food Distribution, Social Media"
          value={form.interests}
          onChange={(e) => setForm({ ...form, interests: e.target.value })}
          className="w-full text-xs px-2.5 py-1.5 border border-slate-300 dark:border-brand-darkBorder rounded bg-white dark:bg-brand-darkCard focus:outline-none focus:ring-1 focus:ring-brand-green"
        />
      </div>
      {status.message && (
        <p className={`text-xxs font-semibold ${status.type === "success" ? "text-green-600" : "text-red-500"}`}>
          {status.message}
        </p>
      )}
      <button
        type="submit"
        disabled={submitting || status.type === "success"}
        className="w-full py-1.5 bg-brand-green hover:bg-emerald-700 text-white text-xs font-bold rounded shadow transition-all disabled:opacity-50"
      >
        {submitting ? "Submitting..." : status.type === "success" ? "Submitted" : "Submit"}
      </button>
    </form>
  );
}

function InternshipForm({ onSubmitSuccess }) {
  const [form, setForm] = useState({ name: "", email: "", college: "", course: "", year_of_study: "", skills: "", resume_link: "" });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("http://localhost:8000/api/internship", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) {
        setStatus({ type: "success", message: "Thank you! Your internship application is submitted." });
        onSubmitSuccess();
      } else {
        setStatus({ type: "error", message: data.detail || "Application failed." });
      }
    } catch (err) {
      setStatus({ type: "error", message: "Unable to reach server." });
    }
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3 p-4 bg-slate-50 dark:bg-brand-darkBg border border-slate-200 dark:border-brand-darkBorder rounded-lg space-y-3 max-w-sm text-slate-800 dark:text-slate-100">
      <h4 className="font-bold text-xs uppercase tracking-wider text-brand-orange">Internship Application</h4>
      <div>
        <label className="block text-xxs font-semibold text-slate-500 dark:text-slate-400 mb-1">Full Name</label>
        <input
          type="text"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full text-xs px-2.5 py-1.5 border border-slate-300 dark:border-brand-darkBorder rounded bg-white dark:bg-brand-darkCard focus:outline-none focus:ring-1 focus:ring-brand-orange"
        />
      </div>
      <div>
        <label className="block text-xxs font-semibold text-slate-500 dark:text-slate-400 mb-1">Email Address</label>
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full text-xs px-2.5 py-1.5 border border-slate-300 dark:border-brand-darkBorder rounded bg-white dark:bg-brand-darkCard focus:outline-none focus:ring-1 focus:ring-brand-orange"
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xxs font-semibold text-slate-500 dark:text-slate-400 mb-1">College/Univ</label>
          <input
            type="text"
            required
            value={form.college}
            onChange={(e) => setForm({ ...form, college: e.target.value })}
            className="w-full text-xs px-2.5 py-1.5 border border-slate-300 dark:border-brand-darkBorder rounded bg-white dark:bg-brand-darkCard focus:outline-none focus:ring-1 focus:ring-brand-orange"
          />
        </div>
        <div>
          <label className="block text-xxs font-semibold text-slate-500 dark:text-slate-400 mb-1">Course</label>
          <input
            type="text"
            required
            placeholder="e.g. B.Tech, BBA"
            value={form.course}
            onChange={(e) => setForm({ ...form, course: e.target.value })}
            className="w-full text-xs px-2.5 py-1.5 border border-slate-300 dark:border-brand-darkBorder rounded bg-white dark:bg-brand-darkCard focus:outline-none focus:ring-1 focus:ring-brand-orange"
          />
        </div>
      </div>
      <div>
        <label className="block text-xxs font-semibold text-slate-500 dark:text-slate-400 mb-1">Year of Study</label>
        <select
          required
          value={form.year_of_study}
          onChange={(e) => setForm({ ...form, year_of_study: e.target.value })}
          className="w-full text-xs px-2.5 py-1.5 border border-slate-300 dark:border-brand-darkBorder rounded bg-white dark:bg-brand-darkCard focus:outline-none focus:ring-1 focus:ring-brand-orange text-slate-700 dark:text-slate-100"
        >
          <option value="">Select Year</option>
          <option value="1st Year">1st Year</option>
          <option value="2nd Year">2nd Year</option>
          <option value="3rd Year">3rd Year</option>
          <option value="4th Year">4th Year</option>
          <option value="Postgrad">Postgraduate</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div>
        <label className="block text-xxs font-semibold text-slate-500 dark:text-slate-400 mb-1">Skills</label>
        <input
          type="text"
          required
          placeholder="e.g. Design, Coding, Writing"
          value={form.skills}
          onChange={(e) => setForm({ ...form, skills: e.target.value })}
          className="w-full text-xs px-2.5 py-1.5 border border-slate-300 dark:border-brand-darkBorder rounded bg-white dark:bg-brand-darkCard focus:outline-none focus:ring-1 focus:ring-brand-orange"
        />
      </div>
      <div>
        <label className="block text-xxs font-semibold text-slate-500 dark:text-slate-400 mb-1">Resume Link (Optional)</label>
        <input
          type="url"
          placeholder="Drive or Dropbox link"
          value={form.resume_link}
          onChange={(e) => setForm({ ...form, resume_link: e.target.value })}
          className="w-full text-xs px-2.5 py-1.5 border border-slate-300 dark:border-brand-darkBorder rounded bg-white dark:bg-brand-darkCard focus:outline-none focus:ring-1 focus:ring-brand-orange"
        />
      </div>
      {status.message && (
        <p className={`text-xxs font-semibold ${status.type === "success" ? "text-green-600" : "text-red-500"}`}>
          {status.message}
        </p>
      )}
      <button
        type="submit"
        disabled={submitting || status.type === "success"}
        className="w-full py-1.5 bg-brand-orange hover:bg-orange-700 text-white text-xs font-bold rounded shadow transition-all disabled:opacity-50"
      >
        {submitting ? "Submitting..." : status.type === "success" ? "Submitted" : "Submit"}
      </button>
    </form>
  );
}

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const chatEndRef = useRef(null);
  const [subscribeEmail, setSubscribeEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!subscribeEmail.trim()) return;
    try {
      const res = await fetch("http://localhost:8000/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: subscribeEmail })
      });
      if (res.ok) {
        setSubscribed(true);
        setSubscribeEmail("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    let session = sessionStorage.getItem("nayepankh_session");
    if (!session) {
      session = "sess_" + Math.random().toString(36).substring(2, 15);
      sessionStorage.setItem("nayepankh_session", session);
    }
    setSessionId(session);

    setMessages([
      {
        id: "welcome",
        sender: "bot",
        text: "Namaste! Welcome to NayePankh Foundation virtual assistant. How can I help you today? You can ask about our programs, volunteering, internships, donations, or contact details.",
        formType: null
      }
    ]);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const queryText = textToSend || input;
    if (!queryText.trim()) return;

    if (!textToSend) {
      setInput("");
    }

    const userMessageId = "user_" + Date.now();
    const userMsg = { id: userMessageId, sender: "user", text: queryText, formType: null };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: queryText, session_id: sessionId })
      });
      const data = await response.json();

      if (response.ok) {
        let responseText = data.response;
        let formType = null;

        if (responseText.includes("[VOLUNTEER_FORM]")) {
          responseText = responseText.replace("[VOLUNTEER_FORM]", "").trim();
          formType = "volunteer";
        } else if (responseText.includes("[INTERNSHIP_FORM]")) {
          responseText = responseText.replace("[INTERNSHIP_FORM]", "").trim();
          formType = "internship";
        }

        const botMsg = {
          id: "bot_" + Date.now(),
          sender: "bot",
          text: responseText,
          formType: formType,
          submitted: false
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        const errMsg = {
          id: "err_" + Date.now(),
          sender: "bot",
          text: "I am having trouble processing that right now. Please try again.",
          formType: null
        };
        setMessages((prev) => [...prev, errMsg]);
      }
    } catch (err) {
      const errMsg = {
        id: "err_" + Date.now(),
        sender: "bot",
        text: "Unable to connect to the assistant server. Please ensure the backend is running.",
        formType: null
      };
      setMessages((prev) => [...prev, errMsg]);
    }
    setLoading(false);
  };

  const handleFormSubmitted = (msgId) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === msgId ? { ...msg, submitted: true } : msg))
    );
  };

  const handleStarterClick = (query, formType = null) => {
    if (formType) {
      const botMsg = {
        id: "bot_" + Date.now(),
        sender: "bot",
        text: `Please fill out the ${formType} form below:`,
        formType: formType,
        submitted: false
      };
      setMessages((prev) => [
        ...prev,
        { id: "starter_" + Date.now(), sender: "user", text: query },
        botMsg
      ]);
    } else {
      handleSend(query);
    }
  };

  const starters = [
    { label: "About NayePankh Foundation", query: "What is NayePankh Foundation and what is its mission?" },
    { label: "Volunteer Opportunities", query: "I want to register as a volunteer", formType: "volunteer" },
    { label: "Internship Information", query: "I want to apply for an internship", formType: "internship" },
    { label: "Donation Process", query: "How can I make a donation (monetary, clothing, books, food)?" },
    { label: "Contact Information", query: "What is the contact number, email, and address of the foundation?" },
    { label: "Current Programs", query: "What programs and initiatives do you currently run?" }
  ];

  return (
    <div className="flex-grow flex flex-col md:flex-row gap-6 h-[calc(100vh-12rem)] min-h-[550px]">
      <div className="md:w-1/4 flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-1 max-h-full">
        <div className="bg-white dark:bg-brand-darkCard p-4 rounded-xl shadow-sm border border-slate-200 dark:border-brand-darkBorder">
          <h2 className="font-bold text-base text-slate-800 dark:text-slate-200 mb-2">Suggested Questions</h2>
          <p className="text-sm text-slate-500 mb-4">Click any option to quickly fetch information or start registration.</p>
          <div className="flex flex-col gap-2">
            {starters.map((starter, i) => (
              <button
                key={i}
                onClick={() => handleStarterClick(starter.query, starter.formType)}
                className="w-full text-left px-3 py-2.5 text-sm font-medium bg-slate-50 hover:bg-brand-greenLight hover:text-brand-green dark:bg-brand-darkBg dark:hover:bg-emerald-950 dark:hover:text-emerald-300 rounded-lg border border-slate-200 dark:border-brand-darkBorder transition-all"
              >
                {starter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-brand-darkCard p-4 rounded-xl shadow-sm border border-slate-200 dark:border-brand-darkBorder">
          <h2 className="font-bold text-base text-slate-800 dark:text-slate-200 mb-2">About NayePankh</h2>
          <p className="text-xs text-slate-500 mb-3">Official NGO Quick Facts</p>
          <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
            <div>
              <span className="font-bold text-slate-500 dark:text-slate-400 block mb-0.5">Registration</span>
              <span>UP Govt. Registered NGO (80G & 12A Tax Exempt)</span>
            </div>
            <div>
              <span className="font-bold text-slate-500 dark:text-slate-400 block mb-0.5">Founder & President</span>
              <span>Prashant Shukla</span>
            </div>
            <div>
              <span className="font-bold text-slate-500 dark:text-slate-400 block mb-0.5">Core Mission</span>
              <span>Uplifting the underprivileged via food, education, clothing, and hygiene drives.</span>
            </div>
            <div>
              <span className="font-bold text-slate-500 dark:text-slate-400 block mb-0.5">Contact Details</span>
              <span>+91 8318500748<br/>contact@nayepankh.com</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-brand-darkCard p-4 rounded-xl shadow-sm border border-slate-200 dark:border-brand-darkBorder">
          <h2 className="font-bold text-base text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-1.5">
            <svg className="w-5 h-5 text-brand-orange hover:animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            Get Notified
          </h2>
          <p className="text-xs text-slate-500 mb-3">Subscribe to receive regular updates and event alerts from NayePankh.</p>
          <form onSubmit={handleSubscribe} className="space-y-2">
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={subscribeEmail}
              onChange={(e) => setSubscribeEmail(e.target.value)}
              className="w-full text-xs px-2.5 py-2 border border-slate-300 dark:border-brand-darkBorder rounded bg-white dark:bg-brand-darkCard text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-brand-orange"
            />
            <button
              type="submit"
              className="w-full py-1.5 bg-brand-orange hover:bg-orange-700 text-white text-xs font-bold rounded shadow transition-all"
            >
              {subscribed ? "Subscribed!" : "Subscribe Us"}
            </button>
          </form>
        </div>
      </div>

      <div className="flex-grow flex flex-col bg-white dark:bg-brand-darkCard rounded-xl shadow-sm border border-slate-200 dark:border-brand-darkBorder overflow-hidden">
        <div className="flex-grow p-4 overflow-y-auto custom-scrollbar flex flex-col space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm text-lg ${
                  msg.sender === "user"
                    ? "bg-brand-green text-white rounded-br-none"
                    : "bg-slate-100 dark:bg-brand-darkBg text-slate-800 dark:text-slate-100 rounded-bl-none border border-slate-200 dark:border-brand-darkBorder"
                }`}
              >
                <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>
                {msg.formType === "volunteer" && !msg.submitted && (
                  <VolunteerForm onSubmitSuccess={() => handleFormSubmitted(msg.id)} />
                )}
                {msg.formType === "internship" && !msg.submitted && (
                  <InternshipForm onSubmitSuccess={() => handleFormSubmitted(msg.id)} />
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-100 dark:bg-brand-darkBg text-slate-500 dark:text-slate-400 rounded-2xl rounded-bl-none px-4 py-3 border border-slate-200 dark:border-brand-darkBorder flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="p-3 border-t border-slate-200 dark:border-brand-darkBorder bg-slate-50 dark:bg-brand-darkBg flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your question about NayePankh Foundation..."
            className="flex-grow px-4 py-2.5 text-base border border-slate-300 dark:border-brand-darkBorder rounded-xl bg-white dark:bg-brand-darkCard text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-brand-green"
          />
          <button
            onClick={() => handleSend()}
            className="px-5 py-2.5 bg-brand-green hover:bg-emerald-700 text-white rounded-xl font-bold text-base shadow transition-all"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;
