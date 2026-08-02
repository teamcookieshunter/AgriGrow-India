import { config } from 'dotenv';
config();

import '@/ai/flows/ai-project-guidance.ts';
import '@/ai/flows/photo-based-crop-analysis.ts';
import '@/ai/flows/greeting-flow.ts';
import '@/ai/flows/agribot-chat-flow.ts';
import '@/ai/flows/weather-suggestion-flow.ts';
import '@/ai/tools.ts';
