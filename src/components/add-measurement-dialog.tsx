
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
    addMeasurement(customerId, values)
    toast({
        title: "Measurement Added",
        description: `A new measurement record has been saved for ${customer?.name}.`,
    })
    onOpenChange(false)
    form.reset()
  }
  
  const renderMeasurementField = (name: keyof typeof measurementSchema, label: string) => (
    <FormField name={name} control={form.control} render={({ field }) => (
        <FormItem><FormLabel>{label}</FormLabel><FormControl><Input type="number" step="0.1" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
    )} />
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Add New Measurement</DialogTitle>
          <DialogDescription>
            Enter new measurements for {customer?.name}. All values are in inches.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
             <ScrollArea className="max-h-[60vh]">
                 <div className="space-y-4 p-4 pr-6">
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
            </ScrollArea>
            <DialogFooter className="pt-6 sm:justify-start">
                <Button type="submit">Save Measurement</Button>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
