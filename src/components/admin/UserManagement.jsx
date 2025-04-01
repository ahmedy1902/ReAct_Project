import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserRole, fetchAllUsers } from "../../features/admin/adminSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  Box,
  Typography,
  Alert,
  FormControl,
} from "@mui/material";

const UserManagement = () => {
  const dispatch = useDispatch();
  const { users, loading, error, message } = useSelector(
    (state) => state.admin
  );
  const currentUser = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      console.log("Attempting role change:", { userId, newRole });

      if (userId === currentUser._id) {
        alert("لا يمكنك تغيير دورك بنفسك!");
        return;
      }

      const result = await dispatch(
        updateUserRole({ userId, role: newRole })
      ).unwrap();
      console.log("Role update result:", result);

      // تحديث القائمة بعد نجاح التغيير
      await dispatch(fetchAllUsers());
    } catch (error) {
      console.error("Role update failed:", error);
      alert(error.message || "فشل تحديث الدور");
    }
  };

  if (loading) return <Typography>جاري التحميل...</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        إدارة المستخدمين
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>اسم المستخدم</TableCell>
              <TableCell>البريد الإلكتروني</TableCell>
              <TableCell>الدور الحالي</TableCell>
              <TableCell>تغيير الدور</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <FormControl size="small">
                    <Select
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(user._id, e.target.value)
                      }
                      disabled={user._id === currentUser._id}
                      sx={{ minWidth: 120 }}
                    >
                      <MenuItem value="user">User</MenuItem>
                      <MenuItem value="admin">Admin</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      {message && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {message}
        </Alert>
      )}
    </Box>
  );
};

export default UserManagement;
