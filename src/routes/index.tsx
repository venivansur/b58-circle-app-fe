import { createBrowserRouter } from 'react-router-dom';
import { DetailPostRoute } from './detail-post';
import { DetailPostImageRoute } from './detail-post-image';
import { FollowsRoute } from './follows';
import { ForgotPasswordRoute } from './forgot-password';
import { HomeRoute } from './home';
import { LoginRoute } from './login';
import { ProfileRoute } from './profile';
import { ProfilePageRoute } from './profile-page';
import {ProtectedRoute} from './protect-route';
import { RegisterRoute } from './register';
import { ResetPasswordRoute } from './reset-password';
import { SearchRoute } from './search';

export const router = createBrowserRouter([
  {
    element: <ProtectedRoute/>,
    children: [
      {
        path: '/',
        element: <HomeRoute />,
      },
      {
        path: '/search',
        element: <SearchRoute />,
      },
      {
        path: '/profile',
        element: <ProfileRoute />,
      },
      {
        path: "/profile-page/:userId",
        element: <ProfilePageRoute />,
      },
      {
        path: '/follows',
        element: <FollowsRoute />,
      },
      {
        path: '/post/:id',
        element: <DetailPostRoute />,
      },
      {
        path: '/post-image/:id',
        element: <DetailPostImageRoute />,
      },
    ],
  },
  {
    path: '/login',
    element: <LoginRoute />,
  },
  {
    path: '/register',
    element: <RegisterRoute />,
  },
  {
    path: '/reset-password',
    element: <ResetPasswordRoute />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordRoute />,
  },
]);
