import For from "~/components/utility/for";
import resources from "./navbar-resources";

const NavbarList = () => {
  return (
    <div className="header__list-wrap header__content-scrollbar">
      <For
        each={resources.NAVBAR_LISTS}
        children={(list, key) => (
          <div
            aria-label={list.label}
            key={`${list.label}-${key}`}
            className="header__list">
            <h1 className="header__list-item header__h1 line-clamp-1">
              {list.label}
            </h1>
            <div className="header__content-separator" />
          </div>
        )}
      />
    </div>
  );
};

export default NavbarList;
