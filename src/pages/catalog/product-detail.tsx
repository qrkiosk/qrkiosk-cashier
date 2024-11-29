import Button from "@/components/button";
import Collapse from "@/components/collapse";
import HorizontalDivider from "@/components/horizontal-divider";
import { useAddToCart } from "@/hooks";
import { productState } from "@/state";
import { Color, Size } from "@/types.global";
import { formatPrice } from "@/utils/format";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import RelatedProducts from "./related-products";
import ShareButton from "./share-buttont";
import VariantPicker from "./variant-picker";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = useAtomValue(productState(Number(id)))!;
  const [selectedColor, setSelectedColor] = useState<Color>();
  const [selectedSize, setSelectedSize] = useState<Size>();

  useEffect(() => {
    setSelectedColor(product.colors?.[0]);
    setSelectedSize(product.sizes?.[0]);
  }, [id]);

  const { addToCart, setOptions } = useAddToCart(product);

  useEffect(() => {
    setOptions({
      size: selectedSize,
      color: selectedColor?.name,
    });
  }, [selectedSize, selectedColor]);

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="w-full px-4">
          <div className="py-2">
            <img
              key={product.id}
              src={product.image}
              alt={product.name}
              className="h-full w-full rounded-lg object-cover"
              style={{
                viewTransitionName: `product-image-${product.id}`,
              }}
            />
          </div>
          <div className="text-xl font-medium text-primary">
            {formatPrice(product.price)}
          </div>
          {!!product.originalPrice && (
            <div className="text-2xs text-subtitle line-through">
              {formatPrice(product.price)}
            </div>
          )}
          <div className="mt-1 text-sm">{product.name}</div>
          <div className="py-2">
            <ShareButton product={product} />
          </div>
          {product.colors && (
            <VariantPicker
              title="Color"
              variants={product.colors}
              value={selectedColor}
              onChange={(color) => setSelectedColor(color)}
              renderVariant={(variant, selected) => (
                <div
                  className={"h-full w-full rounded-full".concat(
                    selected ? "border-2 border-primary p-0.5" : "",
                  )}
                >
                  <div
                    className="h-full w-full rounded-full"
                    style={{ backgroundColor: variant?.hex }}
                  />
                </div>
              )}
            />
          )}
          <HorizontalDivider />
          {product.sizes && (
            <VariantPicker
              title="Size"
              variants={product.sizes}
              value={selectedSize}
              onChange={(size) => setSelectedSize(size)}
              renderVariant={(variant, selected) => (
                <div
                  className={"flex h-full w-full items-center justify-center".concat(
                    selected ? "bg-primary text-white" : "",
                  )}
                >
                  <div className="truncate">{variant}</div>
                </div>
              )}
            />
          )}
        </div>
        {product.details && (
          <>
            <div className="h-2 w-full bg-section"></div>
            <Collapse items={product.details} />
          </>
        )}
        <div className="h-2 w-full bg-section"></div>
        <div className="px-4 py-2 font-medium">
          <div className="pb-2.5 pt-2">Sản phẩm khác</div>
          <HorizontalDivider />
        </div>
        <RelatedProducts currentProductId={product.id} />
      </div>

      <HorizontalDivider />
      <div className="grid flex-none grid-cols-2 gap-2 px-4 py-3">
        <Button
          size="lg"
          variant="secondary"
          onClick={() => {
            addToCart(1);
            toast.success("Đã thêm vào giỏ hàng");
          }}
        >
          Thêm vào giỏ
        </Button>
        <Button
          size="lg"
          variant="primary"
          onClick={() => {
            addToCart(1);
            navigate("/cart");
          }}
        >
          Mua ngay
        </Button>
      </div>
    </div>
  );
}
