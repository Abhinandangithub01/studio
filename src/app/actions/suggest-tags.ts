"use server";

import { suggestPostTags, SuggestPostTagsInput } from "@/ai/flows/suggest-post-tags";

export async function getTagSuggestions(
  input: SuggestPostTagsInput
): Promise<string[] | null> {
  try {
    const result = await suggestPostTags(input);
    return result.tags;
  } catch (error) {
    console.error("Error suggesting tags:", error);
    // In a real app, you might want to return a more specific error
    return null;
  }
}
