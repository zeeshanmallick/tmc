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
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Basic investor profile schema - will be expanded with more fields
const investorProfileSchema = z.object({
  fullName: z.string().min(1, { message: 'Full name is required.' }),
  phoneNumber: z.string().optional(),
  linkedinProfile: z.string().url({ message: 'Please enter a valid LinkedIn URL.' }).optional().or(z.literal('')),
  investorType: z.string().min(1, { message: 'Investor type is required.' }),
  accreditedInvestor: z.boolean().optional(),
  companyFundName: z.string().optional(),
  locationCountry: z.string().min(1, { message: 'Country is required.' }),
  locationCity: z.string().optional(),
  
  // Investment Preferences
  investmentStages: z.string().min(1, { message: 'Please select at least one investment stage.' }),
  interestedIndustries: z.string().min(1, { message: 'Please select at least one industry.' }),
  typicalInvestmentSize: z.string().min(1, { message: 'Investment size is required.' }),
  investmentsPerYear: z.string().min(1, { message: 'Please select a range.' }),
  leadInvestorRole: z.string().optional(),
  
  // Availability
  activelyInvestingNext3Months: z.boolean().optional(),
});

type InvestorProfileFormValues = z.infer<typeof investorProfileSchema>;

const InvestorProfileForm: React.FC = () => {
  const form = useForm<InvestorProfileFormValues>({
    resolver: zodResolver(investorProfileSchema),
    defaultValues: {
      fullName: '',
      phoneNumber: '',
      linkedinProfile: '',
      investorType: '',
      accreditedInvestor: false,
      companyFundName: '',
      locationCountry: '',
      locationCity: '',
      investmentStages: '',
      interestedIndustries: '',
      typicalInvestmentSize: '',
      investmentsPerYear: '',
      leadInvestorRole: '',
      activelyInvestingNext3Months: false,
    },
  });

  const onSubmit = (values: InvestorProfileFormValues) => {
    // TODO: Implement actual profile update logic (API call)
    console.log('Investor profile form submitted:', values);
    // Example: callApi('/api/profiles/investor', values, 'PUT');
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-gray-900 p-8 rounded-lg border border-gray-700">
        <h2 className="text-2xl font-semibold text-white mb-6">Investor Profile</h2>
        
        <div className="space-y-4">
          <h3 className="text-xl font-medium text-white">Personal Information</h3>
          
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Full Name</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-gray-800 border-gray-600 text-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Phone Number (optional)</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-gray-800 border-gray-600 text-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="linkedinProfile"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">LinkedIn Profile (optional but recommended)</FormLabel>
                <FormControl>
                  <Input placeholder="https://linkedin.com/in/yourprofile" {...field} className="bg-gray-800 border-gray-600 text-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="investorType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Investor Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue placeholder="Select investor type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-gray-800 border-gray-600 text-white">
                    <SelectItem value="angel">Angel Investor</SelectItem>
                    <SelectItem value="vc">Venture Capitalist</SelectItem>
                    <SelectItem value="family">Family Office</SelectItem>
                    <SelectItem value="institutional">Institutional Investor</SelectItem>
                    <SelectItem value="syndicate">Syndicate Member</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="accreditedInvestor"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 bg-gray-800">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-gray-300">
                    I am an accredited investor
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="companyFundName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Company Name / Fund Name (if applicable)</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-gray-800 border-gray-600 text-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="locationCountry"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Country</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-gray-800 border-gray-600 text-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="locationCity"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">City</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-gray-800 border-gray-600 text-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="space-y-4">
          <h3 className="text-xl font-medium text-white">Investment Preferences</h3>
          
          <FormField
            control={form.control}
            name="investmentStages"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">What stage of companies do you invest in?</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue placeholder="Select investment stage" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-gray-800 border-gray-600 text-white">
                    <SelectItem value="pre-seed">Pre-Seed</SelectItem>
                    <SelectItem value="seed">Seed</SelectItem>
                    <SelectItem value="series-a">Series A</SelectItem>
                    <SelectItem value="series-b">Series B+</SelectItem>
                    <SelectItem value="growth">Growth Stage</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="interestedIndustries"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">What industries are you interested in?</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue placeholder="Select primary industry" />
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
                <FormDescription className="text-gray-400">
                  Select your primary focus area. Multiple industries will be supported in the full version.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="typicalInvestmentSize"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">What is your typical investment size per deal?</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue placeholder="Select investment size" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-gray-800 border-gray-600 text-white">
                    <SelectItem value="under25k">Under $25,000</SelectItem>
                    <SelectItem value="25k-100k">$25,000–$100,000</SelectItem>
                    <SelectItem value="100k-500k">$100,000–$500,000</SelectItem>
                    <SelectItem value="500k-1m">$500,000–$1M</SelectItem>
                    <SelectItem value="over1m">$1M+</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="investmentsPerYear"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">How many investments do you typically make per year?</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-gray-800 border-gray-600 text-white">
                    <SelectItem value="1-2">1–2</SelectItem>
                    <SelectItem value="3-5">3–5</SelectItem>
                    <SelectItem value="6-10">6–10</SelectItem>
                    <SelectItem value="10+">10+</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="leadInvestorRole"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Are you open to lead investor roles?</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-gray-800 border-gray-600 text-white">
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="depends">Depends</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="space-y-4">
          <h3 className="text-xl font-medium text-white">Availability</h3>
          
          <FormField
            control={form.control}
            name="activelyInvestingNext3Months"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 bg-gray-800">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-gray-300">
                    I am actively looking to invest in the next 3 months
                  </FormLabel>
                </div>
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

export default InvestorProfileForm;
