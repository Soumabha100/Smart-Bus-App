import { useState, type FC, type FormEvent } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

export const ContactPage: FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs font-bold uppercase tracking-wider text-accent">Get in Touch</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-ink-strong mt-1">
          Contact OneGoBus Support
        </h1>
        <p className="text-sm text-ink-muted mt-3 leading-relaxed">
          Need help with an existing booking, refund status, or partner bus registration? We&apos;re here 7 days a week.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Info Card */}
        <div className="glass rounded-3xl p-6 sm:p-8 flex flex-col justify-between gap-6 shadow-xs">
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-ink-strong">Our Office & Helpdesk</h2>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-ink-muted">
                <p className="font-semibold text-ink-strong">Transit Operations Headquarters</p>
                <p>Salt Lake Sector V, Kolkata, West Bengal 700091, India</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-accent shrink-0" />
              <div className="text-xs sm:text-sm text-ink-muted">
                <p className="font-semibold text-ink-strong">+91 (033) 2400-GO-BUS</p>
                <p className="text-xs">Mon – Sun: 6:00 AM – 11:00 PM IST</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-accent shrink-0" />
              <div className="text-xs sm:text-sm text-ink-muted">
                <p className="font-semibold text-ink-strong">support@onegobus.in</p>
                <p className="text-xs">Average response time: &lt; 15 minutes</p>
              </div>
            </div>
          </div>
        </div>

        {/* Message Form Card */}
        <div className="glass rounded-3xl p-6 sm:p-8 shadow-xs">
          <h2 className="text-xl font-bold text-ink-strong mb-4">Send a Message</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            <div>
              <label htmlFor="contact-name" className="block text-xs font-semibold text-ink-strong mb-1">
                Full Name
              </label>
              <input
                id="contact-name"
                type="text"
                required
                className="w-full min-h-[42px] px-3.5 rounded-xl bg-surface-2 border border-line/60 text-xs text-ink-strong focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div>
              <label htmlFor="contact-email" className="block text-xs font-semibold text-ink-strong mb-1">
                Email Address
              </label>
              <input
                id="contact-email"
                type="email"
                required
                className="w-full min-h-[42px] px-3.5 rounded-xl bg-surface-2 border border-line/60 text-xs text-ink-strong focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div>
              <label htmlFor="contact-message" className="block text-xs font-semibold text-ink-strong mb-1">
                Your Query or Issue
              </label>
              <textarea
                id="contact-message"
                rows={3}
                required
                className="w-full p-3 rounded-xl bg-surface-2 border border-line/60 text-xs text-ink-strong focus:outline-none focus:ring-2 focus:ring-accent resize-none"
              />
            </div>

            <button
              type="submit"
              className="min-h-[44px] px-5 rounded-xl bg-brand hover:bg-brand-hover text-on-brand font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm mt-1"
            >
              <Send className="w-3.5 h-3.5 text-white" />
              <span>Submit Message</span>
            </button>

            {submitted && (
              <div className="p-3 rounded-xl bg-success-tint border border-success/30 text-success text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>Message received! Our Kolkata dispatch desk will get back to you shortly.</span>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
