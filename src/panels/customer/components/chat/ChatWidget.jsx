import { useState } from "react";
import { ChatIcon, CloseIcon, SendIcon } from "../icons/Icons";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hello! How can I help you today?", time: "10:30 AM" },
  ]);

  const send = () => {
    if (!input.trim()) return;
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages((prev) => [...prev, { from: "user", text: input, time }]);
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: "Thanks for reaching out! Our team will assist you shortly.",
          time,
        },
      ]);
    }, 800);
  };

  return (
    <>
      {/* FAB */}
      <button style={styles.fab} onClick={() => setOpen((p) => !p)}>
        {open ? <CloseIcon /> : <ChatIcon />}
      </button>

      {/* Panel */}
      {open && (
        <div style={styles.panel}>
          <div style={styles.header}>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Chat Support</div>
            <div style={{ fontSize: 12, opacity: 0.9 }}>We're here to help!</div>
          </div>

          <div style={styles.messages}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: m.from === "user" ? "flex-end" : "flex-start",
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    maxWidth: "78%",
                    background:
                      m.from === "user"
                        ? "linear-gradient(135deg,#0ea5e9,#0284c7)"
                        : "#f1f5f9",
                    color: m.from === "user" ? "white" : "#1e293b",
                    borderRadius:
                      m.from === "user"
                        ? "16px 16px 4px 16px"
                        : "16px 16px 16px 4px",
                    padding: "9px 13px",
                    fontSize: 13,
                  }}
                >
                  {m.text}
                  <div style={{ fontSize: 10, opacity: 0.65, marginTop: 3, textAlign: "right" }}>
                    {m.time}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={styles.inputRow}>
            <input
              style={styles.input}
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
            />
            <button style={styles.sendBtn} onClick={send}>
              <SendIcon />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

const styles = {
  fab: {
    position: "fixed",
    bottom: 24,
    right: 24,
    width: 52,
    height: 52,
    borderRadius: "50%",
    background: "linear-gradient(135deg,#0ea5e9,#0284c7)",
    border: "none",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 4px 16px rgba(14,165,233,0.4)",
    zIndex: 100,
  },
  panel: {
    position: "fixed",
    bottom: 86,
    right: 24,
    width: 320,
    borderRadius: 18,
    background: "white",
    boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
    zIndex: 99,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  header: {
    background: "linear-gradient(135deg,#0ea5e9,#0284c7)",
    color: "white",
    padding: "16px 18px",
  },
  messages: {
    padding: "14px",
    maxHeight: 240,
    overflowY: "auto",
    background: "#f8fafc",
  },
  inputRow: {
    display: "flex",
    gap: 8,
    padding: "12px 14px",
    borderTop: "1px solid #e2e8f0",
    background: "white",
  },
  input: {
    flex: 1,
    border: "1px solid #e2e8f0",
    borderRadius: 10,
    padding: "9px 13px",
    fontSize: 13,
    outline: "none",
    color: "#1e293b",
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    background: "linear-gradient(135deg,#0ea5e9,#0284c7)",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    flexShrink: 0,
  },
};
