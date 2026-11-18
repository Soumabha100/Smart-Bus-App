import { useState, type FC } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';

export const FaqPage: FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does the 7-minute seat hold work?',
      a: 'Once you select a seat, our Redis backend creates an atomic lock. Nobody else in the world can select or pay for that seat while your timer is running. You have full 7 minutes to finish payment safely.',
    },
    {
      q: 'How do I apply for the student discount pass?',
      a: 'During checkout or registration, toggle the "Student Privilege Pass" option. Upload or flash your college ID during boarding to unlock up to 40% fare concession on intercity Bengal routes.',
    },
    {
      q: 'What is the refund policy if my bus is delayed or cancelled?',
      a: 'If a partner bus is cancelled by the operator or delayed by over 60 minutes, you are entitled to an immediate 100% refund with zero cancellation charges.',
    },
    {
      q: 'Are luggage charges included in the fare?',
      a: 'Yes, up to 15 kg of cabin and boot luggage per passenger is completely free on all standard and luxury Volvo AC services across West Bengal.',
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs font-bold uppercase tracking-wider text-accent">Help Center</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-ink-strong mt-1">
          Frequently Asked Questions
        </h1>
        <p className="text-sm text-ink-muted mt-3 leading-relaxed">
          Quick answers to common questions about booking, seat holds, and student privileges.
        </p>
      </div>

      <div className="space-y-3.5">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={idx} className="glass rounded-2xl p-5 transition-all shadow-xs">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full flex items-center justify-between text-left gap-4"
              >
                <span className="text-sm sm:text-base font-bold text-ink-strong flex items-center gap-2.5">
                  <HelpCircle className="w-4 h-4 text-accent shrink-0" />
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-ink-muted transition-transform duration-200 shrink-0 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <p className="text-xs sm:text-sm text-ink-muted mt-3 pt-3 border-t border-line/30 leading-relaxed pl-6">
                  {faq.a}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FaqPage;
