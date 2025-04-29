import React from 'react';
import { CompanyProfile } from '@/lib/db/schema'; // Assuming schema types are defined
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface CompanyCardProps {
  company: Partial<CompanyProfile>; // Use partial for MVP, might not have all data
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company }) => {
  return (
    <Card className="bg-gray-800 border-gray-700 text-white">
      <CardHeader>
        <CardTitle>{company.companyName || 'Unnamed Company'}</CardTitle>
        <CardDescription className="text-gray-400">{company.industry || 'Industry not specified'}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-300 mb-2">Location: {company.location || 'N/A'}</p>
        <p className="text-sm text-gray-300 mb-2">Seeking: ${company.fundingAmountSought ? company.fundingAmountSought.toLocaleString() : 'N/A'} ({company.fundingType || 'N/A'})</p>
        {/* Add more relevant details like MRR or Team Size if available */}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full bg-gray-700 border-gray-600 hover:bg-gray-600 text-white">
          View Profile
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CompanyCard;
