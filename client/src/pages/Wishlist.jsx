import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function Wishlist() {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/wishlist/wish/view');
        const data = await res.json();
        setListings(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);
  const recordsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = listings.slice(firstIndex, lastIndex);
  const npage = Math.ceil(listings.length / recordsPerPage);
  const numbers = [...Array(npage + 1).keys()].slice(1);

  const prePage = () => {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const changeCPage = (id) => {
    setCurrentPage(id);
  };

  const nextPage = () => {
    if (currentPage === lastIndex) {
      setCurrentPage(currentPage);
    } else {
      setCurrentPage(currentPage + 1);
    }
  };
  const handlePurchase = async (e) => {
    const listingId = e.target.value;
    try {
      const res = await fetch(`/api/wishlist/wish/create/${listingId}`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success === false) {
        Swal.fire({
          icon: 'error',
          title: 'Transaction Failed!',
          text: data.message,
          allowOutsideClick: false,
          showConfirmButton: true,
          confirmButtonText: 'Try Again!',
          confirmButtonColor: '#d9534f',
        });
        return;
      } else if (data.state === false) {
        Swal.fire({
          icon: 'error',
          title: 'Transaction Failed!',
          text: data.message,
          allowOutsideClick: false,
          showConfirmButton: true,
          confirmButtonText: 'Try Again!',
          confirmButtonColor: '#d9534f',
        });
        return;
      }
      if (data.state === true) {
        Swal.fire({
          icon: 'success',
          title: 'Transaction Successful!',
          text: data.message,
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

  const handleRemove = async (e) => {
    const wishId = e.target.value;
    console.log(wishId);
    try {
      const res = await fetch(`/api/wishlist/wish/remove/${wishId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        Swal.fire({
          icon: 'error',
          title: 'Transaction Failed!',
          text: data.message,
          allowOutsideClick: false,
          showConfirmButton: true,
          confirmButtonText: 'Try Again!',
          confirmButtonColor: '#d9534f',
        });
        return;
      } else if (data.state === false) {
        Swal.fire({
          icon: 'error',
          title: 'Transaction Failed!',
          text: data.message,
          allowOutsideClick: false,
          showConfirmButton: true,
          confirmButtonText: 'Try Again!',
          confirmButtonColor: '#d9534f',
        });
        return;
      }
      if (data.state === true) {
        Swal.fire({
          icon: 'success',
          title: 'Transaction Successful!',
          text: data.message,
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
    <div>
      <div className="relative overflow-x-auto mt-5 text-center">
        <h2 className="text-2xl text-slate-700 font-semibold">
          {listings && listings.length > 1 ? 'Wishlists' : 'Wishlist'}
        </h2>
        <table className="w-full text-sm text-left text-slate-700 mb-7">
          <thead className="text-xs text-gray-700 uppercase bg-slate-200">
            <tr>
              <th scope="col" className="px-6 py-3">
                owner id
              </th>
              <th scope="col" className="px-6 py-3">
                listing id
              </th>
              <th scope="col" className="px-6 py-3">
                buyer id
              </th>
              <th scope="col" className="px-6 py-3">
                name
              </th>
              <th scope="col" className="px-6 py-3">
                regular price
              </th>
              <th scope="col" className="px-6 py-3">
                discounted price
              </th>
              <th scope="col" className="px-6 py-3">
                type
              </th>
              <th scope="col" className="px-6 py-3">
                status
              </th>
              <th colSpan="2" scope="col" className="px-6 py-3 text-center">
                action
              </th>
            </tr>
          </thead>
          <tbody>
            {listings && listings.length > 0 ? (
              records.map((listings) => (
                <tr key={listings._id} className="bg-slate-100">
                  <td className="px-6 py-4">
                    <Link
                      className="text-blue-500 font-semibold hover:underline"
                      to={`/view-user/${listings.userRef}`}
                    >
                      {listings.userRef}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      className="text-blue-500 font-semibold hover:underline"
                      to={`/listing/${listings._id}`}
                    >
                      {listings._id}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      className="text-blue-500 font-semibold hover:underline"
                      to={`/view-user/${listings.user_id}`}
                    >
                      {listings.user_id}
                    </Link>
                  </td>

                  <td className="px-6 py-4">{listings.name}</td>
                  <td className="px-6 py-4">{listings.regularPrice}</td>
                  <td className="px-6 py-4">{listings.discountPrice}</td>
                  <td className="px-6 py-4">{listings.type}</td>
                  <td className="px-6 py-4">
                    <p className={listings.isAvailable ? 'text-green-500' : 'text-red-500'}>
                      {listings.isAvailable ? 'Available' : 'Sold Out'}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    {listings.isAvailable ? (
                      <button
                        type="submit"
                        className="p-2 bg-orange-400 text-white rounded-lg uppercase hover:bg-slate-500"
                        value={listings._id}
                        onClick={(e) => handlePurchase(e)}
                      >
                        Purchase
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="p-2 bg-gray-400 text-white rounded-lg uppercase hover:bg-slate-500"
                      >
                        Sold Out
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      type="submit"
                      className="p-2 bg-red-500 text-white rounded-lg uppercase hover:bg-slate-500"
                      value={listings._id}
                      onClick={(e) => handleRemove(e)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td>
                  <h1>No Listings Found!</h1>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <footer className="pb-7">
          <ul className="flex flex-wrap gap-1 w-full mx-auto">
            <li>
              <a
                className="p-3 bg-slate-200 text-slate-700 font-semibold rounded-lg"
                href="#/"
                onClick={prePage}
              >
                Prev
              </a>
            </li>

            {numbers.map((n, i) => (
              <li key={i}>
                <a
                  href="#/"
                  className={`${
                    currentPage === n ? 'active' : ''
                  } p-3 bg-slate-200 text-slate-700 font-semibold rounded-lg`}
                  onClick={() => changeCPage(n)}
                >
                  {n}
                </a>
              </li>
            ))}
            <li>
              <a
                className="p-3 bg-slate-200 text-slate-700 font-semibold rounded-lg"
                href="#/"
                onClick={() => nextPage()}
              >
                Next
              </a>
            </li>
          </ul>
        </footer>
      </div>
    </div>
  );
}
