'use server';
/**
 * @fileOverview Generates personalized weather tips based on current weather conditions.
 *
 * - generateWeatherTip - A function that generates personalized weather tips.
 * - GenerateWeatherTipInput - The input type for the generateWeatherTip function.
 * - GenerateWeatherTipOutput - The return type for the generateWeatherTip function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';
import {Weather} from '@/services/weather';

const GenerateWeatherTipInputSchema = z.object({
  weather: z.object({
    temperatureCelsius: z.number().describe('The temperature in Celsius.'),
    humidity: z.number().describe('The humidity percentage.'),
    windSpeed: z.number().describe('The wind speed in km/h.'),
    conditions: z.string().describe('The weather conditions (e.g., Sunny, Cloudy, Rainy).'),
  }).describe('The current weather conditions.'),
});
export type GenerateWeatherTipInput = z.infer<typeof GenerateWeatherTipInputSchema>;

const GenerateWeatherTipOutputSchema = z.object({
  tip: z.string().describe('A personalized weather tip based on the current conditions.'),
});
export type GenerateWeatherTipOutput = z.infer<typeof GenerateWeatherTipOutputSchema>;

export async function generateWeatherTip(input: GenerateWeatherTipInput): Promise<GenerateWeatherTipOutput> {
  return generateWeatherTipFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateWeatherTipPrompt',
  input: {
    schema: z.object({
      weather: z.object({
        temperatureCelsius: z.number().describe('The temperature in Celsius.'),
        humidity: z.number().describe('The humidity percentage.'),
        windSpeed: z.number().describe('The wind speed in km/h.'),
        conditions: z.string().describe('The weather conditions (e.g., Sunny, Cloudy, Rainy).'),
      }).describe('The current weather conditions.'),
    }),
  },
  output: {
    schema: z.object({
      tip: z.string().describe('A personalized weather tip based on the current conditions.'),
    }),
  },
  prompt: `You are a helpful weather assistant. Generate a short, personalized weather tip based on the current weather conditions.  The tip should be no more than one sentence.

Current Weather Conditions:
Temperature: {{{weather.temperatureCelsius}}}°C
Humidity: {{{weather.humidity}}}%
Wind Speed: {{{weather.windSpeed}}} km/h
Conditions: {{{weather.conditions}}}

Tip: `,
});

const generateWeatherTipFlow = ai.defineFlow<
  typeof GenerateWeatherTipInputSchema,
  typeof GenerateWeatherTipOutputSchema
>(
  {
    name: 'generateWeatherTipFlow',
    inputSchema: GenerateWeatherTipInputSchema,
    outputSchema: GenerateWeatherTipOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
