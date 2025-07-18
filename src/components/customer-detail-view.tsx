
"use client"

import * as React from "react"
import Link from "next/link"
import { format } from 'date-fns';
import { type Customer, type Measurement, type PaymentStatus, type CompletionStatus } from "@/lib/types"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, Mail, Phone, PlusCircle, Ruler, FileText, Calendar, CreditCard, Pencil } from "lucide-react"
import { AddMeasurementDialog } from "@/components/add-measurement-dialog";
import { EditMeasurementDialog } from "./edit-measurement-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const measurementLabels: Record<string, string> = {
    height: 'Height', neck: 'Neck', chest: 'Chest', waist: 'Waist', hips: 'Hips', shoulder: 'Shoulder',
    neck_width: 'Neck Width', underbust: 'Underbust', nipple_to_nipple: 'Nipple to Nipple', single_shoulder: 'Single Shoulder',
    front_drop: 'Front Drop', back_drop: 'Back Drop', sleeve_length: 'Sleeve Length', upperarm_width: 'Upperarm Width',
    armhole_curve: 'Armhole Curve', armhole_curve_straight: 'Armhole Curve (Straight)', shoulder_to_wrist: 'Shoulder to Wrist',
    shoulder_to_elbow: 'Shoulder to Elbow', inner_arm_length: 'Inner Arm Length', sleeve_opening: 'Sleeve Opening',
    cuff_height: 'Cuff Height', inseam_length: 'Inseam Length', outseam_length: 'Outseam Length',
    waist_to_knee_length: 'Waist to Knee Length', waist_to_ankle: 'Waist to Ankle', thigh_circ: 'Thigh Circ.', ankle_circ: 'Ankle Circ.',
    back_rise: 'Back Rise', front_rise: 'Front Rise', leg_opening: 'Leg Opening', seat_length: 'Seat Length',
    neck_band_width: 'Neck Band Width', collar_width: 'Collar Width', collar_point: 'Collar Point', waist_band: 'Waist Band',
    shoulder_to_waist: 'Shoulder to Waist', shoulder_to_ankle: 'Shoulder to Ankle',
};

type MeasurementKey = keyof Omit<Measurement, 'id' | 'date' | 'payment_status' | 'completion_status' | 'customer_id' | 'user_id' | 'created_at'>;

const measurementGroups: { [key: string]: MeasurementKey[] } = {
    "Core": ['height', 'neck', 'chest', 'waist', 'hips'],
    "Upper Body": ['shoulder', 'neck_width', 'underbust', 'nipple_to_nipple', 'single_shoulder', 'front_drop', 'back_drop'],
    "Arm": ['sleeve_length', 'upperarm_width', 'armhole_curve', 'armhole_curve_straight', 'shoulder_to_wrist', 'shoulder_to_elbow', 'inner_arm_length', 'sleeve_opening', 'cuff_height'],
    "Lower Body": ['inseam_length', 'outseam_length', 'waist_to_knee_length', 'waist_to_ankle', 'thigh_circ', 'ankle_circ', 'back_rise', 'front_rise', 'leg_opening', 'seat_length'],
    "Garment Specific": ['neck_band_width', 'collar_width', 'collar_point', 'waist_band', 'shoulder_to_waist', 'shoulder_to_ankle']
};

type MeasurementGroupCardProps = {
    title: string;
    measurements: Measurement;
    fields: MeasurementKey[];
}

function MeasurementGroupCard({ title, measurements, fields }: MeasurementGroupCardProps) {
    const hasData = fields.some(field => measurements[field] != null && measurements[field] !== 0);

    if (!hasData) return null;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">{title}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                {fields.map(field => {
                    const value = measurements[field];
                    return (value != null && value !== 0) ? (
                        <React.Fragment key={field}>
                            <div className="font-medium text-muted-foreground">{measurementLabels[field]}</div>
                            <div className="text-right tabular-nums">{value}"</div>
                        </React.Fragment>
                    ) : null;
                })}
            </CardContent>
        </Card>
    )
}

export function CustomerDetailView({ customer }: { customer: Customer }) {
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [editingMeasurement, setEditingMeasurement] = React.useState<Measurement | null>(null);

  const sortedMeasurements = customer.measurements || [];

  const getPaymentStatusVariant = (status: PaymentStatus) => {
    switch (status) {
        case 'Paid': return 'default';
        case 'Partial': return 'secondary';
        case 'Unpaid': return 'destructive';
        default: return 'outline';
    }
  }

  const getCompletionStatusVariant = (status: CompletionStatus) => {
    switch (status) {
        case 'Completed': return 'default';
        case 'In Progress': return 'secondary';
        case 'Pending': return 'outline';
        default: return 'outline';
    }
  }

  return (
    <main className="flex-1 p-4 md:p-8 space-y-8">
        <div className="flex items-center gap-4">
             <Button variant="outline" size="icon" asChild>
                <Link href="/dashboard"><ChevronLeft className="h-4 w-4" /></Link>
            </Button>
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-2xl">{customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold font-headline">{customer.name}</h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><Mail className="h-4 w-4" /> {customer.email}</span>
                <span className="flex items-center gap-1.5"><Phone className="h-4 w-4" /> {customer.phone}</span>
                <span className="flex items-center gap-1.5"><CreditCard className="h-4 w-4" /> {customer.nic}</span>
                <span className="flex items-center gap-1.5"><FileText className="h-4 w-4" /> {customer.job_number}</span>
                <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> Requested on {format(new Date(customer.request_date), 'PP')}</span>
              </div>
            </div>
        </div>

        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2"><Ruler className="h-5 w-5"/> Measurement History</CardTitle>
                    <CardDescription>All recorded measurements for {customer.name}.</CardDescription>
                </div>
                 <AddMeasurementDialog customerId={customer.id} open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <Button onClick={() => setIsAddDialogOpen(true)} variant="default">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Measurement
                    </Button>
                </AddMeasurementDialog>
            </CardHeader>
            <CardContent>
                {sortedMeasurements.length > 0 ? (
                <Tabs defaultValue={sortedMeasurements[0].id} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 h-auto flex-wrap justify-start">
                        {sortedMeasurements.map((m) => (
                            <TabsTrigger key={m.id} value={m.id}>
                                {format(new Date(m.date), 'PP')}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    {sortedMeasurements.map((m) => (
                        <TabsContent key={m.id} value={m.id}>
                            <div className="pt-4 border-t mt-2">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="flex items-center gap-4">
                                        <h3 className="text-lg font-semibold">Details for {format(new Date(m.date), 'PPPP')}</h3>
                                        <div className="flex items-center gap-2">
                                            <Badge variant={getPaymentStatusVariant(m.payment_status)} className={cn(m.payment_status === 'Paid' && 'bg-green-600')}>{m.payment_status}</Badge>
                                            <Badge variant={getCompletionStatusVariant(m.completion_status)} className={cn(m.completion_status === 'Completed' && 'bg-green-600')}>{m.completion_status}</Badge>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm" onClick={() => setEditingMeasurement(m)}>
                                        <Pencil className="mr-2 h-4 w-4" />
                                        Edit this record
                                    </Button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {Object.entries(measurementGroups).map(([groupTitle, fields]) => (
                                        <MeasurementGroupCard
                                            key={groupTitle}
                                            title={groupTitle}
                                            measurements={m}
                                            fields={fields}
                                        />
                                    ))}
                                </div>
                            </div>
                        </TabsContent>
                    ))}
                </Tabs>
                ) : (
                    <div className="text-center text-muted-foreground py-12">
                        No measurement history found. Add the first record to get started.
                    </div>
                )}
            </CardContent>
        </Card>
        {editingMeasurement && (
            <EditMeasurementDialog
                customerId={customer.id}
                measurement={editingMeasurement}
                open={!!editingMeasurement}
                onOpenChange={(open) => {
                    if (!open) {
                        setEditingMeasurement(null);
                    }
                }}
            />
        )}
    </main>
  )
}
