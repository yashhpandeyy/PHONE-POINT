'use server';
/**
 * @fileOverview An AI agent that provides personalized phone recommendations based on user preferences.
 *
 * - getPersonalizedPhoneRecommendations - A function that generates personalized phone recommendations.
 * - PersonalizedPhoneRecommendationsInput - The input type for the getPersonalizedPhoneRecommendations function.
 * - PersonalizedPhoneRecommendationsOutput - The return type for the getPersonalizedPhoneRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedPhoneRecommendationsInputSchema = z.object({
  browsingHistory: z
    .string()
    .describe('A summary of the user browsing history on the phone store.'),
  preferences: z
    .string()
    .describe('The user preferences in terms of phone features, brands, and price range.'),
});
export type PersonalizedPhoneRecommendationsInput = z.infer<
  typeof PersonalizedPhoneRecommendationsInputSchema
>;

const PersonalizedPhoneRecommendationsOutputSchema = z.object({
  recommendations: z
    .string()
    .describe(
      'A list of phone recommendations tailored to the user browsing history and preferences.'
    ),
});
export type PersonalizedPhoneRecommendationsOutput = z.infer<
  typeof PersonalizedPhoneRecommendationsOutputSchema
>;

export async function getPersonalizedPhoneRecommendations(
  input: PersonalizedPhoneRecommendationsInput
): Promise<PersonalizedPhoneRecommendationsOutput> {
  return personalizedPhoneRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedPhoneRecommendationsPrompt',
  input: {schema: PersonalizedPhoneRecommendationsInputSchema},
  output: {schema: PersonalizedPhoneRecommendationsOutputSchema},
  prompt: `You are an expert in recommending phones based on user history and stated preferences.

  Based on the user's browsing history: {{{browsingHistory}}} and preferences: {{{preferences}}},
  recommend a list of phones that would be suitable for them. Explain why each phone is a good fit.
  Keep the list to a maximum of 5 phones.
  Be concise.`,
});

const personalizedPhoneRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedPhoneRecommendationsFlow',
    inputSchema: PersonalizedPhoneRecommendationsInputSchema,
    outputSchema: PersonalizedPhoneRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
