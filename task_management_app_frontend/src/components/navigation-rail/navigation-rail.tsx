import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { Icon } from "../../components/icon/icon";
import { Ripple } from "../../components/ripple/ripple";
import { ThemeToggleButton } from "../../components/button/button";
import { Link, useLocation } from "react-router";

// Define the styles for the nav link using cva
const navLinkVariants = cva(
  "rounded-3xl flex flex-col justify-center items-center relative w-[3.5rem] h-8 transition-colors",
  {
    variants: {
      active: {
        true: "bg-secondary-container text-on-secondary-container",
        false: "text-on-surface-variant",
      },
    },
  },
);

const navTextVariants = cva("text-[0.75rem] leading-4", {
  variants: {
    active: {
      true: "text-on-secondary-container font-bold",
      false: "text-on-surface-variant",
    },
  },
});

export interface NavLinkProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof navLinkVariants> {
  name: string;
  href: string;
  icon: string;
  selectedIcon: string;
  isSelected: (path: string) => boolean;
  asChild?: boolean;
}

const NavLink = React.forwardRef<HTMLDivElement, NavLinkProps>(
  (
    {
      name: title,
      href,
      icon,
      selectedIcon,
      active,
      asChild = false,
      ...props
    },
    ref,
  ) => {
    const Component = asChild ? Slot : "div";
    return (
      <Link to={href} className="flex flex-col items-center">
        <Component
          className={cn(navLinkVariants({ active }))}
          ref={ref}
          {...props}
        >
          <Ripple />
          <Icon>
            <span
              className={
                active
                  ? "material-symbols-rounded-selected"
                  : "material-symbols-rounded"
              }
            >
              {active ? selectedIcon : icon}
            </span>
          </Icon>
        </Component>

        <p className={cn(navTextVariants({ active }))}>{title}</p>
      </Link>
    );
  },
);
NavLink.displayName = "NavLink";

// The NavigationRail component
export const NavigationRail = () => {
  const { pathname } = useLocation();

  const routerPathName = pathname;

  const isSelected = (pathName: string): boolean => {
    if (pathName !== "/") {
      return routerPathName.startsWith(pathName);
    }
    return routerPathName === "/" && pathName === "/";
  };

  return (
    <div className="bg-surface text-on-surface fixed top-0 left-0 flex h-screen w-[4.5rem] flex-col justify-between">
      <div></div>
      <div className="mx-auto my-2 flex h-fit w-fit flex-col gap-4">
        <NavLink
          href="/tasks"
          name="Tasks"
          icon="task_alt"
          selectedIcon="task_alt"
          isSelected={isSelected}
          active={isSelected("/tasks")}
        />
        <NavLink
          href="/projects"
          name="Projects"
          icon="explore"
          selectedIcon="explore"
          isSelected={isSelected}
          active={isSelected("/projects")}
        />
        <NavLink
          href="/teams"
          name="Teams"
          icon="groups"
          selectedIcon="groups"
          isSelected={isSelected}
          active={isSelected("/teams")}
        />
      </div>
      <div className="mx-auto my-2 flex h-fit w-fit flex-col gap-4">
        <ThemeToggleButton />
      </div>
    </div>
  );
};

export const BottomNavigation = () => {
  const { pathname } = useLocation();

  const routerPathName = pathname;

  const isSelected = (pathName: string): boolean => {
    if (pathName !== "/") {
      return routerPathName.startsWith(pathName);
    }
    return routerPathName === "/" && pathName === "/";
  };

  return (
    <div className="bg-surface text-on-surface fixed bottom-0 flex w-screen flex-row justify-center">
      <div className="mx-auto my-2 flex h-fit w-fit flex-row gap-4">
        <NavLink
          href="/tasks"
          name="Tasks"
          icon="task_alt"
          selectedIcon="task_alt"
          isSelected={isSelected}
          active={isSelected("/tasks")}
        />
        <NavLink
          href="/projects"
          name="Projects"
          icon="explore"
          selectedIcon="explore"
          isSelected={isSelected}
          active={isSelected("/projects")}
        />
        <NavLink
          href="/teams"
          name="Teams"
          icon="deployed_code"
          selectedIcon="deployed_code"
          isSelected={isSelected}
          active={isSelected("/teams")}
        />
      </div>
    </div>
  );
};
