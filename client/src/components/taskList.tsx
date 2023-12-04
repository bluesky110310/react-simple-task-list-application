import {
  AppBar,
  Button,
  CssBaseline,
  Stack,
  Toolbar,
  Typography,
  Backdrop,
  CircularProgress,
  IconButton,
} from "@mui/material";
import TaskIcon from "@mui/icons-material/Task";
import { AlertColor } from "@mui/material/Alert";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TaskTable from "./taskTable";
import axios from "axios";
import { TaskListInterface } from "../types/task";
import { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import CloseIcon from "@mui/icons-material/Close";
import { DIALOG_DISPLAY_DATA } from "../utils/constants";
import HandleTaskDialog from "./handleTaskDialog";
import { BASE_URL } from "../utils/constants";
import { useConfirm } from "material-ui-confirm";

const defaultTheme = createTheme();

export default function TaskList() {
  const [tasks, setTasks] = useState<TaskListInterface[]>([]);
  const [currentTaskData, setCurrentTaskData] = useState<TaskListInterface>();
  const [dialogDisplayType, setDialogDisplayType] = useState<string>(
    DIALOG_DISPLAY_DATA.HIDDEN_DIALOG
  );
  const [loading, setLoading] = useState<boolean>(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const confirm = useConfirm();

  // send 'Get All Tasks' API to the server
  const getAllTasks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/tasks`);
      setTasks(res.data);
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        addSnackbarMessage("error", err.response?.data);
      }
    }
    setLoading(false);
  };

  // send 'Add Task' API to the server
  const handleAddTask = async (taskField: TaskListInterface) => {
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/tasks`, taskField);

      // synchronize with status
      setTasks((tasks) => {
        tasks.unshift(res.data);
        return [...tasks];
      });

      // show notification
      addSnackbarMessage("success", "Task Added Successfully!");
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        addSnackbarMessage("error", err.response?.data);
      }
      setLoading(false);
      return false;
    }
    setLoading(false);
    return true;
  };

  // send 'Edit Task' API to the server
  const handleEditTask = async (taskField: TaskListInterface) => {
    setLoading(true);
    try {
      const res = await axios.patch(
        `${BASE_URL}/api/tasks/${taskField._id}`,
        taskField
      );

      // synchronize with status
      setTasks((tasks) => {
        const idx = tasks.findIndex((item) => item._id === res.data._id);
        tasks.splice(idx, 1, res.data);
        return [...tasks];
      });

      // show notification
      addSnackbarMessage("success", "Task Edit Successfully!");
    } catch (err: any) {
      if (axios.isAxiosError(err))
        addSnackbarMessage("error", err.response?.data);
      setLoading(false);
      return false;
    }
    setLoading(false);
    return true;
  };

  // send 'Delete Task' API to the server
  const handleDeleteTask = async (_id: string) => {
    setLoading(true);
    try {
      const res = await axios.delete(`${BASE_URL}/api/tasks/${_id}`);

      // synchronize with status
      setTasks((tasks) => {
        const idx = tasks.findIndex((item) => item._id === res.data);
        tasks.splice(idx, 1);
        return [...tasks];
      });

      // show notification
      addSnackbarMessage("success", "Task Deleted Successfully!");
    } catch (err: any) {
      if (axios.isAxiosError(err))
        addSnackbarMessage("error", err.response?.data);
    }
    setLoading(false);
  };

  // add snackbar message
  const addSnackbarMessage = (type: AlertColor, message: string) => {
    enqueueSnackbar(message, {
      variant: type,
      autoHideDuration: 3000,
      anchorOrigin: { vertical: "top", horizontal: "right" },
      action: (key) => {
        return (
          <IconButton size="small" onClick={() => closeSnackbar(key)}>
            <CloseIcon fontSize="small"></CloseIcon>
          </IconButton>
        );
      },
    });
  };

  useEffect(() => {
    getAllTasks();
    // eslint-disable-next-line
  }, []);

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      {loading && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      <AppBar position="relative">
        <Toolbar>
          <TaskIcon sx={{ mr: 1 }} />
          <Typography variant="h6" color="inherit" noWrap>
            Task List
          </Typography>
        </Toolbar>
      </AppBar>
      <main>
        <Stack sx={{ px: 10, py: 6 }} spacing={3}>
          <Stack sx={{ px: 2 }} direction="row" justifyContent="flex-end">
            <Button
              variant="contained"
              onClick={() => {
                setDialogDisplayType(DIALOG_DISPLAY_DATA.ADD_DIALOG);
                setCurrentTaskData(undefined);
              }}
            >
              Add task
            </Button>
          </Stack>
          {tasks.length ? (
            <TaskTable
              rows={tasks}
              editTask={(data: TaskListInterface) => {
                setDialogDisplayType(DIALOG_DISPLAY_DATA.EDIT_DIALOG);
                setCurrentTaskData(data);
              }}
              deleteTask={(_id: string) => {
                confirm({
                  title: "Delete Confirm",
                  description: "Are you sure to delete the task?",
                })
                  .then(() => handleDeleteTask(_id))
                  .catch(() => {});
              }}
            ></TaskTable>
          ) : (
            <Typography
              sx={{ py: 10 }}
              variant="h3"
              color="inherit"
              align="center"
              noWrap
            >
              No Tasks
            </Typography>
          )}
        </Stack>
        {dialogDisplayType !== DIALOG_DISPLAY_DATA.HIDDEN_DIALOG && (
          <HandleTaskDialog
            displayType={dialogDisplayType}
            currentData={currentTaskData}
            handleClose={() => {
              setDialogDisplayType(DIALOG_DISPLAY_DATA.HIDDEN_DIALOG);
            }}
            manipulateTask={
              dialogDisplayType === DIALOG_DISPLAY_DATA.ADD_DIALOG
                ? handleAddTask
                : handleEditTask
            }
          ></HandleTaskDialog>
        )}
      </main>
    </ThemeProvider>
  );
}
