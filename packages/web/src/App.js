import { useDispatch } from 'react-redux';
import {
  Route, Routes,
} from 'react-router-dom';
import { useQuery } from 'react-query';
import Header from './components/Header';
import Footer from './components/Footer';
import AuthGuard from './components/AuthGuard';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Account from './pages/Account';
import Course from './pages/Course';
import CreateCourse from './pages/CreateCourse';
import AddCourseLesson from './pages/AddCourseLesson';
import MyCourses from './pages/MyCourses';
import { setUserId } from './store/authSlice';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';
import './App.scss';
import { checkAuth } from './utils/usersApi';

function App() {
  const dispatch = useDispatch();

  useQuery('userId', checkAuth, {
    refetchInterval: 60000,
    onSuccess: (data) => {
      console.log(data.user);
      dispatch(setUserId({ userId: data.user.user_id, role: data.user.role }));
    },
    onSettled: (_, error) => {
      if (error?.response?.status === 401) {
        dispatch(setUserId(null));
      }
    },
  });

  return (
    <>
      <Header />
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/" element={<Footer />}>
          <Route path="/" element={<Home />} />
          <Route element={<AuthGuard />}>
            <Route path="/account" element={<Account />} />
            <Route path="/courses">
              <Route path=":id" element={<Course />} />
              <Route path="add" element={<CreateCourse />} />
              <Route path=":id/add" element={<AddCourseLesson />} />
              <Route path="my" element={<MyCourses />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
