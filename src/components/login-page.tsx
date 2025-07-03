
"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { LogIn, Scissors } from "lucide-react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(1, { message: "Password is required." }),
})

export function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = React.useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    // Mock authentication
    setTimeout(() => {
      if (values.email === "owner@stitch.link" && values.password === "password123") {
        toast({
          title: "Login Successful",
          description: "Welcome back!",
        })
        router.push("/dashboard")
      } else {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "Invalid email or password. Please try again.",
        })
        setIsLoading(false)
      }
    }, 1000)
  }

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
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., owner@stitch.link" {...field} />
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
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <Button type="submit" className="w-full" disabled={isLoading} variant="default">
                  {isLoading ? "Signing In..." : "Sign In"}
                  <LogIn className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center text-sm">
             <p className="text-muted-foreground">Use <span className="font-semibold text-foreground">owner@stitch.link</span> and <span className="font-semibold text-foreground">password123</span></p>
          </CardFooter>
        </Card>
      </div>
    </main>
  )
}
