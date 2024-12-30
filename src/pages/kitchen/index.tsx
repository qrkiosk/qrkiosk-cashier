import Button from "@/components/button";
import FlexDiv from "@/components/flex-div";
import HorizontalDivider from "@/components/horizontal-divider";
import Divider from "@/components/section-divider";
import dayjs from "dayjs";
import { Fragment } from "react";
import { FaAngleRight, FaAnglesRight } from "react-icons/fa6";

const KitchenPage = () => {
  return (
    <FlexDiv col className="!p-0">
      <div className="space-y-2 bg-white p-4">
        <p className="font-semibold">
          Bàn số 1 - Đơn số 1 - {dayjs().format("HH:mm")}
        </p>
        <div className="grid grid-cols-5 gap-y-4">
          {/* Món 1 */}
          <Fragment>
            <div className="col-span-3 space-y-1 text-sm">
              <p>Sản phẩm 1</p>
              <ul className="pl-3 text-subtitle">
                <li>Đá</li>
                <li>Trân châu phô mai, Thạch dừa</li>
                <li>Ít đường</li>
              </ul>
            </div>

            <div className="col-span-1">{1}</div>

            <div className="col-span-1 flex items-start space-x-4">
              <Button variant="text" onClick={() => {}}>
                <FaAngleRight />
              </Button>
              <Button variant="text" onClick={() => {}}>
                <FaAnglesRight />
              </Button>
            </div>
          </Fragment>

          <div className="col-span-5">
            <HorizontalDivider />
          </div>

          {/* Món 2 */}
          <Fragment>
            <div className="col-span-3 space-y-1 text-sm">
              <p>Sản phẩm 2</p>
              <ul className="pl-3 text-subtitle">
                <li>Đá</li>
                <li>Trân châu phô mai, Thạch dừa</li>
                <li>Ít đường</li>
              </ul>
            </div>

            <div className="col-span-1">{1}</div>

            <div className="col-span-1 flex items-start space-x-4">
              <Button variant="text" onClick={() => {}}>
                <FaAngleRight />
              </Button>
              <Button variant="text" onClick={() => {}}>
                <FaAnglesRight />
              </Button>
            </div>
          </Fragment>
        </div>
      </div>
      <Divider />

      <div className="space-y-2 bg-white p-4">
        <p className="font-semibold">
          Bàn số 2 - Đơn số 1 - {dayjs().format("HH:mm")}
        </p>
        <div className="grid grid-cols-5 gap-y-2">
          <div className="col-span-3 space-y-1 text-sm">
            <p>Sản phẩm 1</p>
            <ul className="pl-3 text-subtitle">
              <li>Đá</li>
              <li>Trân châu phô mai, Thạch dừa</li>
              <li>Ít đường</li>
            </ul>
          </div>

          <div className="col-span-1">{1}</div>

          <div className="col-span-1 flex items-start space-x-4">
            <Button variant="text" onClick={() => {}}>
              <FaAngleRight />
            </Button>
            <Button variant="text" onClick={() => {}}>
              <FaAnglesRight />
            </Button>
          </div>
        </div>
      </div>
      <Divider />
    </FlexDiv>
  );
};

export default KitchenPage;
