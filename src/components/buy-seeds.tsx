
'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ArrowDown,
  ArrowUp,
  Link as LinkIcon,
  Search,
  Phone,
  Globe,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { seedData } from '@/app/(app)/market/seed-data';
import Link from 'next/link';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
  

export default function BuySeeds() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = seedData.filter(
    (item) =>
      item.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.variety.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="mt-6 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search for a seed..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Buy Seeds</CardTitle>
            <CardDescription>
              Find prices for seeds from local sellers. Prices are per kg.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Crop</TableHead>
                  <TableHead>Variety</TableHead>
                  <TableHead className="text-right">Price (₹/kg)</TableHead>
                  <TableHead className="text-center">Trend</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <TableRow key={`${item.crop}-${item.variety}`}>
                      <TableCell className="font-medium">{item.crop}</TableCell>
                      <TableCell>{item.variety}</TableCell>
                      <TableCell className="text-right font-mono">
                        {item.price.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={item.trend === 'up' ? 'default' : 'destructive'}
                          className={
                            item.trend === 'up'
                              ? 'bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400'
                              : 'bg-red-500/20 text-red-700 dark:bg-red-500/10 dark:text-red-400'
                          }
                        >
                          {item.trend === 'up' ? (
                            <ArrowUp className="mr-1 h-3 w-3" />
                          ) : (
                            <ArrowDown className="mr-1 h-3 w-3" />
                          )}
                          {item.change}%
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" size="sm">
                                <LinkIcon className="mr-2 h-4 w-4" />
                                Contact Seller
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                                <div className="grid gap-4">
                                <div className="space-y-2">
                                    <h4 className="font-medium leading-none">{item.seller.name}</h4>
                                    <p className="text-sm text-muted-foreground">
                                    Local supplier of quality seeds.
                                    </p>
                                </div>
                                <div className="grid gap-2">
                                    <div className="grid grid-cols-[25px_1fr] items-start pb-2 last:mb-0 last:pb-0">
                                        <Phone className="h-4 w-4 mt-0.5" />
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium leading-none">
                                            {item.seller.contact}
                                            </p>
                                        </div>
                                    </div>
                                    {item.seller.website && (
                                        <div className="grid grid-cols-[25px_1fr] items-start">
                                            <Globe className="h-4 w-4 mt-0.5" />
                                            <div className="space-y-1">
                                                <Link href={item.seller.website} target="_blank" rel="noopener noreferrer" className="text-sm font-medium leading-none text-blue-600 hover:underline">
                                                    Visit Website
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
                      No seeds found matching your search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
