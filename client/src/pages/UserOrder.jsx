import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function UserOrder() {
  const [listings, setListings] = useState([]);
  const [updateStatus, setUpdateStatus] = useState('');
  const [idUpdate, setIdUpdate] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/purchase/transactions');
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

  const updateState = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/purchase/update/${idUpdate}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: updateStatus,
        }),
      });
      const data = await res.json();
      if (data.success === false) {
        return;
      }
      Swal.fire({
        icon: 'success',
        title: 'Status Updated!',
        text: '',
        allowOutsideClick: false,
        showConfirmButton: true,
        confirmButtonColor: '#f8981e',
      }).then(function () {
        window.location = '/user-orders';
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <div className="relative overflow-x-auto mt-5 text-center">
        <h2 className="text-2xl text-slate-700 font-semibold">Listings</h2>
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
              <th scope="col" className="px-6 py-3">
                action
              </th>
            </tr>
          </thead>
          <tbody>
            {listings && listings.length > 0 ? (
              records.map((listings, i) => (
                <tr key={listings._id} className="bg-slate-100">
                  <td className="px-6 py-4">{listings.ref_id}</td>
                  <td className="px-6 py-4">
                    <Link
                      className="text-blue-500 font-semibold hover:underline"
                      to={`/listing/${listings.listing_id}`}
                    >
                      {listings.listing_id}
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

                  <td className="px-6 py-4">{listings.price}</td>
                  <td className="px-6 py-4">{listings.discount}</td>
                  <td className="px-6 py-4">{listings.type}</td>
                  <td className="px-6 py-4">{listings.status}</td>
                  <td className="px-6 py-4">
                    <form onSubmit={updateState} className="flex flex-col gap-4">
                      <input
                        className="p-2 rounded-lg"
                        type="text"
                        value={updateStatus[listings._id]}
                        id={i + listings._id}
                        key={i + listings._id}
                        onChange={(e) => setUpdateStatus(e.target.value)}
                        placeholder="send status..."
                      />
                      <button
                        type="submit"
                        onClick={() => setIdUpdate(listings._id)}
                        className="p-2 bg-green-600 text-white rounded-lg uppercase hover:bg-slate-500"
                      >
                        send status
                      </button>
                    </form>
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
