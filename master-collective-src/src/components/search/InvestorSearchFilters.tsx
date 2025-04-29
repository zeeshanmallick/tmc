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

interface InvestorSearchFiltersProps {
  onSearch: (filters: any) => void; // Replace 'any' with a specific filter type later
}

const InvestorSearchFilters: React.FC<InvestorSearchFiltersProps> = ({ onSearch }) => {
  // State for filters would go here, using useState

  const handleSearch = () => {
    // Gather filter values from state
    const filters = {
      // Example filters
      investorType: 'vc',
      stage: 'seed',
      industry: 'fintech',
    };
    onSearch(filters);
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg border border-gray-700 mb-6">
      <h3 className="text-lg font-semibold text-white mb-4">Filter Investors</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Investor Type Filter */}
        <div>
          <Label htmlFor="investorType" className="text-gray-300">Investor Type</Label>
          <Select /* value={investorType} onValueChange={setInvestorType} */ >
            <SelectTrigger id="investorType" className="bg-gray-800 border-gray-600 text-white">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600 text-white">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="angel">Angel Investor</SelectItem>
              <SelectItem value="vc">Venture Capitalist</SelectItem>
              <SelectItem value="family">Family Office</SelectItem>
              {/* Add other types */}
            </SelectContent>
          </Select>
        </div>

        {/* Preferred Stage Filter */}
        <div>
          <Label htmlFor="stage" className="text-gray-300">Preferred Stage</Label>
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

        {/* Industry Focus Filter */}
        <div>
          <Label htmlFor="industry" className="text-gray-300">Industry Focus</Label>
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
      </div>
      <div className="mt-4 flex justify-end">
        <Button onClick={handleSearch} className="bg-white text-black hover:bg-gray-200">Search</Button>
      </div>
    </div>
  );
};

export default InvestorSearchFilters;
