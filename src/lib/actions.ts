'use server';

import {
  getAIProjectGuidance,
  type AIProjectGuidanceInput,
  type AIProjectGuidanceOutput,
} from '@/ai/flows/ai-project-guidance';
import {
  analyzeCropHealth,
  type AnalyzeCropHealthInput,
  type AnalyzeCropHealthOutput,
} from '@/ai/flows/photo-based-crop-analysis';
import { 
  agriBotChat, 
  type AgriBotChatInput, 
  type AgriBotChatOutput 
} from '@/ai/flows/agribot-chat-flow';
import { 
  getGreeting as getGreetingFlow,
  type GreetingInput,
  type GreetingOutput,
} from '@/ai/flows/greeting-flow';
import { z } from 'zod';

const projectGuidanceSchema = z.object({
  soilType: z.string().min(1, "Soil type is required."),
  landSize: z.string().min(1, "Land size is required."),
  lastCrop: z.string().min(1, "Last crop is required."),
  lastUsedFertilizers: z.string().optional(),
  location: z.string().min(1, "Location is required."),
  cropChoice: z.string(),
});

// Wrapper for AI Project Guidance
export async function getGuidance(
  input: AIProjectGuidanceInput
): Promise<{ success: boolean; data: AIProjectGuidanceOutput | { fallbackMessage: string } }> {
  const validation = projectGuidanceSchema.safeParse(input);
  if (!validation.success) {
    const errorMessage = "Validation failed: " + validation.error.errors.map(e => e.message).join(', ');
    console.error(errorMessage);
    return { success: false, data: { fallbackMessage: errorMessage } };
  }

  try {
    const result = await getAIProjectGuidance(input);
    console.log("Response:", result);

    if (result.fallbackMessage) {
      console.error("AI Flow returned a fallback message:", result.fallbackMessage);
      return { success: false, data: { fallbackMessage: result.fallbackMessage } };
    }
    
    if (input.cropChoice === 'suggest' && !result.suggestion) {
        const fallbackMessage = "The AI failed to return a valid suggestion. Please try again.";
        console.error(fallbackMessage, "Raw output:", result);
        return { success: false, data: { fallbackMessage } };
    }

    if (input.cropChoice !== 'suggest' && !result.plan) {
        const fallbackMessage = "The AI failed to return a valid plan. Please try again.";
        console.error(fallbackMessage, "Raw output:", result);
        return { success: false, data: { fallbackMessage } };
    }

    return { success: true, data: result };
  } catch (error: any) {
    const errorMessage = error.response?.data || error.message;
    console.error("Error:", errorMessage);
    return { success: false, data: { fallbackMessage: `An unexpected error occurred: ${errorMessage}` } };
  }
}


// Wrapper for Crop Health Analysis
export async function getCropAnalysis(
  input: AnalyzeCropHealthInput
): Promise<AnalyzeCropHealthOutput> {
  // The data URI comes from the client, just pass it through.
  // Add validation if needed.
  return analyzeCropHealth(input);
}


// Wrapper for AgriBot Chat
export async function sendMessageToAgriBot(
  input: AgriBotChatInput
): Promise<{ success: boolean; data: AgriBotChatOutput | { fallbackMessage: string } }> {
  // Add validation if needed
  try {
    const result = await agriBotChat(input);
    if (result.fallbackMessage) {
      return { success: false, data: { fallbackMessage: result.fallbackMessage } };
    }
    return { success: true, data: result };
  } catch (error: any) {
    const errorMessage = error.message || "An unexpected error occurred.";
    return { success: false, data: { fallbackMessage: errorMessage } };
  }
}


// Wrapper for Greeting Flow
export async function getGreeting(input: GreetingInput): Promise<GreetingOutput> {
  return getGreetingFlow(input);
}
