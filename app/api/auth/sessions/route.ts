import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

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

    const { data: sessions, error: sessionsError } = await supabase
      .from('user_sessions')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true);

    if (sessionsError) throw sessionsError;

    return NextResponse.json({ sessions });
  } catch (error) {
    console.error('Sessions error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { sessionId } = await request.json();

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

    const { error: sessionError } = await supabase
      .from('user_sessions')
      .update({ is_active: false })
      .eq('id', sessionId)
      .eq('user_id', user.id);

    if (sessionError) throw sessionError;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Session termination error:', error);
    return NextResponse.json(
      { error: 'Failed to terminate session' },
      { status: 500 }
    );
  }
}