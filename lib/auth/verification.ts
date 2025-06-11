import { createClient } from '@supabase/supabase-js';
import { createHash } from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function generateOTP(userId: string): Promise<string> {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOTP = createHash('sha256').update(otp).digest('hex');
  
  await supabase
    .from('verification_codes')
    .insert({
      user_id: userId,
      code_hash: hashedOTP,
      expires_at: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    });
  
  return otp;
}

export async function verifyOTP(userId: string, otp: string): Promise<boolean> {
  const hashedOTP = createHash('sha256').update(otp).digest('hex');
  
  const { data, error } = await supabase
    .from('verification_codes')
    .select()
    .eq('user_id', userId)
    .eq('code_hash', hashedOTP)
    .gt('expires_at', new Date().toISOString())
    .single();
  
  if (error || !data) return false;
  
  // Delete used OTP
  await supabase
    .from('verification_codes')
    .delete()
    .eq('id', data.id);
  
  return true;
}

export async function startVerification(userId: string, type: 'PHONE' | 'EMAIL' | 'ID' | 'BUSINESS') {
  const { data, error } = await supabase
    .from('verification_requests')
    .insert({
      user_id: userId,
      type,
      status: 'PENDING',
      submitted_at: new Date().toISOString()
    })
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function updateVerificationStatus(
  requestId: string,
  status: 'APPROVED' | 'REJECTED',
  reviewerId?: string
) {
  const { error } = await supabase
    .from('verification_requests')
    .update({
      status,
      reviewed_at: new Date().toISOString(),
      reviewer_id: reviewerId
    })
    .eq('id', requestId);
    
  if (error) throw error;
}