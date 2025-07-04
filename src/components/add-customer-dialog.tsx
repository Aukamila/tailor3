
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { useCustomerStore } from "@/lib/store"
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
import { useToast } from "@/hooks/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

const measurementSchema = {
  height: z.coerce.number().positive().nullable(),
  neck: z.coerce.number().positive().nullable(),
  chest: z.coerce.number().positive().nullable(),
  waist: z.coerce.number().positive().nullable(),
  hips: z.coerce.number().positive().nullable(),
  shoulder: z.coerce.number().positive().nullable(),
  neckWidth: z.coerce.number().positive().nullable(),
  underbust: z.coerce.number().positive().nullable(),
  nippleToNipple: z.coerce.number().positive().nullable(),
  singleShoulder: z.coerce.number().positive().nullable(),
  frontDrop: z.coerce.number().positive().nullable(),
  backDrop: z.coerce.number().positive().nullable(),
  sleeveLength: z.coerce.number().positive().nullable(),
  upperarmWidth: z.coerce.number().positive().nullable(),
  armholeCurve: z.coerce.number().positive().nullable(),
  armholeCurveStraight: z.coerce.number().positive().nullable(),
  shoulderToWrist: z.coerce.number().positive().nullable(),
  shoulderToElbow: z.coerce.number().positive().nullable(),
  innerArmLength: z.coerce.number().positive().nullable(),
  sleeveOpening: z.coerce.number().positive().nullable(),
  cuffHeight: z.coerce.number().positive().nullable(),
  inseamLength: z.coerce.number().positive().nullable(),
  outseamLength: z.coerce.number().positive().nullable(),
  waistToKneeLength: z.coerce.number().positive().nullable(),
  waistToAnkle: z.coerce.number().positive().nullable(),
  thighCirc: z.coerce.number().positive().nullable(),
  ankleCirc: z.coerce.number().positive().nullable(),
  backRise: z.coerce.number().positive().nullable(),
  frontRise: z.coerce.number().positive().nullable(),
  legOpening: z.coerce.number().positive().nullable(),
  seatLength: z.coerce.number().positive().nullable(),
  neckBandWidth: z.coerce.number().positive().nullable(),
  collarWidth: z.coerce.number().positive().nullable(),
  collarPoint: z.coerce.number().positive().nullable(),
  waistBand: z.coerce.number().positive().nullable(),
  shoulderToWaist: z.coerce.number().positive().nullable(),
  shoulderToAnkle: z.coerce.number().positive().nullable(),
};

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email(),
  phone: z.string().min(10, { message: "Phone number is too short." }),
  jobNumber: z.string().min(1, { message: "Job number is required." }),
  requestDate: z.date({
    required_error: "A request date is required.",
  }),
  ...measurementSchema,
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
      jobNumber: "",
      requestDate: undefined,
      height: null, neck: null, chest: null, waist: null, hips: null, shoulder: null,
      neckWidth: null, underbust: null, nippleToNipple: null, singleShoulder: null,
      frontDrop: null, backDrop: null, sleeveLength: null, upperarmWidth: null,
      armholeCurve: null, armholeCurveStraight: null, shoulderToWrist: null,
      shoulderToElbow: null, innerArmLength: null, sleeveOpening: null,
      cuffHeight: null, inseamLength: null, outseamLength: null,
      waistToKneeLength: null, waistToAnkle: null, thighCirc: null, ankleCirc: null,
      backRise: null, frontRise: null, legOpening: null, seatLength: null,
      neckBandWidth: null, collarWidth: null, collarPoint: null, waistBand: null,
      shoulderToWaist: null, shoulderToAnkle: null,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { name, email, phone, jobNumber, requestDate, ...measurements } = values;
    addCustomer({ name, email, phone, jobNumber, requestDate: requestDate.toISOString() }, measurements)
    toast({
        title: "Customer Added",
        description: `${name} has been successfully added to your records.`,
    })
    onOpenChange(false)
    form.reset()
  }
  
  function handleCancel() {
    onOpenChange(false);
    form.reset();
  }

  const renderMeasurementField = (name: keyof typeof measurementSchema, label: string) => (
    <FormField name={name} control={form.control} render={({ field }) => (
        <FormItem><FormLabel>{label}</FormLabel><FormControl><Input type="number" step="0.1" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
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
                      <h3 className="font-semibold">Job Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                              control={form.control}
                              name="jobNumber"
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
                              name="requestDate"
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
                                                  disabled={(date) =>
                                                      date > new Date() || date < new Date("1900-01-01")
                                                  }
                                                  initialFocus
                                              />
                                          </PopoverContent>
                                      </Popover>
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
                          {renderMeasurementField("neckWidth", "Neck Width")}
                          {renderMeasurementField("underbust", "Underbust")}
                          {renderMeasurementField("nippleToNipple", "Nipple to Nipple")}
                          {renderMeasurementField("singleShoulder", "Single Shoulder")}
                          {renderMeasurementField("frontDrop", "Front Drop")}
                          {renderMeasurementField("backDrop", "Back Drop")}
                          
                          <h4 className="col-span-full font-medium text-base mt-4">Arm</h4>
                          {renderMeasurementField("sleeveLength", "Sleeve Length")}
                          {renderMeasurementField("upperarmWidth", "Upperarm Width")}
                          {renderMeasurementField("armholeCurve", "Armhole Curve")}
                          {renderMeasurementField("armholeCurveStraight", "Armhole Curve Straight")}
                          {renderMeasurementField("shoulderToWrist", "Shoulder to Wrist")}
                          {renderMeasurementField("shoulderToElbow", "Shoulder to Elbow")}
                          {renderMeasurementField("innerArmLength", "Inner Arm Length")}
                          {renderMeasurementField("sleeveOpening", "Sleeve Opening")}
                          {renderMeasurementField("cuffHeight", "Cuff Height")}
                          
                          <h4 className="col-span-full font-medium text-base mt-4">Lower Body</h4>
                          {renderMeasurementField("inseamLength", "Inseam Length")}
                          {renderMeasurementField("outseamLength", "Outseam Length")}
                          {renderMeasurementField("waistToKneeLength", "Waist to Knee Length")}
                          {renderMeasurementField("waistToAnkle", "Waist to Ankle")}
                          {renderMeasurementField("thighCirc", "Thigh Circ.")}
                          {renderMeasurementField("ankleCirc", "Ankle Circ.")}
                          {renderMeasurementField("backRise", "Back Rise")}
                          {renderMeasurementField("frontRise", "Front Rise")}
                          {renderMeasurementField("legOpening", "Leg Opening")}
                          {renderMeasurementField("seatLength", "Seat Length")}
                          
                          <h4 className="col-span-full font-medium text-base mt-4">Garment Specific</h4>
                          {renderMeasurementField("neckBandWidth", "Neck Band Width")}
                          {renderMeasurementField("collarWidth", "Collar Width")}
                          {renderMeasurementField("collarPoint", "Collar Point")}
                          {renderMeasurementField("waistBand", "Waist Band")}
                          {renderMeasurementField("shoulderToWaist", "Shoulder to Waist")}
                          {renderMeasurementField("shoulderToAnkle", "Shoulder to Ankle")}
                      </div>
                  </div>
              </form>
            </Form>
          </div>
        </ScrollArea>
        <DialogFooter className="p-6 pt-4 border-t sm:justify-start">
            <Button type="submit" form="add-customer-form">Save Customer</Button>
            <Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
