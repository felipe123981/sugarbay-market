
    import React from 'react';
    import { Input } from "@/components/ui/input";
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
    import { Slider } from "@/components/ui/slider";
    import { Label } from "@/components/ui/label";
    import { Button } from "@/components/ui/button";
    import { Checkbox } from "@/components/ui/checkbox";
    import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
    import { Search, X, ArrowDownUp, TrendingUp, CalendarPlus, Tag } from 'lucide-react';

    const sortOptions = [
      { value: 'relevance', label: 'Relevance', icon: Search },
      { value: 'latest', label: 'Most Recent', icon: CalendarPlus },
      { value: 'best-selling', label: 'Best Selling', icon: TrendingUp },
      { value: 'price-asc', label: 'Price: Low to High', icon: ArrowDownUp },
      { value: 'price-desc', label: 'Price: High to Low', icon: ArrowDownUp },
    ];

    const ProductFilters = React.memo(({
      categories,
      maxPrice,
      searchTerm,
      setSearchTerm,
      selectedCategory,
      setSelectedCategory,
      priceRange,
      setPriceRange,
      inStockOnly,
      setInStockOnly,
      sortBy,
      setSortBy,
      clearFilters
    }) => {
      return (
        <div className="mb-8 p-4 md:p-6 border rounded-lg bg-card shadow-sm glassmorphism">
          <div className="flex flex-col md:flex-row gap-4 mb-4 items-center">
            <div className="relative flex-grow w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
              />
            </div>

            <div className="hidden md:block">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}><Tag className="inline-block h-4 w-4 mr-2 text-muted-foreground" />{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="hidden md:block">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-[220px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      <option.icon className="inline-block h-4 w-4 mr-2 text-muted-foreground" />
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="more-filters">
              <AccordionTrigger className="text-sm font-medium hover:no-underline">More Filters</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <div className="md:hidden space-y-2">
                     <Label>Category</Label>
                     <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                       <SelectTrigger>
                         <SelectValue placeholder="Select Category" />
                       </SelectTrigger>
                       <SelectContent>
                         {categories.map(category => (
                           <SelectItem key={category} value={category}><Tag className="inline-block h-4 w-4 mr-2 text-muted-foreground" />{category}</SelectItem>
                         ))}
                       </SelectContent>
                     </Select>
                  </div>
                  
                  <div className="md:hidden space-y-2">
                    <Label>Sort By</Label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger>
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                        {sortOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                            <option.icon className="inline-block h-4 w-4 mr-2 text-muted-foreground" />
                            {option.label}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price-range">Price Range: ${priceRange[0]} - ${priceRange[1]}</Label>
                    <Slider
                      id="price-range"
                      min={0}
                      max={maxPrice}
                      step={1}
                      value={priceRange}
                      onValueChange={setPriceRange}
                      className="w-full"
                    />
                  </div>

                  <div className="flex items-center space-x-2 pt-2 md:pt-4">
                    <Checkbox
                      id="in-stock"
                      checked={inStockOnly}
                      onCheckedChange={setInStockOnly}
                    />
                    <Label htmlFor="in-stock" className="cursor-pointer">Show only in stock</Label>
                  </div>

                   <div className="flex justify-end items-center md:col-span-2">
                     <Button variant="ghost" onClick={clearFilters} size="sm">
                       <X className="mr-2 h-4 w-4" /> Clear Filters
                     </Button>
                   </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      );
    });

    export default ProductFilters;
  