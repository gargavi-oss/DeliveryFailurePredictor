import { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi 👋 I'm your Delivery AI assistant!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim()) return;
    setMessages(p => [...p, { role: "user", text: input }]);
    setInput(""); setLoading(true);
    try {
      const r = await axios.post("http://127.0.0.1:8001/chat", { message: input });
      setMessages(p => [...p, { role: "bot", text: r.data.reply }]);
    } catch {
      setMessages(p => [...p, { role: "bot", text: "⚠️ Service unavailable" }]);
    }
    setLoading(false);
  };

  return (
    <>
      {/* Button */}
      <motion.button onClick={() => setOpen(!open)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
        className="fixed bottom-5 right-5 z-50 w-12 h-12 rounded-xl text-white shadow-lg flex items-center justify-center"
        style={{ background: 'var(--accent)' }}
      >
        {open ? "✕" : "💬"}
      </motion.button>

      {/* Window */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 16, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }} transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-5 z-50 w-[340px] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', maxHeight: 480 }}
          >
            {/* Header */}
            <div className="p-3 flex items-center gap-2" style={{ borderBottom: '1px solid var(--border)' }}>
              <div className="w-7 h-7 rounded-lg text-white text-xs flex items-center justify-center" style={{ background: 'var(--accent)' }}>🤖</div>
              <div>
                <h3 className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>AI Assistant</h3>
                <span className="text-[9px] flex items-center gap-1" style={{ color: 'var(--risk-low)' }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--risk-low)' }} /> Online
                </span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-3 space-y-2 overflow-y-auto" style={{ maxHeight: 320 }}>
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className="max-w-[80%] text-[11px] px-3 py-2 rounded-xl leading-relaxed"
                    style={{
                      background: m.role === "user" ? 'var(--accent)' : 'var(--bg-subtle)',
                      color: m.role === "user" ? '#fff' : 'var(--text-primary)',
                      border: m.role === "user" ? 'none' : '1px solid var(--border)',
                      borderBottomRightRadius: m.role === "user" ? '4px' : undefined,
                      borderBottomLeftRadius: m.role === "bot" ? '4px' : undefined,
                    }}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-1 px-3 py-2 rounded-xl w-fit" style={{ background: 'var(--bg-subtle)' }}>
                  {[0,1,2].map(i => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full animate-bounce"
                      style={{ background: 'var(--text-muted)', animationDelay: `${i * 150}ms` }} />
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-2.5 flex gap-2" style={{ borderTop: '1px solid var(--border)' }}>
              <input value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && send()}
                placeholder="Ask something..."
                className="flex-1 text-xs rounded-lg px-3 py-2 outline-none"
                style={{ background: 'var(--bg-subtle)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
              />
              <button onClick={send} disabled={!input.trim()}
                className="w-8 h-8 rounded-lg text-white flex items-center justify-center text-xs disabled:opacity-40"
                style={{ background: 'var(--accent)' }}>
                ➤
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}