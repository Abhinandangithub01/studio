
export type User = {
  id: string;
  name: string;
  avatarUrl: string;
  bio: string;
  skills: string[];
  socials: { name: string; url: string }[];
};

export type Project = {
  id: string;
  userId: string;
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
  featured: boolean;
};

export type Showcase = {
  id: string;
  userId: string;
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
  upvotes: number;
  createdAt: string;
};

export type Post = {
  id: string;
  userId: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  views: number;
  reactions: number;
  commentsCount: number;
};

export type Comment = {
  id:string;
  postId: string;
  userId: string;
  content: string;
  createdAt: string;
};

export type Badge = {
  id: string;
  name: string;
  description: string;
  icon: string;
};

export const mockUser: User = {
  id: 'user-1',
  name: 'Alex Doe',
  avatarUrl: 'https://placehold.co/128x128',
  bio: 'Product Manager & No-Code Builder passionate about creating intuitive digital experiences. Turning ideas into reality, one component at a time.',
  skills: ['Product Management', 'UI/UX Design', 'No-Code Development', 'Agile Methodologies', 'Figma'],
  socials: [
    { name: 'LinkedIn', url: '#' },
    { name: 'Twitter', url: '#' },
    { name: 'Portfolio', url: '#' },
  ],
};

export const mockShowcases: Showcase[] = [
  {
    id: 'proj-1',
    userId: 'user-1',
    title: 'E-commerce Platform Redesign',
    description: 'Led the complete redesign of a major e-commerce platform, improving user engagement by 25% and conversion rates by 15%.',
    imageUrl: 'https://placehold.co/600x400',
    tags: ['UI/UX', 'E-commerce', 'Product Management'],
    upvotes: 128,
    createdAt: "2023-10-26T10:00:00Z",
  },
  {
    id: 'proj-2',
    userId: 'user-2',
    title: 'SaaS Dashboard for Analytics',
    description: 'Designed and shipped a comprehensive analytics dashboard for a B2B SaaS product, providing users with actionable insights.',
    imageUrl: 'https://placehold.co/600x400',
    tags: ['SaaS', 'No-Code', 'Figma'],
    upvotes: 97,
    createdAt: "2023-10-25T10:00:00Z",
  },
  {
    id: 'proj-3',
    userId: 'user-3',
    title: 'Mobile App for mindfulness',
    description: 'A concept for a mobile app to help users practice mindfulness through guided meditations and journaling.',
    imageUrl: 'https://placehold.co/600x400',
    tags: ['Mobile App', 'UI/UX', 'Wellness'],
    upvotes: 63,
    createdAt: "2023-10-24T10:00:00Z",
  },
];


export const mockProjects: Project[] = [
  {
    id: 'proj-1',
    userId: 'user-1',
    title: 'E-commerce Platform Redesign',
    description: 'Led the complete redesign of a major e-commerce platform, improving user engagement by 25% and conversion rates by 15%.',
    imageUrl: 'https://placehold.co/600x400',
    tags: ['UI/UX', 'E-commerce', 'Product Management'],
    featured: true,
  },
  {
    id: 'proj-2',
    userId: 'user-1',
    title: 'SaaS Dashboard for Analytics',
    description: 'Designed and shipped a comprehensive analytics dashboard for a B2B SaaS product, providing users with actionable insights.',
    imageUrl: 'https://placehold.co/600x400',
    tags: ['SaaS', 'No-Code', 'Figma'],
    featured: true,
  },
  {
    id: 'proj-3',
    userId: 'user-1',
    title: 'Mobile App for mindfulness',
    description: 'A concept for a mobile app to help users practice mindfulness through guided meditations and journaling.',
    imageUrl: 'https://placehold.co/600x400',
    tags: ['Mobile App', 'UI/UX', 'Wellness'],
    featured: false,
  },
];

export const mockPosts: Post[] = [
  {
    id: 'post-1',
    userId: 'user-1',
    title: '10 Tips for Effective Product Roadmapping',
    content: 'A deep dive into creating product roadmaps that align stakeholders and drive results. This guide covers everything from initial brainstorming to final presentation. I will share my personal experiences and templates that I use in my day-to-day work.',
    tags: ['Product Management', 'Strategy', 'Agile'],
    createdAt: '2 days ago',
    views: 1200,
    reactions: 45,
    commentsCount: 12,
  },
  {
    id: 'post-2',
    userId: 'user-1',
    title: 'The Rise of No-Code: Building Complex Apps Without Code',
    content: 'No-code platforms are revolutionizing app development. In this post, I explore the capabilities of modern no-code tools and showcase a complex app I built in just one week.',
    tags: ['No-Code', 'Tech', 'Innovation'],
    createdAt: '5 days ago',
    views: 2500,
    reactions: 120,
    commentsCount: 34,
  },
];

export const mockComments: Comment[] = [
    {
        id: 'comment-1',
        postId: 'post-1',
        userId: 'user-2',
        content: 'Great insights, Alex! The point about stakeholder alignment is crucial and often overlooked.',
        createdAt: '1 day ago',
    },
    {
        id: 'comment-2',
        postId: 'post-1',
        userId: 'user-3',
        content: 'Thanks for sharing the templates. They are going to be very helpful for my next project.',
        createdAt: '2 hours ago',
    }
]

export const mockUsers: Record<string, Omit<User, 'id'>> = {
    'user-1': {
        name: 'Alex Doe',
        avatarUrl: 'https://placehold.co/128x128',
        bio: '', skills: [], socials: []
    },
    'user-2': {
        name: 'Jane Smith',
        avatarUrl: 'https://placehold.co/128x128',
        bio: '', skills: [], socials: []
    },
    'user-3': {
        name: 'Carlos Gomez',
        avatarUrl: 'https://placehold.co/128x128',
        bio: '', skills: [], socials: []
    }
}

export const mockBadges: Badge[] = [
  {
    id: 'badge-1',
    name: 'First Post',
    description: 'Published your very first post on the platform.',
    icon: 'Feather',
  },
  {
    id: 'badge-2',
    name: '1K Views',
    description: 'Your content has been viewed over 1,000 times.',
    icon: 'Eye',
  },
  {
    id: 'badge-3',
    name: 'Top Contributor',
    description: 'Reached the top 10 on the weekly leaderboard.',
    icon: 'Trophy',
  },
  {
    id: 'badge-4',
    name: 'Community Helper',
    description: 'Received 50 upvotes on your comments.',
    icon: 'Heart',
  },
];
