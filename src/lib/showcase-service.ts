
'use server';

import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, doc, updateDoc, increment, serverTimestamp, query, orderBy, where } from "firebase/firestore";
import type { Showcase } from "./types";
import { Timestamp } from "firebase/firestore";

type ShowcaseInput = Omit<Showcase, "id" | "upvotes" | "createdAt">;

// Create a new showcase
export const createShowcase = async (showcaseData: ShowcaseInput) => {
    try {
        await addDoc(collection(db, "showcases"), {
            ...showcaseData,
            upvotes: 0,
            createdAt: serverTimestamp(),
        });
    } catch (error) {
        console.error("Error adding document: ", error);
        throw new Error("Failed to create showcase");
    }
};

// Get all showcases
export const getShowcases = async (): Promise<Showcase[]> => {
    const showcasesCol = collection(db, "showcases");
    const q = query(showcasesCol, orderBy("createdAt", "desc"));
    const showcaseSnapshot = await getDocs(q);
    const showcaseList = showcaseSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            // Convert Firestore Timestamp to a serializable format if necessary
            createdAt: (data.createdAt as Timestamp)?.toDate ? (data.createdAt as Timestamp).toDate().toISOString() : new Date().toISOString(),
        } as Showcase
    });
    return showcaseList;
};

// Get showcases by user
export const getShowcasesByUserId = async(userId: string): Promise<Showcase[]> => {
    const showcasesCol = collection(db, "showcases");
    const q = query(showcasesCol, where("userId", "==", userId), orderBy("createdAt", "desc"));
    const showcaseSnapshot = await getDocs(q);
    const showcaseList = showcaseSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            createdAt: (data.createdAt as Timestamp)?.toDate ? (data.createdAt as Timestamp).toDate().toISOString() : new Date().toISOString(),
        } as Showcase
    });
    return showcaseList;
}

// Upvote a showcase
export const upvoteShowcase = async (showcaseId: string): Promise<number> => {
    const showcaseRef = doc(db, "showcases", showcaseId);
    try {
        // This is not transactional, so the returned value might be slightly off in high-concurrency scenarios.
        // For this app, it's an acceptable trade-off for simplicity.
        const showcaseSnap = await getDoc(showcaseRef);
        const currentUpvotes = showcaseSnap.data()?.upvotes || 0;
        
        await updateDoc(showcaseRef, {
            upvotes: increment(1)
        });
        
        return currentUpvotes + 1;
    } catch (error) {
        console.error("Error upvoting showcase: ", error);
        throw new Error("Failed to upvote showcase");
    }
};
