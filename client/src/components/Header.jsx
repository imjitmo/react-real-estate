import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Fragment, useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { signOutFailure, signOutStart, signOutSuccess } from '../app/user/userSlice';

export default function Header() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const handleSignOut = async () => {
    try {
      dispatch(signOutStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutFailure(data.message));
        return;
      }
      dispatch(signOutSuccess(data));
      navigate('/sign-in');
    } catch (error) {
      dispatch(signOutFailure(error.message));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const urlSearchTerm = urlParams.get('searchTerm');
    if (urlSearchTerm) {
      setSearchTerm(urlSearchTerm);
    }
  }, [location.search]);

  return (
    <Disclosure as="nav" className="bg-slate-100 py-3 uppercase">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center hidden lg:block">
                  <Link to="/">
                    <img
                      className="h-10 w-auto"
                      src="https://firebasestorage.googleapis.com/v0/b/jp-estate.appspot.com/o/contents%2Flogo_header.png?alt=media&token=24bd2f23-c6c6-4e97-baad-8e5e78d80445&_gl=1*1g6wz8v*_ga*MTM1Nzk3ODk0NC4xNjk3MjQ3ODM3*_ga_CW55HF8NVT*MTY5NzU1MDUzOS4yMy4xLjE2OTc1NTA1NjIuMzcuMC4w"
                    />
                  </Link>
                </div>
                <div className="hidden px-7 sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {currentUser && currentUser.isAdmin && (
                      <NavLink to="/dashboard" className="text-slate-700 hover:text-orange-400">
                        Dashboard
                      </NavLink>
                    )}
                    <NavLink to="/" className="text-slate-700 hover:text-orange-400">
                      Home
                    </NavLink>
                    <NavLink to="/search?type=sale" className="text-slate-700 hover:text-orange-400">
                      Listings
                    </NavLink>
                    <NavLink to="/about" className="text-slate-700 hover:text-orange-400">
                      About
                    </NavLink>
                    <NavLink to="/contact" className="text-slate-700 hover:text-orange-400">
                      Contact
                    </NavLink>
                    {currentUser ? (
                      ''
                    ) : (
                      <NavLink to="/sign-in" className="text-slate-700 hover:text-orange-400">
                        Sign in
                      </NavLink>
                    )}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <form onSubmit={handleSubmit} className="bg-white p-3 rounded-lg flex item-scenter">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="bg-transparent focus:outline-none w-38 sm:w-96"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button type="submit">
                    <FaSearch className="text-slate-600" />
                  </button>
                </form>
                {currentUser ? (
                  ''
                ) : (
                  <div className="mx-3">
                    <NavLink to="/sign-up">
                      <button className="text-white bg-orange-400 p-2 rounded-lg uppercase hover:bg-slate-500">
                        Sign up
                      </button>
                    </NavLink>
                  </div>
                )}
                {/* Profile dropdown */}
                {currentUser ? (
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">Open user menu</span>
                        <img className="h-8 w-8 rounded-full" src={currentUser.avatar} alt="" />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          <Link to="/profile">
                            <span className="block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-slate-200">
                              Profile
                            </span>
                          </Link>
                        </Menu.Item>
                        <Menu.Item>
                          <Link to="/my-orders">
                            <span className="block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-slate-200">
                              My Purchases
                            </span>
                          </Link>
                        </Menu.Item>
                        <Menu.Item>
                          <Link to="/user-orders">
                            <span className="block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-slate-200">
                              User Purchases
                            </span>
                          </Link>
                        </Menu.Item>
                        <Menu.Item>
                          <Link to="/wishlist">
                            <span className="block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-slate-200">
                              My Wishlist
                            </span>
                          </Link>
                        </Menu.Item>
                        <Menu.Item>
                          <span
                            className="block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-slate-200"
                            onClick={handleSignOut}
                          >
                            Sign out
                          </span>
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                ) : null}
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              <span className="block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-slate-200">
                <NavLink to="/">Home</NavLink>
              </span>
              <span className="block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-slate-200">
                <NavLink to="/search?type=sale">Listings</NavLink>
              </span>
              <span className="block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-slate-200">
                <NavLink to="/about">About</NavLink>
              </span>
              <span className="block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-slate-200">
                <NavLink to="/contact">Contact</NavLink>
              </span>
              {currentUser ? (
                ''
              ) : (
                <span className="block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-slate-200">
                  <NavLink to="/sign-in">Sign In</NavLink>
                </span>
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
