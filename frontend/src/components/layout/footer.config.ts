export interface FooterLink {
  label: string;
  href: string;
  badge?: string;
  isExternal?: boolean;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface SocialLink {
  platform: 'github' | 'linkedin' | 'instagram' | 'x';
  href: string;
  ariaLabel: string;
}

export interface FooterConfig {
  brand: {
    name: string;
    tagline: string;
    description: string;
    socials: SocialLink[];
  };
  columns: {
    product: FooterColumn;
    company: FooterColumn;
    support: FooterColumn;
    contact: {
      title: string;
      address: string;
      email: string;
      phone: string;
      hours: string;
    };
  };
  newsletter: {
    title: string;
    description: string;
    placeholder: string;
    buttonText: string;
  };
  bottom: {
    copyright: string;
    madeWith: string;
    links: FooterLink[];
  };
}

// TODO: Update these production values when deployment endpoints are ready
export const footerConfig: FooterConfig = {
  brand: {
    name: 'OneGoBus',
    // TODO: Customize brand tagline
    tagline: 'Smart Bus Discovery. Smarter Journeys.',
    // TODO: Customize elevator pitch
    description:
      'AI-powered next-gen transit platform for West Bengal. Real-time tracking, zero-fee booking, and guaranteed seat holds.',
    socials: [
      // TODO: Replace with official OneGoBus social handles
      { platform: 'x', href: 'https://x.com', ariaLabel: 'Follow OneGoBus on X (Twitter)' },
      { platform: 'github', href: 'https://github.com', ariaLabel: 'OneGoBus on GitHub' },
      { platform: 'linkedin', href: 'https://linkedin.com', ariaLabel: 'Connect with OneGoBus on LinkedIn' },
      { platform: 'instagram', href: 'https://instagram.com', ariaLabel: 'Follow OneGoBus on Instagram' },
    ],
  },
  columns: {
    product: {
      title: 'Product',
      links: [
        { label: 'Features', href: '/features' },
        { label: 'How it Works', href: '/how-it-works' },
        { label: 'Routes', href: '/routes' },
        { label: 'Ask AI', href: '/ask-ai', badge: 'AI' },
        { label: 'Pricing & Fares', href: '/features#pricing' },
      ],
    },
    company: {
      title: 'Company',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'Our Team', href: '/about#team' },
        { label: 'Careers', href: '/about#careers' },
        { label: 'Blog', href: '/about#blog' },
        { label: 'Contact', href: '/contact' },
      ],
    },
    support: {
      title: 'Support',
      links: [
        { label: 'FAQ', href: '/faq' },
        { label: 'Help Center', href: '/contact#help' },
        { label: 'Cancellation & Refunds', href: '/faq#refunds' },
        { label: 'Report an Issue', href: '/contact#report' },
      ],
    },
    contact: {
      title: 'Contact',
      // TODO: Replace with permanent registered office address
      address: 'Salt Lake Sector V, Kolkata, West Bengal 700091, India',
      // TODO: Configure active support mailbox
      email: 'support@onegobus.in',
      // TODO: Configure customer hotline
      phone: '+91 (033) 2400-GO-BUS',
      // TODO: Configure business operating hours
      hours: 'Mon – Sun: 6:00 AM – 11:00 PM IST',
    },
  },
  newsletter: {
    title: 'Stay in the Loop',
    description: 'Get route updates, festive specials, and exclusive student pass deals.',
    placeholder: 'Enter your email address',
    buttonText: 'Subscribe',
  },
  bottom: {
    copyright: `© ${new Date().getFullYear()} OneGoBus Inc. All rights reserved.`,
    madeWith: 'Made with ♥ in Kolkata, West Bengal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/privacy#cookies' },
    ],
  },
};
