import Layout from "@/components/layout";
import CartPage from "@/pages/cart";
import CategoryListPage from "@/pages/catalog/category-list";
import ProductDetailPage from "@/pages/catalog/product-detail";
import ProductListPage from "@/pages/catalog/product-list";
import ChooseOrderCustomer from "@/pages/choose-order-customer";
import HomePage from "@/pages/home";
import LedgerPage from "@/pages/ledger";
import LoginPage from "@/pages/login";
import MenuStorePage from "@/pages/menu-store";
import MenuTablePage from "@/pages/menu-table";
import OrderCreatePage from "@/pages/order-create";
import OrderCreatePosPage from "@/pages/order-create-pos";
import OrderDetailsPage from "@/pages/order-details";
import OrderDetailsPosPage from "@/pages/order-details-pos";
import OrderHistoryPage from "@/pages/order-history";
import PickOrderProducts from "@/pages/pick-order-products";
import ProfilePage from "@/pages/profile";
import SearchPage from "@/pages/search";
import { getBasePath } from "@/utils/zma";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/home",
          element: <HomePage />,
          handle: {
            logo: true,
          },
        },
        {
          path: "/categories",
          element: <CategoryListPage />,
          handle: {
            title: "Danh mục sản phẩm",
            back: false,
          },
        },
        {
          path: "/cart",
          element: <CartPage />,
          handle: {
            title: "Giỏ hàng",
          },
        },
        {
          path: "/profile",
          element: <ProfilePage />,
          handle: {
            logo: true,
          },
        },
        {
          path: "/flash-sales",
          element: <ProductListPage />,
          handle: {
            title: "Flash Sales",
          },
        },
        {
          path: "/category/:id",
          element: <ProductListPage />,
          handle: {
            title: ({ categories, params }) =>
              categories.find((c) => c.id === Number(params.id))?.name,
          },
        },
        {
          path: "/product/:id",
          element: <ProductDetailPage />,
          handle: {
            scrollRestoration: 0, // when user selects another product in related products, scroll to the top of the page
          },
        },
        {
          path: "/search",
          element: <SearchPage />,
          handle: {
            title: "Tìm kiếm",
          },
        },

        // actual routes
        {
          path: "/login",
          element: <LoginPage />,
          handle: {
            headerless: true,
          },
        },
        {
          path: "/menu-table",
          element: <MenuTablePage />,
          handle: {
            title: "Bán hàng",
            back: false,
            user: true,
          },
        },
        {
          path: "/order-details",
          element: <OrderDetailsPage />,
          handle: {
            headerless: true, // uses its own header bar
            footerless: true,
          },
        },
        {
          path: "/order-details-pos",
          element: <OrderDetailsPosPage />,
          handle: {
            headerless: true, // uses its own header bar
            footerless: true,
          },
        },
        {
          path: "/order-create",
          element: <OrderCreatePage />,
          handle: {
            headerless: true, // uses its own header bar
            footerless: true,
          },
        },
        {
          path: "/order-create-pos",
          element: <OrderCreatePosPage />,
          handle: {
            headerless: true, // uses its own header bar
            footerless: true,
          },
        },
        {
          path: "/choose-order-customer",
          element: <ChooseOrderCustomer />,
          handle: {
            back: true,
            backAppearance: "close",
            footerless: true,
          },
        },
        {
          path: "/pick-order-products",
          element: <PickOrderProducts />,
          handle: {
            back: true,
            backAppearance: "close",
            footerless: true,
          },
        },
        {
          path: "/ledger",
          element: <LedgerPage />,
          handle: {
            title: "Sổ quỹ",
            back: false,
            user: true,
          },
        },
        {
          path: "/menu-store",
          element: <MenuStorePage />,
          handle: {
            title: "Cửa hàng",
            back: false,
            user: true,
          },
        },
        {
          path: "/order-history",
          element: <OrderHistoryPage />,
          handle: {
            title: "Lịch sử đơn hàng",
            back: true,
            footerless: true,
          },
        },
      ],
    },
  ],
  { basename: getBasePath() },
);

export default router;
