"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { useCustomerStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "./ui/use-toast"
import { ScrollArea } from "./ui/scroll-area"
import { Separator } from "./ui/separator"

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email(),
  phone: z.string().min(10, { message: "Phone number is too short." }),
  neck: z.coerce.number().positive().nullable(),
  chest: z.coerce.number().positive().nullable(),
  waist: z.coerce.number().positive().nullable(),
  hips: z.coerce.number().positive().nullable(),
  sleeve: z.coerce.number().positive().nullable(),
  inseam: z.coerce.number().positive().nullable(),
})

type AddCustomerDialogProps = {
  children: React.ReactNode
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddCustomerDialog({ children, open, onOpenChange }: AddCustomerDialogProps) {
  const addCustomer = useCustomerStore((state) => state.addCustomer)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      neck: null,
      chest: null,
      waist: null,
      hips: null,
      sleeve: null,
      inseam: null,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { name, email, phone, ...measurements } = values;
    addCustomer({ name, email, phone }, measurements)
    toast({
        title: "Customer Added",
        description: `${name} has been successfully added to your records.`,
    })
    onOpenChange(false)
    form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Customer</DialogTitle>
          <DialogDescription>
            Enter customer details and their first set of measurements.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <ScrollArea className="max-h-[60vh] p-1 pr-6">
                <div className="space-y-6 p-4">
                    <div className="space-y-4">
                        <h3 className="font-semibold">Contact Information</h3>
                        <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., john.doe@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., 123-456-7890" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                        </div>
                    </div>

                    <Separator />
                    
                    <div className="space-y-4">
                         <h3 className="font-semibold">Initial Measurements (in inches)</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <FormField name="neck" control={form.control} render={({ field }) => (
                                <FormItem><FormLabel>Neck</FormLabel><FormControl><Input type="number" step="0.1" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField name="chest" control={form.control} render={({ field }) => (
                                <FormItem><FormLabel>Chest</FormLabel><FormControl><Input type="number" step="0.1" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField name="waist" control={form.control} render={({ field }) => (
                                <FormItem><FormLabel>Waist</FormLabel><FormControl><Input type="number" step="0.1" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField name="hips" control={form.control} render={({ field }) => (
                                <FormItem><FormLabel>Hips</FormLabel><FormControl><Input type="number" step="0.1" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField name="sleeve" control={form.control} render={({ field }) => (
                                <FormItem><FormLabel>Sleeve</FormLabel><FormControl><Input type="number" step="0.1" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField name="inseam" control={form.control} render={({ field }) => (
                                <FormItem><FormLabel>Inseam</FormLabel><FormControl><Input type="number" step="0.1" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                    </div>
                </div>
            </ScrollArea>
            <DialogFooter className="pt-6 pr-6">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                <Button type="submit">Save Customer</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
