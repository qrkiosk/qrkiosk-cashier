import React, { useEffect } from "react";

const CSS_VARIABLES = {
  "--zmp-background-color": "#f4f5f6",
};

const ConfigProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    Object.keys(CSS_VARIABLES)
      .filter((cssVar) => CSS_VARIABLES[cssVar])
      .forEach((cssVar) => {
        document.documentElement.style.setProperty(
          `${cssVar}`,
          CSS_VARIABLES[cssVar],
        );
      });
  }, []);

  useEffect(
    () => () => {
      Object.keys(CSS_VARIABLES).forEach((cssVar) => {
        document.documentElement.style.removeProperty(`${cssVar}`);
      });
    },
    [],
  );

  return <>{children}</>;
};

export default ConfigProvider;
