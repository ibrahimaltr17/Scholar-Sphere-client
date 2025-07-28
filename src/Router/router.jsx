import {
  createBrowserRouter,
} from "react-router";
import Root from "../Layout/Root";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Dashboard from "../pages/Dashboard/Dashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      {
        index: true,
        Component: Home
      },
      {
        path: '/dashboard',
        Component: Dashboard
      }
    ]
  },
  {
    path: '/login',
    Component: Login
  },
  {
    path: '/signup',
    Component: Register
  }
]);