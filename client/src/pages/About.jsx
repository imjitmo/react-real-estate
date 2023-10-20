import { Link } from 'react-router-dom';
import img from '../assets/about.svg';
import Button from '../layout/Button';
import Heading from '../layout/Heading';

export default function About() {
  return (
    <div className=" md:min-h-screen flex flex-col-reverse md:flex-row items-center gap-5 md:mx-32">
      <div className=" w-full md:w-2/4">
        <img src={img} alt="img" />
      </div>

      <div className="w-full md:w-2/4 text-center space-y-2">
        <Heading title1="About" title2="Us?" />
        <p className="text-lightText text-justify">
          Whether you’re looking for property for sale in the Philippine area or property for rent, J.re Real
          Estate makes searching easy. Use our unique geolocation mapping feature to root-out your ideal
          villa, townhouse or apartment.
        </p>
        <p className="text-lightText text-justify">
          We will help you find your dream house in just a few seconds. We offer our clients a wealth of
          knowledge regarding all aspects of purchasing or selling a home. Whether it is helping you search
          for your dream home, discussing new real estate developments, or assisting with the sale of your
          property. Please feel free to contact us with any questions!
        </p>

        <Link to="/contact" spy={true} smooth={true} duration={500}>
          <Button title="Contact Us" />
        </Link>
      </div>
    </div>
  );
}
