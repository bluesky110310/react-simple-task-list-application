import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { TaskListInterface } from "../types/task";
import { IconButton } from "@mui/material";
import { STATUS_DATA } from "../utils/constants";

type Props = {
  rows: TaskListInterface[];
  editTask: Function;
  deleteTask: Function;
};

export default function TaskTable({ rows, editTask, deleteTask }: Props) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center">ID</TableCell>
            <TableCell align="center">Title</TableCell>
            <TableCell align="center">Description</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell align="center">Operation</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow
              key={index}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell
                component="th"
                scope="row"
                style={{ width: "10%" }}
                align="center"
              >
                {index + 1}
              </TableCell>
              <TableCell
                style={{
                  width: "20%",
                  maxWidth: "20vw",
                }}
                align="center"
              >
                <Typography
                  style={{
                    width: "100%",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                  }}
                >
                  {row.title}
                </Typography>
              </TableCell>
              <TableCell
                style={{ width: "40%", maxWidth: "40vw" }}
                align="center"
              >
                <pre style={{ textOverflow: "ellipsis", overflow: "hidden" }}>
                  {row.description}
                </pre>
              </TableCell>
              <TableCell style={{ width: "15%" }} align="center">
                <Chip
                  color={
                    row.status === STATUS_DATA.TO_DO
                      ? "primary"
                      : row.status === STATUS_DATA.IN_PROGRESS
                      ? "secondary"
                      : "success"
                  }
                  label={row.status}
                ></Chip>
              </TableCell>
              <TableCell style={{ width: "15%" }} align="center">
                <IconButton sx={{ mr: 2 }} onClick={() => editTask(row)}>
                  <EditIcon></EditIcon>
                </IconButton>
                <IconButton
                  type="button"
                  color="error"
                  onClick={() => deleteTask(row._id)}
                >
                  <DeleteIcon></DeleteIcon>
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
