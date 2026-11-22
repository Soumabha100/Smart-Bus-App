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
  platform: 'instagram' | 'linkedin' | 'github';
  href: string;
  ariaLabel: string;
}

export interface FooterConfig {
  banner: {
    tag: string;
    title: string;
    description: string;
    ctaLabel: string;
    ctaHref: string;
  };
  brand: {
    namePrefix: string;
    nameHighlight: string;
    description: string;
    socials: SocialLink[];
  };
  columns: {
    explore: FooterColumn;
    company: FooterColumn;
    support: FooterColumn;
    contact: {
      title: string;
      location: string;
      buttonLabel: string;
      buttonHref: string;
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
    links: FooterLink[];
    madeFor: string;
  };
}

export const footerConfig: FooterConfig = {
  banner: {
    tag: 'MADE FOR MOVING',
    title: 'Your next journey starts here.',
    description: 'Explore routes across Kolkata and West Bengal.',
    ctaLabel: 'Find buses',
    ctaHref: '/results',
  },
  brand: {
    namePrefix: 'One Go',
    nameHighlight: 'Bus',
    description: 'A simpler way to discover routes, choose seats and travel across West Bengal.',
    socials: [
      { platform: 'instagram', href: 'https://instagram.com', ariaLabel: 'One Go Bus on Instagram' },
      { platform: 'linkedin', href: 'https://linkedin.com', ariaLabel: 'One Go Bus on LinkedIn' },
      { platform: 'github', href: 'https://github.com', ariaLabel: 'One Go Bus on GitHub' },
    ],
  },
  columns: {
    explore: {
      title: 'EXPLORE',
      links: [
        { label: 'Search Buses', href: '/results' },
        { label: 'Popular Routes', href: '/routes' },
        { label: 'Live Tracking', href: '/results' },
        { label: 'Ask AI', href: '/ask-ai' },
      ],
    },
    company: {
      title: 'COMPANY',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'Our Team', href: '/about' },
        { label: 'How It Works', href: '/how-it-works' },
      ],
    },
    support: {
      title: 'SUPPORT',
      links: [
        { label: 'Help Center', href: '/faq' },
        { label: 'FAQs', href: '/faq' },
        { label: 'Cancellations & Refunds', href: '/terms' },
        { label: 'Contact Support', href: '/contact' },
      ],
    },
    contact: {
      title: 'GET IN TOUCH',
      location: 'Kolkata, West Bengal, India',
      buttonLabel: 'Contact our team',
      buttonHref: '/contact',
    },
  },
  newsletter: {
    title: 'Get route updates',
    description: 'Occasional travel news, straight to your inbox.',
    placeholder: 'Email address',
    buttonText: 'Subscribe',
  },
  bottom: {
    copyright: `© ${new Date().getFullYear()} One Go Bus. All rights reserved.`,
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Accessibility', href: '/terms' },
    ],
    madeFor: 'Made for West Bengal',
  },
};
