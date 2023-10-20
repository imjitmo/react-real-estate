import emailjs from '@emailjs/browser';
import { useRef, useState } from 'react';
import Swal from 'sweetalert2';
import img from '../assets/contact.svg';
import Heading from '../layout/Heading';

const Contact = () => {
  const form = useRef();
  const [state, setState] = useState(true);

  const sendEmail = (e) => {
    e.preventDefault();
    setState(false);
    emailjs
      .sendForm(
        import.meta.env.VITE_EMAILJS_API_KEY,
        import.meta.env.VITE_EMAILJS_TEMPLATE_KEY,
        form.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )
      .then(
        (result) => {
          console.log(result);
          setState(false);
          Swal.fire({
            icon: 'success',
            title: 'Message Sent Successfully!',
            text: 'We will get back to you soon!',
            allowOutsideClick: false,
            showConfirmButton: true,
            confirmButtonColor: '#f8981e',
          }).then(function () {
            window.location = '/contact';
          });
        },
        (error) => {
          console.log(error.text);
        }
      );
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center md:mx-32">
      <Heading title1="Contact" title2="Us" />

      <div className=" flex flex-col md:flex-row justify-between w-full">
        <form form ref={form} onSubmit={sendEmail} className=" w-full md:w-2/5 space-y-5 pt-20">
          <div className=" flex flex-col">
            <label htmlFor="user_name">Your Name</label>
            <input
              className=" py-3 px-2 rounded-lg hover:shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] transition-all"
              type="text"
              name="user_name"
              id="user_name"
              placeholder="enter your name"
              required
            />
          </div>
          <div className=" flex flex-col">
            <label htmlFor="user_email">Your Email</label>
            <input
              className=" py-3 px-2 rounded-lg hover:shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] transition-all"
              type="email"
              name="user_email"
              id="user_email"
              placeholder="enter your email"
              required
            />
          </div>
          <div className=" flex flex-col">
            <label htmlFor="user_number">Your Number</label>
            <input
              className=" py-3 px-2 rounded-lg hover:shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] transition-all"
              type="text"
              name="user_number"
              id="user_number"
              placeholder="enter your number"
              required
            />
          </div>
          <div className=" flex flex-col">
            <label htmlFor="message">Your Message</label>
            <textarea
              className=" py-3 px-2 rounded-lg resize-none hover:shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] transition-all"
              name="message"
              id="message"
              placeholder="enter your message"
              required
            />
          </div>
          <div className="flex flex-row">
            <button
              type="submit"
              className=" bg-slate-700 text-white py-3 px-5 rounded-lg mt-4 hover:bg-gray-500 transition-all disabled:bg-gray-400"
              disabled={state === false}
            >
              {state ? 'Send' : 'Sending...'}
            </button>
          </div>
        </form>

        <div className=" w-full md:w-2/4">
          <img src={img} alt="img" />
        </div>
      </div>
    </div>
  );
};

export default Contact;
