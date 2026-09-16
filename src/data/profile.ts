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
      'Custom software development, API consulting, and Tier 3 support for healthcare technology clients and internal teams.',
    highlights: [
      'Design and support applications, integrations, reporting tools, and automation using C#/.NET, SQL, PowerShell, and TypeScript.',
      'Guide payer and provider API engagements, from authentication and implementation decisions to testing and troubleshooting.',
      'Investigate complex production issues across application behavior, APIs, data, and customer workflows, coordinating with Support, Professional Services, Product, and Engineering.',
      'Build reusable tools and repeatable processes, and help colleagues adopt AI-assisted development as a Claude Code Change Champion within Professional Services.',
    ],
  },
  {
    role: 'Technical Support Specialist',
    company: 'symplr',
    period: 'October 2020 – February 2024',
    location: 'Remote',
    summary:
      'Functional and technical support for healthcare clients, with a focus on understanding the full workflow behind an issue.',
    highlights: [
      'Investigated application behavior, integrations, and data by reproducing issues, working with users, querying SQL Server, and testing with customers.',
      'Resolved incidents independently and alongside engineering and delivery teams, keeping customers informed throughout the investigation.',
      'Created investigation documentation, knowledge-transfer materials, and practical resolution guidance.',
    ],
  },
  {
    role: 'Technical Solutions Analyst',
    company: 'Cerner Corporation',
    period: 'February 2019 – March 2020',
    location: 'Kansas City, Missouri',
    summary:
      'Application support and incident investigation for healthcare clients and clinical workflows.',
    highlights: [
      'Owned investigation planning, customer communication, application maintenance, and incident resolution.',
      'Used diagnostic tools, evidence gathering, and end-user observation to reproduce problems and coordinate fixes with internal teams.',
      'Documented findings and shared knowledge to keep investigations moving across teams.',
    ],
  },
  {
    role: 'Crew Member to General Manager',
    company: 'Chipotle Mexican Grill',
    period: 'June 2012 – August 2017',
    location: 'Kansas City, Missouri',
    summary:
      'A foundation in hands-on leadership, progressing through Kitchen Manager, Service Manager, and Apprentice before becoming General Manager.',
    highlights: [
      'Led a high-volume restaurant with a 40-person workforce and a management team, balancing service quality, staffing, and financial responsibility.',
      'Hired, trained, coached, and promoted employees, including developing new kitchen and service managers.',
      'Managed schedules, budgets, profit and loss, food and labor costs, and day-to-day operations.',
    ],
  },
];

export const skillGroups: SkillGroup[] = [
  {
    title: 'Software & data',
    items: ['C#', '.NET Framework', 'SQL Server', 'TypeScript', 'PowerShell', 'Next.js'],
  },
  {
    title: 'Integrations & automation',
    items: ['REST APIs', 'ETL & data integration', 'SSRS', 'SFTP', 'Process automation', 'Git & GitHub'],
  },
  {
    title: 'Technical delivery',
    items: ['API consulting', 'Tier 3 support', 'Production troubleshooting', 'Testing', 'Documentation', 'Client communication'],
  },
  {
    title: 'People & leadership',
    items: ['Coaching & peer training', 'Team development', 'Change enablement', 'Customer escalations', 'Operational planning'],
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
