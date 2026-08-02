import CropAnalysisForm from '@/components/crop-analysis-form';

export default function CropAnalysisPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Photo-Based Crop Analysis</h1>
      <p className="text-muted-foreground">Get an instant health check for your crops using AI.</p>
      <div className="mt-6">
        <CropAnalysisForm />
      </div>
    </div>
  );
}
