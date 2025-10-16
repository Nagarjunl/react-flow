import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Chip,
  Stack,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { useAppSelector, useAppDispatch } from "../../../Store/StoreConfig";
import { useTestRuleMutation } from "../../../Api/rulesApi";
import {
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
} from "../../../Store/slice/TestSlice";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

interface TestDataProps {
  workflowJson?: any;
}

const TestData: React.FC<TestDataProps> = ({ workflowJson }) => {
  const dispatch = useAppDispatch();
  const testData = useAppSelector((state) => state.testData);
  const [activeTab, setActiveTab] = useState(0);
  const [editingItem, setEditingItem] = useState<{
    type: string;
    index: number;
    data: any;
  } | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [showJsonView, setShowJsonView] = useState(false);
  const [testRuleMutation, { isLoading: isTestLoading }] =
    useTestRuleMutation();

  // Store workflowJson locally, only dispatch when Test API is clicked
  const [localWorkflowJson, setLocalWorkflowJson] = useState<string>("");

  useEffect(() => {
    if (workflowJson) {
      setLocalWorkflowJson(JSON.stringify(workflowJson, null, 2));
    }
  }, [workflowJson]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const testApi = async () => {
    try {
      // First dispatch the current workflowJson to store
      if (localWorkflowJson) {
        dispatch(updateWorkflowJson(localWorkflowJson));
      }

      // Get the current test data (excluding workflowJson)
      const { workflowJson, ...testDataWithoutWorkflow } = testData;

      // Prepare the test data with the local workflowJson
      const testPayload = {
        ...testDataWithoutWorkflow,
        workflowJson: localWorkflowJson,
      };

      console.log("Testing with payload:", testPayload);

      const result = await testRuleMutation({ data: testPayload }).unwrap();
      console.log("Test API result:", result);
      alert("Test API called successfully! Check console for results.");
    } catch (error) {
      console.error("Test API error:", error);
      alert("Failed to call test API. Check console for details.");
    }
  };

  const handleEdit = (type: string, index: number, data: any) => {
    setEditingItem({ type, index, data: { ...data } });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (type: string, index: number) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      switch (type) {
        case "user":
          dispatch(removeUser(index));
          break;
        case "sale":
          dispatch(removeSale(index));
          break;
        case "attendance":
          dispatch(removeAttendance(index));
          break;
        case "leave":
          dispatch(removeLeave(index));
          break;
        case "storeTarget":
          dispatch(removeStoreTarget(index));
          break;
      }
    }
  };

  const handleSaveEdit = () => {
    if (!editingItem) return;

    const { type, index, data } = editingItem;
    switch (type) {
      case "user":
        dispatch(updateUser({ index, user: data }));
        break;
      case "sale":
        dispatch(updateSale({ index, sale: data }));
        break;
      case "attendance":
        dispatch(updateAttendance({ index, attendance: data }));
        break;
      case "leave":
        dispatch(updateLeave({ index, leave: data }));
        break;
      case "storeTarget":
        dispatch(updateStoreTarget({ index, storeTarget: data }));
        break;
    }

    setIsEditDialogOpen(false);
    setEditingItem(null);
  };

  const handleAddNew = (type: string) => {
    const newItem = getNewItemTemplate(type);
    setEditingItem({ type, index: -1, data: newItem });
    setIsEditDialogOpen(true);
  };

  const getNewItemTemplate = (type: string): any => {
    switch (type) {
      case "user":
        return {
          id: `user-${Date.now()}`,
          userName: "",
          email: "",
          firstName: "",
          lastName: "",
          employeeCode: "",
          storeId: testData.storeId,
          countryCode: "US",
          retailCountryCode: "US",
          departmentId: 10,
          brandId: 5,
          companyId: 1,
          categoryId: 3,
          branchId: 2,
          designation: "",
          dateJoined: new Date().toISOString(),
          dateOfBirth: "",
          isActive: true,
          roleId: "role-associate",
        };
      case "sale":
        return {
          id: Date.now(),
          departmentId: 10,
          brandId: 5,
          saleAmount: 0,
          categoryId: 3,
          subCategoryId: 15,
          subSubCategoryId: 25,
          saleTypeId: 1,
          productPrice: 0,
          tax: 0,
          discount: 0,
          quantity: 1,
          invoiceNumber: "",
          itemNumber: "",
          notes: "",
          storeId: testData.storeId,
          createdBy: "user-001",
          createdOn: new Date().toISOString(),
        };
      case "attendance":
        return {
          id: Date.now(),
          userId: "user-001",
          storeId: testData.storeId,
          totalHours: 0,
          createdBy: "user-001",
          createdOn: new Date().toISOString(),
        };
      case "leave":
        return {
          id: Date.now(),
          leaveType: "Annual",
          startDate: new Date().toISOString(),
          endDate: new Date().toISOString(),
          leaveDays: 1,
          reason: "",
          status: "Pending",
          approverComments: "",
          approvedBy: "",
          approvedOn: "",
          createdBy: "user-001",
          totalDays: 1,
        };
      case "storeTarget":
        return {
          id: Date.now(),
          brandId: 5,
          storeId: testData.storeId,
          year: testData.year,
          month: testData.month,
          roleId: "role-associate",
          targetAmount: 0,
          storeKPITargetBraPenetration: 0,
          storeKPIAchievementBraPenetration: 0,
          storeTargetAchievement: 0,
          status: 1,
        };
      default:
        return {};
    }
  };

  const handleSaveNew = () => {
    if (!editingItem) return;

    const { type, data } = editingItem;
    switch (type) {
      case "user":
        dispatch(addUser(data));
        break;
      case "sale":
        dispatch(addSale(data));
        break;
      case "attendance":
        dispatch(addAttendance(data));
        break;
      case "leave":
        dispatch(addLeave(data));
        break;
      case "storeTarget":
        dispatch(addStoreTarget(data));
        break;
    }

    setIsEditDialogOpen(false);
    setEditingItem(null);
  };

  const renderTable = (data: any[], type: string, columns: string[]) => (
    <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column} sx={{ fontWeight: "bold" }}>
                {column}
              </TableCell>
            ))}
            <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={item.id || index}>
              {columns.map((column) => {
                const key = column.toLowerCase().replace(/\s+/g, "");
                const value = item[key];
                return (
                  <TableCell key={column}>
                    {typeof value === "boolean" ? (
                      <Chip
                        label={value ? "Active" : "Inactive"}
                        color={value ? "success" : "default"}
                        size="small"
                      />
                    ) : typeof value === "number" ? (
                      value.toLocaleString()
                    ) : (
                      String(value || "")
                    )}
                  </TableCell>
                );
              })}
              <TableCell>
                <IconButton
                  size="small"
                  onClick={() => handleEdit(type, index, item)}
                  color="primary"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleDelete(type, index)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderEditDialog = () => {
    if (!editingItem) return null;

    const { type, data } = editingItem;
    const isNew = editingItem.index === -1;

    return (
      <Dialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{isNew ? `Add New ${type}` : `Edit ${type}`}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            {Object.keys(data).map((key) => {
              if (key === "id") return null;

              const value = data[key];
              const isDate = key.includes("Date") || key.includes("On");
              const isNumber = typeof value === "number";
              const isBoolean = typeof value === "boolean";

              return (
                <TextField
                  key={key}
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                  value={
                    isDate
                      ? value
                        ? new Date(value).toISOString().slice(0, 16)
                        : ""
                      : String(value || "")
                  }
                  onChange={(e) => {
                    const newData = { ...data };
                    if (isDate) {
                      newData[key] = new Date(e.target.value).toISOString();
                    } else if (isNumber) {
                      newData[key] = parseFloat(e.target.value) || 0;
                    } else if (isBoolean) {
                      newData[key] = e.target.value === "true";
                    } else {
                      newData[key] = e.target.value;
                    }
                    setEditingItem({ ...editingItem, data: newData });
                  }}
                  type={
                    isDate ? "datetime-local" : isNumber ? "number" : "text"
                  }
                  fullWidth
                  size="small"
                />
              );
            })}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={isNew ? handleSaveNew : handleSaveEdit}
            variant="contained"
          >
            {isNew ? "Add" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Main Content */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Card sx={{ mb: 2 }}>
          <CardHeader
            title="Test Data Configuration"
            action={
              <Stack direction="row" spacing={1}>
                <Button
                  startIcon={<RefreshIcon />}
                  onClick={() => dispatch(resetTestData())}
                  variant="outlined"
                  size="small"
                >
                  Reset
                </Button>
                <Button
                  startIcon={<ViewIcon />}
                  onClick={() => setShowJsonView(!showJsonView)}
                  variant="contained"
                  size="small"
                >
                  {showJsonView ? "Hide" : "Show"} JSON
                </Button>

                <Button
                  startIcon={<ViewIcon />}
                  onClick={testApi}
                  variant="contained"
                  size="small"
                  disabled={isTestLoading || !localWorkflowJson}
                >
                  {isTestLoading ? "Testing..." : "Test API"}
                </Button>
              </Stack>
            }
          />
        </Card>

        {/* Basic Info */}
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Basic Information
            </Typography>
            <Stack direction="row" spacing={2}>
              <TextField
                label="Year"
                type="number"
                value={testData.year}
                onChange={(e) =>
                  dispatch(updateBasicInfo({ year: parseInt(e.target.value) }))
                }
                size="small"
              />
              <TextField
                label="Month"
                type="number"
                value={testData.month}
                onChange={(e) =>
                  dispatch(updateBasicInfo({ month: parseInt(e.target.value) }))
                }
                size="small"
              />
              <TextField
                label="Store ID"
                type="number"
                value={testData.storeId}
                onChange={(e) =>
                  dispatch(
                    updateBasicInfo({ storeId: parseInt(e.target.value) })
                  )
                }
                size="small"
              />
            </Stack>
          </CardContent>
        </Card>

        {/* Data Tables */}
        <Card sx={{ flex: 1 }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs value={activeTab} onChange={handleTabChange}>
              <Tab label={`Users (${testData.users.length})`} />
              <Tab label={`Sales (${testData.sales.length})`} />
              <Tab label={`Attendance (${testData.attendance.length})`} />
              <Tab label={`Leaves (${testData.leaves.length})`} />
              <Tab label={`Store Targets (${testData.storeTargets.length})`} />
            </Tabs>
          </Box>

          <TabPanel value={activeTab} index={0}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Typography variant="h6">Users</Typography>
              <Button
                startIcon={<AddIcon />}
                onClick={() => handleAddNew("user")}
                variant="contained"
                size="small"
              >
                Add User
              </Button>
            </Box>
            {renderTable(testData.users, "user", [
              "ID",
              "User Name",
              "Email",
              "First Name",
              "Last Name",
              "Designation",
              "Is Active",
            ])}
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Typography variant="h6">Sales</Typography>
              <Button
                startIcon={<AddIcon />}
                onClick={() => handleAddNew("sale")}
                variant="contained"
                size="small"
              >
                Add Sale
              </Button>
            </Box>
            {renderTable(testData.sales, "sale", [
              "ID",
              "Sale Amount",
              "Product Price",
              "Tax",
              "Quantity",
              "Invoice Number",
              "Notes",
            ])}
          </TabPanel>

          <TabPanel value={activeTab} index={2}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Typography variant="h6">Attendance</Typography>
              <Button
                startIcon={<AddIcon />}
                onClick={() => handleAddNew("attendance")}
                variant="contained"
                size="small"
              >
                Add Attendance
              </Button>
            </Box>
            {renderTable(testData.attendance, "attendance", [
              "ID",
              "User ID",
              "Total Hours",
              "Created On",
            ])}
          </TabPanel>

          <TabPanel value={activeTab} index={3}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Typography variant="h6">Leaves</Typography>
              <Button
                startIcon={<AddIcon />}
                onClick={() => handleAddNew("leave")}
                variant="contained"
                size="small"
              >
                Add Leave
              </Button>
            </Box>
            {renderTable(testData.leaves, "leave", [
              "ID",
              "Leave Type",
              "Start Date",
              "End Date",
              "Leave Days",
              "Status",
              "Reason",
            ])}
          </TabPanel>

          <TabPanel value={activeTab} index={4}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Typography variant="h6">Store Targets</Typography>
              <Button
                startIcon={<AddIcon />}
                onClick={() => handleAddNew("storeTarget")}
                variant="contained"
                size="small"
              >
                Add Target
              </Button>
            </Box>
            {renderTable(testData.storeTargets, "storeTarget", [
              "ID",
              "Role ID",
              "Target Amount",
              "Target Penetration",
              "Achievement Penetration",
              "Target Achievement",
            ])}
          </TabPanel>
        </Card>
      </Box>

      {/* Right Sidebar - JSON View */}
      {showJsonView && (
        <Box sx={{ width: 400, borderLeft: 1, borderColor: "divider" }}>
          <Card sx={{ height: "100%", borderRadius: 0 }}>
            <CardHeader
              title="JSON Preview"
              action={
                <IconButton onClick={() => setShowJsonView(false)} size="small">
                  ×
                </IconButton>
              }
            />
            <CardContent sx={{ height: "calc(100% - 80px)", overflow: "auto" }}>
              <pre style={{ fontSize: "12px", margin: 0 }}>
                {JSON.stringify(
                  {
                    ...testData,
                    workflowJson: localWorkflowJson,
                  },
                  null,
                  2
                )}
              </pre>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Edit Dialog */}
      {renderEditDialog()}
    </Box>
  );
};

export default TestData;
