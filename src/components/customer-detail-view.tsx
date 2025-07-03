"use client"

import * as React from "react"
import Link from "next/link"
import { format } from 'date-fns';
import { useCustomerStore } from "@/lib/store"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronLeft, Mail, Phone, PlusCircle, Ruler, FileText, Calendar } from "lucide-react"
import { AddMeasurementDialog } from "@/components/add-measurement-dialog";
import { Skeleton } from "@/components/ui/skeleton";

function CustomerDetailSkeleton() {
    return (
        <main className="flex-1 p-4 md:p-8 space-y-8">
            <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-md" />
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-[400px]" />
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
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

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

  const renderCell = (value: number | null | undefined) => (
    <TableCell className="text-center">{value ?? '–'}</TableCell>
  )

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
                 <AddMeasurementDialog customerId={customer.id} open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <Button onClick={() => setIsDialogOpen(true)} variant="default">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Measurement
                    </Button>
                </AddMeasurementDialog>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="sticky left-0 bg-card">Date</TableHead>
                            <TableHead className="text-center">Height</TableHead>
                            <TableHead className="text-center">Neck</TableHead>
                            <TableHead className="text-center">Neck Width</TableHead>
                            <TableHead className="text-center">Chest</TableHead>
                            <TableHead className="text-center">Waist</TableHead>
                            <TableHead className="text-center">Hips</TableHead>
                            <TableHead className="text-center">Underbust</TableHead>
                            <TableHead className="text-center">Nipple to Nipple</TableHead>
                            <TableHead className="text-center">Shoulder</TableHead>
                            <TableHead className="text-center">Single Shoulder</TableHead>
                            <TableHead className="text-center">Front Drop</TableHead>
                            <TableHead className="text-center">Back Drop</TableHead>
                            <TableHead className="text-center">Sleeve Length</TableHead>
                            <TableHead className="text-center">Upperarm Width</TableHead>
                            <TableHead className="text-center">Armhole Curve</TableHead>
                            <TableHead className="text-center">Armhole Curve (Straight)</TableHead>
                            <TableHead className="text-center">Shoulder to Wrist</TableHead>
                            <TableHead className="text-center">Shoulder to Elbow</TableHead>
                            <TableHead className="text-center">Inner Arm Length</TableHead>
                            <TableHead className="text-center">Sleeve Opening</TableHead>
                            <TableHead className="text-center">Cuff Height</TableHead>
                            <TableHead className="text-center">Inseam Length</TableHead>
                            <TableHead className="text-center">Outseam Length</TableHead>
                            <TableHead className="text-center">Waist to Knee</TableHead>
                            <TableHead className="text-center">Waist to Ankle</TableHead>
                            <TableHead className="text-center">Thigh Circ.</TableHead>
                            <TableHead className="text-center">Ankle Circ.</TableHead>
                            <TableHead className="text-center">Back Rise</TableHead>
                            <TableHead className="text-center">Front Rise</TableHead>
                            <TableHead className="text-center">Leg Opening</TableHead>
                            <TableHead className="text-center">Seat Length</TableHead>
                            <TableHead className="text-center">Neck Band Width</TableHead>
                            <TableHead className="text-center">Collar Width</TableHead>
                            <TableHead className="text-center">Collar Point</TableHead>
                            <TableHead className="text-center">Waist Band</TableHead>
                            <TableHead className="text-center">Shoulder to Waist</TableHead>
                            <TableHead className="text-center">Shoulder to Ankle</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedMeasurements.map(m => (
                            <TableRow key={m.id}>
                                <TableCell className="font-medium sticky left-0 bg-card">{format(new Date(m.date), 'PP')}</TableCell>
                                {renderCell(m.height)}
                                {renderCell(m.neck)}
                                {renderCell(m.neckWidth)}
                                {renderCell(m.chest)}
                                {renderCell(m.waist)}
                                {renderCell(m.hips)}
                                {renderCell(m.underbust)}
                                {renderCell(m.nippleToNipple)}
                                {renderCell(m.shoulder)}
                                {renderCell(m.singleShoulder)}
                                {renderCell(m.frontDrop)}
                                {renderCell(m.backDrop)}
                                {renderCell(m.sleeveLength)}
                                {renderCell(m.upperarmWidth)}
                                {renderCell(m.armholeCurve)}
                                {renderCell(m.armholeCurveStraight)}
                                {renderCell(m.shoulderToWrist)}
                                {renderCell(m.shoulderToElbow)}
                                {renderCell(m.innerArmLength)}
                                {renderCell(m.sleeveOpening)}
                                {renderCell(m.cuffHeight)}
                                {renderCell(m.inseamLength)}
                                {renderCell(m.outseamLength)}
                                {renderCell(m.waistToKneeLength)}
                                {renderCell(m.waistToAnkle)}
                                {renderCell(m.thighCirc)}
                                {renderCell(m.ankleCirc)}
                                {renderCell(m.backRise)}
                                {renderCell(m.frontRise)}
                                {renderCell(m.legOpening)}
                                {renderCell(m.seatLength)}
                                {renderCell(m.neckBandWidth)}
                                {renderCell(m.collarWidth)}
                                {renderCell(m.collarPoint)}
                                {renderCell(m.waistBand)}
                                {renderCell(m.shoulderToWaist)}
                                {renderCell(m.shoulderToAnkle)}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </main>
  )
}
