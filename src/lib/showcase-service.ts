
'use server';

/**
 * @fileoverview This file contains server-side functions for managing 'showcases' in Firestore.
 * Showcases are user-submitted products or projects. Functions include creation, fetching, and upvoting.
 */

import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, doc, updateDoc, increment, serverTimestamp, query, orderBy, where, getDoc } from "firebase/firestore";
import type { Showcase } from "./types";
import { Timestamp } from "firebase/firestore";

// Defines the shape of the data needed to create a new showcase.
type ShowcaseInput = Omit<Showcase, "id" | "upvotes" | "createdAt">;

/**
 * Creates a new showcase document in the 'showcases' collection.
 * @param showcaseData The data for the new showcase.
 * @returns A promise that resolves when the showcase is successfully created.
 */
export const createShowcase = async (showcaseData: ShowcaseInput) => {
    try {
        await addDoc(collection(db, "showcases"), {
            ...showcaseData,
            upvotes: 0,
            createdAt: serverTimestamp(),
        });
    } catch (error) {
        console.error("Error adding showcase document: ", error);
        throw new Error("Failed to create showcase");
    }
};

/**
 * Fetches all showcases from the database, ordered by creation date.
 * @returns A promise that resolves to an array of Showcase objects.
 */
export const getShowcases = async (): Promise<Showcase[]> => {
    const showcasesCol = collection(db, "showcases");
    const q = query(showcasesCol, orderBy("createdAt", "desc"));
    const showcaseSnapshot = await getDocs(q);
    const showcaseList = showcaseSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            // Convert Firestore Timestamp to a serializable ISO string for client-side use.
            createdAt: (data.createdAt as Timestamp)?.toDate ? (data.createdAt as Timestamp).toISOString() : new Date().toISOString(),
        } as Showcase
    });
    return showcaseList;
};

/**
 * Fetches all showcases created by a specific user.
 * @param userId The ID of the user whose showcases to fetch.
 * @returns A promise that resolves to an array of Showcase objects.
 */
export const getShowcasesByUserId = async(userId: string): Promise<Showcase[]> => {
    const showcasesCol = collection(db, "showcases");
    const q = query(showcasesCol, where("userId", "==", userId), orderBy("createdAt", "desc"));
    const showcaseSnapshot = await getDocs(q);
    const showcaseList = showcaseSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            createdAt: (data.createdAt as Timestamp)?.toDate ? (data.createdAt as Timestamp).toISOString() : new Date().toISOString(),
        } as Showcase
    });
    return showcaseList;
}

/**
 * Increments the upvote count for a specific showcase.
 * @param showcaseId The ID of the showcase to upvote.
 * @returns A promise that resolves to the new upvote count.
 */
export const upvoteShowcase = async (showcaseId: string): Promise<number> => {
    const showcaseRef = doc(db, "showcases", showcaseId);
    try {
        // This operation is not transactional, meaning the returned count might be slightly
        // off in high-concurrency scenarios. For this app's scale, it's an acceptable trade-off.
        const showcaseSnap = await getDoc(showcaseRef);
        const currentUpvotes = showcaseSnap.data()?.upvotes || 0;
        
        // Use Firestore's atomic increment operation.
        await updateDoc(showcaseRef, {
            upvotes: increment(1)
        });
        
        return currentUpvotes + 1;
    } catch (error) {
        console.error("Error upvoting showcase: ", error);
        throw new Error("Failed to upvote showcase");
    }
};
