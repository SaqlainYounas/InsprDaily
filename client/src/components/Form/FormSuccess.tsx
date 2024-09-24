import {CheckCircledIcon} from "@radix-ui/react-icons";

interface FormSuccessProps {
  message?: string;
}

export const FormSuccess: React.FunctionComponent<FormSuccessProps> = ({
  message,
}) => {
  if (!message) return null;

  return (
    <div className="bg-emerald-500 p-3 rounded-md flex items-center gap-x-2 text-sm text-white w-50">
      <CheckCircledIcon className="h-4 w-4" />
      <p>{message}</p>
    </div>
  );
};
