import { NextResponse } from 'next/server';
import { connectToDatabase, isMongoConfigured } from '@/lib/mongodb';
import PackageModel from '@/models/Package';
import EnquiryModel from '@/models/Enquiry';
import DestinationModel from '@/models/Destination';


export async function GET() {
  try {
    if (!isMongoConfigured()) {
      return NextResponse.json({
        configured: false,
        connected: false,
        message: 'MONGODB_URI environment variable is not defined.',
      });
    }

    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json({
        configured: true,
        connected: false,
        message: 'Could not connect to MongoDB cluster.',
      });
    }

    const [packagesCount, enquiriesCount, destinationsCount] = await Promise.all([
      PackageModel.countDocuments(),
      EnquiryModel.countDocuments(),
      DestinationModel.countDocuments(),
    ]);

    return NextResponse.json({
      configured: true,
      connected: true,
      stats: {
        packages: packagesCount,
        enquiries: enquiriesCount,
        destinations: destinationsCount,
      },
      message: 'MongoDB Atlas is active and connected.',
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        configured: isMongoConfigured(),
        connected: false,
        error: error?.message || 'Database error',
      },
      { status: 500 }
    );
  }
}
