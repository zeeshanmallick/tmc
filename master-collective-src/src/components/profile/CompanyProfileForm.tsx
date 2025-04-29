import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Basic company profile schema - will be expanded with more fields
const companyProfileSchema = z.object({
  companyName: z.string().min(1, { message: 'Company name is required.' }),
  
  // Financials - Basic
  revenueLast12Months: z.string().optional(),
  mrr: z.string().optional(),
  arr: z.string().optional(),
  
  // Funding
  fundingAmountSought: z.string().optional(),
  fundingType: z.string().optional(),
  
  // Other info
  website: z.string().url({ message: 'Please enter a valid URL.' }).optional().or(z.literal('')),
  location: z.string().optional(),
  industry: z.string().optional(),
});

type CompanyProfileFormValues = z.infer<typeof companyProfileSchema>;

const CompanyProfileForm: React.FC = () => {
  const form = useForm<CompanyProfileFormValues>({
    resolver: zodResolver(companyProfileSchema),
    defaultValues: {
      companyName: '',
      revenueLast12Months: '',
      mrr: '',
      arr: '',
      fundingAmountSought: '',
      fundingType: '',
      website: '',
      location: '',
      industry: '',
    },
  });

  const onSubmit = (values: CompanyProfileFormValues) => {
    // TODO: Implement actual profile update logic (API call)
    console.log('Company profile form submitted:', values);
    // Example: callApi('/api/profiles/company', values, 'PUT');
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-gray-900 p-8 rounded-lg border border-gray-700">
        <h2 className="text-2xl font-semibold text-white mb-6">Company Profile</h2>
        
        <div className="space-y-4">
          <h3 className="text-xl font-medium text-white">Basic Information</h3>
          
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Company Name</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-gray-800 border-gray-600 text-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="industry"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Industry</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-gray-800 border-gray-600 text-white">
                    <SelectItem value="fintech">Fintech</SelectItem>
                    <SelectItem value="healthtech">Healthtech</SelectItem>
                    <SelectItem value="saas">SaaS</SelectItem>
                    <SelectItem value="ai">AI / Machine Learning</SelectItem>
                    <SelectItem value="ecommerce">E-commerce</SelectItem>
                    <SelectItem value="deeptech">Deep Tech</SelectItem>
                    <SelectItem value="consumer">Consumer Goods</SelectItem>
                    <SelectItem value="media">Media / Entertainment</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Website</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com" {...field} className="bg-gray-800 border-gray-600 text-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Location</FormLabel>
                <FormControl>
                  <Input placeholder="City, Country" {...field} className="bg-gray-800 border-gray-600 text-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="space-y-4">
          <h3 className="text-xl font-medium text-white">Financials</h3>
          
          <FormField
            control={form.control}
            name="revenueLast12Months"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Revenue (Last 12 Months)</FormLabel>
                <FormControl>
                  <Input placeholder="$" {...field} className="bg-gray-800 border-gray-600 text-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="mrr"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Monthly Recurring Revenue (MRR)</FormLabel>
                <FormControl>
                  <Input placeholder="$" {...field} className="bg-gray-800 border-gray-600 text-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="arr"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Annual Recurring Revenue (ARR)</FormLabel>
                <FormControl>
                  <Input placeholder="$" {...field} className="bg-gray-800 border-gray-600 text-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="space-y-4">
          <h3 className="text-xl font-medium text-white">Funding</h3>
          
          <FormField
            control={form.control}
            name="fundingAmountSought"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Funding Amount Sought</FormLabel>
                <FormControl>
                  <Input placeholder="$" {...field} className="bg-gray-800 border-gray-600 text-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="fundingType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Funding Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue placeholder="Select funding type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-gray-800 border-gray-600 text-white">
                    <SelectItem value="equity">Equity</SelectItem>
                    <SelectItem value="safe">SAFE</SelectItem>
                    <SelectItem value="convertible">Convertible Note</SelectItem>
                    <SelectItem value="revenue">Revenue Share</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="pt-4">
          <Button type="submit" className="w-full bg-white text-black hover:bg-gray-200">
            Save Profile
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CompanyProfileForm;
