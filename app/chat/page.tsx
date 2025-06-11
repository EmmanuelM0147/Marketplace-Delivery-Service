import { Chat } from '@/components/chat/chat';

export const metadata = {
  title: 'Agricultural Assistant - Gardenia Marketplace',
  description: 'Get expert farming advice and product recommendations',
};

export default function ChatPage() {
  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Agricultural Assistant</h1>
          <p className="text-muted-foreground">
            Get expert advice on farming, market prices, and product recommendations
          </p>
        </div>
        <div className="mt-8">
          <Chat />
        </div>
      </div>
    </div>
  );
}