import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { products } = await request.json();

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

    // Validate farmer profile
    const { data: farmerProfile, error: profileError } = await supabase
      .from('farmer_profiles')
      .select('id, verification_status')
      .eq('id', user.id)
      .single();

    if (profileError || !farmerProfile) {
      return NextResponse.json(
        { error: 'Farmer profile not found' },
        { status: 404 }
      );
    }

    if (farmerProfile.verification_status !== 'verified') {
      return NextResponse.json(
        { error: 'Account not verified' },
        { status: 403 }
      );
    }

    // Insert products
    const { error: productsError } = await supabase
      .from('products')
      .insert(
        products.map((product: any) => ({
          ...product,
          farmer_id: user.id,
        }))
      );

    if (productsError) {
      throw productsError;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Bulk upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload products' },
      { status: 500 }
    );
  }
}