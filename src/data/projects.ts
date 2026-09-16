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
    category: "Interior design website",
    accent: "sand",
    highlights: ["Service pages", "Project previews", "Consultation inquiries"],
    description:
      "A website for a St. Louis interior designer, bringing services, project previews, and favorite finds together with an easy way to ask about a consultation.",
    tech: ["Next.js", "TypeScript", "Vercel"],
    url: "https://www.krhdesignco.com",
  },
  {
    name: "VEST First Responder",
    category: "First-responder training",
    accent: "forest",
    highlights: ["Course information", "Training resources", "Class requests"],
    description:
      "A site where EMS, fire, and healthcare teams can learn about VEST’s training, explore courses, and request a class.",
    tech: ["Next.js", "Supabase", "Bunny.net"],
    url: "https://www.vestfirstresponder.com",
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
      "The site you’re on now. I used Codex to help move it to Astro, refine the design, and check the pages, with updates published automatically through GitHub Pages.",
    tech: ["Astro", "TypeScript", "GitHub Pages"],
    url: "https://github.com/jacobhuberonline/jacobhuberonline.github.io",
  },
];
