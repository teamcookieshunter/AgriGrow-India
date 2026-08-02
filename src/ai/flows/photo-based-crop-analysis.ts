'use server';
/**
 * @fileOverview AI-powered crop health analysis flow.
 *
 * - analyzeCropHealth - A function that analyzes the health of a crop based on a photo.
 * - AnalyzeCropHealthInput - The input type for the analyzeCropHealth function.
 * - AnalyzeCropHealthOutput - The return type for the analyzeCropHealth function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeCropHealthInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a crop, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeCropHealthInput = z.infer<typeof AnalyzeCropHealthInputSchema>;

const AnalyzeCropHealthOutputSchema = z.object({
  healthAnalysis: z.string().describe('An analysis of the crop health based on the photo.'),
});
export type AnalyzeCropHealthOutput = z.infer<typeof AnalyzeCropHealthOutputSchema>;

export async function analyzeCropHealth(input: AnalyzeCropHealthInput): Promise<AnalyzeCropHealthOutput> {
  return analyzeCropHealthFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeCropHealthPrompt',
  input: {schema: AnalyzeCropHealthInputSchema},
  output: {schema: AnalyzeCropHealthOutputSchema},
  model: 'googleai/gemini-1.5-flash-latest',
  prompt: `You are AgriBot, an expert agricultural advisor and chatbot for farmers. Your primary function is to provide science-guided crop recommendations, answer farming-related questions, and give real-time market price information. You are part of the Government of Jharkhand's "Agri PS30" project. Respond in the same language as the user's query.

Analyze the health of the crop in the photo and provide a detailed analysis.

Photo: {{media url=photoDataUri}}`,
});

const analyzeCropHealthFlow = ai.defineFlow(
  {
    name: 'analyzeCropHealthFlow',
    inputSchema: AnalyzeCropHealthInputSchema,
    outputSchema: AnalyzeCropHealthOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
