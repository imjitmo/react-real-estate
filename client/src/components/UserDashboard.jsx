import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

export default function UserDashboard() {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/user/all');
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

  const setArchive = async (e) => {
    try {
      const productId = e.target.value;
      const res = await fetch(`/api/user/change/false/${productId}`, {
        method: 'PUT',
      });
      const data = await res.json();
      if (data.success === false) {
        return;
      }
      Swal.fire({
        icon: 'success',
        title: 'Archived Successful!',
        text: '',
        allowOutsideClick: false,
        showConfirmButton: true,
        confirmButtonColor: '#f8981e',
      }).then(function () {
        window.location = '/dashboard';
      });
    } catch (error) {
      console.log(error);
    }
  };

  const setActive = async (e) => {
    try {
      const productId = e.target.value;
      const res = await fetch(`/api/user/change/true/${productId}`, {
        method: 'PUT',
      });
      const data = await res.json();
      if (data.success === false) {
        return;
      }
      Swal.fire({
        icon: 'success',
        title: 'Activation Successful!',
        text: '',
        allowOutsideClick: false,
        showConfirmButton: true,
        confirmButtonColor: '#f8981e',
      });
      // .then(function () {
      //   window.location = '/dashboard';
      // });
    } catch (error) {
      console.log(error);
    }
  };

  const unsetAdmin = async (e) => {
    try {
      const productId = e.target.value;
      const res = await fetch(`/api/user/admin/false/${productId}`, {
        method: 'PUT',
      });
      const data = await res.json();
      if (data.success === false) {
        return;
      }
      Swal.fire({
        icon: 'success',
        title: 'Unsetting Admin Successful!',
        text: '',
        allowOutsideClick: false,
        showConfirmButton: true,
        confirmButtonColor: '#f8981e',
      }).then(function () {
        window.location = '/dashboard';
      });
    } catch (error) {
      console.log(error);
    }
  };

  const setAdmin = async (e) => {
    try {
      const productId = e.target.value;
      const res = await fetch(`/api/user/admin/true/${productId}`, {
        method: 'PUT',
      });
      const data = await res.json();
      if (data.success === false) {
        return;
      }
      Swal.fire({
        icon: 'success',
        title: 'Setting Admin Successful!',
        text: '',
        allowOutsideClick: false,
        showConfirmButton: true,
        confirmButtonColor: '#f8981e',
      }).then(function () {
        window.location = '/dashboard';
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="relative overflow-x-auto mt-5 text-center">
        <h2 className="text-2xl text-slate-700 font-semibold">Users</h2>
        <table className="w-full text-sm text-left text-slate-700 mb-7">
          <thead className="text-xs text-gray-700 uppercase bg-slate-200">
            <tr>
              <th scope="col" className="px-6 py-3">
                user id
              </th>
              <th scope="col" className="px-6 py-3">
                username
              </th>
              <th scope="col" className="px-6 py-3">
                email
              </th>
              <th scope="col" className="px-6 py-3">
                full name
              </th>
              <th scope="col" className="px-6 py-3">
                user status
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
                  <td className="px-6 py-4">{listings._id}</td>
                  <td className="px-6 py-4">{listings.username}</td>
                  <td className="px-6 py-4">{listings.email}</td>
                  <td className="px-6 py-4">
                    {listings.displayName
                      ? listings.displayName
                      : listings.firstName + ' ' + listings.lastName}
                  </td>
                  <td className="px-6 py-4">
                    {listings.isActive ? (
                      <p className="text-green-500">Active</p>
                    ) : (
                      <p className="text-red-500">Inactive</p>
                    )}
                  </td>
                  <td>
                    {listings.isActive ? (
                      <button
                        className="bg-red-500 rounded-lg p-2 text-white uppercase hover:opacity-70"
                        id="archive"
                        value={listings._id}
                        onClick={setArchive}
                      >
                        Deactivate
                      </button>
                    ) : (
                      <button
                        className="bg-green-500 rounded-lg p-2 text-white uppercase hover:opacity-70"
                        id="archive"
                        value={listings._id}
                        onClick={setActive}
                      >
                        Activate
                      </button>
                    )}
                  </td>
                  <td>
                    {listings.isAdmin ? (
                      <button
                        className="bg-red-500 rounded-lg p-2 text-white uppercase hover:opacity-70"
                        id="not_admin"
                        value={listings._id}
                        onClick={unsetAdmin}
                      >
                        Remove Admin
                      </button>
                    ) : (
                      <button
                        className="bg-green-500 rounded-lg p-2 text-white uppercase hover:opacity-70"
                        id="admin"
                        value={listings._id}
                        onClick={setAdmin}
                      >
                        Give Admin
                      </button>
                    )}
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
