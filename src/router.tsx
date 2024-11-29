import Layout from "@/components/layout";
import CartPage from "@/pages/cart";
import CategoryListPage from "@/pages/catalog/category-list";
import ProductDetailPage from "@/pages/catalog/product-detail";
import ProductListPage from "@/pages/catalog/product-list";
import HomePage from "@/pages/home";
import LoginPage from "@/pages/login";
import MenuTable from "@/pages/menu-table";
import OrderDetailsPage from "@/pages/order-details";
import ProfilePage from "@/pages/profile";
import SearchPage from "@/pages/search";
import { getBasePath } from "@/utils/zma";
import { createBrowserRouter } from "react-router-dom";
import ChooseOrderCustomer from "./pages/choose-order-customer";

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
          element: <MenuTable />,
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
            back: true,
            footerless: true,
          },
        },
        {
          path: "/choose-order-customer",
          element: <ChooseOrderCustomer />,
          handle: {
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
