import { SearchIconLarge } from "./vectors";

const EmptyState = ({ message }: { message: string }) => {
  return (
    <div className="flex flex-col items-center space-y-4 p-6">
      <SearchIconLarge />
      <div className="text-center text-2xs text-inactive">{message}</div>
    </div>
  );
};

export default EmptyState;
