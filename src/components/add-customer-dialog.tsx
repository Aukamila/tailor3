
"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { createClient } from "@/lib/supabase-client"
import { useRouter } from "next/navigation"

const optionalNonNegativeNumber = z.union([z.literal("").transform(() => null), z.coerce.number().nonnegative()]).nullable();

const measurementSchema = {
  height: optionalNonNegativeNumber,
  neck: optionalNonNegativeNumber,
  chest: optionalNonNegativeNumber,
  waist: optionalNonNegativeNumber,
  hips: optionalNonNegativeNumber,
  shoulder: optionalNonNegativeNumber,
  neck_width: optionalNonNegativeNumber,
  underbust: optionalNonNegativeNumber,
  nipple_to_nipple: optionalNonNegativeNumber,
  single_shoulder: optionalNonNegativeNumber,
  front_drop: optionalNonNegativeNumber,
  back_drop: optionalNonNegativeNumber,
  sleeve_length: optionalNonNegativeNumber,
  upperarm_width: optionalNonNegativeNumber,
  armhole_curve: optionalNonNegativeNumber,
  armhole_curve_straight: optionalNonNegativeNumber,
  shoulder_to_wrist: optionalNonNegativeNumber,
  shoulder_to_elbow: optionalNonNegativeNumber,
  inner_arm_length: optionalNonNegativeNumber,
  sleeve_opening: optionalNonNegativeNumber,
  cuff_height: optionalNonNegativeNumber,
  inseam_length: optionalNonNegativeNumber,
  outseam_length: optionalNonNegativeNumber,
  waist_to_knee_length: optionalNonNegativeNumber,
  waist_to_ankle: optionalNonNegativeNumber,
  thigh_circ: optionalNonNegativeNumber,
  ankle_circ: optionalNonNegativeNumber,
  back_rise: optionalNonNegativeNumber,
  front_rise: optionalNonNegativeNumber,
  leg_opening: optionalNonNegativeNumber,
  seat_length: optionalNonNegativeNumber,
  neck_band_width: optionalNonNegativeNumber,
  collar_width: optionalNonNegativeNumber,
  collar_point: optionalNonNegativeNumber,
  waist_band: optionalNonNegativeNumber,
  shoulder_to_waist: optionalNonNegativeNumber,
  shoulder_to_ankle: optionalNonNegativeNumber,
};

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  nic: z.string().min(10, { message: "Please enter a valid NIC number."}),
  email: z.string().email(),
  phone: z.string().min(10, { message: "Phone number is too short." }),
  job_number: z.string().min(1, { message: "Job number is required." }),
  request_date: z.date({
    required_error: "A request date is required.",
  }),
  payment_status: z.enum(["Paid", "Unpaid", "Partial"]),
  completion_status: z.enum(["Pending", "In Progress", "Completed"]),
  ...measurementSchema,
})

type AddCustomerDialogProps = {
  children: React.ReactNode
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddCustomerDialog({ children, open, onOpenChange }: AddCustomerDialogProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      nic: "",
      job_number: "",
      request_date: new Date(),
      payment_status: "Unpaid",
      completion_status: "Pending",
      // Initialize all measurement fields to null
      ...Object.keys(measurementSchema).reduce((acc, key) => ({ ...acc, [key]: null }), {})
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        toast({ variant: "destructive", title: "Not authenticated" })
        setIsSubmitting(false)
        return
    }

    const { name, email, phone, nic, job_number, request_date, payment_status, completion_status, ...measurements } = values;
    
    // 1. Insert Customer
    const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .insert({ name, email, phone, nic, job_number, request_date: request_date.toISOString(), user_id: user.id })
        .select()
        .single()
    
    if (customerError) {
        toast({ variant: "destructive", title: "Error adding customer", description: customerError.message })
        setIsSubmitting(false)
        return
    }

    // 2. Insert Measurement
    const measurementToInsert = {
        ...measurements,
        customer_id: customerData.id,
        payment_status,
        completion_status,
        date: new Date().toISOString(),
    }

    const { error: measurementError } = await supabase
        .from('measurements')
        .insert(measurementToInsert)

    if (measurementError) {
        toast({ variant: "destructive", title: "Error adding measurement", description: measurementError.message })
        // Potentially delete the customer here for atomicity
        setIsSubmitting(false)
        return
    }

    toast({
        title: "Customer Added",
        description: `${name} has been successfully added to your records.`,
    })
    
    form.reset()
    onOpenChange(false)
    setIsSubmitting(false)
    router.refresh() // Re-fetches data on the current route
  }
  
  function handleCancel() {
    onOpenChange(false);
    form.reset();
  }

  const renderMeasurementField = (name: keyof typeof measurementSchema, label: string) => (
    <FormField name={name} control={form.control} render={({ field }) => (
        <FormItem><FormLabel>{label}</FormLabel><FormControl><Input type="number" step="0.1" {...field} value={field.value ?? ""} onChange={(e) => field.onChange(e.target.value)} /></FormControl><FormMessage /></FormItem>
    )} />
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[800px] grid-rows-[auto,1fr,auto] max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle>Add New Customer</DialogTitle>
          <DialogDescription>
            Enter customer details and their first set of measurements.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="overflow-y-auto">
          <div className="px-6 space-y-6">
            <Form {...form}>
              <form id="add-customer-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-4">
                      <h3 className="font-semibold">Contact Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <FormField
                            control={form.control}
                            name="nic"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>NIC Number</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., 199012345678" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                      </div>
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
                      <h3 className="font-semibold">Job Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                              control={form.control}
                              name="job_number"
                              render={({ field }) => (
                                  <FormItem>
                                      <FormLabel>Job Number</FormLabel>
                                      <FormControl>
                                          <Input placeholder="e.g., JOB-001" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                  </FormItem>
                              )}
                          />
                          <FormField
                              control={form.control}
                              name="request_date"
                              render={({ field }) => (
                                  <FormItem className="flex flex-col pt-2">
                                      <FormLabel>Request Date</FormLabel>
                                      <Popover>
                                          <PopoverTrigger asChild>
                                              <FormControl>
                                                  <Button
                                                      variant={"outline"}
                                                      className={cn(
                                                          "w-full pl-3 text-left font-normal",
                                                          !field.value && "text-muted-foreground"
                                                      )}
                                                  >
                                                      {field.value ? (
                                                          format(field.value, "PPP")
                                                      ) : (
                                                          <span>Pick a date</span>
                                                      )}
                                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                  </Button>
                                              </FormControl>
                                          </PopoverTrigger>
                                          <PopoverContent className="w-auto p-0" align="start">
                                              <Calendar
                                                  mode="single"
                                                  selected={field.value}
                                                  onSelect={field.onChange}
                                                  initialFocus
                                              />
                                          </PopoverContent>
                                      </Popover>
                                      <FormMessage />
                                  </FormItem>
                              )}
                          />
                          <FormField
                            control={form.control}
                            name="payment_status"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Payment Status</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                    <SelectItem value="Unpaid">Unpaid</SelectItem>
                                    <SelectItem value="Partial">Partial</SelectItem>
                                    <SelectItem value="Paid">Paid</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <FormField
                                control={form.control}
                                name="completion_status"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Completion Status</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                        <SelectItem value="Pending">Pending</SelectItem>
                                        <SelectItem value="In Progress">In Progress</SelectItem>
                                        <SelectItem value="Completed">Completed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                      </div>
                  </div>

                  <Separator />
                  
                  <div className="space-y-4">
                      <h3 className="font-semibold">Initial Measurements (in inches)</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-2">
                          <h4 className="col-span-full font-medium text-base mt-2">Core</h4>
                          {renderMeasurementField("height", "Height")}
                          {renderMeasurementField("neck", "Neck")}
                          {renderMeasurementField("chest", "Chest")}
                          {renderMeasurementField("waist", "Waist")}
                          {renderMeasurementField("hips", "Hips")}

                          <h4 className="col-span-full font-medium text-base mt-4">Upper Body</h4>
                          {renderMeasurementField("shoulder", "Shoulder")}
                          {renderMeasurementField("neck_width", "Neck Width")}
                          {renderMeasurementField("underbust", "Underbust")}
                          {renderMeasurementField("nipple_to_nipple", "Nipple to Nipple")}
                          {renderMeasurementField("single_shoulder", "Single Shoulder")}
                          {renderMeasurementField("front_drop", "Front Drop")}
                          {renderMeasurementField("back_drop", "Back Drop")}
                          
                          <h4 className="col-span-full font-medium text-base mt-4">Arm</h4>
                          {renderMeasurementField("sleeve_length", "Sleeve Length")}
                          {renderMeasurementField("upperarm_width", "Upperarm Width")}
                          {renderMeasurementField("armhole_curve", "Armhole Curve")}
                          {renderMeasurementField("armhole_curve_straight", "Armhole Curve Straight")}
                          {renderMeasurementField("shoulder_to_wrist", "Shoulder to Wrist")}
                          {renderMeasurementField("shoulder_to_elbow", "Shoulder to Elbow")}
                          {renderMeasurementField("inner_arm_length", "Inner Arm Length")}
                          {renderMeasurementField("sleeve_opening", "Sleeve Opening")}
                          {renderMeasurementField("cuff_height", "Cuff Height")}
                          
                          <h4 className="col-span-full font-medium text-base mt-4">Lower Body</h4>
                          {renderMeasurementField("inseam_length", "Inseam Length")}
                          {renderMeasurementField("outseam_length", "Outseam Length")}
                          {renderMeasurementField("waist_to_knee_length", "Waist to Knee Length")}
                          {renderMeasurementField("waist_to_ankle", "Waist to Ankle")}
                          {renderMeasurementField("thigh_circ", "Thigh Circ.")}
                          {renderMeasurementField("ankle_circ", "Ankle Circ.")}
                          {renderMeasurementField("back_rise", "Back Rise")}
                          {renderMeasurementField("front_rise", "Front Rise")}
                          {renderMeasurementField("leg_opening", "Leg Opening")}
                          {renderMeasurementField("seat_length", "Seat Length")}
                          
                          <h4 className="col-span-full font-medium text-base mt-4">Garment Specific</h4>
                          {renderMeasurementField("neck_band_width", "Neck Band Width")}
                          {renderMeasurementField("collar_width", "Collar Width")}
                          {renderMeasurementField("collar_point", "Collar Point")}
                          {renderMeasurementField("waist_band", "Waist Band")}
                          {renderMeasurementField("shoulder_to_waist", "Shoulder to Waist")}
                          {renderMeasurementField("shoulder_to_ankle", "Shoulder to Ankle")}
                      </div>
                  </div>
              </form>
            </Form>
          </div>
        </ScrollArea>
        <DialogFooter className="p-6 pt-4 border-t sm:justify-start">
            <Button type="submit" form="add-customer-form" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Customer'}
            </Button>
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
