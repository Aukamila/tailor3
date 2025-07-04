import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Scissors, LogIn, UserPlus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function WelcomePage() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const { data: { session } } = await supabase.auth.getSession()

  if (session) {
    redirect('/dashboard')
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Scissors className="h-8 w-8" />
          </div>
          <CardTitle className="font-headline text-3xl">Welcome to StitchLink</CardTitle>
          <CardDescription>
            The modern tool for tailors to manage customers and measurements.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button asChild size="lg">
            <Link href="/login">
              <LogIn className="mr-2 h-5 w-5" /> Sign In
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/signup">
              <UserPlus className="mr-2 h-5 w-5" /> Sign Up
            </Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
