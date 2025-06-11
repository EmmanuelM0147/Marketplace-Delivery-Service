import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyBiometric } from "@/lib/auth/biometric";

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { type, data } = await request.json();
    
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

    // Verify biometric data
    const result = await verifyBiometric(user.id, type, data);
    
    if (!result.valid) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    // Update verification status
    const { error: updateError } = await supabase
      .from('user_verifications')
      .upsert({
        user_id: user.id,
        [`${type}_verified`]: true,
        updated_at: new Date().toISOString()
      });

    if (updateError) throw updateError;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Biometric verification error:', error);
    return NextResponse.json(
      { error: 'Failed to process biometric verification' },
      { status: 500 }
    );
  }
}