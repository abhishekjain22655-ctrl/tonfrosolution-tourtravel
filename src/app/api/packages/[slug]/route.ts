import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase, isMongoConfigured } from '@/lib/mongodb';
import PackageModel from '@/models/Package';
import { packagesData } from '@/data/packages';


export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!isMongoConfigured()) {
      const found = packagesData.find((p) => p.slug === slug);
      if (!found) {
        return NextResponse.json({ error: 'Package not found' }, { status: 404 });
      }
      return NextResponse.json({ source: 'local-fallback', package: found });
    }

    await connectToDatabase();
    const pkg = await PackageModel.findOne({ slug });

    if (!pkg) {
      // Fallback to static packages
      const found = packagesData.find((p) => p.slug === slug);
      if (found) {
        return NextResponse.json({ source: 'local-fallback', package: found });
      }
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }

    return NextResponse.json({ source: 'mongodb', package: pkg.toJSON() });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();

    if (!isMongoConfigured()) {
      return NextResponse.json({
        updated: true,
        source: 'local-only',
        package: body,
      });
    }

    await connectToDatabase();
    const updated = await PackageModel.findOneAndUpdate(
      { slug },
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }

    return NextResponse.json({
      updated: true,
      source: 'mongodb',
      package: updated.toJSON(),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!isMongoConfigured()) {
      return NextResponse.json({
        deleted: true,
        source: 'local-only',
      });
    }

    await connectToDatabase();
    const result = await PackageModel.deleteOne({ slug });

    return NextResponse.json({
      deleted: result.deletedCount > 0,
      source: 'mongodb',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
