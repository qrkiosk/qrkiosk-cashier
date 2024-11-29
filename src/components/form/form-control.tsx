import { ReactNode } from "react";

const FormControl = ({ children }: { children: ReactNode }) => {
  return <div className="form-control relative">{children}</div>;
};

export default FormControl;
