import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { generateOTP, verifyOTP } from "@/lib/auth/verification";

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { action, otp } = await request.json();
    
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (action === 'enable') {
      // Generate and send OTP
      const newOTP = await generateOTP(user.id);
      
      // TODO: Send OTP via preferred method (email/SMS)
      console.log(`2FA OTP for testing: ${newOTP}`);

      return NextResponse.json({ success: true });
    } else if (action === 'verify') {
      // Verify OTP
      const isValid = await verifyOTP(user.id, otp);
      if (!isValid) {
        return NextResponse.json(
          { error: 'Invalid or expired OTP' },
          { status: 400 }
        );
      }

      // Enable 2FA for user
      const { error: updateError } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          two_factor_enabled: true,
          updated_at: new Date().toISOString()
        });

      if (updateError) throw updateError;

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('2FA error:', error);
    return NextResponse.json(
      { error: 'Failed to process 2FA request' },
      { status: 500 }
    );
  }
}