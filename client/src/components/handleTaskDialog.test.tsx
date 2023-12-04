import { cleanup } from "@testing-library/react";
import { configure, shallow } from "enzyme";
import Adapter from "@cfaester/enzyme-adapter-react-18";
import { Button, DialogActions, DialogContent, TextField } from "@mui/material";
import HandleTaskDialog from "./handleTaskDialog";
import { DIALOG_DISPLAY_DATA, STATUS_DATA } from "../utils/constants";
import { Controller } from "react-hook-form";

afterEach(() => {
  cleanup();
});

configure({ adapter: new Adapter() });

const handleClose = jest.fn();
const manipulateTask = jest.fn();

const props1 = {
  displayType: DIALOG_DISPLAY_DATA.ADD_DIALOG,
  currentData: undefined,
  handleClose,
  manipulateTask,
};

const props2 = {
  displayType: DIALOG_DISPLAY_DATA.EDIT_DIALOG,
  currentData: {
    _id: "656c88a295a6bc188f6f1d4a",
    title: "Test",
    description: "This is the test task.",
    status: STATUS_DATA.IN_PROGRESS,
  },
  handleClose,
  manipulateTask,
};

const setup = (props: any) => {
  const wrapper = shallow(<HandleTaskDialog {...props} />);

  return { props, wrapper };
};

describe("HandleTaskDialog component", () => {
  test("it(ADD TASK) renders", () => {
    const { props, wrapper } = setup(props1);

    expect(wrapper).toMatchSnapshot();

    const textFields = wrapper.find(DialogContent).find(TextField);
    expect(textFields.at(0).props().id).toEqual("input-description");
    expect(textFields.at(0).props().value).toEqual("");

    const buttons = wrapper.find(DialogActions).find(Button);
    expect(buttons.at(0).text()).toEqual("Cancel");
    expect(buttons.at(1).text()).toEqual(props.displayType);
  });

  test("it(EDIT TASK) renders", () => {
    const { props, wrapper } = setup(props2);

    expect(wrapper).toMatchSnapshot();

    const textFields = wrapper.find(DialogContent).find(TextField);
    expect(textFields.at(0).props().id).toEqual("input-description");
    expect(textFields.at(0).props().value).toEqual(
      props.currentData.description
    );

    const buttons = wrapper.find(DialogActions).find(Button);
    expect(buttons.at(0).text()).toEqual("Cancel");
    expect(buttons.at(1).text()).toEqual(props.displayType);
  });
});
