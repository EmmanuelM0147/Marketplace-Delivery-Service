import { OpenAIStream, StreamingTextResponse } from 'ai';
import { Configuration, OpenAIApi } from 'openai-edge';
import { supabase } from '@/lib/supabase/client';
import { kv } from '@vercel/kv';

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

export const runtime = 'edge';

const systemPrompt = `You are an agricultural expert assistant for Gardenia Marketplace. Your role is to:
- Provide product recommendations based on crop type, soil conditions, and climate
- Share real-time market prices for agricultural commodities
- Help with ordering seeds, fertilizers, and farming equipment
- Provide weather-based cultivation advice
- Assist in multiple languages including English, Yoruba, Hausa, Igbo, and Pidgin English
- Share pest control and disease management solutions

Always be concise, practical, and farmer-friendly in your responses.`;

export async function POST(req: Request) {
  const { messages, language = 'en' } = await req.json();

  const response = await openai.createChatCompletion({
    model: 'gpt-4',
    stream: true,
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages,
    ],
    temperature: 0.7,
    max_tokens: 500,
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}