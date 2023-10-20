import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import ListingCard from '../components/ListingCard';

export default function Home() {
  SwiperCore.use([Navigation]);
  const [offers, setOffers] = useState([]);
  const [sales, setSales] = useState([]);
  const [rents, setRents] = useState([]);
  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=4');
        const data = await res.json();

        setOffers(data);
        fetchRent();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchRent = async () => {
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=4');
        const data = await res.json();

        setRents(data);
        fetchSale();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSale = async () => {
      try {
        const res = await fetch('/api/listing/get?type=sale&limit=4');
        const data = await res.json();

        setSales(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOffer();
  }, []);
  return (
    <div>
      <div className="flex flex-col gap-6 py-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
          A place to find a perfect
          <br />
          place for <span className="text-slate-400">you</span>.
        </h1>
        <div className="text-gray-500 text-md sm:text-sm">
          J.re Properties have the wonderful and best properties for you. Have a talk with us for proper
          guidance.
        </div>
        <Link className="text-xs sm:text-sm text-blue-600 font-bold hover:opacity-85" to={'/search'}>
          Find yours now...
        </Link>
      </div>

      <Swiper navigation>
        {sales &&
          sales.length > 0 &&
          sales.map((listing) => (
            <SwiperSlide key={listing._id}>
              <div
                className="h-[500px]"
                style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat`,
                  backgroundSize: 'cover',
                }}
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {offers && offers.length > 0 && (
          <div className="">
            <div className="">
              <h2 className="text-2xl font-semibold text-slate-600">Recent offers</h2>
              <Link className="text-md text-blue-500 hover:underline" to={`/search?offer=true`}>
                Show more offers...
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {offers.map((listing) => (
                <ListingCard key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {rents && rents.length > 0 && (
          <div className="">
            <div className="">
              <h2 className="text-2xl font-semibold text-slate-600">Recent places for rents</h2>
              <Link className="text-md text-blue-500 hover:underline" to={`/search?type=rent`}>
                Show more rents...
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {rents.map((listing) => (
                <ListingCard key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {sales && sales.length > 0 && (
          <div className="">
            <div className="">
              <h2 className="text-2xl font-semibold text-slate-600">Recent places for sale</h2>
              <Link className="text-md text-blue-500 hover:underline" to={`/search?type=sale`}>
                Show more sales...
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {sales.map((listing) => (
                <ListingCard key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
