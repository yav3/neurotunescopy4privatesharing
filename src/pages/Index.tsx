import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            🎵 Bucket Connection Tester
          </h1>
          <p className="text-xl text-muted-foreground">
            View exactly which storage buckets we connect to
          </p>
        </header>

        <div className="flex justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>🔗 View Connections</CardTitle>
              <CardDescription>
                See exactly which buckets we access and test their connectivity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                onClick={() => window.location.href = '/buckets'}
                size="lg"
              >
                View Bucket Connections
              </Button>
              
              <div className="mt-4 text-xs text-muted-foreground text-center">
                This will show you exactly which buckets we connect to
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;