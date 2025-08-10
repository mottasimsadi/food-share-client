import { Outlet, useNavigation } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loading from "../pages/Loading";

const RootLayout = () => {
  const { state } = useNavigation();
  return (
    <div>
      <Navbar></Navbar>
      <main className="overflow-x-clip">
        {state == "loading" ? <Loading></Loading> : <Outlet></Outlet>}
      </main>
      <Footer></Footer>
    </div>
  );
};

export default RootLayout;
