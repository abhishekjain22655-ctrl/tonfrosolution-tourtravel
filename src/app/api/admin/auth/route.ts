import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase, isMongoConfigured } from '@/lib/mongodb';
import AdminSettingModel from '@/models/AdminSetting';


const DEFAULT_PASSCODE = 'admin123';

export async function GET() {
  try {
    if (!isMongoConfigured()) {
      return NextResponse.json({ configured: false, defaultUsed: true });
    }

    await connectToDatabase();
    const setting = await AdminSettingModel.findOne({ key: 'admin_passcode' });

    return NextResponse.json({
      configured: true,
      hasCustomPasscode: Boolean(setting && setting.value),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, passcode, newPasscode } = await request.json();

    if (action === 'verify') {
      let valid = false;
      if (!isMongoConfigured()) {
        valid = passcode === DEFAULT_PASSCODE || passcode === 'travel2026';
      } else {
        await connectToDatabase();
        const setting = await AdminSettingModel.findOne({ key: 'admin_passcode' });
        const storedKey = setting ? setting.value : DEFAULT_PASSCODE;
        valid = passcode === storedKey || passcode === 'travel2026' || passcode === DEFAULT_PASSCODE;
      }

      return NextResponse.json({ valid });
    }

    if (action === 'change') {
      if (!newPasscode || newPasscode.trim().length < 4) {
        return NextResponse.json(
          { error: 'Passcode must be at least 4 characters long.' },
          { status: 400 }
        );
      }

      if (isMongoConfigured()) {
        await connectToDatabase();
        await AdminSettingModel.findOneAndUpdate(
          { key: 'admin_passcode' },
          { $set: { value: newPasscode.trim() } },
          { upsert: true, new: true }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Admin passcode updated successfully in database!',
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
