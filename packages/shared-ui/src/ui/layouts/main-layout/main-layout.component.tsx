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
      actions={headerActions}
      brandHref={brandHref}
      brandLabel={brandLabel}
      loginLabel={loginLabel}
      menuItems={menuItems}
      menus={menus}
      navigate={navigate}
      openMenuLabel={openMenuLabel}
      registerLabel={registerLabel}
      userMenuProps={userMenuProps}
    />
    <div>{children}</div>
  </div>
);
