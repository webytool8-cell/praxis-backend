"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { usePraxisStore } from "@/store/usePraxisStore";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const STARTER_PROMPTS = [
  "What's the riskiest part of this codebase?",
  "Explain the overall architecture",
  "What would break if I removed the auth service?",
  "Which components should I refactor first?",
];

function renderInline(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={i} className="font-mono text-xs bg-white/10 px-1 py-0.5 rounded text-accent">{part.slice(1, -1)}</code>;
    }
    return part;
  });
}

function renderMarkdown(text: string) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  const listItems: string[] = [];
  let key = 0;

  const flushList = () => {
    if (listItems.length === 0) return;
    elements.push(
      <ul key={key++} className="my-2 space-y-1.5">
        {listItems.map((item, i) => (
          <li key={i} className="flex gap-2 text-slate-300 text-sm leading-relaxed">
            <span className="text-accent shrink-0 mt-0.5">•</span>
            <span>{renderInline(item)}</span>
          </li>
        ))}
      </ul>
    );
    listItems.length = 0;
  };

  for (const line of lines) {
    if (line.startsWith("## ")) {
      flushList();
      elements.push(
        <p key={key++} className="font-semibold text-white text-sm mt-3 mb-1">
          {line.slice(3)}
        </p>
      );
    } else if (line.startsWith("### ")) {
      flushList();
      elements.push(
        <p key={key++} className="font-medium text-slate-200 text-sm mt-2 mb-0.5">
          {line.slice(4)}
        </p>
      );
    } else if (line.match(/^[-*] /)) {
      listItems.push(line.slice(2));
    } else if (line.trim() === "") {
      flushList();
      if (elements.length > 0) elements.push(<div key={key++} className="h-1.5" />);
    } else {
      flushList();
      elements.push(
        <p key={key++} className="text-slate-300 text-sm leading-relaxed">
          {renderInline(line)}
        </p>
      );
    }
  }

  flushList();
  return elements;
}

export function ChatPanel() {
  const { currentAnalysisId, setChatOpen } = usePraxisStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || !currentAnalysisId || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setLoading(true);
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysisId: currentAnalysisId, message: text }),
      });

      if (!response.ok) {
        const err = await response.json();
        setMessages((prev) => [
          ...prev.slice(0, -1),
          { role: "assistant", content: err.error ?? "Failed to get response." },
        ]);
        return;
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) return;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const lines = decoder.decode(value).split("\n");
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6);
          if (data === "[DONE]") continue;
          try {
            const { text: token } = JSON.parse(data);
            if (token) {
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  ...updated[updated.length - 1],
                  content: updated[updated.length - 1].content + token,
                };
                return updated;
              });
            }
          } catch { /* ignore */ }
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: "assistant", content: "Network error. Please try again." },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="absolute right-0 top-0 z-50 flex h-full w-[420px] flex-col border-l border-slate-800/80 bg-[#0d1117] shadow-2xl animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/80 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/15">
            <svg className="w-3.5 h-3.5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Codebase Chat</p>
            <p className="text-xs text-muted">Ask anything about this project</p>
          </div>
        </div>
        <button
          onClick={() => setChatOpen(false)}
          className="flex h-7 w-7 items-center justify-center rounded-md text-muted hover:text-white hover:bg-white/10 transition-colors text-base"
        >
          ×
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-5 scroll-smooth">
        {messages.length === 0 && (
          <div className="space-y-2.5">
            <p className="text-xs text-muted text-center mb-4">Suggestions</p>
            {STARTER_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => sendMessage(prompt)}
                className="w-full text-left text-xs px-4 py-3 rounded-xl bg-white/4 hover:bg-white/8 text-slate-400 hover:text-slate-200 transition-colors border border-white/5 hover:border-white/10"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {messages.map((msg, idx) => (
          <div key={idx} className={`flex flex-col gap-1 ${msg.role === "user" ? "items-end" : "items-start"}`}>
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted px-1">
              {msg.role === "user" ? "You" : "Praksys"}
            </span>
            <div
              className={`max-w-[92%] rounded-2xl px-4 py-3 ${
                msg.role === "user"
                  ? "bg-accent text-white text-sm leading-relaxed rounded-tr-sm"
                  : "bg-white/5 border border-white/8 rounded-tl-sm"
              }`}
            >
              {msg.role === "user" ? (
                <p className="text-sm leading-relaxed">{msg.content}</p>
              ) : msg.content ? (
                <div className="space-y-0.5">{renderMarkdown(msg.content)}</div>
              ) : loading && idx === messages.length - 1 ? (
                <span className="inline-flex gap-1 py-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: "300ms" }} />
                </span>
              ) : null}
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-slate-800/80 shrink-0">
        <div className="flex gap-2 items-end rounded-xl border border-white/10 bg-white/5 focus-within:border-accent/40 focus-within:bg-white/7 transition-all px-3 py-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
            }}
            onKeyDown={handleKeyDown}
            placeholder="Ask about this codebase…"
            disabled={loading}
            rows={1}
            className="flex-1 bg-transparent text-sm text-white placeholder:text-muted focus:outline-none resize-none min-h-[24px] max-h-[120px] disabled:opacity-50 leading-relaxed py-0.5"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="shrink-0 flex items-center justify-center h-7 w-7 rounded-lg bg-accent text-white disabled:opacity-40 hover:bg-accent/90 transition-colors mb-0.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <p className="text-[10px] text-muted mt-2 text-center">Enter to send · Shift+Enter for new line</p>
      </form>
    </div>
  );
}
