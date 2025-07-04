
"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"

import { type Measurement } from "@/lib/types"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ScrollArea } from "./ui/scroll-area"
import { Separator } from "./ui/separator"
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
  payment_status: z.enum(["Paid", "Unpaid", "Partial"]),
  completion_status: z.enum(["Pending", "In Progress", "Completed"]),
  ...measurementSchema
})

type EditMeasurementDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customerId: string;
  measurement: Measurement;
}

export function EditMeasurementDialog({ open, onOpenChange, customerId, measurement }: EditMeasurementDialogProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: measurement,
  })

  React.useEffect(() => {
    form.reset(measurement)
  }, [measurement, form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    const supabase = createClient()
    
    const { error } = await supabase
        .from('measurements')
        .update(values)
        .eq('id', measurement.id)

    if (error) {
        toast({ variant: "destructive", title: "Error updating measurement", description: error.message })
        setIsSubmitting(false)
        return
    }

    toast({
        title: "Measurement Updated",
        description: `The measurement from ${format(new Date(measurement.date), 'PP')} has been updated.`,
    })

    onOpenChange(false)
    setIsSubmitting(false)
    router.refresh()
  }

  function handleCancel() {
    onOpenChange(false);
  }
  
  const renderMeasurementField = (name: keyof typeof measurementSchema, label: string) => (
    <FormField name={name} control={form.control} render={({ field }) => (
        <FormItem><FormLabel>{label}</FormLabel><FormControl><Input type="number" step="0.1" {...field} value={field.value ?? ""} onChange={(e) => field.onChange(e.target.value)}/></FormControl><FormMessage /></FormItem>
    )} />
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] grid-rows-[auto,1fr,auto] max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle>Edit Measurement</DialogTitle>
          <DialogDescription>
            Editing measurement from {format(new Date(measurement.date), 'PPPP')}. All values are in inches.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="overflow-y-auto">
            <div className="px-6 space-y-6">
                <Form {...form}>
                    <form id="edit-measurement-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="font-semibold">Job Status</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            <h3 className="font-semibold">Measurements (in inches)</h3>
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
            <Button type="submit" form="edit-measurement-form" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save Changes"}</Button>
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
