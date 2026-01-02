import type { MainLayoutProps } from "./main-layout.type";

import { Header } from "../../components/header";

export const MainLayout = ({
  children,
  navigate,
  menuItems,
  headerActions,
  menus,
  brandLabel,
  brandHref,
  loginLabel,
  registerLabel,
  openMenuLabel,
  userMenuProps,
}: MainLayoutProps) => (
  <div className="w-full md:w-5/6">
    <Header
      brandHref={brandHref}
      brandLabel={brandLabel}
      menuItems={menuItems}
      menus={menus}
      navigate={navigate}
      registerLabel={registerLabel}
      actions={headerActions}
      loginLabel={loginLabel}
      openMenuLabel={openMenuLabel}
      userMenuProps={userMenuProps}
    />
    <div>{children}</div>
  </div>
);
