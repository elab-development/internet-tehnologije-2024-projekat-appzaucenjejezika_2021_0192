import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Layout from './layouts/Layout';
import RedirectIfAuth from './components/routing/RedirectIfAuth';
import ProtectedRoute from './components/routing/ProtectedRoute';
import AdminRoute from './components/routing/AdminRoute';
import Home from './pages/Home';
import Courses from './pages/Courses';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/protected/Dashboard';
import CourseDetails from './pages/protected/CourseDetails';
import LessonView from './pages/protected/LessonView';
import Profile from './pages/protected/Profile';
import AdminDashboard from './pages/admin/AdminDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/courses' element={<Courses />} />

          <Route element={<RedirectIfAuth />}>
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/courses/:courseId' element={<CourseDetails />} />
            <Route path='/lessons/:lessonId' element={<LessonView />} />
            <Route path='/profile' element={<Profile />} />
          </Route>

          <Route element={<AdminRoute />}>
            <Route path='/admin' element={<AdminDashboard />} />
          </Route>
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
