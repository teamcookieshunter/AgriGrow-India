'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { getCropAnalysis } from '@/lib/actions';
import { Loader2, ScanLine, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

export default function CropAnalysisForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 4 * 1024 * 1024) { // 4MB limit
        toast({
          variant: 'destructive',
          title: 'File too large',
          description: 'Please upload an image smaller than 4MB.',
        });
        return;
      }
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
      setResult(null); // Clear previous result
    }
  };

  const handleAnalyze = async () => {
    if (!file || !preview) {
      toast({
        variant: 'destructive',
        title: 'No file selected',
        description: 'Please upload an image to analyze.',
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await getCropAnalysis({ photoDataUri: preview });
      setResult(response.healthAnalysis);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Analysis failed',
        description: 'Something went wrong. Please try again.',
      });
    }

    setLoading(false);
  };

  const clearPreview = () => {
    setPreview(null);
    setFile(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Upload Crop Photo</CardTitle>
          <CardDescription>Upload a clear photo of the affected crop for AI analysis.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div 
            className="relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            {preview ? (
              <>
                <Image src={preview} alt="Crop preview" fill style={{ objectFit: 'contain' }} className="rounded-lg p-2" />
                <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-8 w-8 z-10" onClick={(e) => { e.stopPropagation(); clearPreview(); }}>
                    <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">Click to upload or drag and drop</p>
                <p className="text-xs text-muted-foreground">PNG, JPG, or WEBP (max. 4MB)</p>
              </div>
            )}
          </div>
          <Input 
            ref={fileInputRef}
            type="file" 
            className="hidden" 
            accept="image/png, image/jpeg, image/webp" 
            onChange={handleFileChange} 
          />
          <Button onClick={handleAnalyze} disabled={loading || !file} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <ScanLine className="mr-2 h-4 w-4" />
                Analyze Crop Health
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI Health Analysis</CardTitle>
          <CardDescription>The crop health report will appear below.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-muted-foreground">Our AI is inspecting your crop...</p>
            </div>
          )}
          {result && (
            <div className="prose dark:prose-invert max-w-none rounded-md border bg-muted/30 p-4 whitespace-pre-wrap">
              {result}
            </div>
          )}
          {!loading && !result && (
            <div className="flex flex-col items-center justify-center h-64 text-center border-2 border-dashed rounded-lg">
              <ScanLine className="h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">Upload an image to get your analysis.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
