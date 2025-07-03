import { CustomerDetailView } from "@/components/customer-detail-view";

type CustomerPageProps = {
    params: {
        id: string;
    };
};

export default function CustomerPage({ params }: CustomerPageProps) {
    return <CustomerDetailView customerId={params.id} />;
}
