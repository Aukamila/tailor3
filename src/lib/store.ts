import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Measurement {
  id: string;
  date: string;
  neck: number | null;
  chest: number | null;
  waist: number | null;
  hips: number | null;
  sleeve: number | null;
  inseam: number | null;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  jobNumber: string;
  requestDate: string;
  measurements: Measurement[];
}

interface CustomerState {
  customers: Customer[];
  addCustomer: (customerData: Omit<Customer, 'id' | 'measurements'>, initialMeasurement: Omit<Measurement, 'id' | 'date'>) => void;
  addMeasurement: (customerId: string, measurement: Omit<Measurement, 'id' | 'date'>) => void;
}

const initialCustomers: Customer[] = [
  {
    id: '1',
    name: 'Eleanor Vance',
    email: 'eleanor.vance@example.com',
    phone: '202-555-0181',
    jobNumber: 'JOB-001',
    requestDate: new Date('2023-10-01T10:00:00Z').toISOString(),
    measurements: [
      { id: 'm1', date: new Date('2023-10-15T10:00:00Z').toISOString(), neck: 14.5, chest: 38, waist: 30, hips: 40, sleeve: 24, inseam: 31 },
      { id: 'm2', date: new Date('2024-03-22T11:30:00Z').toISOString(), neck: 14.5, chest: 38.5, waist: 30, hips: 40, sleeve: 24, inseam: 31 },
    ],
  },
  {
    id: '2',
    name: 'Marcus Thorne',
    email: 'marcus.thorne@example.com',
    phone: '312-555-0142',
    jobNumber: 'JOB-002',
    requestDate: new Date('2024-03-25T14:00:00Z').toISOString(),
    measurements: [
      { id: 'm3', date: new Date('2024-04-01T14:00:00Z').toISOString(), neck: 16, chest: 42, waist: 34, hips: 42, sleeve: 26, inseam: 33 },
    ],
  },
  {
    id: '3',
    name: 'Isabelle Rossi',
    email: 'isabelle.rossi@example.com',
    phone: '415-555-0199',
    jobNumber: 'JOB-003',
    requestDate: new Date('2024-05-15T09:45:00Z').toISOString(),
    measurements: [
      { id: 'm4', date: new Date('2024-05-20T09:45:00Z').toISOString(), neck: 13.5, chest: 34, waist: 26, hips: 38, sleeve: 23, inseam: 29 },
    ],
  },
];

export const useCustomerStore = create<CustomerState>()(
  persist(
    (set) => ({
      customers: initialCustomers,
      
      addCustomer: (customerData, initialMeasurement) => {
        set((state) => ({
          customers: [
            ...state.customers,
            {
              ...customerData,
              id: `c-${Date.now()}`,
              measurements: [
                {
                  ...initialMeasurement,
                  id: `m-${Date.now()}`,
                  date: new Date().toISOString(),
                },
              ],
            },
          ],
        }));
      },
    
      addMeasurement: (customerId, measurementData) => {
        set((state) => ({
          customers: state.customers.map(customer =>
            customer.id === customerId
              ? {
                  ...customer,
                  measurements: [
                    ...customer.measurements,
                    {
                      ...measurementData,
                      id: `m-${Date.now()}`,
                      date: new Date().toISOString(),
                    },
                  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
                }
              : customer
          ),
        }));
      },
    }),
    {
      name: 'stitchlink-customer-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
