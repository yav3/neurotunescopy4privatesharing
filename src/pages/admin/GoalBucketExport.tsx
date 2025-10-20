import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { THERAPEUTIC_GOALS } from "@/config/therapeuticGoals";
import { Download } from "lucide-react";
import { toast } from "sonner";

export default function GoalBucketExport() {
  
  const downloadJSON = () => {
    const data = THERAPEUTIC_GOALS.map(goal => ({
      id: goal.id,
      name: goal.name,
      slug: goal.slug,
      backendKey: goal.backendKey,
      description: goal.description,
      shortName: goal.shortName,
      musicBuckets: goal.musicBuckets,
      bpmRange: goal.bpmRange,
      vadProfile: goal.vadProfile,
      synonyms: goal.synonyms
    }));

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `therapeutic-goals-buckets-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('JSON file downloaded');
  };

  const downloadCSV = () => {
    const headers = ['Goal ID', 'Goal Name', 'Slug', 'Backend Key', 'Music Buckets', 'BPM Min', 'BPM Max', 'BPM Optimal'];
    const rows = THERAPEUTIC_GOALS.map(goal => [
      goal.id,
      goal.name,
      goal.slug,
      goal.backendKey,
      goal.musicBuckets.join('; '),
      goal.bpmRange.min,
      goal.bpmRange.max,
      goal.bpmRange.optimal
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `therapeutic-goals-buckets-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('CSV file downloaded');
  };

  const copyToClipboard = () => {
    const text = THERAPEUTIC_GOALS.map(goal => 
      `${goal.name} (${goal.slug}):\nBuckets: ${goal.musicBuckets.join(', ')}\nBPM: ${goal.bpmRange.min}-${goal.bpmRange.max} (optimal: ${goal.bpmRange.optimal})\n`
    ).join('\n');

    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Therapeutic Goals & Music Buckets</h1>
          <p className="text-muted-foreground">Export configuration data for all therapeutic goals</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={copyToClipboard} variant="outline">
            Copy Text
          </Button>
          <Button onClick={downloadCSV} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download CSV
          </Button>
          <Button onClick={downloadJSON}>
            <Download className="mr-2 h-4 w-4" />
            Download JSON
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {THERAPEUTIC_GOALS.map((goal) => (
          <Card key={goal.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {typeof goal.icon === 'string' && <span className="text-2xl">{goal.icon}</span>}
                    {goal.name}
                  </CardTitle>
                  <CardDescription>{goal.description}</CardDescription>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  <div>ID: {goal.id}</div>
                  <div>Slug: {goal.slug}</div>
                  <div>Backend: {goal.backendKey}</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Music Buckets ({goal.musicBuckets.length})</h4>
                <div className="flex flex-wrap gap-2">
                  {goal.musicBuckets.map((bucket) => (
                    <span key={bucket} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                      {bucket}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold">BPM Range:</span> {goal.bpmRange.min}-{goal.bpmRange.max}
                </div>
                <div>
                  <span className="font-semibold">Optimal BPM:</span> {goal.bpmRange.optimal}
                </div>
                <div>
                  <span className="font-semibold">Valence:</span> {goal.vadProfile.valence}
                </div>
                <div>
                  <span className="font-semibold">Arousal:</span> {goal.vadProfile.arousal}
                </div>
              </div>

              {goal.synonyms && goal.synonyms.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Synonyms</h4>
                  <div className="text-sm text-muted-foreground">
                    {goal.synonyms.join(', ')}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
