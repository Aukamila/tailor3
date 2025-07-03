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

type CustomerDetailViewProps = {
  customerId: string
}

export function CustomerDetailView({ customerId }: CustomerDetailViewProps) {
  const customer = useCustomerStore((state) =>
    state.customers.find((c) => c.id === customerId)
  )
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

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
                            <TableHead>Date</TableHead>
                            <TableHead className="text-center">Neck</TableHead>
                            <TableHead className="text-center">Chest</TableHead>
                            <TableHead className="text-center">Waist</TableHead>
                            <TableHead className="text-center">Hips</TableHead>
                            <TableHead className="text-center">Sleeve</TableHead>
                            <TableHead className="text-center">Inseam</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedMeasurements.map(m => (
                            <TableRow key={m.id}>
                                <TableCell className="font-medium">{format(new Date(m.date), 'PP')}</TableCell>
                                <TableCell className="text-center">{m.neck ?? '–'}</TableCell>
                                <TableCell className="text-center">{m.chest ?? '–'}</TableCell>
                                <TableCell className="text-center">{m.waist ?? '–'}</TableCell>
                                <TableCell className="text-center">{m.hips ?? '–'}</TableCell>
                                <TableCell className="text-center">{m.sleeve ?? '–'}</TableCell>
                                <TableCell className="text-center">{m.inseam ?? '–'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </main>
  )
}
