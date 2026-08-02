
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { getGuidance } from '@/lib/actions';
import { Loader2, Wand2, Leaf, Check, RefreshCcw, LocateFixed, Wheat, CheckCircle, Plus, Tractor, Wind, Droplets, Shield, ArrowRight, CalendarDays, ChevronsRight, Award, AlertTriangle as AlertTriangleIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { AIProjectGuidanceInput, AIProjectGuidanceOutput } from '@/ai/flows/ai-project-guidance';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Terminal, AlertTriangle } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';

const formSchema = z.object({
  soilType: z.string().min(3, 'Soil type must be at least 3 characters.'),
  landSize: z.string().min(1, 'Please enter the land size.'),
  lastCrop: z.string().min(3, 'Last crop must be at least 3 characters.'),
  lastUsedFertilizers: z.string().optional(),
  location: z.string().min(3, 'Location must be at least 3 characters.'),
  customCrop: z.string().optional(),
});

type FormSchemaType = z.infer<typeof formSchema>;

export default function FarmingAssistant() {
  const [loading, setLoading] = useState<'suggestion' | 'plan' | false>(false);
  const [suggestion, setSuggestion] = useState<AIProjectGuidanceOutput['suggestion'] | null>(null);
  const [plan, setPlan] = useState<AIProjectGuidanceOutput['plan'] | null>(null);
  const [currentView, setCurrentView] = useState<'form' | 'suggestion' | 'plan'>('form');
  const [selectedCrop, setSelectedCrop] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>({});
  const [planViewMode, setPlanViewMode] = useState<'overview' | 'interactive'>('overview');
  const [planCompleted, setPlanCompleted] = useState(false);


  const { toast } = useToast();

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      soilType: '',
      landSize: '',
      lastCrop: '',
      lastUsedFertilizers: '',
      location: '',
      customCrop: '',
    },
  });
  
  const { watch } = form;
  const customCropValue = watch('customCrop');


  const handleGetSuggestion: SubmitHandler<FormSchemaType> = async (data) => {
    setLoading('suggestion');
    setSuggestion(null);
    setError(null);
    setPlan(null);
    setCurrentView('suggestion');
    const input: AIProjectGuidanceInput = {
      ...data,
      cropChoice: 'suggest',
    };
    
    try {
      const response = await getGuidance(input);
      if (response.success && response.data.suggestion) {
        setSuggestion(response.data.suggestion);
        setSelectedCrop(response.data.suggestion.cropName);
      } else {
        const errorMessage = (response.data as any)?.fallbackMessage || "Failed to get suggestion. Please try again.";
        setError(errorMessage);
        toast({ variant: "destructive", title: "AI is temporarily unavailable", description: errorMessage });
      }
    } catch (e: any) {
      const errorMessage = e.message || "An unexpected error occurred.";
      setError(errorMessage);
      toast({ variant: "destructive", title: "Error", description: errorMessage });
    }
    setLoading(false);
  };

  const handleGetPlan = async (crop: string) => {
    if (!crop) return;
    setLoading('plan');
    setSelectedCrop(crop);
    setPlan(null);
    setError(null);
    setCurrentView('plan');
    setPlanViewMode('overview'); // Reset to overview view
    setPlanCompleted(false);
    const formData = form.getValues();
    const input: AIProjectGuidanceInput = {
      ...formData,
      cropChoice: crop,
    };

    try {
        const response = await getGuidance(input);
        if (response.success && response.data.plan) {
          setPlan(response.data.plan);
          setCheckedSteps({}); // Reset progress on new plan
        } else {
            const errorMessage = (response.data as any)?.fallbackMessage || "Failed to generate plan. Please try again.";
            setError(errorMessage);
            toast({ variant: "destructive", title: "AI is temporarily unavailable", description: errorMessage });
            setCurrentView('suggestion'); // Go back to suggestion view on plan failure
        }
    } catch (e: any) {
        const errorMessage = e.message || "An unexpected error occurred.";
        setError(errorMessage);
        toast({ variant: "destructive", title: "Error", description: errorMessage });
        setCurrentView('suggestion');
    }
    setLoading(false);
  };
  
  const handleCustomCropSubmit = () => {
    const customCrop = form.getValues('customCrop');
    if (customCrop && customCrop.trim().length > 2) {
      handleGetPlan(customCrop);
    } else {
      form.setError('customCrop', { type: 'manual', message: 'Please enter a valid crop name.' });
    }
  };

  const resetForm = () => {
    form.reset();
    setSuggestion(null);
    setPlan(null);
    setSelectedCrop('');
    setError(null);
    setCurrentView('form');
    setPlanCompleted(false);
  }

  const handleStepCheck = (stepTitle: string, checked: boolean) => {
    setCheckedSteps(prev => ({ ...prev, [stepTitle]: checked }));
  };

  const allStepsChecked = plan ? Object.keys(checkedSteps).length === plan.steps.length && Object.values(checkedSteps).every(Boolean) : false;

  const handleCompletePlan = () => {
    setPlanCompleted(true);
    toast({
        title: "Project Completed!",
        description: `${selectedCrop} has been added to your completed projects.`,
    });
  }
  
  const handleAutofillLocation = () => {
    // In a real app, this would come from a user profile state/context
    const userProfile = {
      village: 'Kanke',
      city: 'Ranchi',
      state: 'Jharkhand'
    };
    form.setValue('location', `${userProfile.village}, ${userProfile.city}, ${userProfile.state}`);
    toast({ title: "Location Autofilled", description: "Your location has been filled from your profile." });
  };

  // Helper to get an icon for a crop
    const getCropIcon = (cropName: string) => {
        const name = cropName.toLowerCase();
        if (name.includes('wheat')) return <Wheat className="h-8 w-8 text-amber-500" />;
        if (name.includes('mustard')) return <Wheat className="h-8 w-8 text-yellow-500" />;
        if (name.includes('chickpea')) return <div className="h-8 w-8 rounded-full bg-gray-800 text-white flex items-center justify-center font-bold text-sm">N</div>;
        return <Leaf className="h-8 w-8 text-green-500" />;
    };
    
    const getStepIcon = (title: string) => {
        const lowerCaseTitle = title.toLowerCase();
        if (lowerCaseTitle.includes('plough')) return <Tractor className="h-6 w-6 text-orange-600" />;
        if (lowerCaseTitle.includes('sow')) return <Leaf className="h-6 w-6 text-green-600" />;
        if (lowerCaseTitle.includes('fertiliz')) return <Wind className="h-6 w-6 text-blue-500" />;
        if (lowerCaseTitle.includes('irrigat')) return <Droplets className="h-6 w-6 text-cyan-500" />;
        if (lowerCaseTitle.includes('nourish')) return <Shield className="h-6 w-6 text-yellow-500" />;
        return <CheckCircle className="h-6 w-6 text-gray-500" />;
    };


  const renderForm = () => (
    <Card>
      <CardHeader>
        <CardTitle>Farm Details</CardTitle>
        <CardDescription>Fill in your farm's details to get a crop suggestion from our AI consultant.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <FormField control={form.control} name="soilType" render={({ field }) => (
            <FormItem>
              <FormLabel>Soil Type</FormLabel>
              <FormControl><Input placeholder="e.g., Alluvial, Black, Red" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="landSize" render={({ field }) => (
            <FormItem>
              <FormLabel>Farm Area (in acres)</FormLabel>
              <FormControl><Input placeholder="e.g., 5" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="lastCrop" render={({ field }) => (
            <FormItem>
              <FormLabel>Last Crop Planted</FormLabel>
              <FormControl><Input placeholder="e.g., Rice, Wheat" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="lastUsedFertilizers" render={({ field }) => (
            <FormItem>
              <FormLabel>Fertilizers Used for Last Crop (Optional)</FormLabel>
              <FormControl><Input placeholder="e.g., Urea, DAP" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="location" render={({ field }) => (
            <FormItem>
              <FormLabel>Farm Location</FormLabel>
              <FormControl><Input placeholder="e.g., Kanke, Ranchi, Jharkhand" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <Button type="button" variant="link" className="p-0 h-auto" onClick={handleAutofillLocation}>
              <LocateFixed className="mr-2 h-4 w-4"/>
              Autofill location from my profile
          </Button>
          </div>
      </CardContent>
      <CardFooter>
          <Button onClick={form.handleSubmit(handleGetSuggestion)} disabled={loading === 'suggestion'} className="w-full">
            {loading === 'suggestion' ? <Loader2 className="animate-spin mr-2"/> : <Wand2 className="mr-2" />}
            Get AI Suggestion
          </Button>
      </CardFooter>
    </Card>
  );

  const renderSuggestion = () => (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Your Crop Recommendation</h1>
            <p className="text-muted-foreground">Based on your farm's data, here are the best crops for you.</p>
        </div>

        {loading === 'suggestion' ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-muted-foreground">Analyzing climate, weather, and farm data...</p>
            </div>
        ) : error ? (
             <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Suggestion Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        ) : suggestion && (
            <div className="space-y-6">
                <div>
                    <h2 className="text-sm font-bold tracking-wider text-muted-foreground uppercase mb-2">Top Recommendation</h2>
                    <Card className="bg-primary/5 border-primary/20">
                        <CardContent className="p-6 flex flex-col items-center text-center">
                            <div className="bg-green-100 dark:bg-green-900/30 rounded-full h-16 w-16 flex items-center justify-center mb-4">
                                <CheckCircle className="h-10 w-10 text-green-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-primary">{suggestion.cropName}</h3>
                            <p className="text-muted-foreground mb-6 max-w-md">{suggestion.reason}</p>
                            <Button onClick={() => handleGetPlan(suggestion.cropName)} size="lg" disabled={!!loading} className="w-full max-w-xs">
                               {loading === 'plan' && selectedCrop === suggestion.cropName ? <Loader2 className='animate-spin mr-2' /> : <Check className="mr-2"/>}
                               Create Plan for {suggestion.cropName}
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <h2 className="text-sm font-bold tracking-wider text-muted-foreground uppercase mb-2">Good Alternatives</h2>
                    <div className="space-y-3">
                       {suggestion.alternativeCrops.map(crop => (
                           <Card key={crop} className="hover:shadow-md transition-shadow">
                               <CardContent className="p-4 flex items-center justify-between">
                                   <div className="flex items-center gap-4">
                                       {getCropIcon(crop)}
                                       <span className="font-bold">{crop}</span>
                                   </div>
                                   <Button variant="ghost" onClick={() => handleGetPlan(crop)} disabled={!!loading}>
                                     {loading === 'plan' && selectedCrop === crop ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : 'Select'}
                                   </Button>
                               </CardContent>
                           </Card>
                       ))}
                    </div>
                </div>
                
                 <Card className="bg-muted/50 border">
                    <CardHeader>
                        <h2 className="text-sm font-bold tracking-wider text-muted-foreground uppercase">Choose Your Own</h2>
                        <CardDescription>
                           If you have another crop in mind, enter it below to generate a custom farming plan.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <FormField
                                control={form.control}
                                name="customCrop"
                                render={({ field }) => (
                                    <FormItem className="flex-grow">
                                        <FormControl>
                                            <Input placeholder="e.g., Sugarcane" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button 
                                type="button" 
                                onClick={handleCustomCropSubmit} 
                                disabled={!!loading || !customCropValue || customCropValue.trim().length < 3}
                                className="w-full sm:w-auto"
                            >
                                {loading === 'plan' && selectedCrop === customCropValue ? <Loader2 className='animate-spin mr-2' /> : <Plus className="mr-2 h-4 w-4" />}
                                Create Custom Plan
                            </Button>
                        </div>
                    </CardContent>
                </Card>
                
                 <div className="pt-4">
                    <Button onClick={resetForm} variant="outline" size="sm" disabled={!!loading}>
                        <RefreshCcw className="mr-2 h-4 w-4" /> Start Over
                    </Button>
                </div>
            </div>
        )}
    </div>
  );

  const renderPlan = () => (
     <Card className="flex-grow">
        <CardHeader className='flex-row items-center justify-between'>
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Farming Plan for {selectedCrop}</h1>
                <p className="text-muted-foreground">Your comprehensive guide for a successful harvest.</p>
            </div>
            <Button onClick={resetForm} variant="outline" disabled={!!loading}><RefreshCcw className="mr-2" /> Start New Plan</Button>
        </CardHeader>
        <CardContent>
        {loading === 'plan' ? (
          <div className="flex flex-col items-center justify-center h-96 space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Our AI is building your detailed plan...</p>
          </div>
        ) : error ? (
            <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Plan Generation Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        ) : plan && planViewMode === 'overview' ? (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-muted/30">
                        <CardHeader className="flex-row items-center gap-4 space-y-0 p-4">
                            <CalendarDays className="h-6 w-6 text-primary flex-shrink-0"/>
                            <div>
                                <CardTitle className="text-base">Growth Duration</CardTitle>
                                <CardDescription className="text-base font-semibold text-foreground">{plan.growthDuration}</CardDescription>
                            </div>
                        </CardHeader>
                    </Card>
                     <Card className="bg-muted/30">
                        <CardHeader className="flex-row items-center gap-4 space-y-0 p-4">
                            <ChevronsRight className="h-6 w-6 text-primary flex-shrink-0"/>
                             <div>
                                <CardTitle className="text-base">Harvesting Period</CardTitle>
                                <CardDescription className="text-base font-semibold text-foreground">{plan.harvestingPeriod}</CardDescription>
                            </div>
                        </CardHeader>
                    </Card>
                     <Card className="bg-muted/30">
                        <CardHeader className="flex-row items-center gap-4 space-y-0 p-4">
                            <Award className="h-6 w-6 text-primary flex-shrink-0"/>
                            <div>
                                <CardTitle className="text-base">Benefits</CardTitle>
                                <CardDescription className="text-base font-semibold text-foreground">{plan.benefits}</CardDescription>
                            </div>
                        </CardHeader>
                    </Card>
                </div>
                 {plan.potentialRisks && plan.potentialRisks.length > 0 && (
                    <Card className="border-amber-500/50 bg-amber-500/10">
                        <CardHeader>
                            <CardTitle className="text-amber-800 dark:text-amber-300 flex items-center gap-2">
                                <AlertTriangle />
                                Potential Diseases & Pests
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                             <ul className="space-y-3">
                                {plan.potentialRisks.map((risk) => (
                                    <li key={risk.name} className="text-amber-700 dark:text-amber-400/80 flex items-start gap-2">
                                        <CheckCircle className="h-4 w-4 mt-1 flex-shrink-0 text-amber-600 dark:text-amber-500" />
                                        <span>
                                            <strong className="font-semibold text-amber-800 dark:text-amber-300">{risk.name}:</strong> {risk.description}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                )}
                 <Button size="lg" className="w-full" onClick={() => setPlanViewMode('interactive')}>
                    Begin Farming <ArrowRight className="ml-2" />
                </Button>
            </div>
        ) : plan && planViewMode === 'interactive' ? (
             <div className="space-y-4">
                {planCompleted ? (
                     <div className="text-center py-10">
                        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4"/>
                        <h2 className="text-2xl font-bold">Your plan got completed!</h2>
                        <p className="text-muted-foreground">This project has been added to your completed projects.</p>
                     </div>
                ) : (
                    <>
                         <Alert variant="destructive" className="bg-orange-50 border-orange-200 text-orange-800 dark:bg-orange-950 dark:border-orange-800 dark:text-orange-300 [&>svg]:text-orange-500">
                           <AlertTriangleIcon />
                           <AlertTitle className="font-bold">Weather Alert: Heatwave Warning</AlertTitle>
                           <AlertDescription>
                             <p>High temperatures are expected for the next 3 days. Take precautions to protect your crops.</p>
                             <p className="font-semibold mt-2">AI Suggestion: Apply light irrigation in the evening to reduce water loss and consider using shade nets if available.</p>
                           </AlertDescription>
                         </Alert>
                        <Accordion type="multiple" defaultValue={plan.steps.map(step => step.title)} className="w-full">
                            {plan.steps.map((step) => (
                            <AccordionItem value={step.title} key={step.title}>
                                <div className="flex items-center gap-3">
                                <Checkbox 
                                    id={`step-${step.title}`}
                                    checked={checkedSteps[step.title] || false}
                                    onCheckedChange={(checked) => handleStepCheck(step.title, !!checked)}
                                    className="h-5 w-5"
                                />
                                <AccordionTrigger className="flex-1 text-lg font-semibold data-[state=open]:text-primary">
                                    {step.title}
                                </AccordionTrigger>
                                </div>
                                <AccordionContent className="pl-8">
                                <p className="text-muted-foreground whitespace-pre-wrap">{step.guidance}</p>
                                </AccordionContent>
                            </AccordionItem>
                            ))}
                        </Accordion>

                        {allStepsChecked && (
                             <Button onClick={handleCompletePlan} className="w-full" size="lg">
                                <Check className="mr-2" />
                                Complete Plan
                            </Button>
                        )}
                        <Button variant="outline" onClick={() => setPlanViewMode('overview')}>Back to Plan Overview</Button>
                    </>
                )}
             </div>
        ) : null}
        </CardContent>
    </Card>
  );
  
  const renderPlaceholder = () => (
     <div className="flex flex-col">
        <Card className="flex-grow">
          <CardHeader>
            <CardTitle>AI Guidance</CardTitle>
            <CardDescription>Your personalized crop recommendations and farming plan will appear here.</CardDescription>
          </CardHeader>
          <CardContent>
              <div className="flex flex-col items-center justify-center h-64 text-center border-2 border-dashed rounded-lg">
                <Wand2 className="h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">Fill out the form to get started.</p>
              </div>
          </CardContent>
        </Card>
      </div>
  );

  const InfoCard = () => (
    <Card>
        <CardHeader>
            <CardTitle>Your Farm Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p><strong>Soil Type:</strong> {form.getValues('soilType')}</p>
            <p><strong>Farm Area:</strong> {form.getValues('landSize')} acres</p>
            <p><strong>Last Crop:</strong> {form.getValues('lastCrop')}</p>
            {form.getValues('lastUsedFertilizers') && <p><strong>Last Fertilizers:</strong> {form.getValues('lastUsedFertilizers')}</p>}
            <p><strong>Location:</strong> {form.getValues('location')}</p>
            {selectedCrop && <p><strong>Selected Crop:</strong> {selectedCrop}</p>}
        </CardContent>
    </Card>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
      <div className="md:col-span-2 flex flex-col">
        <Form {...form}>
            {currentView === 'form' && renderForm()}
            {currentView === 'suggestion' && renderSuggestion()}
            {currentView === 'plan' && renderPlan()}
        </Form>
      </div>
      <div className="hidden md:block md:col-span-1">
        {currentView === 'form' ? renderPlaceholder() : <InfoCard />}
      </div>
    </div>
  );
}
