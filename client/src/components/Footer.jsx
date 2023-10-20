export default function Footer() {
  return (
    <footer className="p-4 bg-slate-200 md:p-8 lg:p-10">
      <div className="mx-auto max-w-screen-xl text-center">
        <div className="flex justify-center items-center ">
          <a href="/" className="text-2xl font-semibold text-gray-900 dark:text-white">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/jp-estate.appspot.com/o/contents%2Flogo_header.png?alt=media&token=24bd2f23-c6c6-4e97-baad-8e5e78d80445&_gl=1*1g6wz8v*_ga*MTM1Nzk3ODk0NC4xNjk3MjQ3ODM3*_ga_CW55HF8NVT*MTY5NzU1MDUzOS4yMy4xLjE2OTc1NTA1NjIuMzcuMC4w"
              className="h-28 w-28 object-contain"
            />
          </a>
        </div>
        <p className="my-6 text-gray-500 dark:text-slate-700">Your place for a perfect place finder.</p>
        <ul className="flex flex-wrap justify-center items-center mb-6 text-slate-900">
          <li>
            <a href="/" className="mr-4 hover:underline md:mr-6">
              Home
            </a>
          </li>
          <li>
            <a href="/about" className="mr-4 hover:underline md:mr-6 ">
              About
            </a>
          </li>
          <li>
            <a href="/search?type=sale" className="mr-4 hover:underline md:mr-6 ">
              Listings
            </a>
          </li>
          <li>
            <a href="#" className="mr-4 hover:underline md:mr-6">
              FAQs
            </a>
          </li>
          <li>
            <a href="#" className="mr-4 hover:underline md:mr-6">
              Contact
            </a>
          </li>
        </ul>
        <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
          © 2023-2024{' '}
          <a href="#" className="hover:underline">
            J.re™
          </a>
          . All Rights Reserved.
        </span>
      </div>
    </footer>
  );
}
