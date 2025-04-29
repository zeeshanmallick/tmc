import React from 'react';
import { InvestorProfile } from '@/lib/db/schema'; // Assuming schema types are defined
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface InvestorCardProps {
  investor: Partial<InvestorProfile>; // Use partial for MVP, might not have all data
}

const InvestorCard: React.FC<InvestorCardProps> = ({ investor }) => {
  return (
    <Card className="bg-gray-800 border-gray-700 text-white">
      <CardHeader>
        <CardTitle>{investor.fullName || 'Unnamed Investor'}</CardTitle>
        <CardDescription className="text-gray-400">
          {investor.investorType || 'Investor Type not specified'} 
          {investor.companyFundName ? ` at ${investor.companyFundName}` : ''}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-300 mb-2">
          Location: {investor.locationCity ? `${investor.locationCity}, ` : ''}{investor.locationCountry || 'N/A'}
        </p>
        <p className="text-sm text-gray-300 mb-2">
          Investment Size: {investor.typicalInvestmentSize || 'N/A'}
        </p>
        <p className="text-sm text-gray-300 mb-2">
          Focus: {investor.interestedIndustries || 'N/A'}
        </p>
        <p className="text-sm text-gray-300 mb-2">
          Stage: {investor.investmentStages || 'N/A'}
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full bg-gray-700 border-gray-600 hover:bg-gray-600 text-white">
          View Profile
        </Button>
      </CardFooter>
    </Card>
  );
};

export default InvestorCard;
