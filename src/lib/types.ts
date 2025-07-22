import { Timestamp } from "firebase/firestore";

export type User = {
  id: string;
  uid: string;
  name: string;
  email: string;
  avatarUrl: string;
  bio: string;
  skills: string[];
  socials: { name: string; url: string }[];
  currentCompany?: string;
  currentRole?: string;
  education?: string;
  createdAt: Timestamp;
};

export type Showcase = {
  id: string;
  userId: string;
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
  upvotes: number;
  createdAt: Timestamp | string;
};

export type Post = {
  id: string;
  userId: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Timestamp | string;
  views: number;
  reactions: number;
  commentsCount: number;
  authorName?: string;
  authorAvatar?: string;
};

export type Comment = {
  id:string;
  postId: string;
  userId: string;
  content: string;
  createdAt: Timestamp | string;
  authorName?: string;
  authorAvatar?: string;
};

export type Badge = {
  id: string;
  name: string;
  description: string;
  icon: string;
};
