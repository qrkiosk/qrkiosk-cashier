import { Grid, GridItem } from "@chakra-ui/react";
import OrderItem from "./order-item";

const Products = () => {
  return (
    <div className="bg-[--zmp-background-white] px-4 py-3">
      <Grid templateColumns="repeat(3, 1fr)">
        <GridItem colSpan={3}>
          <div className="flex h-full items-center">
            <p className="font-semibold">Sản phẩm</p>
          </div>
        </GridItem>

        <OrderItem>
          {{
            uniqIdentifier: "x1",
            quantity: 1,
            name: "Cà phê sữa",
            options: [{ id: "o1" }, { id: "o2" }],
            note: "note",
          }}
        </OrderItem>
        <OrderItem>
          {{
            uniqIdentifier: "x2",
            quantity: 1,
            name: "Cà phê sữa",
            options: [{ id: "o3" }, { id: "o4" }],
            note: "note",
          }}
        </OrderItem>
        <OrderItem>
          {{
            uniqIdentifier: "x3",
            quantity: 1,
            name: "Cà phê sữa",
            options: [{ id: "o5" }, { id: "o6" }],
            note: "another note",
          }}
        </OrderItem>
        <OrderItem>
          {{
            uniqIdentifier: "x4",
            quantity: 1,
            name: "Cà phê sữa",
            options: [{ id: "o5" }, { id: "o6" }],
            note: "another note",
          }}
        </OrderItem>
      </Grid>
    </div>
  );
};

export default Products;
