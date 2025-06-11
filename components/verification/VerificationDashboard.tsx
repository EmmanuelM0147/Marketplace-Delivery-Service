"use client";

import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Camera, Fingerprint, FileCheck, Shield } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

interface VerificationStep {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed" | "failed";
  icon: React.ReactNode;
}

export function VerificationDashboard() {
  const [steps, setSteps] = useState<VerificationStep[]>([
    {
      id: "facial",
      title: "Facial Recognition",
      description: "Take a clear photo of your face",
      status: "pending",
      icon: <Camera className="h-6 w-6" />,
    },
    {
      id: "fingerprint",
      title: "Fingerprint Verification",
      description: "Scan your fingerprint",
      status: "pending",
      icon: <Fingerprint className="h-6 w-6" />,
    },
    {
      id: "document",
      title: "Document Verification",
      description: "Upload your identification documents",
      status: "pending",
      icon: <FileCheck className="h-6 w-6" />,
    },
    {
      id: "background",
      title: "Background Check",
      description: "Complete background verification",
      status: "pending",
      icon: <Shield className="h-6 w-6" />,
    },
  ]);

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Calculate progress
    const completed = steps.filter((step) => step.status === "completed").length;
    setProgress((completed / steps.length) * 100);
  }, [steps]);

  const handleStepAction = async (stepId: string) => {
    // Update step status
    setSteps((current) =>
      current.map((step) =>
        step.id === stepId
          ? { ...step, status: "in-progress" }
          : step
      )
    );

    try {
      // Implement step-specific verification logic
      switch (stepId) {
        case "facial":
          // Implement facial recognition
          break;
        case "fingerprint":
          // Implement fingerprint scanning
          break;
        case "document":
          // Implement document upload and verification
          break;
        case "background":
          // Implement background check
          break;
      }

      // Update step status on success
      setSteps((current) =>
        current.map((step) =>
          step.id === stepId
            ? { ...step, status: "completed" }
            : step
        )
      );
    } catch (error) {
      console.error(`Step ${stepId} failed:`, error);
      setSteps((current) =>
        current.map((step) =>
          step.id === stepId
            ? { ...step, status: "failed" }
            : step
        )
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Identity Verification</h2>
        <p className="text-muted-foreground">
          Complete the following steps to verify your identity
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Verification Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="mb-2" />
          <p className="text-sm text-muted-foreground">
            {progress.toFixed(0)}% Complete
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {steps.map((step) => (
          <Card key={step.id}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">{step.icon}</div>
                <div className="flex-grow">
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
                <Button
                  onClick={() => handleStepAction(step.id)}
                  disabled={step.status === "completed"}
                >
                  {step.status === "completed"
                    ? "Completed"
                    : step.status === "in-progress"
                    ? "Processing..."
                    : "Start"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {progress === 100 && (
        <Alert>
          <AlertTitle>Verification Complete!</AlertTitle>
          <AlertDescription>
            Your identity has been successfully verified. You can now access all
            platform features.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}