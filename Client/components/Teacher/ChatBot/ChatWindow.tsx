"use client";

import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/api/axios";

interface Message {
  id: string;
  message: string;
  sender: "user" | "bot" | "admin";
}

interface ChatWindowProps {
  onClose: () => void;
}

const sendMessageApi = async (messageText: string) => {
  const res = await api.post("/api/v1/teacher/chatbot/chat", {
    message: messageText,
  });
  return res.data.reply;
};

export default function ChatWindow({ onClose }: ChatWindowProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-msg",
      message: "Hi! How can we help you today?",
      sender: "bot",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessageMutation = useMutation({
    mutationFn: sendMessageApi,
    onSuccess: (reply) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          message: reply || "Not Found",
          sender: "bot",
        },
      ]);
    },
    onError: () => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          message: "Not Found",
          sender: "bot",
        },
      ]);
    },
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sendMessageMutation.isPending) return;

    const messageText = input;

    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), message: messageText, sender: "user" },
    ]);

    setInput("");
    sendMessageMutation.mutate(messageText);
  };

  return (
    <div className="w-[calc(100vw-2rem)] sm:w-96 h-[450px] max-h-[80vh] bg-white border border-gray-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden select-none">
      <div className="bg-blue-600 px-4 py-3 flex justify-between items-center text-white shrink-0">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
          <h3 className="font-semibold text-sm">Support Chat</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-blue-700 text-white/80 hover:text-white transition-colors cursor-pointer"
          aria-label="Close chat"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-4 bg-gray-50 space-y-3">
        {messages.map((msg) => {
          const isUser = msg.sender === "user";
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[82%] rounded-2xl px-4 py-2 text-sm break-words ${
                  isUser
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm"
                }`}
              >
                {msg.message}
              </div>
            </div>
          );
        })}

        {sendMessageMutation.isPending && (
          <div className="flex flex-col items-start animate-pulse">
            <div className="bg-white border border-gray-200 text-gray-400 max-w-[82%] rounded-2xl rounded-bl-none px-4 py-2 text-sm shadow-sm italic">
              Waiting...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 bg-white border-t border-gray-100 shrink-0">
        <form onSubmit={handleSend} className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-gray-100 text-gray-800 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            disabled={sendMessageMutation.isPending}
          />
          <button
            type="submit"
            disabled={sendMessageMutation.isPending || !input.trim()}
            className="bg-blue-600 text-white rounded-full p-2.5 w-10 h-10 flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 transition-colors shrink-0"
          >
            <svg
              className="w-4 h-4 transform rotate-45 -mt-0.5 -ml-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}