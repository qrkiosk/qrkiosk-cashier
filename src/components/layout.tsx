import { useHandle401 } from "@/hooks";
import { isAuthenticatedAtom } from "@/state";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider as JotaiProvider, useAtomValue } from "jotai";
import { queryClientAtom } from "jotai-tanstack-query";
import { useHydrateAtoms } from "jotai/react/utils";
import { Suspense, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Outlet, useNavigate } from "react-router-dom";
import ConfigProvider from "./config-provider";
import Footer from "./footer";
import Header from "./header";
import OpenShiftModal from "./open-shift-modal";
import OrderSocket from "./order-socket";
import { PageSkeleton } from "./skeleton";

const InnerLayout = () => {
  useHandle401();

  const navigate = useNavigate();
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/menu-table", { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated]);

  return (
    <div className="flex h-screen w-screen flex-col bg-background text-foreground">
      <Header />
      <div className="flex flex-1 flex-col overflow-y-auto bg-[--zmp-background-color]">
        <Suspense fallback={<PageSkeleton />}>
          <Outlet />
        </Suspense>
      </div>
      {isAuthenticated && <Footer />}
      <Toaster
        containerClassName="toast-container"
        containerStyle={{
          top: "calc(50% - 24px)",
        }}
      />
      <OrderSocket />
      <OpenShiftModal />
      {/* <ScrollRestoration /> */}
    </div>
  );
};

const queryClient = new QueryClient();

const HydrateAtoms = ({ children }: { children: React.ReactNode }) => {
  useHydrateAtoms([[queryClientAtom, queryClient]]);
  return <>{children}</>;
};

const Layout = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <JotaiProvider>
        <HydrateAtoms>
          <ChakraProvider>
            <ConfigProvider>
              <InnerLayout />
            </ConfigProvider>
          </ChakraProvider>
        </HydrateAtoms>
      </JotaiProvider>
    </QueryClientProvider>
  );
};

export default Layout;
