"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";

export default function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [availability, setAvailability] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  const updateFilters = () => {
    const params = new URLSearchParams(searchParams);
    
    params.set("minPrice", priceRange[0].toString());
    params.set("maxPrice", priceRange[1].toString());
    
    if (availability.length) {
      params.set("availability", availability.join(","));
    } else {
      params.delete("availability");
    }
    
    if (categories.length) {
      params.set("categories", categories.join(","));
    } else {
      params.delete("categories");
    }

    router.push(`/products?${params.toString()}`);
  };

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="price">
        <AccordionTrigger>Price Range</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            <Slider
              value={priceRange}
              min={0}
              max={1000}
              step={10}
              onValueChange={setPriceRange}
            />
            <div className="flex items-center justify-between text-sm">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="availability">
        <AccordionTrigger>Availability</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="in-stock"
                checked={availability.includes("in-stock")}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setAvailability([...availability, "in-stock"]);
                  } else {
                    setAvailability(availability.filter(a => a !== "in-stock"));
                  }
                }}
              />
              <label htmlFor="in-stock">In Stock</label>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="categories">
        <AccordionTrigger>Categories</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2">
            {["Grains", "Fruits", "Vegetables", "Livestock"].map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={category.toLowerCase()}
                  checked={categories.includes(category.toLowerCase())}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setCategories([...categories, category.toLowerCase()]);
                    } else {
                      setCategories(categories.filter(c => c !== category.toLowerCase()));
                    }
                  }}
                />
                <label htmlFor={category.toLowerCase()}>{category}</label>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>

      <Button onClick={updateFilters} className="w-full mt-4">
        Apply Filters
      </Button>
    </Accordion>
  );
}