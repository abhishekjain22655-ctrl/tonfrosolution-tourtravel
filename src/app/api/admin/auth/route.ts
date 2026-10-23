import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase, isMongoConfigured } from '@/lib/mongodb';
import AdminSettingModel from '@/models/AdminSetting';
import { adminAuthRateLimiter, getClientIp } from '@/lib/rateLimit';

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
      const clientIp = getClientIp(request);
      const limitCheck = adminAuthRateLimiter.check(clientIp);
      if (!limitCheck.success) {
        const waitMinutes = Math.ceil(limitCheck.resetInSeconds / 60);
        return NextResponse.json(
          {
            valid: false,
            error: `Too many login attempts. Locked for ${waitMinutes} minute(s).`,
          },
          {
            status: 429,
            headers: {
              'Retry-After': String(limitCheck.resetInSeconds),
            },
          }
        );
      }

      const envPasscode = process.env.ADMIN_PASSCODE || process.env.NEXT_PUBLIC_ADMIN_PASSCODE || 'Admin123';
      let valid = false;

      if (!isMongoConfigured()) {
        valid = (passcode || '').trim() === envPasscode.trim();
      } else {
        await connectToDatabase();
        const setting = await AdminSettingModel.findOne({ key: 'admin_passcode' });
        const storedKey = (setting && setting.value) ? setting.value : envPasscode;
        valid = (passcode || '').trim() === storedKey.trim();
      }

      if (valid) {
        adminAuthRateLimiter.reset(clientIp);
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

      const envPasscode = process.env.ADMIN_PASSCODE || process.env.NEXT_PUBLIC_ADMIN_PASSCODE || 'Admin123';
      let activeStoredKey = envPasscode;

      if (isMongoConfigured()) {
        await connectToDatabase();
        const setting = await AdminSettingModel.findOne({ key: 'admin_passcode' });
        if (setting && setting.value) {
          activeStoredKey = setting.value;
        }
      }

      // If passcode (current passcode) is provided, verify it
      if (passcode !== undefined) {
        const matchesCurrent =
          (passcode || '').trim() === activeStoredKey.trim() ||
          (passcode || '').trim() === envPasscode.trim();

        if (!matchesCurrent) {
          return NextResponse.json(
            { error: 'Current passcode is incorrect.' },
            { status: 401 }
          );
        }
      }

      if (isMongoConfigured()) {
        await connectToDatabase();
        await AdminSettingModel.findOneAndUpdate(
          { key: 'admin_passcode' },
          { $set: { value: newPasscode.trim() } },
          { upsert: true, returnDocument: 'after' }
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
