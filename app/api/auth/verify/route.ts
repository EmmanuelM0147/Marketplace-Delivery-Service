import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { generateOTP, verifyOTP } from "@/lib/auth/verification";

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { type, otp } = await request.json();
    
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

    if (otp) {
      // Verify OTP
      const isValid = await verifyOTP(user.id, otp);
      if (!isValid) {
        return NextResponse.json(
          { error: 'Invalid or expired OTP' },
          { status: 400 }
        );
      }

      // Update user verification status
      const { error: updateError } = await supabase
        .from('farmer_profiles')
        .update({
          [`${type.toLowerCase()}_verified`]: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      return NextResponse.json({ success: true });
    } else {
      // Generate new OTP
      const newOTP = await generateOTP(user.id);
      
      // TODO: Send OTP via email/SMS based on type
      console.log(`OTP for testing: ${newOTP}`);

      return NextResponse.json({ success: true });
    }
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { error: 'Failed to process verification' },
      { status: 500 }
    );
  }
}