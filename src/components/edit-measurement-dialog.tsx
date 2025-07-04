
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
import { useToast } from "@/hooks/use-toast"
import { ScrollArea } from "./ui/scroll-area"

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

const formSchema = z.object(measurementSchema)

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
        <FormItem><FormLabel>{label}</FormLabel><FormControl><Input type="number" step="0.1" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
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
            <div className="px-6">
                <Form {...form}>
                    <form id="edit-measurement-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
