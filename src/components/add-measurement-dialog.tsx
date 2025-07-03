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

const formSchema = z.object({
  neck: z.coerce.number().positive().nullable(),
  chest: z.coerce.number().positive().nullable(),
  waist: z.coerce.number().positive().nullable(),
  hips: z.coerce.number().positive().nullable(),
  sleeve: z.coerce.number().positive().nullable(),
  inseam: z.coerce.number().positive().nullable(),
})

type AddMeasurementDialogProps = {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customerId: string;
}

export function AddMeasurementDialog({ children, open, onOpenChange, customerId }: AddMeasurementDialogProps) {
  const { addMeasurement, customers } = useCustomerStore()
  const customer = customers.find(c => c.id === customerId);
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      neck: null,
      chest: null,
      waist: null,
      hips: null,
      sleeve: null,
      inseam: null,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    addMeasurement(customerId, values)
    toast({
        title: "Measurement Added",
        description: `A new measurement record has been saved for ${customer?.name}.`,
    })
    onOpenChange(false)
    form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Add New Measurement</DialogTitle>
          <DialogDescription>
            Enter new measurements for {customer?.name}. All values are in inches.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
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
            <DialogFooter>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                <Button type="submit">Save Measurement</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
