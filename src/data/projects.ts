export type Project = {
  name: string;
  description: string;
  tech: string[];
  category: string;
  accent: "sand" | "forest" | "moss" | "stone";
  highlights: string[];
  url?: string;
};

export const projects: Project[] = [
  {
    name: "KRH Design Co.",
    category: "Brand website",
    accent: "sand",
    highlights: ["Interior design", "Styling", "Consultations"],
    description:
      "Interior design and styling website for a St. Louis brand, with service pages, portfolio previews, journal content, curated shopping links, and a clear consultation inquiry path.",
    tech: ["Next.js", "TypeScript", "Vercel"],
    url: "https://www.krhdesignco.com",
  },
  {
    name: "VEST First Responder",
    category: "Training platform",
    accent: "forest",
    highlights: ["Curriculum", "Resources", "Training inquiries"],
    description:
      "A dedicated information and contact site for the VEST First Responder training program, providing curriculum details, program structure, and an easy way for EMS, fire, and healthcare teams to request training.",
    tech: ["Next.js", "Supabase", "Bunny.net"],
    url: "https://www.vestfirstresponder.com",
  },
  {
    name: "VEST First Responder Reviews",
    category: "Review platform",
    accent: "moss",
    highlights: ["Class feedback", "Testimonials", "Training themes"],
    description:
      "Public review hub for VEST post-class evaluation feedback, including aggregate statistics, recent testimonials, common training themes, FAQs, and a review submission flow.",
    tech: ["Next.js", "TypeScript", "Vercel"],
    url: "https://reviews.vestfirstresponder.com",
  },
  {
    name: "First Responder Violence",
    category: "Reporting portal",
    accent: "stone",
    highlights: ["Incident reporting", "Support resources", "Safety patterns"],
    description:
      "Secure incident reporting portal for first responders to document workplace violence after a call, find support resources, and help agencies identify safety patterns.",
    tech: ["Next.js", "TypeScript", "Vercel"],
    url: "https://www.firstresponderviolence.com",
  },
  {
    name: "St. Andrew's Episcopal Church (Unofficial)",
    category: "Community website \u00b7 prototype",
    accent: "sand",
    highlights: ["Visit planning", "Sermons", "Ministries"],
    description:
      "Unofficial parish website prototype for St. Andrew's Episcopal Church in Edwardsville, with worship details, visit planning, sermons, events, ministry pages, and giving information.",
    tech: ["Next.js", "Tailwind CSS", "Vercel"],
    url: "https://st-andrews-church-nu.vercel.app",
  },
  {
    name: "Off-Duty Studio",
    category: "Media business website",
    accent: "stone",
    highlights: ["Drone photography", "Video", "Booking"],
    description:
      "St. Louis real estate drone photo and video website with portfolio sections, service positioning, booking links, social-ready media messaging, and search-focused content.",
    tech: ["Next.js", "TypeScript", "Vercel"],
    url: "https://www.offdutystudiostl.com",
  },
  {
    name: "Legends Photography",
    category: "Media business website",
    accent: "sand",
    highlights: ["Property media", "Coverage", "Booking"],
    description:
      "Florida real estate media website for listing photography, drone coverage, floor plans, and walkthrough video, with service, pricing, coverage, and booking content.",
    tech: ["Next.js", "TypeScript", "Vercel"],
    url: "https://legends-photography.vercel.app",
  },
  {
    name: "Address Validator",
    category: "Healthcare data tool",
    accent: "forest",
    highlights: ["Address checks", "Data cleanup", "Import / export"],
    description:
      "Audit and clean healthcare address data using external verification services and repeatable import/export workflows. Focused on catching bad data before it hits downstream systems.",
    tech: [".NET", "C#", "SQL"],
  },
  {
    name: "Personal Site",
    category: "Personal portfolio",
    accent: "moss",
    highlights: ["Engineering", "Selected work", "Static publishing"],
    description:
      "This site: a home for my software engineering work, websites, and personal projects, built as a static Astro site with automatic publishing through GitHub Pages.",
    tech: ["Astro", "TypeScript", "GitHub Pages"],
    url: "https://github.com/jacobhuberonline/jacobhuberonline.github.io",
  },
];
