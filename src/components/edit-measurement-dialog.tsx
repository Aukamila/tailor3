
"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"

import { useCustomerStore, Measurement } from "@/lib/store"
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

const optionalNonNegativeNumber = z.union([z.literal("").transform(() => null), z.coerce.number().nonnegative()]).nullable();

const measurementSchema = {
    height: optionalNonNegativeNumber,
    neck: optionalNonNegativeNumber,
    chest: optionalNonNegativeNumber,
    waist: optionalNonNegativeNumber,
    hips: optionalNonNegativeNumber,
    shoulder: optionalNonNegativeNumber,
    neckWidth: optionalNonNegativeNumber,
    underbust: optionalNonNegativeNumber,
    nippleToNipple: optionalNonNegativeNumber,
    singleShoulder: optionalNonNegativeNumber,
    frontDrop: optionalNonNegativeNumber,
    backDrop: optionalNonNegativeNumber,
    sleeveLength: optionalNonNegativeNumber,
    upperarmWidth: optionalNonNegativeNumber,
    armholeCurve: optionalNonNegativeNumber,
    armholeCurveStraight: optionalNonNegativeNumber,
    shoulderToWrist: optionalNonNegativeNumber,
    shoulderToElbow: optionalNonNegativeNumber,
    innerArmLength: optionalNonNegativeNumber,
    sleeveOpening: optionalNonNegativeNumber,
    cuffHeight: optionalNonNegativeNumber,
    inseamLength: optionalNonNegativeNumber,
    outseamLength: optionalNonNegativeNumber,
    waistToKneeLength: optionalNonNegativeNumber,
    waistToAnkle: optionalNonNegativeNumber,
    thighCirc: optionalNonNegativeNumber,
    ankleCirc: optionalNonNegativeNumber,
    backRise: optionalNonNegativeNumber,
    frontRise: optionalNonNegativeNumber,
    legOpening: optionalNonNegativeNumber,
    seatLength: optionalNonNegativeNumber,
    neckBandWidth: optionalNonNegativeNumber,
    collarWidth: optionalNonNegativeNumber,
    collarPoint: optionalNonNegativeNumber,
    waistBand: optionalNonNegativeNumber,
    shoulderToWaist: optionalNonNegativeNumber,
    shoulderToAnkle: optionalNonNegativeNumber,
};

const formSchema = z.object({
  paymentStatus: z.enum(["Paid", "Unpaid", "Partial"]),
  completionStatus: z.enum(["Pending", "In Progress", "Completed"]),
  ...measurementSchema
})

type EditMeasurementDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customerId: string;
  measurement: Measurement;
}

export function EditMeasurementDialog({ open, onOpenChange, customerId, measurement }: EditMeasurementDialogProps) {
  const { updateMeasurement, customers } = useCustomerStore()
  const customer = customers.find(c => c.id === customerId);
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: measurement,
  })

  React.useEffect(() => {
    form.reset(measurement)
  }, [measurement, form])

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateMeasurement(customerId, { ...measurement, ...values })
    toast({
        title: "Measurement Updated",
        description: `The measurement from ${format(new Date(measurement.date), 'PP')} has been updated for ${customer?.name}.`,
    })
    onOpenChange(false)
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
            Editing measurement for {customer?.name} from {format(new Date(measurement.date), 'PPPP')}. All values are in inches.
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
                                    name="paymentStatus"
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
                                    name="completionStatus"
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
            <Button type="submit" form="edit-measurement-form">Save Changes</Button>
            <Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
