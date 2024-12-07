import { productVariantNoteAtom } from "@/state/product";
import { Textarea } from "@chakra-ui/react";
import autosize from "autosize";
import { useAtom } from "jotai";
import { useEffect, useRef } from "react";

const VariantNote = () => {
  const [note, setNote] = useAtom(productVariantNoteAtom);
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    autosize(ref.current);

    return () => {
      autosize.destroy(ref.current);
    };
  }, []);

  return (
    <Textarea
      ref={ref}
      rows={1}
      size="sm"
      transition="height none" // important for autosize to work properly
      placeholder="Thêm lưu ý của bạn về món này."
      borderRadius="md"
      mb={5}
      value={note}
      onChange={(e) => setNote(e.target.value)}
    />
  );
};

export default VariantNote;
