import { STATUS_DATA, DIALOG_DISPLAY_DATA } from "../utils/constants";

export type StatusType = typeof STATUS_DATA;
export type DialogDisplayType = typeof DIALOG_DISPLAY_DATA;

export interface TaskListInterface {
  _id: string;
  title: string;
  description: string;
  status: string;
}
