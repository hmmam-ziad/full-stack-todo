// import { NavLink } from "react-router-dom";


import { NavLink, useLocation } from "react-router-dom";
import Button from "./ui/Button";


const NavBar = () => {
    const {pathname} = useLocation();
  
    const storgekey = "loggedInUser";
    const userDataString = localStorage.getItem(storgekey);
    const userData = userDataString ? JSON.parse(userDataString) : null;
    
    const onLogout = () => {
        localStorage.removeItem(storgekey);
        setTimeout(() => {
            location.replace(pathname);
        }, 1500);
    };  
      

    return(
        <nav className="max-w-lg mx-auto mt-7 mb-20 px-3 py-5 rounded-md">
      <ul className="flex items-center justify-between">
        <li className="text-black duration-200 font-semibold text-lg cursor-pointer">
          <NavLink to="/">Home</NavLink>
        </li>
        {
          userData ? (
            <div className="flex items-center text-indigo-600 space-x-2">
              <li className="duration-200 text-lg cursor-pointer">
                <NavLink to="/profile">Profile</NavLink>
              </li>
              <li className="duration-200 text-lg cursor-pointer">
                <NavLink to="/todos">Todos</NavLink>
              </li>
              <Button className="cursor-pointer" size={"sm"} onClick={onLogout}>
                Logout
              </Button>
            </div>
          ) : (
            <p className="flex items-center space-x-3">
            <li className="text-black duration-200 font-semibold text-lg cursor-pointer">
              <NavLink to="/register">Register</NavLink>
            </li>
            <li className="text-black duration-200 font-semibold text-lg cursor-pointer">
              <NavLink to="/login">Login</NavLink>
            </li>
          </p>
          )
        }
          
      </ul>
    </nav>
    );
}

export default NavBar