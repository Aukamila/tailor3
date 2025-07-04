import { CustomerDetailView } from "@/components/customer-detail-view";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import type { Customer } from "@/lib/types";

export default async function CustomerPage({ params }: { params: { id: string }}) {
    const cookieStore = cookies();
    const supabase = createServerClient(
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
        redirect('/login');
    }
    
    const { data: customer, error } = await supabase
        .from('customers')
        .select('*, measurements(*)')
        .eq('id', params.id)
        .eq('user_id', user.id)
        .single();
    
    if (error || !customer) {
        notFound();
    }
    
    // Sort measurements by date descending
    if (customer.measurements) {
        customer.measurements.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    return <CustomerDetailView customer={customer as Customer} />;
}
