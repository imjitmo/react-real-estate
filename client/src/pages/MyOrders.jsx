import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function MyOrders() {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/purchase/view');
        const data = await res.json();
        setListings(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);
  console.log(listings);
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

  return (
    <div>
      <div className="relative overflow-x-auto mt-5 text-center">
        <h2 className="text-2xl text-slate-700 font-semibold">Listings</h2>
        <table className="w-full text-sm text-left text-slate-700 mb-7">
          <thead className="text-xs text-gray-700 uppercase bg-slate-200">
            <tr>
              <th scope="col" className="px-6 py-3">
                user id
              </th>
              <th scope="col" className="px-6 py-3">
                listing id
              </th>
              <th scope="col" className="px-6 py-3">
                name
              </th>
              <th scope="col" className="px-6 py-3">
                owner id
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
            </tr>
          </thead>
          <tbody>
            {listings && listings.length > 0 ? (
              records.map((listings) => (
                <tr key={listings._id} className="bg-slate-100">
                  <td className="px-6 py-4">{listings.user_id}</td>
                  <td className="px-6 py-4">
                    <Link
                      className="text-blue-500 font-semibold hover:underline"
                      to={`/listing/${listings.listing_id}`}
                    >
                      {listings.listing_id}
                    </Link>
                  </td>
                  <td className="px-6 py-4">{listings.name}</td>
                  <td className="px-6 py-4">
                    <Link
                      className="text-blue-500 font-semibold hover:underline"
                      to={`/view-user/${listings.ref_id}`}
                    >
                      {listings.ref_id}
                    </Link>
                  </td>
                  <td className="px-6 py-4">{listings.price}</td>
                  <td className="px-6 py-4">{listings.discount}</td>
                  <td className="px-6 py-4">{listings.type}</td>
                  <td className="px-6 py-4">{listings.status}</td>
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
