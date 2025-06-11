"use client";

import { useChat } from 'ai/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Mic, Send, StopCircle } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'yo', name: 'Yoruba' },
  { code: 'ha', name: 'Hausa' },
  { code: 'ig', name: 'Igbo' },
  { code: 'pcm', name: 'Pidgin English' },
];

export function Chat() {
  const [language, setLanguage] = useState('en');
  const [isRecording, setIsRecording] = useState(false);

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    body: { language },
  });

  const toggleRecording = async () => {
    if (!isRecording) {
      try {
        const recognition = new (window as any).webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.lang = language === 'en' ? 'en-US' : 'en-NG';
        
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          handleInputChange({ target: { value: transcript } } as any);
        };
        
        recognition.start();
        setIsRecording(true);
        
        recognition.onend = () => setIsRecording(false);
      } catch (error) {
        console.error('Speech recognition error:', error);
      }
    } else {
      setIsRecording(false);
    }
  };

  return (
    <div className="rounded-lg border bg-background">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="font-semibold">Chat with Agricultural Expert</h2>
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem key={lang.code} value={lang.code}>
                {lang.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="h-[600px] overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'assistant' ? 'justify-start' : 'justify-end'
            }`}
          >
            <div
              className={`rounded-lg px-4 py-2 max-w-[80%] ${
                message.role === 'assistant'
                  ? 'bg-muted'
                  : 'bg-primary text-primary-foreground'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={toggleRecording}
        >
          {isRecording ? (
            <StopCircle className="h-4 w-4" />
          ) : (
            <Mic className="h-4 w-4" />
          )}
        </Button>
        <Input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask about farming, market prices, or products..."
          className="flex-1"
        />
        <Button type="submit" disabled={isLoading}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}