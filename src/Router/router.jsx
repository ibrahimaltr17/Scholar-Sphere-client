import { createBrowserRouter } from "react-router";
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
import ApplyScholarship from "../pages/ApplyScholarship/ApplyScholarship";
import PaymentSuccess from "../pages/PaymentSuccess/PaymentSuccess";
import MyAppliedScholarships from "../pages/MyAppliedScholarships/MyAppliedScholarships";
import MyReviews from "../pages/MyReviews/MyReviews";
import AllReviews from "../pages/AllReviews/AllReviews";
import AllAppliedScholarships from "../pages/AllAppliedScholarships/AllAppliedScholarships";
import PrivateRoute from "../Provider/PrivateRoute";
import Error from "../pages/Error/Error";
import About from "../pages/About/About";
import Contact from "../pages/Contact/Contact";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Error></Error>,
    children: [
      { index: true, element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Register /> },
      { path: "/all-Scholarships", element: <AllScholarships /> },
      {
        path: "/scholarship/:id", element: <PrivateRoute>
          <ScholarshipDetails />
        </PrivateRoute>
      },
      { path: "/apply-scholarship/:id", element: <ApplyScholarship /> },
      { path: "/payment-success", element: <PaymentSuccess /> },

      // Private dashboard routes
      {
        path: "/dashboard",
        element: (
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        ),
        children: [
          { index: true, element: <Dashboard /> },
          { path: "profile", element: <ProfilePage /> },
          { path: "scholarships", element: <ManageScholarships /> },
          { path: "content-management", element: <ContentManagement /> },
          { path: "my-donation-requests", element: <MyRequest /> },
          { path: "add-scholarship", element: <AddScholarship /> },
          { path: "update-donation-request/:id", element: <UpdateRequest /> },
          { path: "all-users", element: <ManageUser /> },
          { path: "my-applied-scholarships", element: <MyAppliedScholarships /> },
          { path: "all-applied-scholarships", element: <AllAppliedScholarships /> },
          { path: "my-reviews", element: <MyReviews /> },
          { path: "all-reviews", element: <AllReviews /> },
        ],
      },
      {
        path: "about",
        Component: About
      },
      {
        path: "contact",
        Component: Contact
      }
    ],
  },
]);
