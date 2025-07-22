/**
 * @fileoverview This file defines the core data structures and TypeScript types used throughout the application.
 * Centralizing these types ensures consistency and provides a single source of truth for the app's data model.
 */

import type { Timestamp } from "firebase/firestore";

/**
 * Represents a user profile in the application.
 */
export type User = {
  id: string; // The document ID in Firestore, same as uid.
  uid: string; // The Firebase Authentication user ID.
  name: string; // The user's full name.
  email: string; // The user's email address.
  avatarUrl: string; // URL for the user's profile picture.
  bio: string; // A short biography or description about the user.
  skills: string[]; // A list of the user's professional skills.
  socials: { name: string; url: string }[]; // A list of social media links.
  currentCompany?: string; // The user's current company.
  currentRole?: string; // The user's current job title.
  education?: string; // The user's educational background.
  createdAt: Timestamp; // The timestamp when the user account was created.
};

/**
 * Represents a product or project showcased by a user.
 */
export type Showcase = {
  id: string; // The document ID in Firestore.
  userId: string; // The ID of the user who created the showcase.
  title: string; // The title of the showcase.
  description: string; // A description of the product or project.
  imageUrl: string; // A URL for the showcase's primary image.
  tags: string[]; // A list of relevant tags or technologies.
  upvotes: number; // The number of upvotes the showcase has received.
  createdAt: Timestamp | string; // The timestamp when the showcase was created.
};

/**
 * Represents a discussion post created by a user.
 */
export type Post = {
  id: string; // The document ID in Firestore.
  userId: string; // The ID of the user who created the post.
  title: string; // The title of the post.
  content: string; // The main content of the post, can support Markdown.
  tags: string[]; // A list of relevant tags.
  createdAt: Timestamp | string; // The timestamp when the post was created.
  views: number; // The number of times the post has been viewed.
  reactions: number; // The number of reactions (e.g., likes) the post has received.
  commentsCount: number; // The total number of comments on the post.
  authorName?: string; // The name of the post's author (denormalized for performance).
  authorAvatar?: string; // The avatar URL of the post's author (denormalized for performance).
};

/**
 * Represents a comment on a discussion post.
 */
export type Comment = {
  id:string; // The document ID in Firestore.
  postId: string; // The ID of the post this comment belongs to.
  userId: string; // The ID of the user who wrote the comment.
  content: string; // The text content of the comment.
  createdAt: Timestamp | string; // The timestamp when the comment was created.
  authorName?: string; // The name of the comment's author.
  authorAvatar?: string; // The avatar URL of the comment's author.
};

/**
 * Represents an achievement or badge that a user can earn.
 */
export type Badge = {
  id: string; // The badge's unique identifier.
  name: string; // The name of the badge (e.g., "First Post").
  description: string; // A description of how the badge is earned.
  icon: string; // An identifier for the badge's icon.
};
