import { StorageNormalizer } from '@/components/StorageNormalizer';

const StorageManager = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Storage File Manager</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Normalize and manage file names in your Supabase storage buckets. 
            Start with one bucket to test the process safely.
          </p>
        </div>
        <StorageNormalizer />
      </div>
    </div>
  );
};

export default StorageManager;