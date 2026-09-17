import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../app/store';

// ─── Domain Types ─────────────────────────────────────────────────────────────

export type WorkOrderType = 'Repair' | 'Preventive' | 'Calibration' | 'Inspection';
export type WorkOrderStatus = 'Scheduled' | 'In Progress' | 'Overdue' | 'Completed';
export type WorkOrderPriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type RecurrenceOption = 'Does not repeat' | 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Annually';

// ─── Schedule Work Form State ─────────────────────────────────────────────────

export interface ScheduleWorkFormState {
  title: string;
  assetId: string;
  type: WorkOrderType;
  priority: WorkOrderPriority;
  status: WorkOrderStatus;
  description: string;
  recurrence: RecurrenceOption;
  scheduledDate: string;
  estimatedDowntimeHours: string;
  technicianId: string;
  vendor: string;
  locationId: string;
  estimatedCost: string;
  isSubmitting: boolean;
  isSuccess: boolean;
}

export interface WorkOrder {
  id: string;
  assetName: string;
  assetCode: string;
  type: WorkOrderType;
  date: string;           // ISO date string
  technicianId: string;
  technicianName: string;
  technicianAvatar: string; // initials
  technicianAvatarColor: string;
  costUsd: number;
  status: WorkOrderStatus;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_WORK_ORDERS: WorkOrder[] = [
  {
    id: 'WO-001',
    assetName: 'Haitian MA1200 Press',
    assetCode: 'AST-00512',
    type: 'Repair',
    date: '2026-07-08',
    technicianId: 'TECH-01',
    technicianName: 'David Okafor',
    technicianAvatar: 'DO',
    technicianAvatarColor: '#5159D7',
    costUsd: 1240,
    status: 'In Progress',
  },
  {
    id: 'WO-002',
    assetName: 'CNC Milling Machine',
    assetCode: 'AST-81126',
    type: 'Preventive',
    date: '2026-07-14',
    technicianId: 'TECH-01',
    technicianName: 'David Okafor',
    technicianAvatar: 'DO',
    technicianAvatarColor: '#5159D7',
    costUsd: 600,
    status: 'Scheduled',
  },
  {
    id: 'WO-003',
    assetName: 'Zebra ZT411 Printer',
    assetCode: 'AST-81244',
    type: 'Repair',
    date: '2026-06-30',
    technicianId: 'TECH-02',
    technicianName: 'Rahul Verma',
    technicianAvatar: 'RV',
    technicianAvatarColor: '#20B46B',
    costUsd: 180,
    status: 'Overdue',
  },
  {
    id: 'WO-004',
    assetName: 'LG 27" Calibration Monitor',
    assetCode: 'AST-81864',
    type: 'Calibration',
    date: '2026-07-01',
    technicianId: 'TECH-03',
    technicianName: 'Amelia Wright',
    technicianAvatar: 'AW',
    technicianAvatarColor: '#EFA831',
    costUsd: 90,
    status: 'Completed',
  },
  {
    id: 'WO-005',
    assetName: 'Toyota 8FGU25 Forklift',
    assetCode: 'AST-00701',
    type: 'Inspection',
    date: '2026-07-22',
    technicianId: 'TECH-01',
    technicianName: 'David Okafor',
    technicianAvatar: 'DO',
    technicianAvatarColor: '#5159D7',
    costUsd: 320,
    status: 'Scheduled',
  },
  {
    id: 'WO-006',
    assetName: 'Haitian MA1200 Press',
    assetCode: 'AST-00512',
    type: 'Preventive',
    date: '2026-07-28',
    technicianId: 'TECH-02',
    technicianName: 'Rahul Verma',
    technicianAvatar: 'RV',
    technicianAvatarColor: '#20B46B',
    costUsd: 450,
    status: 'Scheduled',
  },
];

// ─── Slice State ──────────────────────────────────────────────────────────────

const INITIAL_SCHEDULE_FORM: ScheduleWorkFormState = {
  title: '',
  assetId: '',
  type: 'Preventive',
  priority: 'Medium',
  status: 'Scheduled',
  description: '',
  recurrence: 'Does not repeat',
  scheduledDate: '',
  estimatedDowntimeHours: '4',
  technicianId: '',
  vendor: '',
  locationId: '',
  estimatedCost: '0.00',
  isSubmitting: false,
  isSuccess: false,
};

interface MaintenanceState {
  workOrders: WorkOrder[];
  typeFilter: WorkOrderType | 'All';
  statusFilter: WorkOrderStatus | 'All';
  searchQuery: string;
  scheduleWorkForm: ScheduleWorkFormState;
}

const initialState: MaintenanceState = {
  workOrders: MOCK_WORK_ORDERS,
  typeFilter: 'All',
  statusFilter: 'All',
  searchQuery: '',
  scheduleWorkForm: INITIAL_SCHEDULE_FORM,
};

// ─── Slice ────────────────────────────────────────────────────────────────────

const maintenanceSlice = createSlice({
  name: 'maintenance',
  initialState,
  reducers: {
    typeFilterChanged(state, action: PayloadAction<WorkOrderType | 'All'>) {
      state.typeFilter = action.payload;
    },
    statusFilterChanged(state, action: PayloadAction<WorkOrderStatus | 'All'>) {
      state.statusFilter = action.payload;
    },
    searchQueryChanged(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    scheduleFormFieldChanged(
      state,
      action: PayloadAction<{ field: keyof ScheduleWorkFormState; value: string }>
    ) {
      const { field, value } = action.payload;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (state.scheduleWorkForm as any)[field] = value;
    },
    scheduleFormReset(state) {
      state.scheduleWorkForm = INITIAL_SCHEDULE_FORM;
    },
    scheduleFormSubmitted(state) {
      const form = state.scheduleWorkForm;
      const newOrder: WorkOrder = {
        id: `WO-${String(state.workOrders.length + 1).padStart(3, '0')}`,
        assetName: form.assetId,  // resolved to name in the selector
        assetCode: form.assetId,
        type: form.type,
        date: form.scheduledDate,
        technicianId: form.technicianId,
        technicianName: form.technicianId,
        technicianAvatar: form.technicianId.slice(0, 2).toUpperCase(),
        technicianAvatarColor: '#5159D7',
        costUsd: parseFloat(form.estimatedCost) || 0,
        status: form.status,
      };
      state.workOrders.unshift(newOrder);
      state.scheduleWorkForm = { ...INITIAL_SCHEDULE_FORM, isSuccess: true };
    },
  },
});

export const {
  typeFilterChanged,
  statusFilterChanged,
  searchQueryChanged,
  scheduleFormFieldChanged,
  scheduleFormReset,
  scheduleFormSubmitted,
} = maintenanceSlice.actions;

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectAllWorkOrders = (state: RootState) => state.maintenance.workOrders;
export const selectTypeFilter = (state: RootState) => state.maintenance.typeFilter;
export const selectStatusFilter = (state: RootState) => state.maintenance.statusFilter;
export const selectSearchQuery = (state: RootState) => state.maintenance.searchQuery;

export const selectFilteredWorkOrders = (state: RootState): WorkOrder[] => {
  const { workOrders, typeFilter, statusFilter, searchQuery } = state.maintenance;
  const q = searchQuery.toLowerCase().trim();
  return workOrders.filter((wo) => {
    const matchesType = typeFilter === 'All' || wo.type === typeFilter;
    const matchesStatus = statusFilter === 'All' || wo.status === statusFilter;
    const matchesSearch =
      !q ||
      wo.assetName.toLowerCase().includes(q) ||
      wo.assetCode.toLowerCase().includes(q) ||
      wo.technicianName.toLowerCase().includes(q) ||
      wo.type.toLowerCase().includes(q);
    return matchesType && matchesStatus && matchesSearch;
  });
};

/** Summary counts for the stat cards. */
export const selectWorkOrderCounts = (state: RootState) => {
  const orders = state.maintenance.workOrders;
  return {
    scheduled: orders.filter((wo) => wo.status === 'Scheduled').length,
    inProgress: orders.filter((wo) => wo.status === 'In Progress').length,
    overdue: orders.filter((wo) => wo.status === 'Overdue').length,
    completedRecent: orders.filter((wo) => wo.status === 'Completed').length,
  };
};

// ─── Schedule Work Form Selectors ─────────────────────────────────────────────

export const selectScheduleWorkForm = (state: RootState) => state.maintenance.scheduleWorkForm;
export const selectScheduleFormCanSubmit = (state: RootState) => {
  const f = state.maintenance.scheduleWorkForm;
  return (
    f.title.trim().length > 0 &&
    f.assetId.length > 0 &&
    f.scheduledDate.length > 0
  );
};

export default maintenanceSlice.reducer;
