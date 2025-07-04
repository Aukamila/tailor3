export type PaymentStatus = 'Paid' | 'Unpaid' | 'Partial';
export type CompletionStatus = 'Pending' | 'In Progress' | 'Completed';

export interface Measurement {
  id: string;
  customer_id: string;
  user_id: string;
  date: string;
  payment_status: PaymentStatus;
  completion_status: CompletionStatus;
  height: number | null;
  neck: number | null;
  chest: number | null;
  waist: number | null;
  hips: number | null;
  shoulder: number | null;
  neck_width: number | null;
  underbust: number | null;
  nipple_to_nipple: number | null;
  single_shoulder: number | null;
  front_drop: number | null;
  back_drop: number | null;
  sleeve_length: number | null;
  upperarm_width: number | null;
  armhole_curve: number | null;
  armhole_curve_straight: number | null;
  shoulder_to_wrist: number | null;
  shoulder_to_elbow: number | null;
  inner_arm_length: number | null;
  sleeve_opening: number | null;
  cuff_height: number | null;
  inseam_length: number | null;
  outseam_length: number | null;
  waist_to_knee_length: number | null;
  waist_to_ankle: number | null;
  thigh_circ: number | null;
  ankle_circ: number | null;
  back_rise: number | null;
  front_rise: number | null;
  leg_opening: number | null;
  seat_length: number | null;
  neck_band_width: number | null;
  collar_width: number | null;
  collar_point: number | null;
  waist_band: number | null;
  shoulder_to_waist: number | null;
  shoulder_to_ankle: number | null;
  created_at: string;
}

export interface Customer {
  id: string;
  user_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  nic: string | null;
  job_number: string | null;
  request_date: string;
  created_at: string;
  measurements?: Measurement[];
}
