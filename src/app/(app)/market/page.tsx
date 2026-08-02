
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BuySeeds from '@/components/buy-seeds';
import SellProduceForm from '@/components/sell-produce-form';

export default function MarketPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Marketplace</h1>
        <p className="text-muted-foreground">
          Connect with buyers and sellers for your agricultural needs.
        </p>
      </div>

      <Tabs defaultValue="buy" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="buy">Buy Seeds</TabsTrigger>
          <TabsTrigger value="sell">Sell Your Produce</TabsTrigger>
        </TabsList>
        <TabsContent value="buy">
          <BuySeeds />
        </TabsContent>
        <TabsContent value="sell">
          <SellProduceForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
