import { useState } from "react";
import {
  Button,
  Dialog,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Stack,
} from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { useForm, Controller } from "react-hook-form";
import {
  DIALOG_DISPLAY_DATA,
  STATUS_DATA,
  STATUS_DATA_ALL,
} from "../utils/constants";
import { TaskListInterface } from "../types/task";

interface Props {
  displayType: string;
  currentData: TaskListInterface | undefined;
  handleClose: Function;
  manipulateTask: Function;
}

export default function HandleTaskDialog({
  displayType,
  currentData,
  handleClose,
  manipulateTask,
}: Props) {
  const [title, setTitle] = useState<string>(
    currentData ? currentData.title : ""
  );
  const [description, setDescription] = useState<string>(
    currentData ? currentData.description : ""
  );
  const [status, setStatus] = useState<string>(
    currentData ? currentData.status : STATUS_DATA.TO_DO
  );
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    reValidateMode: "onChange",
  });

  // when the 'add' or 'edit' button is clicked, add task
  const handleManipulateTask = async (event: any) => {
    const result = await manipulateTask({
      title,
      description,
      status,
      _id: currentData?._id,
    });
    if (result) handleClose();
  };

  // when the 'status' field is changed
  const handleStatusChange = (event: SelectChangeEvent) => {
    setStatus(event.target.value);
  };

  return (
    <Dialog
      open={displayType !== DIALOG_DISPLAY_DATA.HIDDEN_DIALOG}
      onClose={() => handleClose()}
      fullWidth={true}
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit(handleManipulateTask)}>
        <DialogTitle>{`${displayType} Task`}</DialogTitle>
        <DialogContent>
          <Stack spacing={4}>
            <Box sx={{ display: "flex", alignItems: "flex-end" }}>
              <Controller
                control={control}
                name="title"
                defaultValue={title}
                rules={{
                  required: {
                    message: "Title is required",
                    value: true,
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="input-title"
                    label="Title"
                    fullWidth
                    variant="standard"
                    name="title"
                    value={field.value}
                    error={errors.title !== undefined}
                    helperText={`${errors.title ? errors.title.message : ""}`}
                    onChange={(event) => {
                      field.onChange(event.target.value);
                      setTitle(event.target.value);
                    }}
                    autoFocus
                  />
                )}
              ></Controller>
            </Box>
            <Box sx={{ display: "flex", alignItems: "flex-end" }}>
              <TextField
                id="input-description"
                label="Description"
                fullWidth
                multiline
                maxRows={5}
                variant="standard"
                name="description"
                value={description}
                onChange={(event) => {
                  setDescription(event.target.value);
                }}
              />
            </Box>
            <FormControl fullWidth>
              <InputLabel id="select-label">Status</InputLabel>
              <Select
                labelId="select-label"
                id="select-status"
                value={status}
                label="Status"
                onChange={handleStatusChange}
              >
                {STATUS_DATA_ALL.map((item: string, index: number) => {
                  return (
                    <MenuItem key={index} value={item}>
                      {item}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose()}>Cancel</Button>
          <Button type="submit">{displayType}</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
