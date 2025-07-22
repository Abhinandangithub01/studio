
'use server';

import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, setDoc, deleteDoc, collection, getDocs } from "firebase/firestore";
import type { User } from "./mock-data";

export const getUserProfile = async (userId: string): Promise<User | null> => {
    try {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            return { id: userSnap.id, ...userSnap.data() } as User;
        } else {
            console.log("No such document!");
            return null;
        }
    } catch (error) {
        console.error("Error getting user profile:", error);
        return null;
    }
};

export const updateUserProfile = async (userId: string, data: Partial<User>) => {
    try {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, data);
    } catch (error) {
        console.error("Error updating user profile:", error);
        throw new Error("Failed to update profile");
    }
};

export const followUser = async (currentUserId: string, targetUserId: string) => {
    if (currentUserId === targetUserId) return;
    try {
        const followingRef = doc(db, "users", currentUserId, "following", targetUserId);
        const followerRef = doc(db, "users", targetUserId, "followers", currentUserId);
        
        await setDoc(followingRef, { userId: targetUserId });
        await setDoc(followerRef, { userId: currentUserId });
    } catch (error) {
        console.error("Error following user:", error);
        throw new Error("Failed to follow user");
    }
};

export const unfollowUser = async (currentUserId: string, targetUserId: string) => {
    if (currentUserId === targetUserId) return;
    try {
        const followingRef = doc(db, "users", currentUserId, "following", targetUserId);
        const followerRef = doc(db, "users", targetUserId, "followers", currentUserId);

        await deleteDoc(followingRef);
        await deleteDoc(followerRef);
    } catch (error) {
        console.error("Error unfollowing user:", error);
        throw new Error("Failed to unfollow user");
    }
};

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
