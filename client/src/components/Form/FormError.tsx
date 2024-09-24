import {ExclamationTriangleIcon} from "@radix-ui/react-icons";

interface FormErrorProps {
  message?: string;
}

export const FormError: React.FunctionComponent<FormErrorProps> = ({
  message,
}) => {
  if (!message) return null;

  return (
    <div className="bg-destructive p-3 rounded-md flex items-center gap-x-2 text-sm text-white">
      <ExclamationTriangleIcon className="h-4 w-4" />
      <p>{message}</p>
    </div>
  );
};
