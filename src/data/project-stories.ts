export type ProjectStorySlug = 'krh-design-co' | 'vest-first-responder';
type ProjectStory = {
  title: string;
  summary: string;
  serviceTakeaway: string;
  challenge: { title: string; paragraphs: string[] };
  decisions: { title: string; detail: string }[];
  outcome: { title: string; paragraphs: string[] };
};

// Illustrative drafts requested by Jacob. Replace with confirmed project details
// before removing the visible placeholder notices or enabling search indexing.
export const projectStories: Record<ProjectStorySlug, ProjectStory> = {
  'krh-design-co': {
    title: 'Making room for the work, and the next conversation.',
    summary: 'A draft story about balancing an interior studio’s visual identity with the practical questions a prospective client brings.',
    serviceTakeaway: 'How photography, service explanations, and a consultation link can work together on a visual business website.',
    challenge: {
      title: 'Beautiful rooms still need a clear introduction.',
      paragraphs: [
        'In this example, a prospective client arrives after seeing a room they love. The photographs establish a style, but the visitor still needs to understand what the studio does, whether their own project might be a fit, and how to begin a conversation.',
        'The design challenge is to give the work enough space without turning the site into a gallery with no direction. Too much explanation competes with the images; too little leaves the visitor to fill in the gaps.',
      ],
    },
    decisions: [
      {
        title: 'Let the photographs lead, then add context.',
        detail: 'The draft approach pairs generous imagery with short, specific introductions. A visitor can get a sense of the studio’s style at a glance, then read enough to understand the service behind the work. The aim is a portfolio that invites exploration without making every image compete for attention.',
      },
      {
        title: 'Give services their own space.',
        detail: 'Rather than placing every detail on the homepage, the story uses service pages to answer the next set of questions. This keeps the first impression focused while giving an interested visitor somewhere useful to go next.',
      },
      {
        title: 'Make the first conversation easy to find.',
        detail: 'Consultation links sit alongside the information that helps someone decide to get in touch. The visitor should not have to return to the top of the site or guess whether a particular project is worth discussing. On a phone, the same path needs to remain easy to read and follow.',
      },
    ],
    outcome: {
      title: 'From admiring the work to knowing what to ask.',
      paragraphs: [
        'The illustrative improvement is a more complete introduction: see the work, understand the services, meet the designer, and request a consultation. The visual character stays central, while the website gives prospective clients a clearer next step.',
        'The real story will replace this draft with the studio’s original challenge, the choices made during the build, and what the client noticed after launch. No enquiry, revenue, or conversion results are claimed here.',
      ],
    },
  },
  'vest-first-responder': {
    title: 'Helping training teams find their next step.',
    summary: 'A draft story about organizing courses, instructor information, and resources around the decisions a training coordinator needs to make.',
    serviceTakeaway: 'How a site with courses, resources, and several audiences can guide visitors toward the information they need.',
    challenge: {
      title: 'One site, several reasons to visit.',
      paragraphs: [
        'Imagine a department training coordinator comparing options between other responsibilities. They need to understand who a course is for, what it covers, who teaches it, and how to ask about bringing a class to their team. A returning participant may only need a resource.',
        'This draft explores the difficulty of serving both visitors without giving every piece of information equal weight. A long page of training material can be thorough and still make the next step hard to find.',
      ],
    },
    decisions: [
      {
        title: 'Organize around the visitor’s task.',
        detail: 'The example separates exploring a course, learning about the instructors, and finding training resources. Each route has a clear purpose, so a new visitor can build an understanding while a returning visitor can get directly to what they need.',
      },
      {
        title: 'Put useful explanations before extra detail.',
        detail: 'Course descriptions introduce the audience and subject before asking someone to work through supporting material. Instructor profiles and video then add context. The goal is to make the first pass useful without requiring every visitor to read or watch everything.',
      },
      {
        title: 'Connect course information to a class request.',
        detail: 'A direct request path follows the information a coordinator uses to evaluate training. The draft treats that handoff as part of the course experience: once someone has enough context, they can ask about a class without searching for a separate contact route.',
      },
    ],
    outcome: {
      title: 'A clearer route through a larger body of information.',
      paragraphs: [
        'The illustrative improvement is a site that supports distinct tasks: evaluate training, learn about the people delivering it, find resources, and request a class. The content remains available, but visitors have a clearer starting point.',
        'The real version will describe the actual content and technical constraints, feedback from the VEST team, and any observed changes after launch. This placeholder does not claim more bookings, time saved, or improved training outcomes.',
      ],
    },
  },
};
