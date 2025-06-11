import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { searchParams } = new URL(request.url);
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

    // Fetch analytics data
    const [
      resolutionTimes,
      statusDistribution,
      categoryTrends,
      severityDistribution
    ] = await Promise.all([
      getResolutionTimes(supabase, startDate, endDate),
      getStatusDistribution(supabase, startDate, endDate),
      getCategoryTrends(supabase, startDate, endDate),
      getSeverityDistribution(supabase, startDate, endDate)
    ]);

    return NextResponse.json({
      resolutionTimes,
      statusDistribution,
      categoryTrends,
      severityDistribution
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}

async function getResolutionTimes(supabase: any, startDate: string | null, endDate: string | null) {
  const query = supabase
    .from('disputes')
    .select('created_at, resolved_at, severity')
    .not('resolved_at', 'is', null);

  if (startDate) query.gte('created_at', startDate);
  if (endDate) query.lte('created_at', endDate);

  const { data } = await query;

  return data?.map((dispute: any) => ({
    severity: dispute.severity,
    resolutionTime: new Date(dispute.resolved_at).getTime() - new Date(dispute.created_at).getTime(),
  }));
}

async function getStatusDistribution(supabase: any, startDate: string | null, endDate: string | null) {
  const query = supabase
    .from('disputes')
    .select('status, count')
    .select('*');

  if (startDate) query.gte('created_at', startDate);
  if (endDate) query.lte('created_at', endDate);

  const { data } = await query;

  return data?.reduce((acc: any, dispute: any) => {
    acc[dispute.status] = (acc[dispute.status] || 0) + 1;
    return acc;
  }, {});
}

async function getCategoryTrends(supabase: any, startDate: string | null, endDate: string | null) {
  const query = supabase
    .from('disputes')
    .select('category, created_at');

  if (startDate) query.gte('created_at', startDate);
  if (endDate) query.lte('created_at', endDate);

  const { data } = await query;

  return data?.reduce((acc: any, dispute: any) => {
    const date = new Date(dispute.created_at).toISOString().split('T')[0];
    acc[date] = acc[date] || {};
    acc[date][dispute.category] = (acc[date][dispute.category] || 0) + 1;
    return acc;
  }, {});
}

async function getSeverityDistribution(supabase: any, startDate: string | null, endDate: string | null) {
  const query = supabase
    .from('disputes')
    .select('severity, count')
    .select('*');

  if (startDate) query.gte('created_at', startDate);
  if (endDate) query.lte('created_at', endDate);

  const { data } = await query;

  return data?.reduce((acc: any, dispute: any) => {
    acc[dispute.severity] = (acc[dispute.severity] || 0) + 1;
    return acc;
  }, {});
}