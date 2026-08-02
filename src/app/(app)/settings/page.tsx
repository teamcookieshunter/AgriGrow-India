'use client';

import { useRouter } from 'next/navigation';
import { useTransition, useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { type Locale, getTranslations } from '@/app/lib/translations';
import { Languages, Monitor, Moon, Sun, Baseline, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { getCookie, setCookie } from 'cookies-next';
import MyInfoForm from '@/components/my-info-form';

export default function SettingsPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [textSize, setTextSize] = useState(100);
  const [lang, setLang] = useState<Locale>('en');

  useEffect(() => {
    const userLang = getCookie('userLanguage') as Locale | undefined;
    if (userLang) {
      setLang(userLang);
    }
  }, []);

  const t = getTranslations(lang);

  useEffect(() => {
    setMounted(true);
    const storedTextSize = localStorage.getItem('textSize');
    if (storedTextSize) {
      const newSize = parseInt(storedTextSize, 10);
      setTextSize(newSize);
      document.documentElement.style.fontSize = `${newSize}%`;
    }
  }, []);

  const onSelectLanguage = (newLocale: string) => {
    setCookie('userLanguage', newLocale, { maxAge: 31536000, path: '/' });
    startTransition(() => {
      setLang(newLocale as Locale);
      router.refresh();
    });
  };

  const updateTextSize = (newSize: number) => {
    const clampedSize = Math.max(80, Math.min(120, newSize));
    setTextSize(clampedSize);
    document.documentElement.style.fontSize = `${clampedSize}%`;
    localStorage.setItem('textSize', clampedSize.toString());
  };

  const handleTextSizeChange = (value: number[]) => {
    updateTextSize(value[0]);
  };
  
  const increaseTextSize = () => {
    updateTextSize(textSize + 10);
  };
  
  const decreaseTextSize = () => {
    updateTextSize(textSize - 10);
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{t.nav_settings}</h1>
        <p className="text-muted-foreground">{t.settings_subtitle}</p>
      </div>

      <MyInfoForm />
      
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t.preferred_language}</CardTitle>
            <CardDescription>{t.settings_language_desc}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <Label htmlFor="language" className="flex items-center gap-2">
                <Languages className="h-4 w-4" />
                <span>{t.preferred_language}</span>
              </Label>
              <Select
                defaultValue={lang}
                onValueChange={onSelectLanguage}
                disabled={isPending}
              >
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
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Display</CardTitle>
            <CardDescription>
              Customize the application's appearance.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">Theme</Label>
              <div className="grid grid-cols-3 gap-2 rounded-lg bg-muted p-1">
                <Button
                  variant={theme === 'light' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setTheme('light')}
                  className={cn(theme === 'light' && 'shadow-sm')}
                >
                  <Sun className="mr-2 h-4 w-4" /> Light
                </Button>
                <Button
                  variant={theme === 'dark' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setTheme('dark')}
                  className={cn(theme === 'dark' && 'shadow-sm')}
                >
                  <Moon className="mr-2 h-4 w-4" /> Dark
                </Button>
                <Button
                  variant={theme !== 'light' && theme !== 'dark' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setTheme('light')}
                  className={cn(theme !== 'light' && theme !== 'dark' && 'shadow-sm')}
                >
                  <Monitor className="mr-2 h-4 w-4" /> Default
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="text-size" className="flex items-center gap-2">
                <Baseline className="h-4 w-4" />
                Text Size
              </Label>
              <div className="flex items-center gap-2">
                 <Button variant="outline" size="icon" onClick={decreaseTextSize} disabled={textSize <= 80} className="h-9 w-9">
                    <Minus className="h-4 w-4" />
                 </Button>
                <Slider
                  id="text-size"
                  min={80}
                  max={120}
                  step={10}
                  value={[textSize]}
                  onValueChange={handleTextSizeChange}
                />
                 <Button variant="outline" size="icon" onClick={increaseTextSize} disabled={textSize >= 120} className="h-9 w-9">
                    <Plus className="h-4 w-4" />
                 </Button>
                 <span className="text-sm font-medium text-muted-foreground w-12 text-center">
                  {textSize}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
