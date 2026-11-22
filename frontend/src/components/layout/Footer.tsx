import { useState, type FC, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Mail, Heart, CheckCircle2 } from 'lucide-react';
import { footerConfig, type SocialLink } from './footer.config';

/**
 * Authentic Kolkata Skyline Vector Illustration.
 * Delicate light-gray vector line-art depicting Victoria Memorial and the Howrah Bridge.
 */
const KolkataSkylineIllustration: FC<{ className?: string }> = ({ className = 'h-9 w-auto text-[#C8C5BD]' }) => (
  <svg
    viewBox="0 0 260 40"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.25"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {/* Baseline river & plaza ground */}
    <line x1="2" y1="36" x2="258" y2="36" />

    {/* --- VICTORIA MEMORIAL (Left side: 10px to 110px) --- */}
    {/* Base podium steps */}
    <rect x="18" y="32" width="84" height="4" rx="0.5" />
    <rect x="24" y="28" width="72" height="4" rx="0.5" />

    {/* Main Hall facade & columns */}
    <rect x="34" y="20" width="52" height="8" rx="0.5" />
    <line x1="42" y1="28" x2="42" y2="20" />
    <line x1="48" y1="28" x2="48" y2="20" />
    <line x1="54" y1="28" x2="54" y2="20" />
    <line x1="66" y1="28" x2="66" y2="20" />
    <line x1="72" y1="28" x2="72" y2="20" />
    <line x1="78" y1="28" x2="78" y2="20" />

    {/* Central Arch portico */}
    <path d="M 57 28 L 57 23 C 57 21 63 21 63 23 L 63 28" />

    {/* Central Dome drum & dome curve */}
    <rect x="48" y="16" width="24" height="4" rx="0.5" />
    <path d="M 49 16 C 49 9, 71 9, 71 16" />
    {/* Angel of Victory finial */}
    <line x1="60" y1="9" x2="60" y2="4" />
    <circle cx="60" cy="3" r="1.2" fill="currentColor" />

    {/* Left corner cupola dome */}
    <rect x="22" y="22" width="10" height="6" rx="0.5" />
    <path d="M 23 22 C 23 18, 31 18, 31 22" />
    <line x1="27" y1="18" x2="27" y2="15" />

    {/* Right corner cupola dome */}
    <rect x="88" y="22" width="10" height="6" rx="0.5" />
    <path d="M 89 22 C 89 18, 97 18, 97 22" />
    <line x1="93" y1="18" x2="93" y2="15" />

    {/* --- HOWRAH BRIDGE (Right side: 130px to 250px) --- */}
    {/* Left Cantilever Pylon tower */}
    <line x1="140" y1="36" x2="148" y2="8" strokeWidth="1.5" />
    <line x1="156" y1="36" x2="148" y2="8" strokeWidth="1.5" />
    <line x1="148" y1="8" x2="148" y2="5" />
    {/* Left tower cross-struts */}
    <line x1="143" y1="26" x2="153" y2="26" />
    <line x1="145" y1="18" x2="151" y2="18" />
    <line x1="142" y1="32" x2="152" y2="20" />
    <line x1="154" y1="32" x2="144" y2="20" />

    {/* Right Cantilever Pylon tower */}
    <line x1="224" y1="36" x2="232" y2="8" strokeWidth="1.5" />
    <line x1="240" y1="36" x2="232" y2="8" strokeWidth="1.5" />
    <line x1="232" y1="8" x2="232" y2="5" />
    {/* Right tower cross-struts */}
    <line x1="227" y1="26" x2="237" y2="26" />
    <line x1="229" y1="18" x2="235" y2="18" />
    <line x1="226" y1="32" x2="236" y2="20" />
    <line x1="238" y1="32" x2="228" y2="20" />

    {/* Main bridge roadway span */}
    <line x1="130" y1="32" x2="250" y2="32" strokeWidth="1.5" />

    {/* Cantilever upper truss chords & suspension curve */}
    <path d="M 130 24 L 148 8 L 190 20 L 232 8 L 250 24" strokeWidth="1.3" />
    <path d="M 148 8 Q 190 28 232 8" />

    {/* Central truss diagonals */}
    <line x1="160" y1="15" x2="160" y2="32" />
    <line x1="172" y1="18" x2="172" y2="32" />
    <line x1="184" y1="20" x2="184" y2="32" />
    <line x1="196" y1="20" x2="196" y2="32" />
    <line x1="208" y1="18" x2="208" y2="32" />
    <line x1="220" y1="15" x2="220" y2="32" />

    {/* Subtle water ripples under bridge */}
    <path d="M 152 38 Q 156 37 160 38 M 174 38 Q 178 37 182 38 M 204 38 Q 208 37 212 38 M 224 38 Q 228 37 232 38" strokeWidth="0.8" />
  </svg>
);

export const Footer: FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const { banner, brand, columns, newsletter, bottom } = footerConfig;

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setIsSubscribed(true);
    setEmail('');
    setTimeout(() => setIsSubscribed(false), 5000);
  };

  const renderSocialIcon = (platform: SocialLink['platform']) => {
    switch (platform) {
      case 'instagram':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        );
      case 'linkedin':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.62 1.62 0 1 0 0-3.24 1.62 1.62 0 0 0 0 3.24M7.86 18.5V10.13H5.07V18.5h2.79z" />
          </svg>
        );
      case 'github':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <footer className="w-full bg-white border-t border-[#EAE8E4] mt-16 sm:mt-24 pt-10 sm:pt-14 pb-8 sm:pb-10 text-[#1B1C1A]">
      <div className="w-full max-w-[1640px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col space-y-12 sm:space-y-14">
        {/* ========================================================================= */}
        {/* SECTION 1: PREMIUM DARK NAVY CTA BANNER (EXACT REFERENCE REPRODUCTION)   */}
        {/* ========================================================================= */}
        <section
          aria-label="Journey Call to Action"
          className="relative w-full rounded-[26px] bg-[#0B2341] px-6 sm:px-12 lg:px-16 py-8 sm:py-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 overflow-hidden shadow-xs"
        >
          {/* Left Text Content */}
          <div className="space-y-1 sm:space-y-2 z-10 max-w-2xl">
            <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#FC7728] block">
              {banner.tag}
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-[46px] font-extrabold text-white tracking-tight leading-tight">
              {banner.title}
            </h2>
            <p className="text-sm sm:text-lg lg:text-[22px] font-normal text-white/85 pt-0.5">
              {banner.description}
            </p>
          </div>

          {/* Right Section: Minimal Transportation Route Illustration & CTA Button */}
          <div className="flex items-center gap-4 sm:gap-6 z-10 w-full sm:w-auto justify-between sm:justify-end">
            {/* Minimalist Route Illustration (Location Pin ➔ Curved Route Line ➔ Orange Waypoint ➔ Front Bus) */}
            <div className="hidden xl:flex items-center gap-2.5 select-none pointer-events-none" aria-hidden="true">
              {/* Location Pin */}
              <svg
                className="w-5 h-5 text-white/90 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>

              {/* Curved Route with Orange Node */}
              <svg width="128" height="34" viewBox="0 0 128 34" fill="none">
                <path
                  d="M 4 22 C 32 22, 38 12, 64 12 C 90 12, 96 24, 124 24"
                  stroke="white"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeDasharray="1 0"
                />
                <circle cx="64" cy="12" r="4.5" fill="#FC7728" stroke="white" strokeWidth="1.75" />
              </svg>

              {/* Front-facing Bus Icon */}
              <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/25 flex items-center justify-center text-white shrink-0">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="4" y="3" width="16" height="15" rx="3" />
                  <path d="M4 10h16" />
                  <path d="M8 6h8" stroke="#FC7728" strokeWidth="2" />
                  <circle cx="7.5" cy="15" r="1.3" fill="currentColor" />
                  <circle cx="16.5" cy="15" r="1.3" fill="currentColor" />
                  <path d="M7 18v2M17 18v2" />
                </svg>
              </div>
            </div>

            {/* Find buses Button */}
            <Link
              to={banner.ctaHref}
              className="group inline-flex items-center justify-center gap-2.5 px-7 sm:px-9 py-3.5 sm:py-4 rounded-[22px] bg-white text-[#0B2341] font-bold text-sm sm:text-base shadow-sm hover:bg-[#F5F3EF] hover:shadow-md transition-all duration-200 shrink-0 w-full sm:w-auto"
            >
              <span>{banner.ctaLabel}</span>
              <span className="transition-transform duration-200 group-hover:translate-x-1 font-bold">→</span>
            </Link>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 2: BRAND INFORMATION & 5-COLUMN NAVIGATION GRID                  */}
        {/* ========================================================================= */}
        <section aria-label="Footer Navigation" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* COLUMN 1: BRAND IDENTITY (~28% / 4 Cols) */}
          <div className="lg:col-span-4 flex flex-col gap-3.5">
            {/* Brand Logo & Wordmark */}
            <Link to="/" className="flex items-center gap-3 group w-fit">
              {/* Navy Rounded-Square Bus Emblem */}
              <div className="w-11 h-11 rounded-[14px] bg-[#0B2341] text-white flex items-center justify-center shadow-xs shrink-0 p-2">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="4" y="3" width="16" height="15" rx="3" />
                  <path d="M4 10h16" />
                  <path d="M8 6h8" stroke="#FC7728" strokeWidth="2" />
                  <circle cx="7.5" cy="15" r="1.4" fill="currentColor" />
                  <circle cx="16.5" cy="15" r="1.4" fill="currentColor" />
                  <path d="M7 18v2.5M17 18v2.5" />
                </svg>
              </div>

              {/* Exact Brand Text: One Go (Navy) Bus (Orange) */}
              <span className="font-sans text-2xl sm:text-[28px] font-extrabold tracking-tight text-[#0B2341]">
                {brand.namePrefix} <span className="text-[#FC7728]">{brand.nameHighlight}</span>
              </span>
            </Link>

            {/* Description */}
            <p className="text-sm text-[#44474E] leading-relaxed max-w-[320px] mt-1">
              {brand.description}
            </p>

            {/* Social Buttons (3 square light-neutral buttons: Instagram, LinkedIn, GitHub) */}
            <div className="flex items-center gap-2.5 pt-2">
              {brand.socials.map((social) => (
                <a
                  key={social.platform}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.ariaLabel}
                  className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#F5F3EF] hover:bg-[#EAE8E4] flex items-center justify-center text-[#1B1C1A] transition-colors duration-200 shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FC7728]"
                >
                  {renderSocialIcon(social.platform)}
                </a>
              ))}
            </div>
          </div>

          {/* COLUMN 2: EXPLORE (~15% / 2 Cols) */}
          <div className="lg:col-span-2 flex flex-col gap-3.5">
            <h3 className="text-sm sm:text-[15px] font-extrabold uppercase tracking-wider text-[#0B2341]">
              {columns.explore.title}
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm text-[#44474E]">
              {columns.explore.links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="hover:text-[#0B2341] hover:underline underline-offset-4 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 3: COMPANY (~15% / 2 Cols) */}
          <div className="lg:col-span-2 flex flex-col gap-3.5">
            <h3 className="text-sm sm:text-[15px] font-extrabold uppercase tracking-wider text-[#0B2341]">
              {columns.company.title}
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm text-[#44474E]">
              {columns.company.links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="hover:text-[#0B2341] hover:underline underline-offset-4 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 4: SUPPORT (~18% / 2 Cols) */}
          <div className="lg:col-span-2 flex flex-col gap-3.5">
            <h3 className="text-sm sm:text-[15px] font-extrabold uppercase tracking-wider text-[#0B2341]">
              {columns.support.title}
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm text-[#44474E]">
              {columns.support.links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="hover:text-[#0B2341] hover:underline underline-offset-4 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 5: GET IN TOUCH (~22% / 2 Cols) */}
          <div className="lg:col-span-2 flex flex-col gap-3.5">
            <h3 className="text-sm sm:text-[15px] font-extrabold uppercase tracking-wider text-[#0B2341]">
              {columns.contact.title}
            </h3>

            {/* Location with Orange Pin */}
            <div className="flex items-center gap-2 text-xs sm:text-sm text-[#44474E] font-medium">
              <MapPin className="w-4 h-4 text-[#FC7728] shrink-0" />
              <span>{columns.contact.location}</span>
            </div>

            {/* Outlined Contact our team Button */}
            <Link
              to={columns.contact.buttonHref}
              className="mt-2 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-[#EAE8E4] bg-white hover:bg-[#F5F3EF] text-[#0B2341] text-xs sm:text-sm font-bold transition-all shadow-2xs w-full sm:w-auto"
            >
              <Mail className="w-4 h-4 text-[#0B2341]" />
              <span>{columns.contact.buttonLabel}</span>
            </Link>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 3: NEWSLETTER SUBSCRIPTION                                       */}
        {/* ========================================================================= */}
        <section aria-label="Newsletter Subscription" className="border-t border-[#EAE8E4] pt-8 sm:pt-9 pb-2">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            {/* Left side: Orange Envelope + Heading & Subtitle */}
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200/60 flex items-center justify-center text-[#FC7728] shrink-0">
                <Mail className="w-5 h-5 text-[#FC7728]" strokeWidth={2.2} />
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-bold text-[#0B2341]">
                  {newsletter.title}
                </h4>
                <p className="text-xs sm:text-sm text-[#44474E] mt-0.5">
                  {newsletter.description}
                </p>
              </div>
            </div>

            {/* Right side: Email input + Subscribe button */}
            <form onSubmit={handleSubscribe} className="w-full lg:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={newsletter.placeholder}
                required
                aria-label="Email address for route updates"
                className="w-full sm:w-[320px] md:w-[380px] lg:w-[420px] h-[50px] sm:h-[54px] px-4 rounded-xl border border-[#EAE8E4] bg-white text-xs sm:text-sm text-[#1B1C1A] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FC7728]"
              />
              <button
                type="submit"
                className="h-[50px] sm:h-[54px] px-6 sm:px-7 rounded-xl bg-[#0B2341] hover:bg-[#000D21] text-white text-xs sm:text-sm font-bold shadow-xs transition-colors shrink-0 cursor-pointer"
              >
                {newsletter.buttonText}
              </button>
            </form>
          </div>

          {/* Submission Feedback Toast */}
          {isSubscribed && (
            <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>Thank you for subscribing! You will receive verified Bengal transit route updates.</span>
            </div>
          )}
        </section>

        {/* ========================================================================= */}
        {/* SECTION 4: BOTTOM FOOTER BAR WITH KOLKATA SKYLINE LINE-ART               */}
        {/* ========================================================================= */}
        <section aria-label="Legal and Copyright" className="border-t border-[#EAE8E4] pt-7 pb-2 flex flex-col md:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-[#44474E]">
          {/* Left: Copyright */}
          <div>{bottom.copyright}</div>

          {/* Center: Legal Links */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
            {bottom.links.map((link, idx) => (
              <span key={link.label} className="inline-flex items-center gap-2 sm:gap-3">
                <Link to={link.href} className="hover:text-[#0B2341] transition-colors">
                  {link.label}
                </Link>
                {idx < bottom.links.length - 1 && <span className="text-slate-300 select-none">•</span>}
              </span>
            ))}
          </div>

          {/* Center-Right: Delicate Kolkata Skyline Illustration (Victoria Memorial & Howrah Bridge) */}
          <div className="hidden lg:flex items-center justify-center opacity-80 select-none pointer-events-none" aria-hidden="true">
            <KolkataSkylineIllustration />
          </div>

          {/* Far Right: Made for West Bengal with Heart */}
          <div className="flex items-center gap-1.5 text-[#0B2341] font-semibold">
            <Heart className="w-4 h-4 text-[#FC7728] fill-none stroke-[2.2]" />
            <span>{bottom.madeFor}</span>
          </div>
        </section>
      </div>
    </footer>
  );
};

export default Footer;
