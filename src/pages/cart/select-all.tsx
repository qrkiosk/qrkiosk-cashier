import Checkbox from "@/components/checkbox";
import { RemoveIcon } from "@/components/vectors";
import { cartState, selectedCartItemIdsState } from "@/state";
import { useAtom } from "jotai";

export default function SelectAll() {
  const [cart, setCart] = useAtom(cartState);

  const [selectedItemIds, setSelectedItemIds] = useAtom(
    selectedCartItemIdsState,
  );
  const checkedAll =
    selectedItemIds.length > 0 &&
    !cart.some((item) => !selectedItemIds.includes(item.id));
  const checkAll = () => {
    setSelectedItemIds(cart.map((item) => item.id));
  };
  const uncheckAll = () => {
    setSelectedItemIds([]);
  };

  return (
    <div className="flex items-center space-x-4 px-4 py-3">
      <Checkbox
        checked={checkedAll}
        onChange={checkedAll ? uncheckAll : checkAll}
      />
      <div className="flex-1 text-sm font-medium">Tất cả</div>
      {selectedItemIds.length > 0 && (
        <RemoveIcon
          className="cursor-pointer"
          onClick={() => {
            setCart(cart.filter((item) => !selectedItemIds.includes(item.id)));
            setSelectedItemIds([]);
          }}
        />
      )}
    </div>
  );
}
