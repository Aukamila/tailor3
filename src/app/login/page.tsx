
"use client"

import * as React from "react"
import { LogIn, Scissors } from "lucide-react"
import Link from "next/link"
import { useFormState, useFormStatus } from "react-dom"
import { login } from "../actions"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" className="w-full" disabled={pending} variant="default">
      {pending ? "Signing In..." : "Sign In"}
      <LogIn className="ml-2 h-4 w-4" />
    </Button>
  )
}

export default function LoginPage() {
  const [state, formAction] = useFormState(login, undefined)
  const { toast } = useToast()

  React.useEffect(() => {
    if (state?.error) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: state.error,
      })
    }
  }, [state, toast])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Scissors className="h-8 w-8" />
            </div>
            <CardTitle className="font-headline text-3xl">StitchLink</CardTitle>
            <CardDescription>Sign in to manage your workshop</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={formAction} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" name="email" type="email" placeholder="e.g., owner@stitch.link" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" placeholder="••••••••" required />
              </div>
              <SubmitButton />
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-4 text-sm">
             <p className="text-muted-foreground">
                Don't have an account?{" "}
                <Button variant="link" asChild className="p-0 h-auto">
                    <Link href="/signup">Sign Up</Link>
                </Button>
             </p>
          </CardFooter>
        </Card>
      </div>
    </main>
  )
}
