export type ProjectStorySlug = 'krh-design-co' | 'vest-first-responder';
type ProjectStory = {
  isDraft: boolean;
  title: string;
  summary: string;
  serviceTakeaway: string;
  challenge: { title: string; paragraphs: string[] };
  decisions: { title: string; detail: string }[];
  outcome: { title: string; paragraphs: string[] };
};

// Keep unverified stories marked as drafts until the project details are confirmed.
export const projectStories: Record<ProjectStorySlug, ProjectStory> = {
  'krh-design-co': {
    isDraft: false,
    title: 'A website shaped around the designer’s work—and her clients’ next step.',
    summary: 'A focused website for KRH Design Co., shaped through collaboration with Katherine Hagen to showcase her work, clarify her services, and welcome enquiries.',
    serviceTakeaway: 'How client feedback shaped a simpler interior design website, clearer service offerings, and a direct way to enquire.',
    challenge: {
      title: 'A cleaner presentation for a visual business.',
      paragraphs: [
        'Katherine Hagen wanted a clean, visually engaging website for her interior design business. As we reviewed the early version, her direction became clear: simplify the content, narrow the photography, and make the services easier to understand.',
      ],
    },
    decisions: [
      {
        title: 'Refine the site together, one preview at a time.',
        detail: 'Working from Katherine’s copy, photographs, and feedback, I designed and built the site through a series of preview versions. Together, we refined the page order, updated imagery, and clarified the service offerings—including furnishing and home staging—so the website reflected what she was ready to offer.',
      },
    ],
    outcome: {
      title: 'From website enquiries to real conversations.',
      paragraphs: [
        'The result was a focused online home for KRH Design Co., with a clear way for prospective clients to get in touch. By September 2026, Katherine reported that enquiries received through the website had led to a kickoff call with one prospect and plans to connect with another.',
      ],
    },
  },
  'vest-first-responder': {
    isDraft: false,
    title: 'Supporting first responders before and after class.',
    summary: 'A website that introduces VEST’s training, gives course participants access to review videos, and is supported by an automated certificate workflow.',
    serviceTakeaway: 'How a public training website, videos available after sign-in, and certificate automation support the same classroom experience.',
    challenge: {
      title: 'Introduce the training. Support the people who take it.',
      paragraphs: [
        'Jake Hecht needed VEST First Responder’s website to showcase its courses and give people who had taken a class a place to revisit the material. The review videos were intended to reinforce in-person training, with access limited to those who had completed the relevant classes.',
      ],
    },
    decisions: [
      {
        title: 'Give prospective clients a clear introduction.',
        detail: 'I built public pages that explain the courses, introduce the instructors, and show VEST’s work through a promotional video. Visitors can explore the training and contact the team about a class.',
      },
      {
        title: 'Match video access to completed training.',
        detail: 'Working from Jake’s organization of the techniques, I arranged the videos into a training library behind sign-in. VEST can manage accounts by organization and course level, including access to earlier levels as participants progress.',
      },
      {
        title: 'Automate certificates after class.',
        detail: 'Alongside the website, I created a workflow that takes participant details from a form into Google Sheets. A script creates a personalized certificate matched to the participant’s training level and sends it by email.',
      },
    ],
    outcome: {
      title: 'A place to return to after training.',
      paragraphs: [
        'VEST now has a public introduction to its training and a video library for course participants to use afterward. The certificate workflow supports the same experience by delivering a record of completion, while VEST controls access to the review material.',
      ],
    },
  },
};
