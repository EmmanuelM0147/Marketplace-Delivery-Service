import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '25');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const severity = searchParams.get('severity');
    const userId = searchParams.get('userId');
    const actionType = searchParams.get('actionType');

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

    let query = supabase
      .from('admin_audit_logs')
      .select(`
        *,
        admin:profiles!admin_id(email, full_name)
      `, { count: 'exact' });

    if (startDate) query = query.gte('created_at', startDate);
    if (endDate) query = query.lte('created_at', endDate);
    if (severity) query = query.eq('severity', severity);
    if (userId) query = query.eq('target_id', userId);
    if (actionType) query = query.eq('action_type', actionType);

    const { data, count, error } = await query
      .range((page - 1) * limit, page * limit - 1)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      logs: data,
      total: count,
      page,
      totalPages: Math.ceil((count || 0) / limit),
    });
  } catch (error) {
    console.error("Logs fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch logs" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { format } = await request.json();

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

    const { data, error } = await supabase
      .from('admin_audit_logs')
      .select(`
        *,
        admin:profiles!admin_id(email, full_name)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const formattedData = format === 'csv' 
      ? formatLogsCSV(data)
      : formatLogsJSON(data);

    return new NextResponse(formattedData, {
      headers: {
        'Content-Type': format === 'csv' ? 'text/csv' : 'application/json',
        'Content-Disposition': `attachment; filename=system-logs.${format}`,
      },
    });
  } catch (error) {
    console.error("Logs export error:", error);
    return NextResponse.json(
      { error: "Failed to export logs" },
      { status: 500 }
    );
  }
}

function formatLogsCSV(data: any[]) {
  const headers = [
    'ID',
    'Action Type',
    'Target Type',
    'Target ID',
    'Admin Email',
    'Created At',
    'Changes',
  ].join(',');

  const rows = data.map(log => [
    log.id,
    log.action_type,
    log.target_type,
    log.target_id,
    log.admin.email,
    log.created_at,
    JSON.stringify(log.changes),
  ].join(','));

  return [headers, ...rows].join('\n');
}

function formatLogsJSON(data: any[]) {
  return JSON.stringify(data, null, 2);
}