
'use server';

/**
 * @fileoverview This file provides server-side functions for interacting with the 'posts' collection in Firestore.
 * It includes creating, fetching, and managing discussion posts.
 */

import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, doc, getDoc, query, orderBy, serverTimestamp, Timestamp, limit, where } from "firebase/firestore";
import type { Post } from "./types";
import { getUserProfile, getFollowingIds } from "./user-service";

// Defines the shape of the input data for creating a new post.
type PostInput = Omit<Post, "id" | "createdAt" | "views" | "reactions" | "commentsCount" | "authorName" | "authorAvatar">;

/**
 * Creates a new post document in the 'posts' collection in Firestore.
 * @param postData The data for the new post, conforming to the PostInput type.
 * @returns A promise that resolves when the post has been created.
 */
export const createPost = async (postData: PostInput) => {
    try {
        // Fetch the author's details to denormalize the data for performance.
        const user = await getUserProfile(postData.userId);

        await addDoc(collection(db, "posts"), {
            ...postData,
            authorName: user?.name || 'Anonymous',
            authorAvatar: user?.avatarUrl || '',
            views: 0,
            reactions: 0,
            commentsCount: 0,
            createdAt: serverTimestamp(),
        });
    } catch (error) {
        console.error("Error adding document: ", error);
        throw new Error("Failed to create post");
    }
};

/**
 * Fetches a list of all posts, ordered by creation date (newest first).
 * @returns A promise that resolves to an array of Post objects.
 */
export const getPosts = async (): Promise<Post[]> => {
    const postsCol = collection(db, "posts");
    const q = query(postsCol, orderBy("createdAt", "desc"));
    const postSnapshot = await getDocs(q);
    const postList = postSnapshot.docs.map(doc => {
        const data = doc.data();
        // Convert Firestore Timestamp to a more client-friendly date string.
        return {
            id: doc.id,
            ...data,
            createdAt: (data.createdAt as Timestamp)?.toDate ? (data.createdAt as Timestamp).toDate().toLocaleDateString() : 'Just now',
        } as Post;
    });
    return postList;
};

/**
 * Fetches all posts created by a specific user.
 * @param userId The ID of the user whose posts are to be fetched.
 * @returns A promise that resolves to an array of Post objects.
 */
export const getPostsByUserId = async (userId: string): Promise<Post[]> => {
    const postsCol = collection(db, "posts");
    const q = query(postsCol, where("userId", "==", userId), orderBy("createdAt", "desc"));
    const postSnapshot = await getDocs(q);
    const postList = postSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            createdAt: (data.createdAt as Timestamp)?.toDate ? (data.createdAt as Timestamp).toDate().toLocaleDateString() : 'Just now',
        } as Post;
    });
    return postList;
}

/**
 * Fetches posts from users that a specific user is following.
 * @param userId The ID of the user for whom to generate the feed.
 * @returns A promise that resolves to an array of Post objects from followed users.
 */
export const getPostsFromFollowing = async(userId: string): Promise<Post[]> => {
    const followingIds = await getFollowingIds(userId);
    if (followingIds.length === 0) {
        return []; // Return empty if the user isn't following anyone.
    }

    const postsCol = collection(db, "posts");
    // Firestore 'in' queries are limited to 10 array members. For a larger scale app,
    // a different data modeling approach would be needed (e.g., a "feed" subcollection for each user).
    const q = query(postsCol, where('userId', 'in', followingIds), orderBy("createdAt", "desc"));
    const postSnapshot = await getDocs(q);
     const postList = postSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            createdAt: (data.createdAt as Timestamp)?.toDate ? (data.createdAt as Timestamp).toDate().toLocaleDateString() : 'Just now',
        } as Post;
    });
    return postList;
}

/**
 * Fetches a single post by its document ID.
 * @param postId The unique ID of the post to fetch.
 * @returns A promise that resolves to the Post object or null if not found.
 */
export const getPost = async (postId: string): Promise<Post | null> => {
    try {
        const postRef = doc(db, "posts", postId);
        const postSnap = await getDoc(postRef);

        if (postSnap.exists()) {
            const data = postSnap.data();
            // Fetch author details for the post page.
            const user = await getUserProfile(data.userId);
            return {
                id: postSnap.id,
                ...data,
                authorName: user?.name,
                authorAvatar: user?.avatarUrl,
                createdAt: (data.createdAt as Timestamp)?.toDate ? (data.createdAt as Timestamp).toDate().toLocaleDateString() : 'Just now',
            } as Post;
        } else {
            console.log("No such post document!");
            return null;
        }
    } catch (error) {
        console.error("Error getting post:", error);
        return null;
    }
}

/**
 * Fetches a list of trending posts, based on the number of reactions.
 * @returns A promise that resolves to an array of the top 10 trending Post objects.
 */
export const getTrendingPosts = async (): Promise<Post[]> => {
    const postsCol = collection(db, "posts");
    const q = query(postsCol, orderBy("reactions", "desc"), limit(10));
    const postSnapshot = await getDocs(q);
    const postList = postSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
        } as Post;
    });
    return postList;
};
