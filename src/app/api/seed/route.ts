import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase, isMongoConfigured } from '@/lib/mongodb';
import PackageModel from '@/models/Package';
import DestinationModel from '@/models/Destination';
import { packagesData } from '@/data/packages';
import { destinationsData } from '@/data/destinations';


export async function POST(request: NextRequest) {
  try {
    if (!isMongoConfigured()) {
      return NextResponse.json(
        {
          success: false,
          message: 'MONGODB_URI is not set in environment variables. Please add your connection string to .env.local first.',
        },
        { status: 400 }
      );
    }

    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json(
        { success: false, message: 'Could not connect to MongoDB cluster.' },
        { status: 500 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const shouldOverwrite = body.overwrite === true;

    if (shouldOverwrite) {
      await Promise.all([
        PackageModel.deleteMany({}),
        DestinationModel.deleteMany({}),
      ]);
    }

    // Upsert packages
    const packageOps = packagesData.map((pkg) => {
      // Exclude string ID so MongoDB assigns ObjectId or keeps schema consistent
      const { id, ...pkgWithoutId } = pkg;
      return PackageModel.findOneAndUpdate(
        { slug: pkg.slug },
        { $set: pkgWithoutId },
        { upsert: true, new: true }
      );
    });

    // Upsert destinations
    const destinationOps = destinationsData.map((dest) => {
      const { id, ...destWithoutId } = dest;
      return DestinationModel.findOneAndUpdate(
        { slug: dest.slug },
        { $set: destWithoutId },
        { upsert: true, new: true }
      );
    });

    await Promise.all([...packageOps, ...destinationOps]);

    const [packageCount, destinationCount] = await Promise.all([
      PackageModel.countDocuments(),
      DestinationModel.countDocuments(),
    ]);

    return NextResponse.json({
      success: true,
      message: `Database successfully seeded with ${packageCount} packages and ${destinationCount} destinations!`,
      counts: {
        packages: packageCount,
        destinations: destinationCount,
      },
    });
  } catch (error: any) {
    console.error('Database seeding error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || 'Failed to seed MongoDB',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Send a POST request to this endpoint to seed MongoDB with default travel packages and destinations.',
  });
}
