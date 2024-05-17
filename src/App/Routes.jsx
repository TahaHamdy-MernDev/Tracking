import { useRoutes } from "react-router-dom";
import Login from "../Pages/Login";
import AddEmployee from "../Pages/AddEmployee";
import Profile from "../Pages/Profile";
import AbsentReason from "../Pages/AbsentReason";
import { Table } from "../Pages/Table";
import { Location } from "../Pages/Location";
import EditEmployee from "../Pages/EditEmployee";



const ProjectRoutes = () => {
  const element = useRoutes([
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/add-employee",
      element: <AddEmployee />,
    },
    {
      path: "/profile",
      element: <Profile />,
    },
    {
      path: "/absent-reason",
      element: <AbsentReason />,
    },
    {
      path: "/dashboard",
      element: <Table />,
    },
    {
      path: "/location",
      element: <Location />,
    },
    {
      path: "/edit-employee/:id",
      element: <EditEmployee />,
    },
  ]);
  return element;
};

export default ProjectRoutes;
