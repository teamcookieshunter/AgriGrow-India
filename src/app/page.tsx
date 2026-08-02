'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Languages, Phone, User, AtSign } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import { useState, useEffect } from 'react';
import { getTranslations, type Locale } from '@/app/lib/translations';

export default function LoginPage() {
  const router = useRouter();
  const [language, setLanguage] = useState<Locale>('en');
  const [t, setT] = useState(getTranslations('en'));

  useEffect(() => {
    setT(getTranslations(language));
  }, [language]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would handle OTP sending and verification here.
    // For this scaffold, we'll just navigate to the dashboard.
    document.cookie = `userLanguage=${language}; path=/; max-age=31536000`; // Expires in 1 year
    router.push('/dashboard');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="absolute top-8 left-8">
        <Logo />
      </div>
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">{t.welcome_back}</CardTitle>
          <CardDescription>{t.login_prompt}</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullname" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Full Name
              </Label>
              <Input id="fullname" type="text" placeholder="e.g. Ram Singh" required />
            </div>
             <div className="space-y-2">
              <Label htmlFor="username" className="flex items-center gap-2">
                <AtSign className="h-4 w-4" />
                Username
              </Label>
              <Input id="username" type="text" placeholder="e.g. ram_s" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {t.phone_number}
              </Label>
              <div className="flex items-center gap-2">
                <Select defaultValue="+91">
                  <SelectTrigger className="w-[80px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+91">+91</SelectItem>
                  </SelectContent>
                </Select>
                <Input id="phone" type="tel" placeholder="9876543210" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="language" className="flex items-center gap-2">
                <Languages className="h-4 w-4" />
                {t.preferred_language}
              </Label>
              <Select value={language} onValueChange={(value) => setLanguage(value as Locale)}>
                <SelectTrigger id="language">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">हिन्दी (Hindi)</SelectItem>
                  <SelectItem value="ta">தமிழ் (Tamil)</SelectItem>
                  <SelectItem value="te">తెలుగు (Telugu)</SelectItem>
                  <SelectItem value="mr">मराठी (Marathi)</SelectItem>
                  <SelectItem value="pa">ਪੰਜਾਬੀ (Punjabi)</SelectItem>
                  <SelectItem value="gu">ગુજરાતી (Gujarati)</SelectItem>
                  <SelectItem value="bn">বাংলা (Bengali)</SelectItem>
                  <SelectItem value="or">ଓଡ଼ିଆ (Odia)</SelectItem>
                  <SelectItem value="as">অসমীয়া (Assamese)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
              {t.login_button}
            </Button>
          </CardFooter>
        </form>
      </Card>
      <p className="mt-8 text-center text-sm text-muted-foreground">
        {t.empowering_farmers}
        <br />{t.new_era_agri}
      </p>
    </div>
  );
}
