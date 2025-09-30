import {
  createBrowserRouter,
} from "react-router";
import Root from "../Layout/Root";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import DashboardLayout from "../layout/DashboardLayout";
import ManageUser from "../pages/ManageUser/ManageUser";
import ContentManagement from "../pages/ContentManagement/ContentManagement";
import AllRequest from "../pages/AllRequest/AllRequest";
import MyRequest from "../pages/MyRequest/MyRequest";
import CreateRequest from "../pages/CreateRequest/CreateRequest";
import ProfilePage from "../pages/ProfilePage/ProfilePage";
import Dashboard from "../pages/Dashboard/Dashboard";
import UpdateRequest from "../pages/UpdateRequest/UpdateRequest";
import AddScholarship from "../pages/AddScholarship/AddScholarship";
import ManageScholarships from "../pages/ManageScholarships/ManageScholarships";
import AllScholarships from "../pages/AllScholarship/AllScholarship";
import ScholarshipDetails from "../pages/ScholarshipDetails/ScholarshipDetails";
import Payment from "../pages/ApplyScholarship/ApplyScholarship";
import ApplyScholarship from "../pages/ApplyScholarship/ApplyScholarship";
import PaymentSuccess from "../pages/PaymentSuccess/PaymentSuccess";
import MyAppliedScholarships from "../pages/MyAppliedScholarships/MyAppliedScholarships";
import MyReviews from "../pages/MyReviews/MyReviews";

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
        element: <DashboardLayout />,
        children: [
          {
            index: true, // This sets the default dashboard page
            Component: Dashboard
          },
          {
            path: 'profile',
            Component: ProfilePage
          },
          {
            path: 'scholarships',
            Component: ManageScholarships
          },
          {
            path: 'content-management',
            Component: ContentManagement
          },
          {
            path: 'my-donation-requests',
            Component: MyRequest
          },
          {
            path: 'add-scholarship',
            Component: AddScholarship
          },
          {
            path: 'update-donation-request/:id',
            Component: UpdateRequest
          },

          {
            path: 'all-users',
            Component: ManageUser
          },
          {
            path: "my-applied-scholarships",
            Component: MyAppliedScholarships
          },
          {
            path: "my-reviews",
            Component: MyReviews,
          }
        ]
      },
      {
        path: '/allScolarships',
        Component: AllScholarships
      },
      {
        path: '/scholarship/:id',
        Component: ScholarshipDetails
      },
      {
        path: "/apply-scholarship/:id",
        Component: ApplyScholarship,
      },
      {
        path: "/payment-success",
        Component: PaymentSuccess
      },


    ]
  },
  {
    path: '/login',
    Component: Login
  },
  {
    path: '/signup',
    Component: Register
  },

]);