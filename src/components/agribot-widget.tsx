'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Bot, Loader2, Send, User, X, Paperclip, Mic, MicOff } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { sendMessageToAgriBot, getCropAnalysis } from '@/lib/actions';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import type { Translations } from '@/app/lib/translations';

interface Message {
  role: 'user' | 'bot';
  content: string;
  image?: string;
}

// SpeechRecognition type definitions for browsers that support it
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: any) => void;
  onerror: (event: any) => void;
  onend: () => void;
}
declare const window: {
  SpeechRecognition?: { new(): SpeechRecognition };
  webkitSpeechRecognition?: { new(): SpeechRecognition };
};

interface AgriBotWidgetProps {
  t: Translations;
}

export default function AgriBotWidget({ t }: AgriBotWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'bot',
      content: t.agribot_greeting,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollViewportRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();

  const toggleOpen = () => setIsOpen(!isOpen);

  useEffect(() => {
    if (isOpen && scrollViewportRef.current) {
        setTimeout(() => {
            if (scrollViewportRef.current) {
                scrollViewportRef.current.scrollTop = scrollViewportRef.current.scrollHeight;
            }
        }, 100);
    }
  }, [messages, isOpen]);

  // Handle Speech Recognition
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        setInput(finalTranscript + interimTranscript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        toast({variant: 'destructive', title: 'Voice Error', description: 'Could not recognize speech. Please check microphone permissions.'});
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [toast]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      navigator.mediaDevices.getUserMedia({ audio: true }).then(() => {
        recognitionRef.current?.start();
        setIsListening(true);
      }).catch(err => {
        toast({variant: 'destructive', title: 'Microphone Access Denied', description: 'Please enable microphone permissions in your browser.'});
      });
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const chatHistory = messages.map(msg => ({ role: msg.role, content: msg.content }));
      const response = await sendMessageToAgriBot({ prompt: input, history: chatHistory });
      
      if (response.success && response.data.response) {
        const botMessage: Message = { role: 'bot', content: response.data.response };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        const errorMessage: Message = { role: 'bot', content: response.data.fallbackMessage || t.agribot_error_generic };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      const errorMessage: Message = { role: 'bot', content: t.agribot_error_unresponsive };
      setMessages((prev) => [...prev, errorMessage]);
    }

    setLoading(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) { // 4MB limit
        toast({
          variant: 'destructive',
          title: t.toast_file_large_title,
          description: t.toast_file_large_desc,
        });
        return;
    }
    
    const reader = new FileReader();
    reader.onloadend = async () => {
        const dataUri = reader.result as string;

        const userMessage: Message = { role: 'user', content: t.agribot_upload_text, image: dataUri };
        setMessages((prev) => [...prev, userMessage]);
        setLoading(true);

        try {
            const response = await getCropAnalysis({ photoDataUri: dataUri });
            const botMessage: Message = { role: 'bot', content: response.healthAnalysis };
            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            const errorMessage: Message = { role: 'bot', content: t.agribot_error_analysis };
            setMessages((prev) => [...prev, errorMessage]);
        }
        setLoading(false);
    };
    reader.readAsDataURL(file);

    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <Button onClick={toggleOpen} className="rounded-full w-16 h-16 shadow-lg" size="icon">
          {isOpen ? <X className="h-8 w-8" /> : <Bot className="h-8 w-8" />}
          <span className="sr-only">{isOpen ? t.agribot_close : t.agribot_open}</span>
        </Button>
      </div>

      {isOpen && (
          <Card
            className="fixed bottom-24 right-6 z-50 w-[350px] h-[min(600px,80vh)] shadow-2xl flex flex-col"
          >
            <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <Bot className="h-6 w-6 text-primary" />
                <CardTitle className="text-lg">{t.agribot_title}</CardTitle>
              </div>
              <Button variant="ghost" size="icon" onClick={toggleOpen}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="p-0 flex-1 flex flex-col min-h-0">
              <ScrollArea className="flex-1" viewportRef={scrollViewportRef}>
                <div className="space-y-4 p-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex items-start gap-3",
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      )}
                    >
                      {message.role === 'bot' && (
                         <div className="bg-primary rounded-full p-1.5 flex-shrink-0">
                            <Bot className="h-5 w-5 text-primary-foreground" />
                        </div>
                      )}
                      <div
                        className={cn(
                          "p-3 rounded-lg max-w-[80%]",
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground rounded-br-none'
                            : 'bg-muted rounded-bl-none'
                        )}
                      >
                        {message.image && (
                            <div className="relative aspect-square w-48 mx-auto mb-2">
                                <Image src={message.image} alt="Uploaded crop" layout="fill" objectFit="cover" className="rounded-md"/>
                            </div>
                        )}
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                       {message.role === 'user' && (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                  {loading && (
                     <div className="flex items-start gap-3 justify-start">
                        <div className="bg-primary rounded-full p-1.5">
                            <Bot className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <div className="p-3 rounded-lg bg-muted rounded-bl-none">
                            <Loader2 className="h-5 w-5 animate-spin" />
                        </div>
                     </div>
                  )}
                </div>
              </ScrollArea>
              <div className="p-4 border-t">
                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                   <Input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                    />
                  <Button type="button" variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()} disabled={loading}>
                    <Paperclip className="h-5 w-5" />
                  </Button>
                   {recognitionRef.current && (
                    <Button type="button" variant="ghost" size="icon" onClick={toggleListening} disabled={loading}>
                      {isListening ? <MicOff className="h-5 w-5 text-red-500" /> : <Mic className="h-5 w-5" />}
                    </Button>
                   )}
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={isListening ? t.agribot_listening : t.agribot_placeholder}
                    className="flex-1"
                    disabled={loading}
                  />
                  <Button type="submit" size="icon" disabled={loading || !input.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
      )}
    </>
  );
}
