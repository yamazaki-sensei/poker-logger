import * as Select from "@radix-ui/react-select";

export const SelectItem = (props: Select.SelectItemProps) => (
  <Select.Item {...props} className="cursor-pointer bg-gray-800 p-2">
    {props.children}
  </Select.Item>
);
