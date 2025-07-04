
import { CustomerListPage } from '@/components/customer-list-page';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { Customer } from '@/lib/types';
import type { Database } from '@/lib/database.types';

export default async function DashboardPage() {
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
    redirect('/login');
  }

  const { data: customersData, error } = await supabase
    .from('customers')
    .select('*, measurements(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching customers:', error);
    // Optionally, render an error state
  }

  const customers: Customer[] = (customersData as any) || [];

  return <CustomerListPage initialCustomers={customers} />;
}
