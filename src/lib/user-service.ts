
'use server';

/**
 * @fileoverview This file contains server-side functions for managing user data in Firestore.
 * It includes operations like fetching profiles, updating profiles, and handling the follow/unfollow system.
 */

import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, setDoc, deleteDoc, collection, getDocs } from "firebase/firestore";
import type { User } from "./types";

/**
 * Fetches a user's profile from the Firestore 'users' collection.
 * @param userId The unique identifier of the user to fetch.
 * @returns A promise that resolves to the User object or null if not found.
 */
export const getUserProfile = async (userId: string): Promise<User | null> => {
    try {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            return { id: userSnap.id, ...userSnap.data() } as User;
        } else {
            console.log("No such user document!");
            return null;
        }
    } catch (error) {
        console.error("Error getting user profile:", error);
        return null;
    }
};

/**
 * Updates a user's profile in Firestore.
 * @param userId The unique identifier of the user to update.
 * @param data An object containing the fields to update.
 * @returns A promise that resolves when the update is complete.
 */
export const updateUserProfile = async (userId: string, data: Partial<User>) => {
    try {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, data);
    } catch (error) {
        console.error("Error updating user profile:", error);
        throw new Error("Failed to update profile");
    }
};

/**
 * Creates a following relationship between two users.
 * It adds the target user to the current user's "following" subcollection
 * and adds the current user to the target user's "followers" subcollection.
 * @param currentUserId The user who is initiating the follow.
 * @param targetUserId The user to be followed.
 */
export const followUser = async (currentUserId: string, targetUserId: string) => {
    if (currentUserId === targetUserId) return; // Users cannot follow themselves.
    try {
        const followingRef = doc(db, "users", currentUserId, "following", targetUserId);
        const followerRef = doc(db, "users", targetUserId, "followers", currentUserId);
        
        // Atomically perform both operations
        await Promise.all([
            setDoc(followingRef, { userId: targetUserId }),
            setDoc(followerRef, { userId: currentUserId })
        ]);
    } catch (error) {
        console.error("Error following user:", error);
        throw new Error("Failed to follow user");
    }
};

/**
 * Removes a following relationship between two users.
 * @param currentUserId The user who is initiating the unfollow.
 * @param targetUserId The user to be unfollowed.
 */
export const unfollowUser = async (currentUserId: string, targetUserId: string) => {
    if (currentUserId === targetUserId) return;
    try {
        const followingRef = doc(db, "users", currentUserId, "following", targetUserId);
        const followerRef = doc(db, "users", targetUserId, "followers", currentUserId);

        await Promise.all([
            deleteDoc(followingRef),
            deleteDoc(followerRef)
        ]);
    } catch (error) {
        console.error("Error unfollowing user:", error);
        throw new Error("Failed to unfollow user");
    }
};

/**
 * Checks if a user is currently following another user.
 * @param currentUserId The user who might be following.
 * @param targetUserId The user who might be followed.
 * @returns A promise that resolves to true if the user is following, false otherwise.
 */
export const checkIfFollowing = async (currentUserId: string, targetUserId: string): Promise<boolean> => {
    try {
        const followingRef = doc(db, "users", currentUserId, "following", targetUserId);
        const docSnap = await getDoc(followingRef);
        return docSnap.exists();
    } catch (error) {
        console.error("Error checking follow status:", error);
        return false;
    }
};

/**
 * Retrieves a list of user IDs that a specific user is following.
 * @param userId The user whose following list is to be fetched.
 * @returns A promise that resolves to an array of user IDs.
 */
export const getFollowingIds = async (userId: string): Promise<string[]> => {
    try {
        const followingCol = collection(db, "users", userId, "following");
        const snapshot = await getDocs(followingCol);
        return snapshot.docs.map(doc => doc.id);
    } catch (error) {
        console.error("Error getting following list:", error);
        return [];
    }
}
