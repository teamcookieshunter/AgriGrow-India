'use server';
/**
 * @fileOverview A simple flow that returns a greeting.
 *
 * - getGreeting - A function that returns a greeting based on language.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { getTranslations, type Locale } from '@/app/lib/translations';

const GreetingInputSchema = z.object({
    lang: z.string().default('en'),
});
export type GreetingInput = z.infer<typeof GreetingInputSchema>;

const GreetingOutputSchema = z.object({
  greeting: z.string(),
});
export type GreetingOutput = z.infer<typeof GreetingOutputSchema>;

export async function getGreeting(input: GreetingInput): Promise<GreetingOutput> {
  return greetingFlow(input);
}

const greetingFlow = ai.defineFlow(
  {
    name: 'greetingFlow',
    inputSchema: GreetingInputSchema,
    outputSchema: GreetingOutputSchema,
  },
  async ({ lang }) => {
    const t = getTranslations(lang as Locale);
    return { greeting: t.welcome };
  }
);
