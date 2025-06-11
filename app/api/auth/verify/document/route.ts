import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyDocument } from "@/lib/auth/document";

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { documentType, documentData } = await request.json();
    
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

    // Verify document using OCR and external validation
    const result = await verifyDocument(documentType, documentData);
    
    if (!result.valid) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    // Store document verification result
    const { error: updateError } = await supabase
      .from('user_documents')
      .insert({
        user_id: user.id,
        document_type: documentType,
        verification_status: 'verified',
        verification_details: result.details,
        expires_at: result.expiryDate,
        created_at: new Date().toISOString()
      });

    if (updateError) throw updateError;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Document verification error:', error);
    return NextResponse.json(
      { error: 'Failed to process document verification' },
      { status: 500 }
    );
  }
}