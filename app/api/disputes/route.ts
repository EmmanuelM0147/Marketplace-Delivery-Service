import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai-edge";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { description, evidence, rideId } = await request.json();

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

    // Analyze dispute using AI
    const analysis = await analyzeDispute(description);

    // Create dispute record
    const { data: dispute, error: disputeError } = await supabase
      .from("disputes")
      .insert({
        user_id: user.id,
        ride_id: rideId,
        description,
        category: analysis.category,
        severity: analysis.severity,
        status: "pending",
        evidence_urls: evidence,
        target_resolution_time: calculateResolutionTime(analysis.severity),
      })
      .select()
      .single();

    if (disputeError) throw disputeError;

    // Trigger automated resolution if applicable
    if (analysis.canAutoResolve) {
      await processAutomatedResolution(dispute.id, analysis);
    }

    return NextResponse.json({ dispute, analysis });
  } catch (error) {
    console.error("Dispute creation error:", error);
    return NextResponse.json(
      { error: "Failed to process dispute" },
      { status: 500 }
    );
  }
}

async function analyzeDispute(description: string) {
  const prompt = `Analyze this ride-sharing dispute:
  "${description}"
  
  Provide a JSON response with:
  - category (wrong_route, service_issue, safety_concern)
  - severity (low, medium, high, critical)
  - canAutoResolve (boolean)
  - recommendedAction
  - compensationAmount (percentage)`;

  const response = await openai.createChatCompletion({
    model: "gpt-4",
    messages: [
      { role: "system", content: "You are a dispute resolution analyst." },
      { role: "user", content: prompt }
    ],
  });

  const result = await response.json();
  return JSON.parse(result.choices[0].message.content);
}

function calculateResolutionTime(severity: string) {
  const times = {
    critical: 1,
    high: 4,
    medium: 24,
    low: 48,
  };
  const hours = times[severity as keyof typeof times] || 24;
  return new Date(Date.now() + hours * 60 * 60 * 1000);
}

async function processAutomatedResolution(disputeId: string, analysis: any) {
  // Implement automated resolution logic
  // This would include refund processing, status updates, etc.
}