import { useState, type FC, type FormEvent } from 'react';
import { Sparkles, Send, Bot, User } from 'lucide-react';

export const AskAiPage: FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ sender: 'ai' | 'user'; text: string }[]>([
    {
      sender: 'ai',
      text: 'নমস্কার! I am your OneGoBus AI Transit Copilot. Ask me anything about Bengal bus schedules, fare comparisons, student concessions, or the fastest routes to Digha and Siliguri!',
    },
  ]);

  const handleSend = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userText = input.trim();
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setInput('');

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `Here is what I found for "${userText}": Luxury Volvo AC coaches depart hourly from Kolkata Esplanade. You can lock a seat for 7 minutes on our homepage with zero booking fee.`,
        },
      ]);
    }, 600);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-tint text-accent text-xs font-bold mb-2 border border-accent/20">
          <Sparkles className="w-3.5 h-3.5 text-accent-bright" />
          <span>Spring AI 2.0 Assistant</span>
        </div>
        <h1 className="text-3xl font-extrabold text-ink-strong">
          Ask OneGoBus AI
        </h1>
        <p className="text-xs sm:text-sm text-ink-muted mt-1.5">
          Natural language transit discovery powered by verified regional bus schedules.
        </p>
      </div>

      <div className="glass rounded-3xl p-5 sm:p-6 shadow-[0_12px_45px_rgba(11,35,65,0.06)] flex flex-col h-[520px]">
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto space-y-3.5 pr-2">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 items-start ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'ai' && (
                <div className="w-8 h-8 rounded-xl bg-brand text-on-brand flex items-center justify-center shrink-0 shadow-2xs">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-brand text-on-brand shadow-xs'
                    : 'bg-surface text-ink-strong border border-line/40 shadow-xs'
                }`}
              >
                {m.text}
              </div>
              {m.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-accent text-on-accent flex items-center justify-center shrink-0 shadow-2xs">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Query Input */}
        <form onSubmit={handleSend} className="mt-4 pt-3 border-t border-line/30 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. Find AC buses to Digha this Saturday morning under ₹300..."
            className="flex-1 min-h-[44px] px-4 rounded-xl bg-surface-2 border border-line/60 text-xs sm:text-sm text-ink-strong placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <button
            type="submit"
            aria-label="Send AI Query"
            className="min-h-[44px] px-4 rounded-xl bg-brand hover:bg-brand-hover text-on-brand transition-colors flex items-center justify-center shadow-xs"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AskAiPage;
