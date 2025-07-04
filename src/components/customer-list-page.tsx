"use client"

import * as React from "react"
import Link from "next/link"
import { PlusCircle, Search, ChevronRight } from "lucide-react"
import { useCustomerStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { AddCustomerDialog } from "@/components/add-customer-dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { format } from "date-fns"
import { Skeleton } from "@/components/ui/skeleton"

function CustomerListSkeleton() {
    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-1 p-4 md:p-8 space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold font-headline">Customers</h1>
                        <p className="text-muted-foreground">
                            Manage your customer database.
                        </p>
                    </div>
                    <Button disabled>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Customer
                    </Button>
                </div>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-10 w-full max-w-sm" />
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Customer</TableHead>
                                    <TableHead className="hidden sm:table-cell">Job Number</TableHead>
                                    <TableHead className="hidden md:table-cell">Phone</TableHead>
                                    <TableHead className="hidden sm:table-cell">Measurements</TableHead>
                                    <TableHead className="text-right"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {[...Array(5)].map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Skeleton className="h-10 w-10 rounded-full" />
                                                <div className="grid gap-1">
                                                    <Skeleton className="h-4 w-24" />
                                                    <Skeleton className="h-3 w-32" />
                                                    <Skeleton className="h-3 w-24" />
                                                    <Skeleton className="h-3 w-28" />
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell"><Skeleton className="h-4 w-20" /></TableCell>
                                        <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
                                        <TableCell className="hidden sm:table-cell"><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                                        <TableCell className="text-right"><Skeleton className="h-10 w-10" /></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}

export function CustomerListPage() {
  const [isClient, setIsClient] = React.useState(false)
  React.useEffect(() => {
    setIsClient(true)
  }, [])

  const [searchQuery, setSearchQuery] = React.useState("")
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const customers = useCustomerStore((state) => state.customers)

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (customer.nic || "").toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (!isClient) {
    return <CustomerListSkeleton />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-4 md:p-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-headline">Customers</h1>
            <p className="text-muted-foreground">
              Manage your customer database.
            </p>
          </div>
          <AddCustomerDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <Button onClick={() => setIsDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Customer
            </Button>
          </AddCustomerDialog>
        </div>

        <Card>
          <CardHeader>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or NIC..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead className="hidden sm:table-cell">Job Number</TableHead>
                  <TableHead className="hidden md:table-cell">Phone</TableHead>
                  <TableHead className="hidden sm:table-cell">Measurements</TableHead>
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>{customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div className="grid gap-0.5">
                            <span className="font-medium">{customer.name}</span>
                            <span className="text-sm text-muted-foreground">{customer.email}</span>
                            <span className="text-sm text-muted-foreground font-mono">{customer.nic}</span>
                             <span className="text-xs text-muted-foreground">
                                Requested on {format(new Date(customer.requestDate), 'PP')}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell font-mono text-sm">{customer.jobNumber}</TableCell>
                      <TableCell className="hidden md:table-cell">{customer.phone}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge variant="secondary">{customer.measurements.length} record(s)</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" asChild>
                           <Link href={`/dashboard/customers/${customer.id}`}>
                            <ChevronRight className="h-4 w-4" />
                           </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                       {searchQuery ? "No customers found." : "No customers yet. Add one to get started!"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
