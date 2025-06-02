import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getServerSession } from 'next-auth';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { prompt, mode } = await req.json();

    let systemPrompt = '';
    switch (mode) {
      case 'reply':
        systemPrompt = 'You are an email assistant. Generate a professional and concise email reply.';
        break;
      case 'compose':
        systemPrompt = 'You are an email assistant. Generate a professional email based on the given points.';
        break;
      case 'summarize':
        systemPrompt = 'You are an email assistant. Summarize the given email content concisely.';
        break;
      default:
        systemPrompt = 'You are an email assistant. Help with the given task.';
    }

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      return NextResponse.json({ 
        response: completion.choices[0].message.content 
      });
    } catch (openaiError: any) {
      console.error('OpenAI API Error:', openaiError);
      
      // Handle specific OpenAI errors
      if (openaiError.code === 'insufficient_quota') {
        return NextResponse.json(
          { error: 'API quota exceeded. Please check your billing status.' },
          { status: 429 }
        );
      }
      
      if (openaiError.code === 'invalid_api_key') {
        return NextResponse.json(
          { error: 'Invalid API key. Please check your configuration.' },
          { status: 401 }
        );
      }

      return NextResponse.json(
        { error: 'Failed to process request with OpenAI' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Server Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 