import { useContext, useState } from "react";
import { CgMenuMotion } from "react-icons/cg";
import { RiMenuAddLine } from "react-icons/ri";
import { Link, NavLink } from "react-router";
import { AuthContext } from "../providers/AuthProvider";

const Header = () => {
  const { user, logOut } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPageLoad, setisPageLoad] = useState(false);
  const menu = [
    {
      name: "Home",
      path: "/",
    },

    {
      name: "Available Food",
      path: "/",
    },
  ];
  return (
    <nav className="overflow-x-clip">
      {user && (
        <p className="text-center text-white bg-black py-2 bg-opacity-90">
          Welcome {user?.displayName} ❤️‍🔥❤️‍🔥. Now You Can Watch All the Foods 🍉🍉
        </p>
      )}
      <div className="text-center bg-slate-400"></div>
      <div className="w-11/12 mx-auto py-5 flex justify-between items-center relative">
        <Link
          to="/"
          className="btn btn-ghost text-xl font-bold gradient-primary text-transparent bg-clip-text"
        >
          <span className="text-xl font-bold text-orange-400">🍽️ FoodShare</span>
        </Link>

        {/* menu-lg start */}
        <ul className="hidden lg:flex items-center gap-5 ">
          {menu.map((item) => (
            <NavLink key={item.name} to={item.path}>
              {item.name}
            </NavLink>
          ))}
          {user && user?.email ? (
            <>
              <button className="cursor-pointer" onClick={logOut}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/registration">Register</NavLink>
            </>
          )}
        </ul>

        <div className="lg:hidden ">
          {!isMenuOpen ? (
            <RiMenuAddLine
              onClick={() => {
                setIsMenuOpen(true);
                setisPageLoad(true);
              }}
              className="text-2xl cursor-pointer"
            ></RiMenuAddLine>
          ) : (
            <CgMenuMotion
              onClick={() => setIsMenuOpen(false)}
              className="text-2xl cursor-pointer"
            ></CgMenuMotion>
          )}

          {
            <ul
              className={`flex animate__animated bg-white flex-col lg:hidden gap-5 absolute z-50 bg-opacity-70 w-full top-14  left-0 ${
                isMenuOpen
                  ? "animate__fadeInRight "
                  : isPageLoad
                  ? "animate__fadeOutRight flex "
                  : "hidden"
              } `}
            >
              {menu.map((item) => (
                <NavLink
                  className="border-b-2 hover:border-orange-500 transition duration-200
                   "
                  key={item.name}
                  to={item.path}
                >
                  {item.name}
                </NavLink>
              ))}
              {user && user?.email ? (
                <>
                  <button className="cursor-pointer" onClick={logOut}>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink to="/login">Login</NavLink>
                  <NavLink to="/registration">Register</NavLink>
                </>
              )}
            </ul>
          }
        </div>
      </div>
    </nav>
  );
};

export default Header;
