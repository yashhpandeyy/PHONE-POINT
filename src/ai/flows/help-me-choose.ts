'use server';

/**
 * @fileOverview This file defines a Genkit flow for recommending a phone to a user based on their needs and budget.
 *
 * - helpMeChoose - A function that takes user preferences and returns a phone recommendation.
 * - HelpMeChooseInput - The input type for the helpMeChoose function.
 * - HelpMeChooseOutput - The return type for the helpMeChoose function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HelpMeChooseInputSchema = z.object({
  needs: z
    .string()
    .describe('Description of what the user needs in a phone.'),
  budget: z
    .string()
    .describe('The user\'s budget for the phone (e.g., $300, under $500).'),
});
export type HelpMeChooseInput = z.infer<typeof HelpMeChooseInputSchema>;

const HelpMeChooseOutputSchema = z.object({
  recommendedPhone: z
    .string()
    .describe('The name of the phone recommended to the user.'),
  reason: z
    .string()
    .describe('Explanation of why the phone is recommended for the user.'),
});
export type HelpMeChooseOutput = z.infer<typeof HelpMeChooseOutputSchema>;

export async function helpMeChoose(input: HelpMeChooseInput): Promise<HelpMeChooseOutput> {
  return helpMeChooseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'helpMeChoosePrompt',
  input: {schema: HelpMeChooseInputSchema},
  output: {schema: HelpMeChooseOutputSchema},
  prompt: `You are an expert in recommending refurbished phones. Based on the user\'s needs and budget, recommend one specific phone model.

User Needs: {{{needs}}}
User Budget: {{{budget}}}

Give the phone model name, and a reason for the recommendation.`,
});

const helpMeChooseFlow = ai.defineFlow(
  {
    name: 'helpMeChooseFlow',
    inputSchema: HelpMeChooseInputSchema,
    outputSchema: HelpMeChooseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
