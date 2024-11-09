import { NextResponse } from 'next/server';
import { getWeatherData } from '@/lib/weather';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log('Received request body:', body);
        
        if (!body?.location) {
            console.log('Location missing from body:', body);
            return NextResponse.json(
                { error: 'Location is required' },
                { status: 400 }
            );
        }

        console.log('Attempting to get weather for location:', body.location);
        const weather = await getWeatherData(body.location);
        return NextResponse.json({ weather });
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Unknown error occurred' },
            { status: error instanceof Error && error.message.includes('not found') ? 404 : 500 }
        );
    }
}
