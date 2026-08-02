'use server';
/**
 * @fileOverview An AI flow to generate weather-based farming suggestions.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { CurrentWeather, Forecast } from '@/app/(app)/dashboard/weather-data';

const WeatherInputSchema = z.object({
  current: z.any().describe('The current weather conditions.'),
  forecast: z.array(z.any()).describe('The 7-day weather forecast.'),
});
export type WeatherInput = z.infer<typeof WeatherInputSchema>;

const WeatherSuggestionOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('A list of 2-3 concise, actionable farming suggestions based on the weather.'),
  fallbackMessage: z.string().optional().describe("A message to send if suggestions can't be generated."),
});
export type WeatherSuggestionOutput = z.infer<typeof WeatherSuggestionOutputSchema>;

export async function getWeatherSuggestions(input: WeatherInput): Promise<WeatherSuggestionOutput> {
  return weatherSuggestionFlow(input);
}

const prompt = ai.definePrompt({
    name: 'weatherSuggestionPrompt',
    input: { schema: WeatherInputSchema },
    output: { schema: WeatherSuggestionOutputSchema },
    model: 'googleai/gemini-1.5-flash-latest',
    prompt: `You are AgriBot, an expert agricultural advisor. Based on the following weather data, provide 2-3 concise and actionable suggestions for a farmer in India. Focus on activities like planting, irrigation, harvesting, and pest control.

    Current Weather:
    - Condition: {{current.condition}}
    - Temperature: {{current.temp}}°C
    - Humidity: {{current.humidity}}%

    7-Day Forecast:
    {{#each forecast}}
    - {{day}}: {{temp}}°C, {{condition}}
    {{/each}}

    Provide your suggestions in the 'suggestions' field.
    `,
});

const weatherSuggestionFlow = ai.defineFlow(
  {
    name: 'weatherSuggestionFlow',
    inputSchema: WeatherInputSchema,
    outputSchema: WeatherSuggestionOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
