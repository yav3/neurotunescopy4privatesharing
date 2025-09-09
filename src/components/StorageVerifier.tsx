import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, AlertCircle, Play } from "lucide-react";
import { toast } from "sonner";

interface VerificationResult {
  bucket: string;
  totalProcessed: number;
  dryRun: boolean;
  summary: {
    verified: number;
    corrected: number;
    markedMissing: number;
    errors: number;
  };
}

export function StorageVerifier() {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);

  const runVerification = async (dryRun: boolean = true) => {
    setIsRunning(true);
    setResult(null);

    try {
      const response = await fetch('/api/functions/v1/fix-storage-mismatches?bucket=audio&limit=100&dryRun=' + dryRun);
      
      if (!response.ok) {
        throw new Error('Failed to run verification');
      }

      const data = await response.json();
      setResult(data);
      
      if (dryRun) {
        toast.success("Dry run complete - check results below");
      } else {
        toast.success(`Fixed ${data.summary.corrected + data.summary.verified} tracks`);
      }
    } catch (error) {
      toast.error("Verification failed: " + (error as Error).message);
      console.error('Verification error:', error);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="h-5 w-5" />
          Storage Verifier
        </CardTitle>
        <CardDescription>
          Verify and fix audio file storage mismatches. Run dry run first to see what would be changed.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button
            onClick={() => runVerification(true)}
            disabled={isRunning}
            variant="outline"
          >
            {isRunning ? "Running..." : "Dry Run"}
          </Button>
          <Button
            onClick={() => runVerification(false)}
            disabled={isRunning || !result}
            variant="default"
          >
            Apply Fixes
          </Button>
        </div>

        {isRunning && (
          <div className="space-y-2">
            <Progress value={undefined} />
            <p className="text-sm text-muted-foreground">
              Verifying audio files...
            </p>
          </div>
        )}

        {result && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-semibold">{result.summary.verified}</span>
                </div>
                <p className="text-xs text-muted-foreground">Verified</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-blue-600">
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-semibold">{result.summary.corrected}</span>
                </div>
                <p className="text-xs text-muted-foreground">Corrected</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-red-600">
                  <XCircle className="h-4 w-4" />
                  <span className="font-semibold">{result.summary.markedMissing}</span>
                </div>
                <p className="text-xs text-muted-foreground">Missing</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-orange-600">
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-semibold">{result.summary.errors}</span>
                </div>
                <p className="text-xs text-muted-foreground">Errors</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant={result.dryRun ? "secondary" : "default"}>
                {result.dryRun ? "Dry Run" : "Applied"}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Processed {result.totalProcessed} tracks from {result.bucket} bucket
              </span>
            </div>

            {result.dryRun && result.summary.corrected > 0 && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-800">
                  <strong>{result.summary.corrected}</strong> tracks can be fixed by moving them to the correct bucket.
                  Click "Apply Fixes" to make these changes.
                </p>
              </div>
            )}

            {result.summary.markedMissing > 0 && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-800">
                  <strong>{result.summary.markedMissing}</strong> tracks are truly missing and need to be re-uploaded or removed from the database.
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}