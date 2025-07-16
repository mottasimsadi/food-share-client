import { Outlet, useNavigation } from "react-router";
import Navbar from "../components/Navbar";

const RootLayout = () => {
  const { state } = useNavigation();
  return (
    <div>
      <Navbar></Navbar>
      <main className="overflow-x-clip">
        {state == "loading" ? <Loading></Loading> : <Outlet></Outlet>}
      </main>
    </div>
  );
};

export default RootLayout;
