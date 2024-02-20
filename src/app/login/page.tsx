"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { auth } from '@/firebase/config';

import { signInWithEmailAndPassword } from "firebase/auth";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { LoginFormSchema } from '@/components/schema';
import { UserAuth } from '../context/firebaseContext';

export default function LoginPage() {
  const { user, googleSignIn, logOut, emailSignIn } = UserAuth();
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      await googleSignIn();
      router.push("/")
    } catch (error) {
      console.log(error);
    }
  };

  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: ""
    },
  })

  async function onSubmit(data: z.infer<typeof LoginFormSchema>) {
    try {
      console.log(data);
      await emailSignIn(data.email, data.password);
      router.push("/");
    } catch (error) {
      // Handle the authentication error
      console.error("Authentication failed:", (error as Error).message);
      // You can also set an error state in your form for user feedback if needed
    }
  }

  return (
    <div className='text-sm h-screen flex flex-col items-center justify-center'>
      <h1 className='text-2xl mb-3'>Log in now!</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-1/3 h-auto space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input className="min-w-3" placeholder="Enter email" {...field} />
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Enter password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Form>
      <h1 className='mt-6 -mb-2'>Already have an account?</h1>
      <Button variant="link" onClick={() => router.push("/signup")}>
        Signup
      </Button>
      <Button className="mt-2" variant="outline" onClick={handleSignIn}>
        Log in with Google
      </Button>
    </div>
  )
}