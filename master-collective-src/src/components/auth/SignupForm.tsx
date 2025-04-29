import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button'; // Assuming shadcn/ui is set up
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const signupSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
  role: z.enum(['COMPANY', 'INVESTOR'], { required_error: 'Please select a role.' }),
});

type SignupFormValues = z.infer<typeof signupSchema>;

const SignupForm: React.FC = () => {
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      role: undefined,
    },
  });

  const onSubmit = (values: SignupFormValues) => {
    // TODO: Implement actual signup logic (API call)
    console.log('Signup form submitted:', values);
    // Example: callApi('/api/auth/signup', values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-gray-900 p-8 rounded-lg border border-gray-700">
        <h2 className="text-2xl font-semibold text-center text-white mb-6">Create Account</h2>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300">Email</FormLabel>
              <FormControl>
                <Input placeholder="your@email.com" {...field} className="bg-gray-800 border-gray-600 text-white placeholder-gray-500" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300">Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="********" {...field} className="bg-gray-800 border-gray-600 text-white placeholder-gray-500" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300">I am a...</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-gray-800 border-gray-600 text-white">
                  <SelectItem value="COMPANY" className="hover:bg-gray-700">Company (Seeking Investment)</SelectItem>
                  <SelectItem value="INVESTOR" className="hover:bg-gray-700">Investor (Looking for Opportunities)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full bg-white text-black hover:bg-gray-200">Sign Up</Button>
        <p className="text-sm text-center text-gray-400">
          Already have an account? <a href="/auth/login" className="text-white hover:underline">Log in</a>
        </p>
      </form>
    </Form>
  );
};

export default SignupForm;
