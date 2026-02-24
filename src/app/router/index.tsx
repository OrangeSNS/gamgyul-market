import { createBrowserRouter, Navigate } from 'react-router-dom'
import AppLayout from '@app/layouts/AppLayout'
import ProtectedRoute from '@app/layouts/ProtectedRoute'

// Pages
import SplashPage from '@pages/SplashPage'
import NotFoundPage from '@pages/NotFoundPage'

// Login feature
import LoginMainPage from '@features/login/pages/LoginMainPage'
import EmailLoginPage from '@features/login/pages/EmailLoginPage'

// Join feature
import JoinEmailPage from '@features/join/pages/JoinEmailPage'
import JoinProfilePage from '@features/join/pages/JoinProfilePage'

// Home feature
import HomeFeedPage from '@features/home/pages/HomeFeedPage'

// Profile feature
import ProfilePage from '@features/profile/pages/ProfilePage'
import FollowersPage from '@features/profile/pages/FollowersPage'
import FollowingPage from '@features/profile/pages/FollowingPage'
import ProfileEditPage from '@features/profile/pages/ProfileEditPage'

// Product feature
import ProductNewPage from '@features/product/pages/ProductNewPage'
import ProductEditPage from '@features/product/pages/ProductEditPage'

// Post/Upload feature
import PostNewPage from '@features/upload/pages/PostNewPage'
import PostDetailPage from '@features/post/pages/PostDetailPage'
import CommentsPage from '@features/post/pages/CommentsPage'

// Search & Chat (markup)
import SearchPage from '@features/search/pages/SearchPage'
import ChatListPage from '@features/chat/pages/ChatListPage'
import ChatRoomPage from '@features/chat/pages/ChatRoomPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/splash" replace />,
  },
  {
    path: '/splash',
    element: <SplashPage />,
  },
  // ─── Auth ──────────────────────────────────────────
  {
    path: '/login',
    element: (
      <div className="mobile-container">
        <LoginMainPage />
      </div>
    ),
  },
  {
    path: '/login/email',
    element: (
      <div className="mobile-container">
        <EmailLoginPage />
      </div>
    ),
  },
  {
    path: '/join',
    element: (
      <div className="mobile-container">
        <JoinEmailPage />
      </div>
    ),
  },
  {
    path: '/join/profile',
    element: (
      <div className="mobile-container">
        <JoinProfilePage />
      </div>
    ),
  },
  // ─── Protected ────────────────────────────────────
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: '/home',
            element: <HomeFeedPage />,
          },
          {
            path: '/search',
            element: <SearchPage />,
          },
          {
            path: '/chat',
            element: <ChatListPage />,
          },
          {
            path: '/chat/:chatId',
            element: <ChatRoomPage />,
          },
          {
            path: '/profile/edit',
            element: <ProfileEditPage />,
          },
          {
            path: '/profile/:accountName',
            element: <ProfilePage />,
          },
          {
            path: '/profile/:accountName/followers',
            element: <FollowersPage />,
          },
          {
            path: '/profile/:accountName/following',
            element: <FollowingPage />,
          },
          {
            path: '/product/new',
            element: <ProductNewPage />,
          },
          {
            path: '/product/:productId/edit',
            element: <ProductEditPage />,
          },
          {
            path: '/post/new',
            element: <PostNewPage />,
          },
          {
            path: '/post/:postId',
            element: <PostDetailPage />,
          },
          {
            path: '/post/:postId/comments',
            element: <CommentsPage />,
          },
        ],
      },
    ],
  },
  // ─── 404 ──────────────────────────────────────────
  {
    path: '/404',
    element: <NotFoundPage />,
  },
  {
    path: '*',
    element: <Navigate to="/404" replace />,
  },
])
