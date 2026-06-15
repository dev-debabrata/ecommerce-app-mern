import Input from "./Input";
import { cn } from "../utils/cn";
import { deliveryFields } from "../data/checkoutData";

const AddressForm = ({ formData, setFormData }) => {
  const handleChange = (fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  return (
    <div className="flex w-full flex-wrap gap-3">
      {deliveryFields.map((deliveryField) => (
        <Input
          key={deliveryField.fieldName}
          value={formData?.[deliveryField.fieldName] || ""}
          size="medium"
          htmlType="text"
          required={deliveryField.isRequired}
          placeholder={deliveryField.placeholder}
          inputClassName="mb-1 w-full rounded border-gray-300 px-4"
          wrapperClassName={cn({
            "w-full": deliveryField.isFullWidth,
            "w-[calc(50%-0.375rem)]": !deliveryField.isFullWidth,
          })}
          onChange={(e) =>
            handleChange(deliveryField.fieldName, e.target.value)
          }
        />
      ))}
    </div>
  );
};

export default AddressForm;
