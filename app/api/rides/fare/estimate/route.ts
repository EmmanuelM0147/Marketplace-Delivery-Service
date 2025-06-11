import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { calculateFareEstimate } from "@/lib/rides/fare-calculator";

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { pickup, destination, rideType } = await request.json();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const estimate = await calculateFareEstimate(pickup, destination, rideType);

    return NextResponse.json(estimate);
  } catch (error) {
    console.error('Fare estimation error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate fare estimate' },
      { status: 500 }
    );
  }
}