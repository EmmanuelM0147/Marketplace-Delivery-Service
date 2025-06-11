import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { documents } = await request.json();

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

    // Insert verification documents
    const { error: verificationError } = await supabase
      .from('farmer_verifications')
      .insert(
        documents.map((doc: any) => ({
          farmer_id: user.id,
          document_type: doc.type,
          document_url: doc.url,
        }))
      );

    if (verificationError) {
      throw verificationError;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { error: 'Failed to submit verification documents' },
      { status: 500 }
    );
  }
}