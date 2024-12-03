import Carousel from "@/components/carousel";
import { bannersState } from "@/state";
import { useAtomValue } from "jotai";

export default function Banners() {
  const banners = useAtomValue(bannersState);

  return (
    <Carousel
      slides={banners.map((banner) => (
        <img className="w-full rounded" src={banner} />
      ))}
    />
  );
}
