'use client';

import { useState, useRef, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, User, AtSign, Phone, Mail, MapPin, Package, Leaf, Image as ImageIcon, X, ArrowRight, ArrowLeft, LocateFixed } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getCropAnalysis } from '@/lib/actions';
import Image from 'next/image';
import { buyerData } from '@/app/(app)/market/buyer-data';
import Link from 'next/link';
import { Globe } from 'lucide-react';


const sellProduceSchema = z.object({
  fullName: z.string().min(2, 'Full name is required.'),
  username: z.string().min(2, 'Username is required.'),
  phone: z.string().min(10, 'A valid phone number is required.'),
  email: z.string().email('Invalid email address.').optional().or(z.literal('')),
  location: z.string().min(3, 'Location is required.'),
  quantity: z.string().min(1, 'Quantity is required.'),
  quantityUnit: z.enum(['kg', 'quintal']),
  cropName: z.string().min(2, 'Crop name is required.'),
  cropSpecies: z.string().min(2, 'Crop species is required.'),
  localName: z.string().optional(),
});

type SellProduceFormValues = z.infer<typeof sellProduceSchema>;

type Buyer = typeof buyerData[0];

export default function SellProduceForm() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [foundBuyers, setFoundBuyers] = useState<Buyer[] | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const form = useForm<SellProduceFormValues>({
    resolver: zodResolver(sellProduceSchema),
    defaultValues: {
      fullName: 'Ram Singh',
      username: 'ram_s',
      phone: '+91 9876543210',
      email: 'ram.s@example.com',
      quantityUnit: 'quintal',
      location: 'Maharashtra, India',
    },
  });

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
    }
  };
  
  const clearPreview = () => {
    setPreview(null);
    setFile(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }

  const handleAnalyze = async () => {
    if (!file || !preview) {
      toast({ variant: 'destructive', title: 'No file selected', description: 'Please upload an image to analyze.' });
      return;
    }
    setLoading(true);
    try {
      const response = await getCropAnalysis({ photoDataUri: preview });
      // This is a mock-up. A real implementation would parse the string to get these details.
      form.setValue('cropName', 'Tomato');
      form.setValue('cropSpecies', 'Solanum lycopersicum');
      form.setValue('localName', 'Tamatar');
      toast({ title: 'Analysis Complete', description: 'Crop details have been auto-filled.' });
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Analysis failed', description: 'Could not auto-fill details. Please enter them manually.' });
    }
    setLoading(false);
  };

  const processForm = async (data: SellProduceFormValues) => {
    setLoading(true);
    // Simulate finding buyers based on location
    await new Promise(resolve => setTimeout(resolve, 1000));
    setFoundBuyers(buyerData);
    setLoading(false);
    setStep(3);
  };

  const nextStep = async () => {
    const isValid = await form.trigger(step === 1 ? ['fullName', 'username', 'phone', 'email', 'location', 'quantity', 'quantityUnit'] : ['cropName', 'cropSpecies']);
    if (isValid) {
      if (step === 2) {
        await processForm(form.getValues());
      } else {
        setStep((prev) => prev + 1);
      }
    }
  };

  const prevStep = () => setStep((prev) => prev - 1);
  
  const handleLiveLocation = () => {
    setLocationLoading(true);
    if (!navigator.geolocation) {
        toast({ variant: 'destructive', title: 'Geolocation not supported', description: "Your browser doesn't support geolocation." });
        setLocationLoading(false);
        return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await response.json();
            const address = data.display_name || `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`;
            form.setValue('location', address);
            form.trigger('location');
            toast({ title: 'Location Updated', description: 'Your current location has been set.' });
        } catch (error) {
            toast({ variant: 'destructive', title: 'Could not fetch address', description: 'Please enter your location manually.' });
        } finally {
            setLocationLoading(false);
        }
    }, (error) => {
        toast({ variant: 'destructive', title: 'Location Access Denied', description: 'Please enable location permissions in your browser.' });
        setLocationLoading(false);
    });
  };

  return (
    <>
    <Card className="mt-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(processForm)}>
          {step === 1 && (
            <>
              <CardHeader>
                <CardTitle>Sell Your Produce - Step 1 of 2</CardTitle>
                <CardDescription>Enter your details and the produce you want to sell.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="fullName" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2"><User /> Full Name</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="username" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2"><AtSign /> Username</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2"><Phone /> Phone Number</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2"><Mail /> Email (Optional)</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="location" render={({ field }) => (
                    <FormItem>
                        <FormLabel className="flex items-center gap-2"><MapPin /> Your Location</FormLabel>
                        <FormControl>
                            <div className="flex items-center gap-2">
                                <Input {...field} />
                                <Button type="button" variant="outline" size="icon" className="h-10 w-10 flex-shrink-0" onClick={handleLiveLocation} disabled={locationLoading}>
                                    {locationLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LocateFixed className="h-4 w-4"/>}
                                </Button>
                            </div>
                        </FormControl>
                         <FormMessage />
                    </FormItem>
                  )} />
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2"><Package /> Quantity to Provide</Label>
                    <div className="flex gap-2">
                        <FormField control={form.control} name="quantity" render={({ field }) => (
                        <FormItem className="flex-grow">
                          <FormControl><Input type="number" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="quantityUnit" render={({ field }) => (
                        <FormItem>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Unit" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="kg">kg</SelectItem>
                              <SelectItem value="quintal">quintal</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button type="button" onClick={nextStep}>Next <ArrowRight className="ml-2 h-4 w-4" /></Button>
              </CardFooter>
            </>
          )}

          {step === 2 && (
             <>
                <CardHeader>
                    <CardTitle>Sell Your Produce - Step 2 of 2</CardTitle>
                    <CardDescription>Provide details about the crop. Upload an image to auto-fill.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className='space-y-4'>
                            <div 
                                className="relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
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
                                    <ImageIcon className="mx-auto h-10 w-10 text-muted-foreground" />
                                    <p className="mt-2 text-sm text-muted-foreground">Upload an image</p>
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
                            <Button type="button" onClick={handleAnalyze} disabled={loading || !file} className="w-full">
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Leaf className="mr-2 h-4 w-4" />}
                                Analyze & Auto-fill
                            </Button>
                        </div>
                        <div className="space-y-4">
                            <FormField control={form.control} name="cropName" render={({ field }) => (
                                <FormItem>
                                <FormLabel>Crop Name</FormLabel>
                                <FormControl><Input placeholder="e.g., Tomato" {...field} /></FormControl>
                                <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="cropSpecies" render={({ field }) => (
                                <FormItem>
                                <FormLabel>Species</FormLabel>
                                <FormControl><Input placeholder="e.g., Solanum lycopersicum" {...field} /></FormControl>
                                <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="localName" render={({ field }) => (
                                <FormItem>
                                <FormLabel>Local Name (Optional)</FormLabel>
                                <FormControl><Input placeholder="e.g., Tamatar" {...field} /></FormControl>
                                <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="justify-between">
                    <Button type="button" variant="outline" onClick={prevStep}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
                    <Button type="button" onClick={nextStep} disabled={loading}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Find Buyers'}
                        {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Button>
                </CardFooter>
             </>
          )}
        </form>
        
        {step === 3 && (
            <>
                <CardHeader>
                    <CardTitle>Potential Buyers Found</CardTitle>
                    <CardDescription>Here are some bulk buyers in the {form.getValues('location')} area for {form.getValues('cropName')}.</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center items-center h-40">
                            <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {foundBuyers?.map(buyer => (
                                <div key={buyer.name} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-lg border p-4">
                                    <div className="flex-1">
                                        <h3 className="font-bold">{buyer.name}</h3>
                                        <p className="text-sm text-muted-foreground">Buying at approx. <span className="font-semibold text-primary">₹{buyer.price_per_quintal}/quintal</span></p>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <Button variant="outline" size="sm" asChild>
                                            <a href={`tel:${buyer.contact}`}><Phone className="mr-2 h-4 w-4" /> Call</a>
                                        </Button>
                                        {buyer.website && (
                                            <Button size="sm" asChild>
                                                <Link href={buyer.website} target="_blank" rel="noopener noreferrer">
                                                    <Globe className="mr-2 h-4 w-4" /> Website
                                                </Link>
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
                <CardFooter className="justify-start">
                    <Button type="button" variant="outline" onClick={() => setStep(1)}><ArrowLeft className="mr-2 h-4 w-4" /> Start Over</Button>
                </CardFooter>
            </>
        )}
      </Form>
    </Card>
    </>
  );
}
