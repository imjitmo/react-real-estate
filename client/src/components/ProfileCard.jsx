import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutFailure,
  signOutStart,
  signOutSuccess,
} from '../app/user/userSlice';

export default function ProfileCard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser, error } = useSelector((state) => state.user);
  const [updateSuccess, setUpdateSuccess] = useState();
  const [listingError, setListingError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [listState, setListState] = useState(false);

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'PUT',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
      setUpdateSuccess(true);
      navigate('/sign-in');
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

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
    } catch (error) {
      dispatch(signOutFailure(error.message));
    }
  };
  const handleShowListings = async () => {
    setListState(true);
    try {
      setListingError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setListingError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setListingError(true);
    }
  };

  const handleListingArchive = async (listId) => {
    try {
      const res = await fetch(`/api/listing/archive/${listId}`, {
        method: 'PUT',
      });
      const data = res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setUserListings((prev) => prev.filter((listing) => listing._id !== listId));
      Swal.fire({
        icon: 'success',
        title: 'Archived Successful!',
        text: data.message,
        allowOutsideClick: false,
        showConfirmButton: true,
        confirmButtonColor: '#f8981e',
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-4 my-5">
        <img
          src={currentUser.avatar}
          alt="profile"
          className="rounded-full h-32 w-32 object-cover cursor-pointer self-center my-3"
        />
        <p>
          {currentUser.displayName
            ? `${currentUser.displayName}`
            : `${currentUser.firstName} ${currentUser.lastName}`}
        </p>
        <p>
          <span className="font-semibold">Contact Number: </span>
          {currentUser.contactNumber}
        </p>
        <p>
          <span className="font-semibold">Email: </span> {currentUser.email}
        </p>
        <p>
          <span className="font-semibold">Username: </span> {currentUser.username}
        </p>
      </div>
      <div className="flex flex-col">
        <Link
          to={'/create-listing'}
          type="submit"
          className="bg-slate-700 text-white rounded-lg p-3 uppercase text-center hover:bg-green-700 disabled:opacity-70"
        >
          create listing
        </Link>
      </div>
      <div className="flex justify-between mt-5">
        <span onClick={handleDeleteUser} className="text-red-500 cursor-pointer font-medium hover:opacity-90">
          Deactivate Account
        </span>
        <span onClick={handleSignOut} className="text-red-500 cursor-pointer font-medium hover:opacity-90">
          Sign Out
        </span>
      </div>
      <p className="text-red-700 mt-5">{error ? error : ''}</p>
      <p className="text-green-500 mt-5">{updateSuccess ? 'Your profile is successfully updated!' : ''}</p>
      {listState ? (
        <button className="text-red-500 w-full" onClick={() => setListState(false)}>
          Hide Listings
        </button>
      ) : (
        <button className="text-green-500 w-full" onClick={handleShowListings}>
          Show Listings
        </button>
      )}

      <p className="text-red-500 mt-5 text-center">
        {listingError ? 'Error showing listings or no listing is found' : ''}
      </p>
      {listState && userListings && userListings.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-center text-2sxl font-semibold">Your Listings</h1>
          {userListings.map((lists) => (
            <div key={lists._id} className="border rounded-lg p-3 flex justity-between items-center gap-4">
              <Link to={`/listing/${lists._id}`}>
                <img
                  src={lists.imageUrls[0]}
                  className="h-16 w-16 object-contain round-lg"
                  alt="listing-image"
                />
              </Link>
              <Link
                className="text-slate-700 font-semibold flex-1 hover:underline truncate"
                to={`/listing/${lists._id}`}
              >
                <p>{lists.name}</p>
              </Link>
              <div className="flex flex-col items-center">
                <button className="text-red-700 uppercase" onClick={() => handleListingArchive(lists._id)}>
                  archive
                </button>
                <Link to={`/update-listing/${lists._id}`} className="text-green-500 uppercase">
                  edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
