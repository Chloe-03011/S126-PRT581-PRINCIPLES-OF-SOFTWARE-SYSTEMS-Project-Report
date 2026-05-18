import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import MainLayout from './Layouts/MainLayout';
import Home from './Components/Home/Home';
import Explore from './Pages/Explore';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Dashboard from './Pages/Dashboard';
import ProtectedRoute from './Components/Shared/ProtectedRoute';
import CampaignDetails from './Pages/CampaignDetails';
import PaymentSuccess from './Pages/PaymentSuccess';
import { AuthProvider } from './Contexts/AuthContext';
import { NotificationProvider } from './Contexts/NotificationContext';

import CreateCampaign from './Pages/CreateCampaign';
import EditCampaign from './Pages/EditCampaign';
import HowItWorks from './Pages/HowItWorks';
import SuccessStories from './Pages/SuccessStories';
import CreatorProfile from './Pages/CreatorProfile';

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children:[
      {
        path:"/",
        element:<Home />
      },
      {
        path:"/explore",
        element:<Explore />
      },
      {
        path:"/how-it-works",
        element:<HowItWorks />
      },
      {
        path:"/stories",
        element:<SuccessStories />
      },
      {
        path: "/creator/:id",
        element: <CreatorProfile />
      },
      {
        path: "/create-campaign",
        element: (
          <ProtectedRoute roles={['creator', 'admin']}>
            <CreateCampaign />
          </ProtectedRoute>
        )
      },
      {
        path: "/edit-campaign/:id",
        element: (
          <ProtectedRoute roles={['creator', 'admin']}>
            <EditCampaign />
          </ProtectedRoute>
        )
      },
      {
        path: "/campaign/:id",
        element: <CampaignDetails />
      },
      {
        path: "/payment/success/:tranId",
        element: <PaymentSuccess />
      },
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/register",
        element: <Register />
      },
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        )
      }
    ]
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <NotificationProvider>
        <RouterProvider router={router} />
      </NotificationProvider>
    </AuthProvider>
  </StrictMode>,
)
