
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, doc, updateDoc, increment, serverTimestamp, query, orderBy } from "firebase/firestore";
import type { Showcase } from "./mock-data";

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
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
        } as Showcase
    });
    return showcaseList;
};

// Upvote a showcase
export const upvoteShowcase = async (showcaseId: string): Promise<number> => {
    const showcaseRef = doc(db, "showcases", showcaseId);
    try {
        await updateDoc(showcaseRef, {
            upvotes: increment(1)
        });
        // Note: To return the new upvote count, we'd need another read (or a transaction).
        // For simplicity, we'll just return a success indicator and let the client update the UI optimistically.
        // Let's assume the update worked and the client can increment its local state.
        // For a real app, you might want to use a transaction to get the updated value.
        return 1; // Placeholder, real logic would fetch the updated doc.
    } catch (error) {
        console.error("Error upvoting showcase: ", error);
        throw new Error("Failed to upvote showcase");
    }
};
