import type { ImageMetadata } from 'astro';
import type { ProjectStorySlug } from './project-stories';
import krhHomepage from '../assets/projects/krh-homepage.jpg';
import vestHomepage from '../assets/projects/vest-homepage.jpg';

export type Project = {
  name: string;
  description: string;
  tech: string[];
  category: string;
  accent: "sand" | "forest" | "moss" | "stone";
  highlights: string[];
  url?: string;
  testimonial?: {
    quote: string;
    storyQuote?: string;
    attribution: string;
  };
  caseStudy?: {
    slug: ProjectStorySlug;
    screenshot: ImageMetadata;
    screenshotAlt: string;
    need: string;
    built: string;
  };
};

export const projects: Project[] = [
  {
    name: "KRH Design Co.",
    category: "Interior design website",
    accent: "sand",
    highlights: ["Service pages", "Project previews", "Consultation inquiries"],
    description:
      "Interior design work, services, and a simple way to request a consultation.",
    tech: ["Next.js", "TypeScript", "Vercel"],
    url: "https://www.krhdesignco.com",
    testimonial: {
      quote: "Jacob welcomed collaboration, listened carefully to feedback, and provided timely, thoughtful solutions.",
      storyQuote: "He took the information I had and made it into digestible (and visually interesting) content for the user to easily locate. Jacob welcomed collaboration, listened carefully to feedback, and provided timely, thoughtful solutions.",
      attribution: "Katherine Hagen, KRH Design Co.",
    },
    caseStudy: {
      slug: 'krh-design-co',
      screenshot: krhHomepage,
      screenshotAlt: "KRH Design Co. homepage with lime-green branding, interior photography, and a consultation link",
      need: "Introduce the design studio, show its style, and make it easy to enquire.",
      built: "An image-led site with service pages, a designer introduction, and clear links to enquire.",
    },
  },
  {
    name: "VEST First Responder",
    category: "First-responder training",
    accent: "forest",
    highlights: ["Course information", "Video access by training level", "Certificate automation"],
    description:
      "A public training website, review videos for course participants, and an automated certificate workflow.",
    tech: ["Next.js", "Supabase", "Bunny.net"],
    url: "https://www.vestfirstresponder.com",
    testimonial: {
      quote: "I've worked with a lot of vendors, and I've never found anyone as responsive, imaginative, fast, and affordable as Huber Builds.",
      storyQuote: "Jacob is extremely responsive and easy to communicate with, and he took my vision for the VEST First Responder site and brought it to life quickly. He consistently offered suggestions I wouldn't have thought of, drawing on his deep knowledge of what's possible, and improved on my original ideas at every turn.",
      attribution: "Jake Hecht, VEST First Responder",
    },
    caseStudy: {
      slug: 'vest-first-responder',
      screenshot: vestHomepage,
      screenshotAlt: "VEST First Responder homepage with its gold shield branding, training introduction, and contact links",
      need: "Showcase VEST’s training and give class participants a place to review what they learned.",
      built: "Public course and instructor pages, a video library with access by training level, and a separate certificate workflow.",
    },
  },
  {
    name: "VEST First Responder Reviews",
    category: "Class reviews",
    accent: "moss",
    highlights: ["Class feedback", "Testimonials", "Training themes"],
    description:
      "A place to read what people thought of their VEST class and share feedback after attending.",
    tech: ["Next.js", "TypeScript", "Vercel"],
    url: "https://reviews.vestfirstresponder.com",
  },
  {
    name: "First Responder Violence",
    category: "Incident reporting",
    accent: "stone",
    highlights: ["Incident reporting", "Support resources", "Safety patterns"],
    description:
      "A tool for first responders to report workplace violence, find support, and help agencies spot patterns.",
    tech: ["Next.js", "TypeScript", "Vercel"],
    url: "https://www.firstresponderviolence.com",
  },
  {
    name: "St. Andrew's Episcopal Church (Unofficial)",
    category: "Church website prototype",
    accent: "sand",
    highlights: ["Plan a visit", "Sermons", "Ministries"],
    description:
      "An unofficial prototype for an Edwardsville church, bringing service times, sermons, events, and visitor information together.",
    tech: ["Next.js", "Tailwind CSS", "Vercel"],
    url: "https://st-andrews-church-nu.vercel.app",
  },
  {
    name: "Off-Duty Studio",
    category: "Photography website",
    accent: "stone",
    highlights: ["Drone photography", "Video", "Booking"],
    description:
      "A website for a St. Louis drone photo and video business, with examples of its work and links to book a shoot.",
    tech: ["Next.js", "TypeScript", "Vercel"],
    url: "https://www.offdutystudiostl.com",
  },
  {
    name: "Legends Photography",
    category: "Photography website",
    accent: "sand",
    highlights: ["Property photos", "Coverage", "Booking"],
    description:
      "A Florida real estate photography site with photo and video services, pricing, coverage areas, and booking information.",
    tech: ["Next.js", "TypeScript", "Vercel"],
    url: "https://legends-photography.vercel.app",
  },
  {
    name: "Address Validator",
    category: "Healthcare data tool",
    accent: "forest",
    highlights: ["Address checks", "Data cleanup", "Import / export"],
    description:
      "A tool for checking healthcare address records, finding problems, and exporting the cleaned-up data.",
    tech: [".NET", "C#", "SQL"],
  },
  {
    name: "Personal Site",
    category: "Personal portfolio",
    accent: "moss",
    highlights: ["Engineering", "Projects", "GitHub Pages"],
    description:
      "This site, built with Astro and help from Codex. Updates publish automatically through GitHub Pages.",
    tech: ["Astro", "TypeScript", "GitHub Pages"],
    url: "https://github.com/jacobhuberonline/jacobhuberonline.github.io",
  },
];
