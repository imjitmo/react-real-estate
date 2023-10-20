import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { signInFailure, signInStart, signInSuccess } from '../app/user//userSlice';
import OAuth from '../components/OAuth';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));

      Swal.fire({
        icon: 'success',
        title: 'Login Successful!',
        text: 'Welcome to JP Real Estate!',
        allowOutsideClick: false,
        showConfirmButton: true,
        confirmButtonColor: '#f8981e',
      }).then(function () {
        window.location = '/profile';
      });
    } catch (error) {
      console.log(error);
      dispatch(signInFailure(error));
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="enter email..."
          id="email"
          className="border p-3 rounded-lg"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          placeholder="enter password..."
          id="password"
          name="password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          className="bg-orange-400 text-white p-3 rounded-lg uppercase hover:bg-slate-700 disabled:opacity-70"
          disabled={loading}
        >
          {loading ? 'loading...' : 'Sign In'}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-2 mt-5">
        <p>Don&apos;t have an account?</p>
        <Link to={'/sign-up'}>
          <span className="text-blue-400">Sign up</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  );
}
