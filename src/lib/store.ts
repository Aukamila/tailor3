import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type PaymentStatus = 'Paid' | 'Unpaid' | 'Partial';
export type CompletionStatus = 'Pending' | 'In Progress' | 'Completed';

export interface Measurement {
  id: string;
  date: string;
  paymentStatus: PaymentStatus;
  completionStatus: CompletionStatus;
  
  // Core
  height: number | null;
  neck: number | null;
  chest: number | null;
  waist: number | null;
  hips: number | null;

  // Upper Body
  shoulder: number | null;
  neckWidth: number | null;
  underbust: number | null;
  nippleToNipple: number | null;
  singleShoulder: number | null;
  frontDrop: number | null;
  backDrop: number | null;
  
  // Arm
  sleeveLength: number | null;
  upperarmWidth: number | null;
  armholeCurve: number | null;
  armholeCurveStraight: number | null;
  shoulderToWrist: number | null;
  shoulderToElbow: number | null;
  innerArmLength: number | null;
  sleeveOpening: number | null;
  cuffHeight: number | null;
  
  // Lower Body
  inseamLength: number | null;
  outseamLength: number | null;
  waistToKneeLength: number | null;
  waistToAnkle: number | null;
  thighCirc: number | null;
  ankleCirc: number | null;
  backRise: number | null;
  frontRise: number | null;
  legOpening: number | null;
  seatLength: number | null;
  
  // Garment Specific
  neckBandWidth: number | null;
  collarWidth: number | null;
  collarPoint: number | null;
  waistBand: number | null;
  shoulderToWaist: number | null;
  shoulderToAnkle: number | null;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  nic: string;
  jobNumber: string;
  requestDate: string;
  measurements: Measurement[];
}

interface CustomerState {
  customers: Customer[];
  addCustomer: (customerData: Omit<Customer, 'id' | 'measurements'>, initialMeasurement: Omit<Measurement, 'id' | 'date'>) => void;
  addMeasurement: (customerId: string, measurement: Omit<Measurement, 'id' | 'date'>) => void;
  updateMeasurement: (customerId: string, measurement: Measurement) => void;
}

const emptyMeasurement: Omit<Measurement, 'id' | 'date'> = {
    paymentStatus: 'Unpaid',
    completionStatus: 'Pending',
    height: null, neck: null, chest: null, waist: null, hips: null, shoulder: null,
    neckWidth: null, underbust: null, nippleToNipple: null, singleShoulder: null,
    frontDrop: null, backDrop: null, sleeveLength: null, upperarmWidth: null,
    armholeCurve: null, armholeCurveStraight: null, shoulderToWrist: null,
    shoulderToElbow: null, innerArmLength: null, sleeveOpening: null,
    cuffHeight: null, inseamLength: null, outseamLength: null,
    waistToKneeLength: null, waistToAnkle: null, thighCirc: null, ankleCirc: null,
    backRise: null, frontRise: null, legOpening: null, seatLength: null,
    neckBandWidth: null, collarWidth: null, collarPoint: null, waistBand: null,
    shoulderToWaist: null, shoulderToAnkle: null,
};


const initialCustomers: Customer[] = [
  {
    id: '1',
    name: 'Eleanor Vance',
    email: 'eleanor.vance@example.com',
    phone: '202-555-0181',
    nic: '199012345678',
    jobNumber: 'JOB-001',
    requestDate: new Date('2023-10-01T10:00:00Z').toISOString(),
    measurements: [
      { id: 'm1', date: new Date('2023-10-15T10:00:00Z').toISOString(), ...emptyMeasurement, paymentStatus: 'Paid', completionStatus: 'Completed', neck: 14.5, chest: 38, waist: 30, hips: 40, sleeveLength: 24, inseamLength: 31 },
      { id: 'm2', date: new Date('2024-03-22T11:30:00Z').toISOString(), ...emptyMeasurement, paymentStatus: 'Unpaid', completionStatus: 'Pending', neck: 14.5, chest: 38.5, waist: 30, hips: 40, sleeveLength: 24, inseamLength: 31 },
    ],
  },
  {
    id: '2',
    name: 'Marcus Thorne',
    email: 'marcus.thorne@example.com',
    phone: '312-555-0142',
    nic: '198512345678',
    jobNumber: 'JOB-002',
    requestDate: new Date('2024-03-25T14:00:00Z').toISOString(),
    measurements: [
      { id: 'm3', date: new Date('2024-04-01T14:00:00Z').toISOString(), ...emptyMeasurement, paymentStatus: 'Partial', completionStatus: 'In Progress', neck: 16, chest: 42, waist: 34, hips: 42, sleeveLength: 26, inseamLength: 33 },
    ],
  },
  {
    id: '3',
    name: 'Isabelle Rossi',
    email: 'isabelle.rossi@example.com',
    phone: '415-555-0199',
    nic: '199512345678',
    jobNumber: 'JOB-003',
    requestDate: new Date('2024-05-15T09:45:00Z').toISOString(),
    measurements: [
      { id: 'm4', date: new Date('2024-05-20T09:45:00Z').toISOString(), ...emptyMeasurement, paymentStatus: 'Paid', completionStatus: 'Completed', neck: 13.5, chest: 34, waist: 26, hips: 38, sleeveLength: 23, inseamLength: 29 },
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

      updateMeasurement: (customerId, updatedMeasurement) => {
        set((state) => ({
          customers: state.customers.map((customer) =>
            customer.id === customerId
              ? {
                  ...customer,
                  measurements: customer.measurements
                    .map((m) =>
                      m.id === updatedMeasurement.id ? updatedMeasurement : m
                    )
                    .sort(
                      (a, b) =>
                        new Date(b.date).getTime() - new Date(a.date).getTime()
                    ),
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
