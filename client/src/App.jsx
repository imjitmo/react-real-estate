import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './assets/css/App.css';

// Page Imports
import AdminRoute from './components/AdminRoute';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import Verifier from './components/Verifier';
import About from './pages/About';
import Contact from './pages/Contact';
import CreateListing from './pages/CreateListing';
import Dashboard from './pages/Dashboard';
import Error from './pages/Error';
import Home from './pages/Home';
import Listing from './pages/Listing';
import MyOrders from './pages/MyOrders';
import Profile from './pages/Profile';
import Search from './pages/Search';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import UpdateListing from './pages/UpdateListing';
import UserOrder from './pages/UserOrder';
import UserProfile from './pages/UserProfile';
import Wish from './pages/Wishlist';

export default function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/listing/:listingId" element={<Listing />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />}></Route>
        <Route path="/search" element={<Search />} />
        <Route path="/verify/:token" element={<Verifier />} />
        <Route element={<PublicRoute />}>
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/update-listing/:listingId" element={<UpdateListing />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/user-orders" element={<UserOrder />} />
          <Route path="/view-user/:userId" element={<UserProfile />} />
          <Route path="/wishlist" element={<Wish />} />
        </Route>
        <Route element={<AdminRoute />}>
          <Route path="/dashboard" element={<Dashboard />}></Route>
        </Route>
        <Route path="*" element={<Error />} />
      </Routes>
    </Router>
  );
}
