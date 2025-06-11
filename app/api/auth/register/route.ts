import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain uppercase, lowercase, number and special character'
    ),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  phoneNumber: z.string().min(10, 'Invalid phone number'),
  address: z.object({
    line1: z.string().min(1, 'Address line 1 is required'),
    line2: z.string().optional(),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    postalCode: z.string().min(1, 'Postal code is required'),
  }),
});

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const body = await request.json();
    
    // Validate request body
    const validatedData = registerSchema.parse(body);

    // Create user account
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: validatedData.email,
      password: validatedData.password,
      options: {
        data: {
          full_name: validatedData.fullName,
          phone_number: validatedData.phoneNumber,
        },
      },
    });

    if (authError) throw authError;

    // Create buyer profile
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('buyer_profiles')
        .insert({
          id: authData.user.id,
          full_name: validatedData.fullName,
          phone_number: validatedData.phoneNumber,
          address: validatedData.address,
        });

      if (profileError) throw profileError;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
}