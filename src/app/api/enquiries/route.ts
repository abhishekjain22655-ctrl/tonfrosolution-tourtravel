import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase, isMongoConfigured } from '@/lib/mongodb';
import EnquiryModel from '@/models/Enquiry';
import { CustomerEnquiry } from '@/types/travel';
import { sendAdminEnquiryNotification } from '@/lib/email';
import { enquiryRateLimiter, getClientIp } from '@/lib/rateLimit';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    if (!isMongoConfigured()) {
      return NextResponse.json({
        source: 'local-only',
        enquiries: [],
      });
    }

    await connectToDatabase();

    const query: any = {};
    if (status && status !== 'all') query.status = status;

    const mongoEnquiries = await EnquiryModel.find(query).sort({ createdAt: -1 });

    const transformed: CustomerEnquiry[] = mongoEnquiries.map(
      (doc) => doc.toJSON() as CustomerEnquiry
    );

    return NextResponse.json({
      source: 'mongodb',
      enquiries: transformed,
    });
  } catch (error: any) {
    console.error('Error fetching enquiries from MongoDB:', error);
    return NextResponse.json({ error: error?.message, enquiries: [] }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // 1. IP Rate Limiting (Max 5 submissions per 10 min window)
    const clientIp = getClientIp(request);
    const limitCheck = enquiryRateLimiter.check(clientIp);
    if (!limitCheck.success) {
      const waitMinutes = Math.ceil(limitCheck.resetInSeconds / 60);
      return NextResponse.json(
        {
          error: `Too many submissions. Please wait ${waitMinutes} minute(s) before submitting another enquiry.`,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(limitCheck.resetInSeconds),
          },
        }
      );
    }

    const body = await request.json();

    // 2. Honeypot check (hidden field bots auto-fill)
    if (body._hp_verification || body.faxNumber) {
      // Silently ignore bot submission
      return NextResponse.json({
        saved: true,
        source: 'honeypot-filtered',
      });
    }

    if (!body.fullName || !body.phone || !body.destinationPreference) {
      return NextResponse.json(
        { error: 'Missing required enquiry fields: fullName, phone, destinationPreference' },
        { status: 400 }
      );
    }

    // 3. Length guards
    if (body.fullName.length > 100 || body.phone.length > 30) {
      return NextResponse.json(
        { error: 'Input exceeds allowable character limits.' },
        { status: 400 }
      );
    }

    if (!isMongoConfigured()) {
      const mockEnquiry: CustomerEnquiry = {
        id: `local-${Date.now()}`,
        createdAt: new Date().toISOString(),
        fullName: body.fullName,
        phone: body.phone,
        email: body.email,
        tripType: body.tripType || 'domestic',
        destinationPreference: body.destinationPreference,
        departureCity: body.departureCity || '',
        travelDateApprox: body.travelDateApprox || '',
        adultsCount: body.adultsCount || 2,
        childrenCount: body.childrenCount || 0,
        approxBudgetINR: body.approxBudgetINR || '',
        additionalNotes: body.additionalNotes || '',
        originPackageSlug: body.originPackageSlug,
        originPackageTitle: body.originPackageTitle,
        status: 'new',
        internalNotes: '',
      };

      // Send instant email notification to Admin
      sendAdminEnquiryNotification(mockEnquiry).catch((err) =>
        console.warn('Email notify error (local mode):', err)
      );

      return NextResponse.json({
        saved: true,
        source: 'local-only',
        enquiry: mockEnquiry,
      });
    }

    await connectToDatabase();

    const newEnquiry = await EnquiryModel.create({
      fullName: body.fullName.trim(),
      phone: body.phone.trim(),
      email: body.email ? body.email.trim() : '',
      tripType: body.tripType || 'domestic',
      destinationPreference: body.destinationPreference.trim(),
      departureCity: body.departureCity ? body.departureCity.trim() : '',
      travelDateApprox: body.travelDateApprox ? body.travelDateApprox.trim() : '',
      adultsCount: Number(body.adultsCount) || 2,
      childrenCount: Number(body.childrenCount) || 0,
      approxBudgetINR: body.approxBudgetINR || '',
      additionalNotes: body.additionalNotes ? body.additionalNotes.trim() : '',
      originPackageSlug: body.originPackageSlug,
      originPackageTitle: body.originPackageTitle,
      status: 'new',
      internalNotes: '',
    });

    const savedDoc = newEnquiry.toJSON();

    // Send instant email notification to Admin
    sendAdminEnquiryNotification(savedDoc).catch((err) =>
      console.warn('Email notify error (mongodb mode):', err)
    );

    return NextResponse.json({
      saved: true,
      source: 'mongodb',
      enquiry: savedDoc,
    });
  } catch (error: any) {
    console.error('Error saving enquiry to MongoDB:', error);
    return NextResponse.json({ error: error?.message || 'Failed to submit enquiry' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, internalNotes } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing enquiry id' }, { status: 400 });
    }

    if (!isMongoConfigured()) {
      return NextResponse.json({
        updated: true,
        source: 'local-only',
      });
    }

    await connectToDatabase();

    const updateFields: any = {};
    if (status) updateFields.status = status;
    if (internalNotes !== undefined) updateFields.internalNotes = internalNotes;

    const updated = await EnquiryModel.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: 'Enquiry not found' }, { status: 404 });
    }

    return NextResponse.json({
      updated: true,
      source: 'mongodb',
      enquiry: updated.toJSON(),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
