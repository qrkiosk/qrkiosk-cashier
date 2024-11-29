import { BreadcrumbEntry } from "@/types/common";
import classNames from "classnames";
import isEmpty from "lodash/isEmpty";
import { Fragment, memo } from "react";
import { FaAngleRight } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const Breadcrumb = ({ entries }: { entries: BreadcrumbEntry[] }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center space-x-1 py-3">
      {entries.map((entry, index) => {
        const isLast = index === entries.length - 1;
        const hasLink = !isEmpty(entry.nav);
        const onClick =
          hasLink && !isLast
            ? () => {
                if (!isEmpty(entry.nav)) {
                  navigate(entry.nav.path, {
                    state: { title: entries.slice(0, index + 1) },
                  });
                }
              }
            : undefined;

        return (
          <Fragment key={`breadcrumb-${index}`}>
            <span
              className={classNames("text-sm", {
                "font-normal text-subtitle": !isLast,
                "font-semibold": isLast,
                "cursor-pointer": hasLink && !isLast,
              })}
            >
              {entry.text}
            </span>
            {!isLast && (
              <FaAngleRight
                fontSize={12}
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
