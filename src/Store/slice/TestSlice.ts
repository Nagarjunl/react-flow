import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: string;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  employeeCode: string;
  storeId: number;
  countryCode: string;
  retailCountryCode: string;
  departmentId: number;
  brandId: number;
  companyId: number;
  categoryId: number;
  branchId: number;
  designation: string;
  dateJoined: string;
  dateOfBirth: string;
  isActive: boolean;
  roleId: string;
}

export interface Sale {
  id: number;
  departmentId: number;
  brandId: number;
  saleAmount: number;
  categoryId: number;
  subCategoryId: number;
  subSubCategoryId: number;
  saleTypeId: number;
  productPrice: number;
  tax: number;
  discount: number;
  quantity: number;
  invoiceNumber: string;
  itemNumber: string;
  notes: string;
  storeId: number;
  createdBy: string;
  createdOn: string;
}

export interface Attendance {
  id: number;
  userId: string;
  storeId: number;
  totalHours: number;
  createdBy: string;
  createdOn: string;
}

export interface Leave {
  id: number;
  leaveType: string;
  startDate: string;
  endDate: string;
  leaveDays: number;
  reason: string;
  status: string;
  approverComments: string;
  approvedBy: string;
  approvedOn: string;
  createdBy: string;
  totalDays: number;
}

export interface StoreTarget {
  id: number;
  brandId: number;
  storeId: number;
  year: number;
  month: number;
  roleId: string;
  targetAmount: number;
  storeKPITargetBraPenetration: number;
  storeKPIAchievementBraPenetration: number;
  storeTargetAchievement: number;
  status: number;
}

export interface TestDataState {
  year: number;
  month: number;
  storeId: number;
  users: User[];
  sales: Sale[];
  attendance: Attendance[];
  leaves: Leave[];
  storeTargets: StoreTarget[];
  workflowJson: string;
}

const initialState: TestDataState = {
  year: 2024,
  month: 10,
  storeId: 1,
  workflowJson: "",
  users: [
    {
      id: "user-001",
      userName: "john.doe",
      email: "john.doe@example.com",
      firstName: "John",
      lastName: "Doe",
      employeeCode: "EMP001",
      storeId: 1,
      countryCode: "US",
      retailCountryCode: "US",
      departmentId: 10,
      brandId: 5,
      companyId: 1,
      categoryId: 3,
      branchId: 2,
      designation: "Sales Manager",
      dateJoined: "2020-01-15T00:00:00",
      dateOfBirth: "1985-06-20T00:00:00",
      isActive: true,
      roleId: "role-manager",
    },
    {
      id: "user-002",
      userName: "jane.smith",
      email: "jane.smith@example.com",
      firstName: "Jane",
      lastName: "Smith",
      employeeCode: "EMP002",
      storeId: 1,
      countryCode: "US",
      retailCountryCode: "US",
      departmentId: 10,
      brandId: 5,
      companyId: 1,
      categoryId: 3,
      branchId: 2,
      designation: "Sales Associate",
      dateJoined: "2021-03-10T00:00:00",
      dateOfBirth: "1990-08-15T00:00:00",
      isActive: true,
      roleId: "role-associate",
    },
  ],
  sales: [
    {
      id: 1,
      departmentId: 10,
      brandId: 5,
      saleAmount: 15000.0,
      categoryId: 3,
      subCategoryId: 15,
      subSubCategoryId: 25,
      saleTypeId: 1,
      productPrice: 14500.0,
      tax: 500.0,
      discount: 0.0,
      quantity: 5,
      invoiceNumber: "INV-2024-001",
      itemNumber: "ITEM-001",
      notes: "Premium sale",
      storeId: 1,
      createdBy: "user-001",
      createdOn: "2024-10-05T10:30:00",
    },
    {
      id: 2,
      departmentId: 10,
      brandId: 5,
      saleAmount: 8500.0,
      categoryId: 3,
      subCategoryId: 16,
      subSubCategoryId: 26,
      saleTypeId: 1,
      productPrice: 8200.0,
      tax: 300.0,
      discount: 0.0,
      quantity: 3,
      invoiceNumber: "INV-2024-002",
      itemNumber: "ITEM-002",
      notes: "Regular sale",
      storeId: 1,
      createdBy: "user-001",
      createdOn: "2024-10-10T14:20:00",
    },
    {
      id: 3,
      departmentId: 10,
      brandId: 5,
      saleAmount: 12000.0,
      categoryId: 3,
      subCategoryId: 15,
      subSubCategoryId: 25,
      saleTypeId: 2,
      productPrice: 11600.0,
      tax: 400.0,
      discount: 0.0,
      quantity: 4,
      invoiceNumber: "INV-2024-003",
      itemNumber: "ITEM-003",
      notes: "Bulk sale",
      storeId: 1,
      createdBy: "user-002",
      createdOn: "2024-10-15T16:45:00",
    },
  ],
  attendance: [
    {
      id: 1,
      userId: "user-001",
      storeId: 1,
      totalHours: 168.5,
      createdBy: "user-001",
      createdOn: "2024-10-01T00:00:00",
    },
    {
      id: 2,
      userId: "user-002",
      storeId: 1,
      totalHours: 160.0,
      createdBy: "user-002",
      createdOn: "2024-10-01T00:00:00",
    },
  ],
  leaves: [
    {
      id: 1,
      leaveType: "Sick",
      startDate: "2024-10-12T00:00:00",
      endDate: "2024-10-13T00:00:00",
      leaveDays: 2,
      reason: "Medical appointment",
      status: "Approved",
      approverComments: "Approved",
      approvedBy: "manager-001",
      approvedOn: "2024-10-11T10:00:00",
      createdBy: "user-002",
      totalDays: 2,
    },
    {
      id: 2,
      leaveType: "Annual",
      startDate: "2024-10-20T00:00:00",
      endDate: "2024-10-22T00:00:00",
      leaveDays: 3,
      reason: "Personal",
      status: "Approved",
      approverComments: "Approved",
      approvedBy: "manager-001",
      approvedOn: "2024-10-18T09:00:00",
      createdBy: "user-001",
      totalDays: 3,
    },
  ],
  storeTargets: [
    {
      id: 1,
      brandId: 5,
      storeId: 1,
      year: 2024,
      month: 10,
      roleId: "role-manager",
      targetAmount: 50000.0,
      storeKPITargetBraPenetration: 75.0,
      storeKPIAchievementBraPenetration: 70.0,
      storeTargetAchievement: 85.5,
      status: 1,
    },
    {
      id: 2,
      brandId: 5,
      storeId: 1,
      year: 2024,
      month: 10,
      roleId: "role-associate",
      targetAmount: 25000.0,
      storeKPITargetBraPenetration: 60.0,
      storeKPIAchievementBraPenetration: 65.0,
      storeTargetAchievement: 90.0,
      status: 1,
    },
  ],
};

const testDataSlice = createSlice({
  name: "testData",
  initialState,
  reducers: {
    updateBasicInfo: (
      state,
      action: PayloadAction<{ year?: number; month?: number; storeId?: number }>
    ) => {
      if (action.payload.year !== undefined) state.year = action.payload.year;
      if (action.payload.month !== undefined)
        state.month = action.payload.month;
      if (action.payload.storeId !== undefined)
        state.storeId = action.payload.storeId;
    },
    updateUser: (
      state,
      action: PayloadAction<{ index: number; user: Partial<User> }>
    ) => {
      const { index, user } = action.payload;
      if (index >= 0 && index < state.users.length) {
        state.users[index] = { ...state.users[index], ...user };
      }
    },
    addUser: (state, action: PayloadAction<User>) => {
      state.users.push(action.payload);
    },
    removeUser: (state, action: PayloadAction<number>) => {
      state.users.splice(action.payload, 1);
    },
    updateSale: (
      state,
      action: PayloadAction<{ index: number; sale: Partial<Sale> }>
    ) => {
      const { index, sale } = action.payload;
      if (index >= 0 && index < state.sales.length) {
        state.sales[index] = { ...state.sales[index], ...sale };
      }
    },
    addSale: (state, action: PayloadAction<Sale>) => {
      state.sales.push(action.payload);
    },
    removeSale: (state, action: PayloadAction<number>) => {
      state.sales.splice(action.payload, 1);
    },
    updateAttendance: (
      state,
      action: PayloadAction<{ index: number; attendance: Partial<Attendance> }>
    ) => {
      const { index, attendance } = action.payload;
      if (index >= 0 && index < state.attendance.length) {
        state.attendance[index] = { ...state.attendance[index], ...attendance };
      }
    },
    addAttendance: (state, action: PayloadAction<Attendance>) => {
      state.attendance.push(action.payload);
    },
    removeAttendance: (state, action: PayloadAction<number>) => {
      state.attendance.splice(action.payload, 1);
    },
    updateLeave: (
      state,
      action: PayloadAction<{ index: number; leave: Partial<Leave> }>
    ) => {
      const { index, leave } = action.payload;
      if (index >= 0 && index < state.leaves.length) {
        state.leaves[index] = { ...state.leaves[index], ...leave };
      }
    },
    addLeave: (state, action: PayloadAction<Leave>) => {
      state.leaves.push(action.payload);
    },
    removeLeave: (state, action: PayloadAction<number>) => {
      state.leaves.splice(action.payload, 1);
    },
    updateStoreTarget: (
      state,
      action: PayloadAction<{
        index: number;
        storeTarget: Partial<StoreTarget>;
      }>
    ) => {
      const { index, storeTarget } = action.payload;
      if (index >= 0 && index < state.storeTargets.length) {
        state.storeTargets[index] = {
          ...state.storeTargets[index],
          ...storeTarget,
        };
      }
    },
    addStoreTarget: (state, action: PayloadAction<StoreTarget>) => {
      state.storeTargets.push(action.payload);
    },
    removeStoreTarget: (state, action: PayloadAction<number>) => {
      state.storeTargets.splice(action.payload, 1);
    },
    resetTestData: () => initialState,
    updateWorkflowJson: (state, action: PayloadAction<string>) => {
      state.workflowJson = action.payload;
    },
  },
});

export const {
  updateBasicInfo,
  updateUser,
  addUser,
  removeUser,
  updateSale,
  addSale,
  removeSale,
  updateAttendance,
  addAttendance,
  removeAttendance,
  updateLeave,
  addLeave,
  removeLeave,
  updateStoreTarget,
  addStoreTarget,
  removeStoreTarget,
  resetTestData,
  updateWorkflowJson,
} = testDataSlice.actions;

export default testDataSlice.reducer;
