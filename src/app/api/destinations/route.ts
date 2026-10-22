import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase, isMongoConfigured } from '@/lib/mongodb';
import DestinationModel from '@/models/Destination';
import { destinationsData } from '@/data/destinations';
import { DestinationInfo } from '@/types/travel';


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const featured = searchParams.get('featured');

    if (!isMongoConfigured()) {
      let filtered = [...destinationsData];
      if (type) filtered = filtered.filter((d) => d.type === type);
      if (featured === 'true') filtered = filtered.filter((d) => d.featured === true);
      return NextResponse.json({
        source: 'local-fallback',
        destinations: filtered,
      });
    }

    await connectToDatabase();

    const query: any = {};
    if (type) query.type = type;
    if (featured === 'true') query.featured = true;

    const mongoDestinations = await DestinationModel.find(query).sort({ startingPriceINR: 1 });

    if (mongoDestinations.length === 0) {
      return NextResponse.json({
        source: 'local-fallback',
        destinations: destinationsData,
      });
    }

    const transformed: DestinationInfo[] = mongoDestinations.map(
      (doc) => doc.toJSON() as DestinationInfo
    );

    return NextResponse.json({
      source: 'mongodb',
      destinations: transformed,
    });
  } catch (error: any) {
    console.error('Error fetching destinations:', error);
    return NextResponse.json({
      source: 'local-fallback',
      destinations: destinationsData,
      error: error?.message,
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name || !body.stateOrCountry || !body.type) {
      return NextResponse.json(
        { error: 'Missing required destination fields: name, stateOrCountry, type' },
        { status: 400 }
      );
    }

    if (!body.slug) {
      body.slug = body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }

    if (!isMongoConfigured()) {
      return NextResponse.json({
        saved: true,
        source: 'local-only',
        destination: body,
      });
    }

    await connectToDatabase();

    const updated = await DestinationModel.findOneAndUpdate(
      { slug: body.slug },
      { $set: body },
      { new: true, upsert: true, runValidators: true }
    );

    return NextResponse.json({
      saved: true,
      source: 'mongodb',
      destination: updated.toJSON(),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
