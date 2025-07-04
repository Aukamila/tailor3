
"use client"

import * as React from "react"
import Link from "next/link"
import { format } from 'date-fns';
import { useCustomerStore, Measurement, PaymentStatus, CompletionStatus } from "@/lib/store"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, Mail, Phone, PlusCircle, Ruler, FileText, Calendar, CreditCard, Pencil } from "lucide-react"
import { AddMeasurementDialog } from "@/components/add-measurement-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { EditMeasurementDialog } from "./edit-measurement-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function CustomerDetailSkeleton() {
    return (
        <main className="flex-1 p-4 md:p-8 space-y-8">
            <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-md" />
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-[500px]" />
                </div>
            </div>
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-4 w-80" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {[...Array(5)].map((_, i) => (
                           <Skeleton key={i} className="h-12 w-full" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        </main>
    )
}

const measurementLabels: Record<string, string> = {
    height: 'Height', neck: 'Neck', chest: 'Chest', waist: 'Waist', hips: 'Hips', shoulder: 'Shoulder',
    neckWidth: 'Neck Width', underbust: 'Underbust', nippleToNipple: 'Nipple to Nipple', singleShoulder: 'Single Shoulder',
    frontDrop: 'Front Drop', backDrop: 'Back Drop', sleeveLength: 'Sleeve Length', upperarmWidth: 'Upperarm Width',
    armholeCurve: 'Armhole Curve', armholeCurveStraight: 'Armhole Curve (Straight)', shoulderToWrist: 'Shoulder to Wrist',
    shoulderToElbow: 'Shoulder to Elbow', innerArmLength: 'Inner Arm Length', sleeveOpening: 'Sleeve Opening',
    cuffHeight: 'Cuff Height', inseamLength: 'Inseam Length', outseamLength: 'Outseam Length',
    waistToKneeLength: 'Waist to Knee Length', waistToAnkle: 'Waist to Ankle', thighCirc: 'Thigh Circ.', ankleCirc: 'Ankle Circ.',
    backRise: 'Back Rise', frontRise: 'Front Rise', legOpening: 'Leg Opening', seatLength: 'Seat Length',
    neckBandWidth: 'Neck Band Width', collarWidth: 'Collar Width', collarPoint: 'Collar Point', waistBand: 'Waist Band',
    shoulderToWaist: 'Shoulder to Waist', shoulderToAnkle: 'Shoulder to Ankle',
};

const measurementGroups = {
    "Core": ['height', 'neck', 'chest', 'waist', 'hips'],
    "Upper Body": ['shoulder', 'neckWidth', 'underbust', 'nippleToNipple', 'singleShoulder', 'frontDrop', 'backDrop'],
    "Arm": ['sleeveLength', 'upperarmWidth', 'armholeCurve', 'armholeCurveStraight', 'shoulderToWrist', 'shoulderToElbow', 'innerArmLength', 'sleeveOpening', 'cuffHeight'],
    "Lower Body": ['inseamLength', 'outseamLength', 'waistToKneeLength', 'waistToAnkle', 'thighCirc', 'ankleCirc', 'backRise', 'frontRise', 'legOpening', 'seatLength'],
    "Garment Specific": ['neckBandWidth', 'collarWidth', 'collarPoint', 'waistBand', 'shoulderToWaist', 'shoulderToAnkle']
} as const;

type MeasurementGroupCardProps = {
    title: string;
    measurements: Measurement;
    fields: readonly (keyof Omit<Measurement, 'id' | 'date' | 'paymentStatus' | 'completionStatus'>)[];
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


type CustomerDetailViewProps = {
    customerId: string;
};

export function CustomerDetailView({ customerId }: CustomerDetailViewProps) {
  const [isClient, setIsClient] = React.useState(false)
  React.useEffect(() => {
    setIsClient(true)
  }, [])

  const customer = useCustomerStore((state) =>
    state.customers.find((c) => c.id === customerId)
  )
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [editingMeasurement, setEditingMeasurement] = React.useState<Measurement | null>(null);


  if (!isClient) {
    return <CustomerDetailSkeleton />;
  }

  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
         <h2 className="text-2xl font-semibold">Customer Not Found</h2>
         <p className="text-muted-foreground">The customer you are looking for does not exist.</p>
         <Button asChild className="mt-4">
            <Link href="/dashboard">Go Back to Customers</Link>
         </Button>
      </div>
    )
  }

  const sortedMeasurements = [...customer.measurements].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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
                <span className="flex items-center gap-1.5"><FileText className="h-4 w-4" /> {customer.jobNumber}</span>
                <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> Requested on {format(new Date(customer.requestDate), 'PP')}</span>
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
                                            <Badge variant={getPaymentStatusVariant(m.paymentStatus)} className={cn(m.paymentStatus === 'Paid' && 'bg-green-600')}>{m.paymentStatus}</Badge>
                                            <Badge variant={getCompletionStatusVariant(m.completionStatus)} className={cn(m.completionStatus === 'Completed' && 'bg-green-600')}>{m.completionStatus}</Badge>
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
