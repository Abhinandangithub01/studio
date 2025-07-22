'use server';

/**
 * @fileOverview Provides AI-powered tag suggestions for user posts to improve content categorization and discoverability.
 *
 * - suggestPostTags - A function that suggests relevant tags for a given post.
 * - SuggestPostTagsInput - The input type for the suggestPostTags function.
 * - SuggestPostTagsOutput - The return type for the suggestPostTags function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestPostTagsInputSchema = z.object({
  postContent: z.string().describe('The content of the post for which tags are to be suggested.'),
});

export type SuggestPostTagsInput = z.infer<typeof SuggestPostTagsInputSchema>;

const SuggestPostTagsOutputSchema = z.object({
  tags: z.array(z.string()).describe('An array of suggested tags for the post.'),
});

export type SuggestPostTagsOutput = z.infer<typeof SuggestPostTagsOutputSchema>;

export async function suggestPostTags(input: SuggestPostTagsInput): Promise<SuggestPostTagsOutput> {
  return suggestPostTagsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestPostTagsPrompt',
  input: {schema: SuggestPostTagsInputSchema},
  output: {schema: SuggestPostTagsOutputSchema},
  prompt: `You are an expert in content categorization. Given the following post content, suggest a list of tags that would be relevant for the post. The tags should be concise and relevant to the content.

Post Content: {{{postContent}}}

Tags:`,
});

const suggestPostTagsFlow = ai.defineFlow(
  {
    name: 'suggestPostTagsFlow',
    inputSchema: SuggestPostTagsInputSchema,
    outputSchema: SuggestPostTagsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
