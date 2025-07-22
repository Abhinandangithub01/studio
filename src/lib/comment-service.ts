
'use server';

/**
 * @fileoverview This file contains server-side functions for managing comments on posts.
 * Comments are stored as a subcollection under each post document in Firestore.
 */

import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp, Timestamp, where, doc, getDoc, updateDoc, increment } from "firebase/firestore";
import type { Comment } from "./types";
import { getUserProfile } from "./user-service";

// Defines the shape of the data required to create a new comment.
type CommentInput = {
    postId: string;
    userId: string;
    content: string;
};

/**
 * Creates a new comment document in a post's 'comments' subcollection.
 * It also atomically increments the 'commentsCount' on the parent post document.
 * @param commentData The data for the new comment.
 * @returns A promise that resolves when the comment has been successfully created.
 */
export const createComment = async (commentData: CommentInput) => {
    try {
        // Fetch user details to denormalize into the comment document for performance.
        const user = await getUserProfile(commentData.userId);

        // Add the new comment to the subcollection.
        await addDoc(collection(db, `posts/${commentData.postId}/comments`), {
            ...commentData,
            authorName: user?.name || 'Anonymous',
            authorAvatar: user?.avatarUrl || '',
            createdAt: serverTimestamp(),
        });
        
        // Atomically increment the commentsCount on the parent post.
        const postRef = doc(db, "posts", commentData.postId);
        await updateDoc(postRef, {
            commentsCount: increment(1)
        });

    } catch (error) {
        console.error("Error adding comment: ", error);
        throw new Error("Failed to create comment");
    }
};

/**
 * Fetches all comments for a given post, ordered by creation time.
 * @param postId The ID of the post for which to fetch comments.
 * @returns A promise that resolves to an array of Comment objects.
 */
export const getComments = async (postId: string): Promise<Comment[]> => {
    const commentsCol = collection(db, `posts/${postId}/comments`);
    const q = query(commentsCol, orderBy("createdAt", "asc"));
    const commentSnapshot = await getDocs(q);
    
    // Asynchronously process all comment documents.
    const commentList = await Promise.all(commentSnapshot.docs.map(async (docSnapshot) => {
        const data = docSnapshot.data();
        
        // In case author details weren't denormalized, fetch them now.
        let authorName = data.authorName;
        let authorAvatar = data.authorAvatar;
        
        if (!authorName) {
            const user = await getUserProfile(data.userId);
            authorName = user?.name || 'Anonymous';
            authorAvatar = user?.avatarUrl || '';
        }

        return {
            id: docSnapshot.id,
            ...data,
            authorName,
            authorAvatar,
            // Convert Firestore Timestamp to a more client-friendly formatted string.
            createdAt: (data.createdAt as Timestamp)?.toDate ? (data.createdAt as Timestamp).toDate().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Just now',
        } as Comment;
    }));

    return commentList;
};
