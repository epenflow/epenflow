import { Link } from "@tanstack/react-router";
import type React from "react";
import For from "~/components/utility/for";
import resources from "./navbar-resources";

type NavbarListProps = {
  onToggle: (event: React.MouseEvent<HTMLElement>) => void;
};
const NavbarList: React.FC<NavbarListProps> = ({ onToggle }) => {
  return (
    <div
      data-lenis-prevent
      className="header__list-wrap header__content-scrollbar">
      <For
        each={resources.NAVBAR_LISTS}
        children={(list, key) => (
          <div
            aria-label={list.label}
            key={`${list.label}-${key}`}
            className="header__list">
            <Link to={list.to} onClick={onToggle}>
              <h1 className="header__list-item header__h1 line-clamp-1">
                {list.label}
              </h1>
            </Link>
            <div className="header__content-separator" />
          </div>
        )}
      />
    </div>
  );
};

export default NavbarList;
