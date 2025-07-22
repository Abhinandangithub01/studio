
'use server';

import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp, Timestamp, where, doc, getDoc, updateDoc, increment } from "firebase/firestore";
import type { Comment } from "./types";
import { getUserProfile } from "./user-service";

type CommentInput = {
    postId: string;
    userId: string;
    content: string;
};

export const createComment = async (commentData: CommentInput) => {
    try {
        const user = await getUserProfile(commentData.userId);

        await addDoc(collection(db, `posts/${commentData.postId}/comments`), {
            ...commentData,
            authorName: user?.name || 'Anonymous',
            authorAvatar: user?.avatarUrl || '',
            createdAt: serverTimestamp(),
        });
        
        // Increment commentsCount on the post
        const postRef = doc(db, "posts", commentData.postId);
        await updateDoc(postRef, {
            commentsCount: increment(1)
        });

    } catch (error) {
        console.error("Error adding comment: ", error);
        throw new Error("Failed to create comment");
    }
};

export const getComments = async (postId: string): Promise<Comment[]> => {
    const commentsCol = collection(db, `posts/${postId}/comments`);
    const q = query(commentsCol, orderBy("createdAt", "asc"));
    const commentSnapshot = await getDocs(q);
    
    const commentList = await Promise.all(commentSnapshot.docs.map(async (docSnapshot) => {
        const data = docSnapshot.data();
        
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
            createdAt: (data.createdAt as Timestamp)?.toDate ? (data.createdAt as Timestamp).toDate().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Just now',
        } as Comment;
    }));

    return commentList;
};
