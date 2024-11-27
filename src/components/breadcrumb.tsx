import { BreadcrumbEntry } from "@/types/common";
import classNames from "classnames";
import isEmpty from "lodash/isEmpty";
import { Fragment, memo } from "react";
import { FaAngleRight } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const Breadcrumb = ({ entries }: { entries: BreadcrumbEntry[] }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center space-x-2 px-4 py-3">
      {entries.map((entry, index) => {
        const isLast = index === entries.length - 1;
        const isClickable = !isEmpty(entry.nav);
        const onClick = isClickable
          ? () => {
              if (!isEmpty(entry.nav)) navigate(entry.nav.path);
            }
          : undefined;

        return (
          <Fragment key={`breadcrumb-${index}`}>
            <span
              className={classNames("text-sm", {
                "font-normal text-subtitle": !isLast,
                "font-semibold": isLast,
                "cursor-pointer": isClickable,
              })}
              onClick={onClick}
            >
              {entry.text}
            </span>
            {!isLast && (
              <FaAngleRight
                fontSize={14}
                fontWeight={300}
                color="rgb(109, 109, 109)"
              />
            )}
          </Fragment>
        );
      })}
    </div>
  );
};

export default memo(Breadcrumb);
