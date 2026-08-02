'use server';
/**
 * @fileoverview This file defines tools for the Genkit AI flows.
 * These tools allow the AI to fetch real-world data like weather and market prices.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { marketData } from '@/app/(app)/market/data';
import { CurrentWeather, dailyForecast } from '@/app/(app)/dashboard/weather-data';


// Tool to get current weather and forecast
export const getWeather = ai.defineTool(
  {
    name: 'getWeather',
    description: 'Provides the current weather and a 7-day forecast for a given location.',
    inputSchema: z.object({
      location: z.string().describe('The city and state for the weather forecast.'),
    }),
    outputSchema: z.object({
      current: z.any().describe('The current weather conditions.'),
      forecast: z.array(z.any()).describe('The 7-day weather forecast.'),
    }),
  },
  async ({ location }) => {
    console.log(`Fetching weather for: ${location}`);
    // In a real application, you would call a weather API here.
    // For this example, we'll return static data.
    return {
      current: CurrentWeather,
      forecast: dailyForecast,
    };
  }
);


// Tool to get local market prices for crops
export const getMarketPrices = ai.defineTool(
  {
    name: 'getMarketPrices',
    description: 'Retrieves current market prices for various crops from local markets.',
    inputSchema: z.object({
      location: z.string().describe('The location to check for market prices.'),
    }),
    outputSchema: z.array(z.any()).describe('A list of crops and their current market prices.'),
  },
  async ({ location }) => {
    console.log(`Fetching market prices for: ${location}`);
    // In a real application, you would fetch this from a government API or other data source.
    // For this example, we'll return static data.
    return marketData;
  }
);
