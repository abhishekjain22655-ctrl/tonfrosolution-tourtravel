import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase, isMongoConfigured } from '@/lib/mongodb';
import PackageModel from '@/models/Package';
import { packagesData } from '@/data/packages';
import { TravelPackage } from '@/types/travel';


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const destinationType = searchParams.get('destinationType');
    const featured = searchParams.get('featured');

    if (!isMongoConfigured()) {
      let filtered = [...packagesData];
      if (status) filtered = filtered.filter((p) => p.status === status);
      if (destinationType) filtered = filtered.filter((p) => p.destinationType === destinationType);
      if (featured === 'true') filtered = filtered.filter((p) => p.featured === true);
      return NextResponse.json({
        source: 'local-fallback',
        packages: filtered,
      });
    }

    await connectToDatabase();

    const query: any = {};
    if (status && status !== 'all') query.status = status;
    if (destinationType) query.destinationType = destinationType;
    if (featured === 'true') query.featured = true;

    const mongoPackages = await PackageModel.find(query).sort({ createdAt: -1 });

    // If MongoDB has zero packages yet, return fallback packages so site is immediately populated
    if (mongoPackages.length === 0 && !status) {
      return NextResponse.json({
        source: 'local-fallback',
        packages: packagesData,
      });
    }

    const transformed: TravelPackage[] = mongoPackages.map((doc) => doc.toJSON() as TravelPackage);

    return NextResponse.json({
      source: 'mongodb',
      packages: transformed,
    });
  } catch (error: any) {
    console.error('Error fetching packages from MongoDB:', error);
    return NextResponse.json({
      source: 'local-fallback',
      packages: packagesData,
      error: error?.message,
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.title || !body.destinationName || !body.startingPriceINR) {
      return NextResponse.json(
        { error: 'Missing required fields: title, destinationName, startingPriceINR' },
        { status: 400 }
      );
    }

    // Generate slug if missing
    if (!body.slug) {
      body.slug = body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }

    if (!isMongoConfigured()) {
      return NextResponse.json({
        saved: true,
        source: 'local-only',
        package: body,
        message: 'MongoDB is not configured. Saved in local session.',
      });
    }

    await connectToDatabase();

    // Upsert package by slug
    const updated = await PackageModel.findOneAndUpdate(
      { slug: body.slug },
      { $set: body },
      { new: true, upsert: true, runValidators: true }
    );

    return NextResponse.json({
      saved: true,
      source: 'mongodb',
      package: updated.toJSON(),
    });
  } catch (error: any) {
    console.error('Error saving package to MongoDB:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to save package' },
      { status: 500 }
    );
  }
}
