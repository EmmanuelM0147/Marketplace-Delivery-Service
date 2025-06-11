"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function PricingFilters() {
  const [category, setCategory] = useState("all");
  const [market, setMarket] = useState("lagos");
  const [search, setSearch] = useState("");

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search commodities..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-8"
        />
      </div>

      <Select value={category} onValueChange={setCategory}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          <SelectItem value="grains">Grains</SelectItem>
          <SelectItem value="vegetables">Vegetables</SelectItem>
          <SelectItem value="fruits">Fruits</SelectItem>
          <SelectItem value="livestock">Livestock</SelectItem>
        </SelectContent>
      </Select>

      <Select value={market} onValueChange={setMarket}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Market" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="lagos">Lagos</SelectItem>
          <SelectItem value="abuja">Abuja</SelectItem>
          <SelectItem value="kano">Kano</SelectItem>
          <SelectItem value="ibadan">Ibadan</SelectItem>
          <SelectItem value="port-harcourt">Port Harcourt</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}