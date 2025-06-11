import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

const userUpdateSchema = z.object({
  id: z.string().uuid(),
  role: z.enum(['admin', 'manager', 'user']),
  is_active: z.boolean().optional(),
  permissions: z.array(z.string()).optional(),
});

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '25');
    const search = searchParams.get('search');
    const role = searchParams.get('role');

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
      .from('profiles')
      .select('*', { count: 'exact' });

    if (search) {
      query = query.or(`email.ilike.%${search}%,full_name.ilike.%${search}%`);
    }

    if (role) {
      query = query.eq('role', role);
    }

    const { data, count, error } = await query
      .range((page - 1) * limit, page * limit - 1)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      users: data,
      total: count,
      page,
      totalPages: Math.ceil((count || 0) / limit),
    });
  } catch (error) {
    console.error("Users fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const body = await request.json();
    
    const validatedData = userUpdateSchema.parse(body);

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
      .from('profiles')
      .update({
        role: validatedData.role,
        is_active: validatedData.is_active,
        permissions: validatedData.permissions,
        updated_at: new Date().toISOString(),
      })
      .eq('id', validatedData.id)
      .select()
      .single();

    if (error) throw error;

    // Log user update
    await supabase.from('admin_audit_logs').insert({
      admin_id: user.id,
      action_type: 'user_update',
      target_type: 'profiles',
      target_id: validatedData.id,
      changes: validatedData,
    });

    return NextResponse.json({ user: data });
  } catch (error) {
    console.error("User update error:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}