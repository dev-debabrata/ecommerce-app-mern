import { cn } from "../utils/cn";

const inputSizes = {
  tiny: "w-3",
  small: "border border-gray-200 p-1 max-w-10 sm:max-w-20 sm:px-2",
  medium: "border-[0.063rem] px-3 py-2 border-gray-800 w-full",
  large: "w-full font-bold border border-gray-300 outline-0 rounded",
};

const Input = ({
  placeholder,
  checked,
  onChange,
  htmlType = "text",
  inputClassName = "",
  wrapperClassName = "",
  name,
  size,
  label,
  value,
  required,
}) => {
  const cursorStyle =
    htmlType === "checkbox" || htmlType === "radio"
      ? "cursor-pointer"
      : "cursor-text";

  return (
    <label
      className={cn(
        "flex w-full gap-2",
        htmlType === "checkbox" || htmlType === "radio" ? "cursor-pointer" : "",
        wrapperClassName,
      )}
    >
      <input
        placeholder={placeholder}
        checked={checked}
        onChange={onChange}
        type={htmlType}
        name={name}
        value={value}
        required={required}
        className={cn(
          htmlType === "checkbox" ? "w-3" : inputSizes[size],
          inputClassName,
          cursorStyle,
        )}
      />

      {label && <span>{label}</span>}
    </label>
  );
};

export default Input;
