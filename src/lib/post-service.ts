
'use server';

import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, doc, getDoc, query, orderBy, serverTimestamp, Timestamp, limit, where, documentId } from "firebase/firestore";
import type { Post } from "./mock-data";
import { getUserProfile, getFollowingIds } from "./user-service";

type PostInput = Omit<Post, "id" | "createdAt" | "views" | "reactions" | "commentsCount">;

export const createPost = async (postData: PostInput) => {
    try {
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

export const getPosts = async (): Promise<Post[]> => {
    const postsCol = collection(db, "posts");
    const q = query(postsCol, orderBy("createdAt", "desc"));
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
};

export const getPostsFromFollowing = async(userId: string): Promise<Post[]> => {
    const followingIds = await getFollowingIds(userId);
    if (followingIds.length === 0) {
        return [];
    }

    const postsCol = collection(db, "posts");
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

export const getPost = async (postId: string): Promise<Post | null> => {
    try {
        const postRef = doc(db, "posts", postId);
        const postSnap = await getDoc(postRef);

        if (postSnap.exists()) {
            const data = postSnap.data();
            const user = await getUserProfile(data.userId);
            return {
                id: postSnap.id,
                ...data,
                authorName: user?.name,
                authorAvatar: user?.avatarUrl,
                createdAt: (data.createdAt as Timestamp)?.toDate ? (data.createdAt as Timestamp).toDate().toLocaleDateString() : 'Just now',
            } as Post;
        } else {
            console.log("No such document!");
            return null;
        }
    } catch (error) {
        console.error("Error getting post:", error);
        return null;
    }
}

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
