
import { OrderListPage } from '@/components/order-list-page';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { Customer, Measurement } from '@/lib/types';
import type { Database } from '@/lib/database.types';

type Order = {
  customerId: string;
  customerName: string;
  customerEmail: string | null;
  nic: string | null;
  jobNumber: string | null;
  measurementId: string;
  measurementDate: string;
  paymentStatus: 'Paid' | 'Unpaid' | 'Partial';
  completionStatus: 'Pending' | 'In Progress' | 'Completed';
};


export default async function OrdersPage() {
  const cookieStore = cookies();
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return redirect('/login');
  }

  const { data: customers, error } = await supabase
    .from('customers')
    .select('id, name, email, nic, job_number, measurements(*)')
    .eq('user_id', user.id);

  if (error) {
    console.error("Error fetching orders:", error);
    return <OrderListPage initialOrders={[]} />;
  }

  const allOrders: Order[] = (customers || []).flatMap((customer: any) =>
    (customer.measurements || []).map((measurement: any) => ({
      customerId: customer.id,
      customerName: customer.name,
      customerEmail: customer.email,
      nic: customer.nic,
      jobNumber: customer.job_number,
      measurementId: measurement.id,
      measurementDate: measurement.date,
      paymentStatus: measurement.payment_status,
      completionStatus: measurement.completion_status,
    }))
  ).sort((a, b) => new Date(b.measurementDate).getTime() - new Date(a.measurementDate).getTime());


  return <OrderListPage initialOrders={allOrders} />;
}
