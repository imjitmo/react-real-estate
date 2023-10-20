import { useEffect, useState } from 'react';
import { FaBath, FaBed, FaChair, FaMapMarkerAlt, FaParking, FaShare } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

export default function Listing() {
  const { currentUser } = useSelector((state) => state.user);
  SwiperCore.use([Navigation]);
  const params = useParams();
  const [listing, setListing] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  const handlePurchase = async (e) => {
    const productId = e.target.value;
    try {
      const res = await fetch(`/api/purchase/create/${productId}`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.state === false) {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: data.message,
          allowOutsideClick: false,
          showConfirmButton: true,
          confirmButtonText: 'Try Again!',
          confirmButtonColor: '#d9534f',
        });
        return;
      }
      Swal.fire({
        icon: 'success',
        title: 'Transaction Successful!',
        text: data.message,
        allowOutsideClick: false,
        showConfirmButton: true,
        confirmButtonColor: '#f8981e',
      }).then(function () {
        window.location = '/my-orders';
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleWish = async (e) => {
    const id = e.target.value;
    try {
      const res = await fetch(`/api/wishlist/wish/${id}`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      } else if (data.state === false) {
        Swal.fire({
          icon: 'error',
          title: 'Wishlist Adding Failed!',
          text: data.message,
          allowOutsideClick: false,
          showConfirmButton: true,
          confirmButtonText: 'Try Again!',
          confirmButtonColor: '#d9534f',
        });
      } else {
        Swal.fire({
          icon: 'success',
          title: 'Wishlist Added!',
          text: '',
          allowOutsideClick: false,
          showConfirmButton: true,
          confirmButtonColor: '#f8981e',
        }).then(function () {
          window.location = '/wishlist';
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main>
      {loading && (
        <div className="flex justify-center items-center">
          <img
            className="w-96 h-96 my-7 object-contain"
            src="https://firebasestorage.googleapis.com/v0/b/jp-estate.appspot.com/o/contents%2Floading.gif?alt=media&token=7af3641c-7738-4fca-a314-6346f5fc0163&_gl=1*10xzelj*_ga*MTM1Nzk3ODk0NC4xNjk3MjQ3ODM3*_ga_CW55HF8NVT*MTY5NzM2MDY5Ny4xMC4xLjE2OTczNjA3MjAuMzcuMC4w"
            alt="loading-image"
          />
        </div>
      )}
      {error && <h1 className="text-center my-7 text-4xl font-bold">Something went wrong...</h1>}
      {listing && !loading && !error && (
        <div>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[550px]"
                  style={{ background: `url(${url}) center no-repeat`, backgroundSize: `cover` }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
            <FaShare className="text-slate-500" />
          </div>

          <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
            <p className="text-2xl font-semibold">
              {listing.name} - &#8369;{' '}
              {listing.offer
                ? listing.discountPrice.toLocaleString('en-US')
                : listing.regularPrice.toLocaleString('en-US')}
              {listing.type === 'rent' && ' / month'}
            </p>
            <p className="text-sm font-semibold">
              Posted by:{' '}
              <Link className="text-blue-500 hover:underline" to={`/view-user/${listing.userRef}`}>
                User#{listing.userRef.slice(0, 8)}
              </Link>
            </p>
            <p className="flex items-center mt-6 gap-2 text-slate-600  text-sm">
              <FaMapMarkerAlt className="text-green-700" />
              {listing.address}
            </p>
            <div className="flex gap-4">
              <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
              </p>
              {listing.offer && (
                <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                  &#8369;{+listing.regularPrice - +listing.discountPrice} OFF
                </p>
              )}
            </div>
            <p className="text-slate-800">
              <span className="font-semibold text-black">Description - </span>
              {listing.description}
            </p>
            <ul className="text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6">
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaBed className="text-lg" />
                {listing.bedrooms > 1 ? `${listing.bedrooms} beds ` : `${listing.bedrooms} bed `}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaBath className="text-lg" />
                {listing.bathrooms > 1 ? `${listing.bathrooms} baths ` : `${listing.bathrooms} bath `}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaParking className="text-lg" />
                {listing.parking ? 'Parking spot' : 'No Parking'}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaChair className="text-lg" />
                {listing.furnished ? 'Furnished' : 'Unfurnished'}
              </li>
            </ul>
            {currentUser && currentUser._id !== listing.userRef ? (
              <div className="flex gap-4">
                <button
                  className="bg-blue-400 w-24 text-white rounded-lg uppercase hover:opacity-95 p-3 hover:bg-slate-700 disabled:opacity-50"
                  value={listing._id}
                  disabled={listing.isAvailable === false || currentUser.isAdmin}
                  onClick={(e) => handleWish(e)}
                >
                  Wishlist
                </button>
                {listing.isAvailable ? (
                  currentUser.isAdmin ? (
                    <button
                      className="bg-gray-400 w-full text-white rounded-lg uppercase hover:opacity-95 p-3 hover:bg-gray-700"
                      disabled={currentUser.isAdmin}
                    >
                      Sorry Admin! You cannot purchase!
                    </button>
                  ) : (
                    <button
                      className="bg-orange-400 w-full text-white rounded-lg uppercase hover:opacity-95 p-3 hover:bg-slate-700"
                      value={listing._id}
                      onClick={handlePurchase}
                    >
                      {listing.type === 'rent' ? 'Rent' : 'Purchase'}
                    </button>
                  )
                ) : (
                  <button
                    className="bg-gray-400 w-full text-white rounded-lg uppercase hover:opacity-95 p-3 disabled:opacity-60"
                    disabled={true}
                  >
                    Unavailable
                  </button>
                )}
              </div>
            ) : currentUser ? (
              <Link to={`/update-listing/${listing._id}`}>
                <button className="bg-green-700 w-full text-white rounded-lg uppercase hover:opacity-95 p-3 hover:bg-slate-700">
                  Update Listing?
                </button>
              </Link>
            ) : (
              ''
            )}
          </div>
        </div>
      )}
    </main>
  );
}
