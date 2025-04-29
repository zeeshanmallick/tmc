import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CompanySearchFiltersProps {
  onSearch: (filters: any) => void; // Replace 'any' with a specific filter type later
}

const CompanySearchFilters: React.FC<CompanySearchFiltersProps> = ({ onSearch }) => {
  // State for filters would go here, using useState
  // For MVP, we'll just have basic structure

  const handleSearch = () => {
    // Gather filter values from state
    const filters = {
      // Example filters
      industry: 'fintech',
      stage: 'seed',
    };
    onSearch(filters);
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg border border-gray-700 mb-6">
      <h3 className="text-lg font-semibold text-white mb-4">Filter Companies</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Industry Filter */}
        <div>
          <Label htmlFor="industry" className="text-gray-300">Industry</Label>
          <Select /* value={industry} onValueChange={setIndustry} */ >
            <SelectTrigger id="industry" className="bg-gray-800 border-gray-600 text-white">
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600 text-white">
              <SelectItem value="all">All Industries</SelectItem>
              <SelectItem value="fintech">Fintech</SelectItem>
              <SelectItem value="healthtech">Healthtech</SelectItem>
              <SelectItem value="saas">SaaS</SelectItem>
              {/* Add other industries */}
            </SelectContent>
          </Select>
        </div>

        {/* Funding Stage Filter */}
        <div>
          <Label htmlFor="stage" className="text-gray-300">Funding Stage</Label>
          <Select /* value={stage} onValueChange={setStage} */ >
            <SelectTrigger id="stage" className="bg-gray-800 border-gray-600 text-white">
              <SelectValue placeholder="Select stage" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600 text-white">
              <SelectItem value="all">All Stages</SelectItem>
              <SelectItem value="pre-seed">Pre-Seed</SelectItem>
              <SelectItem value="seed">Seed</SelectItem>
              <SelectItem value="series-a">Series A</SelectItem>
              {/* Add other stages */}
            </SelectContent>
          </Select>
        </div>

        {/* Location Filter */}
        <div>
          <Label htmlFor="location" className="text-gray-300">Location</Label>
          <Input id="location" placeholder="City or Country" className="bg-gray-800 border-gray-600 text-white" /* value={location} onChange={(e) => setLocation(e.target.value)} */ />
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <Button onClick={handleSearch} className="bg-white text-black hover:bg-gray-200">Search</Button>
      </div>
    </div>
  );
};

export default CompanySearchFilters;
