import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }), // Basic check for login
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm: React.FC = () => {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    // TODO: Implement actual login logic (API call)
    console.log('Login form submitted:', values);
    // Example: callApi('/api/auth/login', values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-gray-900 p-8 rounded-lg border border-gray-700">
        <h2 className="text-2xl font-semibold text-center text-white mb-6">Log In</h2>
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
        <Button type="submit" className="w-full bg-white text-black hover:bg-gray-200">Log In</Button>
        <p className="text-sm text-center text-gray-400">
          Don't have an account? <a href="/auth/signup" className="text-white hover:underline">Sign up</a>
        </p>
      </form>
    </Form>
  );
};

export default LoginForm;
