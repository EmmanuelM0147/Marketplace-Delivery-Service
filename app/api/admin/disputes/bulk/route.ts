import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { disputeIds, action, updates } = await request.json();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Verify admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Process bulk action
    const { data, error } = await supabase
      .from('disputes')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
        updated_by: user.id,
      })
      .in('id', disputeIds)
      .select();

    if (error) throw error;

    // Log bulk action
    await supabase.from('admin_audit_logs').insert({
      admin_id: user.id,
      action_type: 'bulk_update',
      target_type: 'disputes',
      target_ids: disputeIds,
      changes: updates,
    });

    return NextResponse.json({ success: true, updated: data });
  } catch (error) {
    console.error("Bulk action error:", error);
    return NextResponse.json(
      { error: "Failed to process bulk action" },
      { status: 500 }
    );
  }
}