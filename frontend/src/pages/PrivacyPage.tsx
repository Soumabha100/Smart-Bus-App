import { type FC } from 'react';
import { Shield } from 'lucide-react';

export const PrivacyPage: FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="glass rounded-3xl p-6 sm:p-10 shadow-[0_12px_45px_rgba(11,35,65,0.06)] space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-line/30">
          <div className="w-10 h-10 rounded-2xl bg-success-tint flex items-center justify-center text-success">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-ink-strong">Privacy Policy</h1>
            <p className="text-xs text-ink-muted">Compliant with DPDP Rules 2025</p>
          </div>
        </div>

        <section className="space-y-2 text-xs sm:text-sm text-ink-muted leading-relaxed">
          <h2 className="text-base font-bold text-ink-strong">1. Data Minimization Principles</h2>
          <p>
            OneGoBus collects only the minimum personal data required to issue your bus ticket and provide boarding coordination: name, mobile number, and destination stop.
          </p>
        </section>

        <section className="space-y-2 text-xs sm:text-sm text-ink-muted leading-relaxed">
          <h2 className="text-base font-bold text-ink-strong">2. AI & Large Language Model Guardrails</h2>
          <p>
            Under our strict architecture rules, passenger personally identifiable information (PII) is never sent to third-party LLMs or external AI providers. Vector embeddings and route queries contain only anonymous transit stop identifiers.
          </p>
        </section>

        <section className="space-y-2 text-xs sm:text-sm text-ink-muted leading-relaxed">
          <h2 className="text-base font-bold text-ink-strong">3. Your Rights as a Data Principal</h2>
          <p>
            Under India&apos;s Digital Personal Data Protection Act 2025, you have the right to access, rectify, or demand the complete erasure of your travel history and account records at any time via support@onegobus.in.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPage;
