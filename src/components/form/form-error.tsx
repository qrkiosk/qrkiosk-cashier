import isEmpty from "lodash/isEmpty";

const FormError = ({ error }) => {
  if (isEmpty(error)) return null;

  return <p className="mt-1 text-xs text-danger">{error.message}</p>;
};

export default FormError;
