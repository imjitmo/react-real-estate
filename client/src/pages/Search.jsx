import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ListingCard from '../components/ListingCard';

export default function Search() {
  const navigate = useNavigate();
  const [sidebarData, setSidebarData] = useState({
    searchTerm: '',
    type: 'all',
    parking: false,
    furnished: false,
    offer: false,
    sort: 'created_at',
    order: 'desc',
  });
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermUrl = urlParams.get('searchTerm');
    const typeUrl = urlParams.get('type');
    const parkingUrl = urlParams.get('parking');
    const furnishedUrl = urlParams.get('furnished');
    const offerUrl = urlParams.get('offer');
    const sortUrl = urlParams.get('sort');
    const orderUrl = urlParams.get('order');

    if (searchTermUrl || typeUrl || parkingUrl || furnishedUrl || offerUrl || sortUrl || orderUrl) {
      setSidebarData({
        searchTerm: searchTermUrl || '',
        type: typeUrl || 'all',
        parking: parkingUrl === 'true' ? true : false,
        furnished: furnishedUrl === 'true' ? true : false,
        offer: offerUrl === 'true' ? true : false,
        sort: sortUrl || 'created_at',
        order: orderUrl || 'desc',
      });
    }

    const fetchListing = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      if (data.length > 9) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setListings(data);
      setLoading(false);
    };

    fetchListing();
  }, [location.search]);

  const handleChange = (e) => {
    if (e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sale') {
      setSidebarData({ ...sidebarData, type: e.target.id });
    }

    if (e.target.id === 'searchTerm') {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value });
    }

    if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
      setSidebarData({
        ...sidebarData,
        [e.target.id]: e.target.checked || e.target.checked === 'true' ? true : false,
      });
    }

    if (e.target.id === 'sort_order') {
      const sort = e.target.value.split('_')[0] || 'created_at';
      const order = e.target.value.split('_')[1] || 'desc';
      setSidebarData({ ...sidebarData, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm', sidebarData.searchTerm);
    urlParams.set('type', sidebarData.type);
    urlParams.set('parking', sidebarData.parking);
    urlParams.set('furnished', sidebarData.furnished);
    urlParams.set('offer', sidebarData.offer);
    urlParams.set('sort', sidebarData.sort);
    urlParams.set('order', sidebarData.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const showMoreHandle = async () => {
    const listingCount = listings.length;
    const startIndex = listingCount;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/get?${searchQuery}`);
    const data = await res.json();
    if (data.length < 10) {
      setShowMore(false);
    }
    setListings([...listings, ...data]);
  };
  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 w-96 border-b-2 md:border-r-2 md:min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap">Search Term: </label>
            <input
              type="text"
              className="border rounded-lg p-3 w-full"
              id="searchTerm"
              placeholder="Search..."
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label>Type: </label>
            <div className="flex">
              <input
                type="checkbox"
                id="all"
                className="w-5"
                checked={sidebarData.type === 'all'}
                onChange={handleChange}
              />
              <span>Rent & Sale</span>
            </div>
            <div className="flex">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                checked={sidebarData.type === 'rent'}
                onChange={handleChange}
              />
              <span>Rent</span>
            </div>
            <div className="flex">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                checked={sidebarData.type === 'sale'}
                onChange={handleChange}
              />
              <span>Sale</span>
            </div>
            <div className="flex">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                checked={sidebarData.offer === true}
                onChange={handleChange}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label>Ameneties: </label>
            <div className="flex">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                checked={sidebarData.parking === true}
                onChange={handleChange}
              />
              <span>Parking</span>
            </div>
            <div className="flex">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                checked={sidebarData.furnished === true}
                onChange={handleChange}
              />
              <span>Furnished</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label>Sort: </label>
            <select
              className="border rounded-lg p-3"
              id="sort_order"
              defaultValue={'created_at_desc'}
              onChange={handleChange}
            >
              <option value="regularPrice_desc">Price - High to Low</option>
              <option value="regularPrice_asc">Price - Low to High</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>
          <button className="bg-orange-400 text-white p-3 rounded-lg uppercase hover:bg-slate-700">
            Search
          </button>
        </form>
      </div>
      <div className="">
        <h1 className="text-3xl font-semibold border-b-2 p-3 text-slate-700 mt-5">Search Results:</h1>
        <div className="flex-1 p-7 flex-wrap">
          {!loading && listings.length === 0 && (
            <p className="text-2xl text-center text-slate-700">No Listings found!</p>
          )}
          {loading && (
            <img
              className="w-2/4 object-contain mx-auto"
              src="https://firebasestorage.googleapis.com/v0/b/jp-estate.appspot.com/o/contents%2Floading.gif?alt=media&token=7af3641c-7738-4fca-a314-6346f5fc0163&_gl=1*10xzelj*_ga*MTM1Nzk3ODk0NC4xNjk3MjQ3ODM3*_ga_CW55HF8NVT*MTY5NzM2MDY5Ny4xMC4xLjE2OTczNjA3MjAuMzcuMC4w"
              alt="loading-image"
            />
          )}
          <div className="flex flex-wrap gap-4">
            {!loading &&
              listings &&
              listings.map((listing) => <ListingCard key={listing._id} listing={listing} />)}
            {showMore && (
              <button
                className="text-green-500 hover:underline p-7 text-center w-full"
                onClick={showMoreHandle}
              >
                Show more...
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
