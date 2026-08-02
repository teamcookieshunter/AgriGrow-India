
'use server';
/**
 * @fileOverview AI-powered project guidance flow for farmers.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getWeather, getMarketPrices } from '@/ai/tools';

const AIProjectGuidanceInputSchema = z.object({
  soilType: z.string().describe('The type of soil.'),
  landSize: z.string().describe('The size of the land in acres.'),
  lastCrop: z.string().describe('The crop that was previously grown.'),
  lastUsedFertilizers: z.string().optional().describe('The fertilizers used for the last crop (optional).'),
  location: z.string().describe('The location of the farm (e.g., area, city/village, state).'),
  cropChoice: z.string().describe("The crop choice from the user. If 'suggest', the AI should suggest a crop. Otherwise, this is the name of the crop the user has chosen."),
});
export type AIProjectGuidanceInput = z.infer<typeof AIProjectGuidanceInputSchema>;

const SuggestionSchema = z.object({
  cropName: z.string().describe("The name of the suggested crop."),
  reason: z.string().describe("A brief, farmer-friendly reason for suggesting this crop for highest yield and land health."),
  alternativeCrops: z.array(z.string()).describe("2–3 alternative crop suggestions suitable for the area."),
});

const PlanStepSchema = z.object({
    title: z.string().describe("The title of the farming step (e.g., 'Ploughing', 'Sowing Seeds')."),
    guidance: z.string().describe("Detailed guidance and plan for this specific process."),
});

const PotentialRiskSchema = z.object({
    name: z.string().describe("The name of the disease or pest."),
    description: z.string().describe("A one-line description of the risk."),
});

const PlanSchema = z.object({
    growthDuration: z.string().describe("The estimated time from sowing to harvesting (e.g., '3-4 months')."),
    harvestingPeriod: z.string().describe("The ideal time of year or season for harvesting (e.g., 'September-October')."),
    benefits: z.string().describe("A brief explanation of the crop's benefits for the land or the farmer."),
    steps: z.array(PlanStepSchema).describe("A list of all essential farming processes, broken down into clear steps like ploughing, sowing, fertilization, irrigation, and nourishment."),
    potentialRisks: z.array(PotentialRiskSchema).describe("A list of potential diseases or pests that could harm the plant growth. Provide a name and a one-line description for each."),
});

const AIProjectGuidanceOutputSchema = z.object({
    suggestion: SuggestionSchema.nullable(),
    plan: PlanSchema.nullable(),
    fallbackMessage: z.string().nullable().describe("A message to send to the user if the request cannot be fulfilled."),
});
export type AIProjectGuidanceOutput = z.infer<typeof AIProjectGuidanceOutputSchema>;

export async function getAIProjectGuidance(input: AIProjectGuidanceInput): Promise<AIProjectGuidanceOutput> {
  console.log("AI Flow Input:", input);
  return aiProjectGuildanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiProjectGuidancePrompt',
  input: { schema: AIProjectGuidanceInputSchema },
  output: { schema: AIProjectGuidanceOutputSchema },
  model: 'googleai/gemini-1.5-flash-latest',
  tools: [getWeather, getMarketPrices],
  prompt: `You are AgriBot, an expert agricultural advisor for Indian farmers. Your goal is to provide science-guided crop recommendations for the highest yield and best land health, followed by a comprehensive, step-by-step farming plan.

  The user has provided the following details:
  - Soil Type: {{{soilType}}}
  - Land Size: {{{landSize}}} acres
  - Last Crop Grown: {{{lastCrop}}}
  - Fertilizers Used Previously (Optional): {{{lastUsedFertilizers}}}
  - Location: {{{location}}}

  The user wants you to do the following: {{{cropChoice}}}

  Follow these instructions carefully:
  1.  If the user's crop choice is 'suggest', you MUST provide a crop suggestion.
      -   Analyze the climate and weather for the 'location' using your tools.
      -   Base your suggestion on soil, location, climate, weather, and previous crop for the highest possible yield and to improve land health.
      -   Provide one primary crop suggestion, a short reason, and 2-3 suitable alternative crops.
      -   Do NOT generate a plan. Set the 'plan' field to null.

  2.  If the user provides a specific crop name as their cropChoice, you MUST generate a detailed, templated farming plan.
      -   Use your tools to fetch relevant weather data for the plan.
      -   Create a comprehensive plan that includes: 'growthDuration', 'harvestingPeriod', 'benefits', 'steps', and 'potentialRisks'.
      -   The 'steps' array MUST include guidance for: Ploughing, Sowing Seeds, Fertilization Process, Irrigation, and Nourishment.
      -   For the 'potentialRisks', provide a list of potential diseases or pests. For each item in the list, provide a 'name' and a one-line 'description'.
      -   For each step, provide a clear 'title' and detailed 'guidance'.
      -   For custom crops where benefits aren't known, set 'benefits' to 'Benefits for land not specified for custom crops.'.
      -   Do NOT generate a suggestion. Set the 'suggestion' field to null.
  
  3.  If you cannot fulfill the request, explain why in the 'fallbackMessage' field.
  `,
});

const aiProjectGuildanceFlow = ai.defineFlow(
  {
    name: 'aiProjectGuildanceFlow',
    inputSchema: AIProjectGuidanceInputSchema,
    outputSchema: AIProjectGuidanceOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
