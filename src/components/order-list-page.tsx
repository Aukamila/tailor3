
"use client"

import * as React from "react"
import Link from "next/link"
import { Search, ChevronRight } from "lucide-react"
import { useCustomerStore, PaymentStatus, CompletionStatus } from "@/lib/store"
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { format } from "date-fns"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

function OrderListSkeleton() {
    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-1 p-4 md:p-8 space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold font-headline">All Orders</h1>
                        <p className="text-muted-foreground">
                            View and manage all customer orders.
                        </p>
                    </div>
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
                                    <TableHead className="hidden sm:table-cell">Job Details</TableHead>
                                    <TableHead className="hidden md:table-cell">Payment</TableHead>
                                    <TableHead className="hidden md:table-cell">Status</TableHead>
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
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell">
                                            <div className="grid gap-0.5">
                                                <Skeleton className="h-4 w-20" />
                                                <Skeleton className="h-3 w-28" />
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell"><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                                        <TableCell className="hidden md:table-cell"><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
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

type Order = {
  customerId: string;
  customerName: string;
  customerEmail: string;
  nic: string;
  jobNumber: string;
  measurementId: string;
  measurementDate: string;
  paymentStatus: PaymentStatus;
  completionStatus: CompletionStatus;
};

export function OrderListPage() {
  const [isClient, setIsClient] = React.useState(false)
  React.useEffect(() => {
    setIsClient(true)
  }, [])

  const [searchQuery, setSearchQuery] = React.useState("")
  const [paymentFilter, setPaymentFilter] = React.useState("All")
  const customers = useCustomerStore((state) => state.customers)

  const allOrders = React.useMemo(() => {
    const orders: Order[] = [];
    customers.forEach(customer => {
        customer.measurements.forEach(measurement => {
            orders.push({
                customerId: customer.id,
                customerName: customer.name,
                customerEmail: customer.email,
                nic: customer.nic,
                jobNumber: customer.jobNumber,
                measurementId: measurement.id,
                measurementDate: measurement.date,
                paymentStatus: measurement.paymentStatus,
                completionStatus: measurement.completionStatus
            });
        });
    });
    return orders.sort((a,b) => new Date(b.measurementDate).getTime() - new Date(a.measurementDate).getTime());
  }, [customers]);

  const filteredOrders = React.useMemo(() => {
    return allOrders
      .filter((order) => {
        if (paymentFilter === 'All') return true
        return order.paymentStatus === paymentFilter
      })
      .filter((order) =>
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.jobNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (order.nic || '').toLowerCase().includes(searchQuery.toLowerCase())
      )
  }, [allOrders, paymentFilter, searchQuery]);


  if (!isClient) {
    return <OrderListSkeleton />;
  }
  
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
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-4 md:p-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-headline">All Orders</h1>
            <p className="text-muted-foreground">
              View and manage all customer orders.
            </p>
          </div>
        </div>

        <Card>
          <CardHeader className="gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search within selected tab..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Tabs value={paymentFilter} onValueChange={setPaymentFilter}>
              <TabsList>
                <TabsTrigger value="All">All</TabsTrigger>
                <TabsTrigger value="Paid">Paid</TabsTrigger>
                <TabsTrigger value="Unpaid">Unpaid</TabsTrigger>
                <TabsTrigger value="Partial">Partial</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead className="hidden sm:table-cell">Job Details</TableHead>
                  <TableHead className="hidden md:table-cell">Payment</TableHead>
                  <TableHead className="hidden md:table-cell">Status</TableHead>
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <TableRow key={order.measurementId}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>{order.customerName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div className="grid gap-0.5">
                            <span className="font-medium">{order.customerName}</span>
                            <span className="text-sm text-muted-foreground">{order.customerEmail}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="grid gap-0.5">
                            <span className="font-mono text-sm">{order.jobNumber}</span>
                             <span className="text-xs text-muted-foreground">
                                {format(new Date(order.measurementDate), 'PP')}
                            </span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant={getPaymentStatusVariant(order.paymentStatus)} className={cn(order.paymentStatus === 'Paid' && 'bg-green-600')}>{order.paymentStatus}</Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant={getCompletionStatusVariant(order.completionStatus)} className={cn(order.completionStatus === 'Completed' && 'bg-green-600')}>{order.completionStatus}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" asChild>
                           <Link href={`/dashboard/customers/${order.customerId}`}>
                            <ChevronRight className="h-4 w-4" />
                           </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                       {allOrders.length > 0 ? "No orders match your current filters." : "No orders yet."}
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
