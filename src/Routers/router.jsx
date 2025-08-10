import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import ErrorPage from "../pages/ErrorPage";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AddFood from "../pages/AddFood";
import PrivateRoute from "./PrivateRoute";
import AvailableFoods from "../pages/AvailableFoods";
import FoodDetails from "../components/FoodDetails";
import axios from "axios";
import ManageMyFoods from "../pages/ManageMyFoods";
import MyFoodRequest from "../pages/MyFoodRequest";
import Profile from "../pages/Profile";
import FavoriteFoods from "../pages/FavoriteFoods";

// Create a reusable axios instance
const axiosInstance = axios.create({
  baseURL: "https://food-share-server-one.vercel.app",
});

// Create a function to pass to TanStack QueryClient
const createQueryClient = (client) => ({
  availableFoodsLoader: async () => {
    const query = {
      queryKey: ["available-foods", "", "expireDate"],
      queryFn: () =>
        axiosInstance
          .get("/available-foods?sort=expireDate")
          .then((res) => res.data),
    };
    return client.ensureQueryData(query);
  },
});

export const createRouter = (queryClient) => {
  const { availableFoodsLoader } = createQueryClient(queryClient);

  return createBrowserRouter([
    {
      path: "/",
      Component: RootLayout,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          Component: Home,
          loader: async () => {
            try {
              // Fetch featured foods for the homepage
              const featuredFoodsRes = await axiosInstance.get(
                "/featured-foods"
              );
              return { featuredFoods: featuredFoodsRes.data };
            } catch (error) {
              console.error("Failed to load homepage data", error);
              return { featuredFoods: [] }; // Return empty array on error
            }
          },
        },
        {
          path: "/login",
          Component: Login,
        },
        {
          path: "/register",
          Component: Register,
        },
        {
          path: "/available-foods",
          Component: AvailableFoods,
          loader: availableFoodsLoader,
        },
        {
          path: "/favorite-foods",
          Component: FavoriteFoods,
        },
        {
          path: "/food/:foodId",
          Component: FoodDetails,
          loader: async ({ params }) => {
            try {
              const { data } = await axiosInstance.get(
                `/food/${params.foodId}`
              );
              return data;
            } catch (error) {
              console.error(
                `Failed to load food details for ${params.foodId}`,
                error
              );
              throw new Response("Not Found", { status: 404 });
            }
          },
        },
        {
          path: "/add-food",
          element: (
            <PrivateRoute>
              <AddFood />
            </PrivateRoute>
          ),
        },
        {
          path: "/manage-foods",
          element: (
            <PrivateRoute>
              <ManageMyFoods />
            </PrivateRoute>
          ),
        },
        {
          path: "/my-requests",
          element: (
            <PrivateRoute>
              <MyFoodRequest />
            </PrivateRoute>
          ),
        },
        {
          path: "/profile",
          element: (
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          ),
        },
      ],
    },
    {
      path: "*",
      Component: ErrorPage,
    },
  ]);
};
