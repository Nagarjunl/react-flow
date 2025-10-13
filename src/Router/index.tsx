import { Suspense, lazy } from 'react';
import { Navigate, type RouteObject } from 'react-router-dom';
import LazyLoading from '../Component/Loading/LazyLoading';
import RouteAuth from '../Auth/RouteAuth';
import SidebarLayout from '../Layout/AppLayout';
import BaseLayout from '../Layout/BaseLayout';

const Loader = (Component:any) => (props:any) =>
  (
    <Suspense fallback={<LazyLoading/>}>
      <Component {...props} />
    </Suspense>
  );

const Login = Loader(lazy(() => import('../Screens/auth')));
const Dashboard = Loader(lazy(() => import('../Screens/dashboard')));
const Status404 = Loader(
  lazy(() => import('../Component/Status/Status404'))
);
const Status500 = Loader(
  lazy(() => import('../Component/Status/Status500'))
);const Status401 = Loader(
  lazy(() => import('../Component/Status/Status401'))
);
const StatusComingSoon = Loader(
  lazy(() => import('../Component/Status/ComingSoon'))
);
const StatusMaintenance = Loader(
  lazy(() => import('../Component/Status/Maintenance'))
);
const routes: RouteObject[] = [
  {
    path: "",
    element: <BaseLayout />,
    children: [
      {
        path: "/",
        element: <Login />,
      },
      {
        path: "login",
        element: <Navigate to="/" replace />,
      },
    
      {
        path: "status",
        children: [
          {
            path: "",
            element: <Navigate to="404" replace />,
          },
          {
            path: "404",
            element: <Status404 />,
          },
          {
            path: "500",
            element: <Status500 />,
          },
          {
            path: "maintenance",
            element: <StatusMaintenance />,
          },
          {
            path: "coming-soon",
            element: <StatusComingSoon />,
          },
        ],
      },
      {
        path: "*",
        element: <Status404 />,
      },
      {
        path: "401",
        element: <Status401 />,
      },
    ],
  },
  {
    element: <RouteAuth/>,
    children: [
      {
        path: "dashboards",
        element: <SidebarLayout />,
        children: [
          {
            path: "",
            element: <Navigate to="Dashboard" replace />,
          },
         
          {
            path: "Dashboard",
            element: <Dashboard/>,
          },
        
         
        ],
      },
    
     
    ],
  },
];

export default routes;
