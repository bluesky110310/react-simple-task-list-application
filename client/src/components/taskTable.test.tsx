import { cleanup } from "@testing-library/react";
import { configure, shallow } from "enzyme";
import Adapter from "@cfaester/enzyme-adapter-react-18";
import TaskTable from "./taskTable";
import { TaskListInterface } from "../types/task";
import {
  IconButton,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

afterEach(() => {
  cleanup();
});

configure({ adapter: new Adapter() });

const editTask = jest.fn();
const deleteTask = jest.fn();

const setup = () => {
  const tasks: TaskListInterface[] = [
    {
      _id: "656c88a295a6bc188f6f1d4a",
      title: "Test1",
      description: "This is the test1 item.",
      status: "To Do",
    },
    {
      _id: "656c88a295a6bc188f6f1d4b",
      title: "Test2",
      description: "This is the test2 item.",
      status: "Done",
    },
  ];

  const props = {
    rows: tasks,
    editTask: editTask,
    deleteTask: deleteTask,
  };

  const wrapper = shallow(<TaskTable {...props} />);

  return { props, wrapper };
};

describe("TaskTable component", () => {
  test("it renders", () => {
    const { props, wrapper } = setup();
    const { rows } = props;

    expect(wrapper).toMatchSnapshot();

    const headers = wrapper.find(TableHead).find(TableCell);
    expect(headers.at(0).text()).toEqual("ID");
    expect(headers.at(1).text()).toEqual("Title");
    expect(headers.at(2).text()).toEqual("Description");
    expect(headers.at(3).text()).toEqual("Status");
    expect(headers.at(4).text()).toEqual("Operation");

    const tableRows = wrapper.find(TableBody).find(TableRow);
    expect(tableRows.length).toEqual(rows.length);

    for (let i = 0; i < rows.length; i++) {
      const row = tableRows.at(i).find(TableCell);
      expect(row.at(0).text()).toEqual(i + 1 + "");
      expect(row.at(1).text()).toEqual(rows[i].title);
      expect(row.at(2).text()).toEqual(rows[i].description);
      expect(row.at(3).find(Chip).get(0).props.label).toEqual(rows[i].status);

      const icons = row.at(4).find(IconButton);
      expect(icons.length).toEqual(2);
      expect(icons.find(EditIcon).length).toEqual(1);
      expect(icons.find(DeleteIcon).length).toEqual(1);
    }
  });
});
