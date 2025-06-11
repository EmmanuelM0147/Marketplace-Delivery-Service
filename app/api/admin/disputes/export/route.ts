import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'csv';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

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

    // Fetch disputes data
    const query = supabase
      .from('disputes')
      .select(`
        *,
        user:profiles(email, full_name),
        ride:rides(pickup_location, dropoff_location, fare)
      `);

    if (startDate) query.gte('created_at', startDate);
    if (endDate) query.lte('created_at', endDate);

    const { data, error } = await query;
    if (error) throw error;

    // Format data based on requested format
    const formattedData = format === 'csv' 
      ? formatCSV(data)
      : formatJSON(data);

    // Log export action
    await supabase.from('admin_audit_logs').insert({
      admin_id: user.id,
      action_type: 'export',
      target_type: 'disputes',
      metadata: { format, startDate, endDate },
    });

    return new NextResponse(formattedData, {
      headers: {
        'Content-Type': format === 'csv' ? 'text/csv' : 'application/json',
        'Content-Disposition': `attachment; filename=disputes-export.${format}`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { error: "Failed to export data" },
      { status: 500 }
    );
  }
}

function formatCSV(data: any[]) {
  const headers = [
    'ID',
    'Status',
    'Category',
    'Severity',
    'User Email',
    'Created At',
    'Resolved At',
  ].join(',');

  const rows = data.map(row => [
    row.id,
    row.status,
    row.category,
    row.severity,
    row.user.email,
    row.created_at,
    row.resolved_at,
  ].join(','));

  return [headers, ...rows].join('\n');
}

function formatJSON(data: any[]) {
  return JSON.stringify(data, null, 2);
}