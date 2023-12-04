import { cleanup } from '@testing-library/react';
import Adapter from '@cfaester/enzyme-adapter-react-18';
import TaskList from './taskList';
import { configure, shallow } from 'enzyme';
import { AppBar, Button, Stack, Typography } from '@mui/material';

afterEach(() => {
    cleanup();
});

configure({ adapter: new Adapter() });

const setup = () => {
    const wrapper = shallow(<TaskList />);

    return { wrapper };
}

describe('TaskList component', () => {
    test('it renders', () => {
        const { wrapper } = setup();

        expect(wrapper).toMatchSnapshot();

        const title = wrapper.find(AppBar).find(Typography);
        expect(title.at(0).text()).toEqual('Task List');

        const button = wrapper.find(Stack).find(Button);
        expect(button.at(0).text()).toEqual('Add task');
    });
});