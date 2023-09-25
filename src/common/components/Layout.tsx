import { useSettingsStore } from "@/modules/play2/state/settings-store";
import { Footer } from "./Footer";
import { navbarFactory } from "./NewNavbar";

interface LayoutProps {
  children: JSX.Element;
}

interface ContainerProps {
  children: JSX.Element;
  centered: boolean;
}

export function Container({ children, centered }: ContainerProps) {
  return (
    <div
      className={`flex justify-center h-full w-full 
     ${centered ? "items-center justify-content" : ""} `}
    >
      <div className="flex flex-col max-w-5xl w-full h-full justify-center relative">
        {children}
      </div>
    </div>
  );
}

export function Layout({ children }: LayoutProps) {
  const Navbar = navbarFactory();

  const navBarVisible = useSettingsStore((state) => state.navBarVisible);
  return (
    <>
      {navBarVisible && (
        <Container centered={false}>
          <Navbar />
        </Container>
      )}

      {navBarVisible && (
        <Container centered={true}>{children}</Container>
      )}
      {!navBarVisible && (
        <> 
        {children}
        </>
      )}

      {navBarVisible && (
        <Container centered={false}>
          <>
            <Footer />
          </>
        </Container>
      )}
    </>
  );
}
