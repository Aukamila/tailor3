
"use client"

import * as React from "react"
import { UserPlus, Scissors } from "lucide-react"
import Link from "next/link"
import { useFormStatus } from "react-dom"
import { useActionState } from "react"
import { signup } from "../actions"

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

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
     <Button type="submit" className="w-full" disabled={pending} variant="default">
      {pending ? "Creating Account..." : "Sign Up"}
      <UserPlus className="ml-2 h-4 w-4" />
    </Button>
  )
}

export default function SignupPage() {
  const [state, formAction] = useActionState(signup, undefined)
  const { toast } = useToast()

  React.useEffect(() => {
    if (state?.error) {
       toast({
        variant: "destructive",
        title: "Signup Failed",
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
            <CardTitle className="font-headline text-3xl">Create an Account</CardTitle>
            <CardDescription>Get started with StitchLink today</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={formAction} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" placeholder="e.g., John Doe" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" name="email" type="email" placeholder="e.g., john.doe@example.com" required />
                </div>
                <div className="space-y-2">
                   <Label htmlFor="password">Password</Label>
                  <Input id="password" name="password" type="password" placeholder="••••••••" required minLength={8}/>
                </div>
                <SubmitButton />
            </form>
          </CardContent>
          <CardFooter className="flex justify-center text-sm">
             <p className="text-muted-foreground">
                Already have an account?{" "}
                <Button variant="link" asChild className="p-0 h-auto">
                    <Link href="/login">Sign In</Link>
                </Button>
             </p>
          </CardFooter>
        </Card>
      </div>
    </main>
  )
}
