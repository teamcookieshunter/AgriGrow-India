'use server';
/**
 * @fileOverview A conversational chat flow for AgriBot.
 */

import { ai } from '@/ai/genkit';
import { getWeather, getMarketPrices } from '@/ai/tools';
import { z } from 'zod';

const MessageSchema = z.object({
    role: z.enum(['user', 'bot']),
    content: z.string(),
});

const AgriBotChatInputSchema = z.object({
  history: z.array(MessageSchema).describe('The conversation history.'),
  prompt: z.string().describe("The user's latest message."),
});
export type AgriBotChatInput = z.infer<typeof AgriBotChatInputSchema>;

const AgriBotChatOutputSchema = z.object({
  response: z.string().describe("AgriBot's response to the user."),
  fallbackMessage: z.string().optional().describe("A message to send to the user if the request cannot be fulfilled."),
});
export type AgriBotChatOutput = z.infer<typeof AgriBotChatOutputSchema>;


export async function agriBotChat(input: AgriBotChatInput): Promise<AgriBotChatOutput> {
  return agriBotChatFlow(input);
}

const prompt = ai.definePrompt({
    name: 'agriBotChatPrompt',
    input: { schema: AgriBotChatInputSchema },
    output: { schema: AgriBotChatOutputSchema },
    model: 'googleai/gemini-1.5-flash-latest',
    tools: [getWeather, getMarketPrices],
    prompt: `You are AgriBot, an expert agricultural advisor and chatbot for farmers. Your primary function is to provide science-guided crop recommendations, answer farming-related questions, and give real-time market price information. You are part of the Government of Jharkhand's "Agri PS30" project. Respond in the same language as the user's query.

    Keep your responses concise and conversational. Use the tools available to you to answer questions about weather and market prices.

    Conversation History:
    {{#each history}}
    - {{role}}: {{content}}
    {{/each}}
    
    Current Question: {{{prompt}}}
    
    Your Response:
    `,
});

const agriBotChatFlow = ai.defineFlow(
  {
    name: 'agriBotChatFlow',
    inputSchema: AgriBotChatInputSchema,
    outputSchema: AgriBotChatOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
