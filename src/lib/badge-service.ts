
'use server';

/**
 * @fileoverview This file provides a service for managing user badges and achievements.
 * For this demo, it uses a mock implementation, but it's structured for a real backend.
 */

import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import type { Badge } from "./types";

// A predefined list of all possible badges in the system.
// In a real application, this could be stored in a 'badges' collection in Firestore.
const mockBadges: Badge[] = [
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

/**
 * Fetches the badges a specific user has earned.
 * @param userId The ID of the user whose badges to fetch.
 * @returns A promise that resolves to an array of Badge objects.
 * 
 * @note This is a mock implementation for demonstration purposes. A real-world
 * implementation would involve checking user statistics against badge criteria
 * or fetching a list of earned badges from a user's subcollection in Firestore.
 */
export const getBadgesForUser = async (userId: string): Promise<Badge[]> => {
    // For this demo, we'll give every user all the badges to showcase the feature.
    if (userId) {
         return mockBadges;
    }
    return [];
};
