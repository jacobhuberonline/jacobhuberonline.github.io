export type Experience = {
  role: string;
  company: string;
  period: string;
  location: string;
  summary: string;
  highlights: string[];
};

export type SkillGroup = {
  title: string;
  items: string[];
};

export type Education = {
  qualification: string;
  institution: string;
  year: string;
  detail?: string;
};

export const experience: Experience[] = [
  {
    role: 'Software Engineer',
    company: 'symplr',
    period: 'January 2024 – Present',
    location: 'Remote',
    summary:
      'I build custom software and help healthcare teams connect their systems, including API consulting and Tier 3 support.',
    highlights: [
      'I use C#/.NET, SQL, PowerShell, and TypeScript to build and support applications, integrations, reports, and automation for clients and internal teams.',
      'I help payer and provider teams set up, test, and troubleshoot APIs, including authentication. For tricky production issues, I work across software, data, and customer workflows with Support, Professional Services, Product, and Engineering.',
      'I turn repeat work into reusable tools and processes. As a Claude Code Change Champion in Professional Services, I also help colleagues use AI-assisted development.',
    ],
  },
  {
    role: 'Technical Support Specialist',
    company: 'symplr',
    period: 'October 2020 – February 2024',
    location: 'Remote',
    summary:
      'I helped healthcare clients figure out what was going wrong in their software and how to fix it.',
    highlights: [
      'I worked with users to reproduce problems, checked application behavior and integrations, queried SQL Server, and tested fixes with customers.',
      'I solved issues on my own and with engineering and delivery teams, kept customers updated, and wrote notes and guides so others could follow the investigation and resolution.',
    ],
  },
  {
    role: 'Technical Solutions Analyst',
    company: 'Cerner Corporation',
    period: 'February 2019 – March 2020',
    location: 'Kansas City, Missouri',
    summary:
      'I supported healthcare applications and helped clients work through problems in their clinical workflows.',
    highlights: [
      'I planned investigations, maintained applications, and kept customers informed while working toward a fix.',
      'I used diagnostic tools and worked alongside users to reproduce problems, gathered evidence for internal teams, and documented what we found so the next person could pick it up.',
    ],
  },
  {
    role: 'Crew Member to General Manager',
    company: 'Chipotle Mexican Grill',
    period: 'June 2012 – August 2017',
    location: 'Kansas City, Missouri',
    summary:
      'I started as a crew member and worked my way through Kitchen Manager, Service Manager, and Apprentice to General Manager.',
    highlights: [
      'I ran a busy restaurant with a 40-person workforce and a management team, keeping service, staffing, and costs on track.',
      'I hired, trained, coached, and promoted employees, including helping people grow into kitchen and service manager roles.',
      'I handled schedules, budgets, profit and loss, food and labor costs, and the day-to-day work of running the restaurant.',
    ],
  },
];

export const skillGroups: SkillGroup[] = [
  {
    title: 'Code & data',
    items: ['C#', '.NET Framework', 'SQL Server', 'TypeScript', 'PowerShell', 'Next.js'],
  },
  {
    title: 'Connecting systems',
    items: ['REST APIs', 'ETL & data integration', 'SSRS', 'SFTP', 'Process automation', 'Git & GitHub'],
  },
  {
    title: 'Solving problems',
    items: ['API consulting', 'Tier 3 support', 'Production troubleshooting', 'Testing', 'Documentation', 'Client communication'],
  },
  {
    title: 'Working with people',
    items: ['Coaching & peer training', 'Team development', 'Helping teams adopt new tools', 'Customer escalations', 'Operational planning'],
  },
];

export const aiWorkflows = [
  {
    tool: 'Claude Code',
    context: 'At symplr',
    description:
      'I use Claude Code in my software development work at symplr. As a Change Champion in Professional Services, I also help colleagues get started with AI-assisted development and apply it to their own work.',
  },
  {
    tool: 'Codex',
    context: 'On my own projects',
    description:
      'I use Codex to explore ideas, write and refine code, troubleshoot issues, and test changes. For this site, that included moving from Next.js to Astro, refining the design, and setting up automatic publishing with GitHub Pages.',
  },
];

export const education: Education[] = [
  {
    qualification: "Bachelor's Degree, Management Information Systems",
    institution: 'Columbia College',
    year: '2018',
    detail: 'Computer/Information Technology Administration and Management',
  },
  {
    qualification: 'Associate of Arts',
    institution: 'Columbia College',
    year: '2014',
  },
];
