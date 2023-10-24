import { useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import OAuth from '../components/OAuth';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState(null);

  // Error Handler
  const [checkError, setCheckError] = useState({
    password: '',
    confirmPass: '',
  });
  const [input, setInput] = useState({
    password: '',
    confirmPass: '',
  });

  // Handler Functions
  const onInputChange = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
    validateInput(e);
  };

  const validateInput = (e) => {
    let { name, value } = e.target;
    setCheckError((prev) => {
      const stateObj = { ...prev, [name]: '' };

      switch (name) {
        case 'password':
          if (!value) {
            stateObj[name] = 'Please enter Password.';
            setIsActive(false);
          } else if (value.length < 6) {
            stateObj[name] = 'Minimum of 6 characters required.';
            setIsActive(false);
          } else if (input.confirmPass && value !== input.confirmPass) {
            stateObj['confirmPass'] = 'Password does not match.';
            setIsActive(false);
          } else {
            stateObj['confirmPass'] = input.confirmPass ? '' : checkError.confirmPass;
            setIsActive(false);
          }
          break;

        case 'confirmPass':
          if (!value) {
            stateObj[name] = 'Please repeat password.';
            setIsActive(false);
          } else if (input.password && value !== input.password) {
            stateObj[name] = 'Password does not match.';
            setIsActive(false);
          } else if (input.confirmPass === input.password) {
            setIsActive(true);
          }
          break;

        default:
          break;
      }

      return stateObj;
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
    onInputChange(e);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isActive === true) {
      try {
        setLoading(true);
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.success === false) {
          setError(data.message);
          setLoading(false);
          return;
        } else if (data.state === false) {
          setLoading(false);
          Swal.fire({
            icon: 'error',
            title: 'Please try again!',
            text: data.message,
            allowOutsideClick: false,
            showConfirmButton: true,
            confirmButtonText: 'Try Again!',
            confirmButtonColor: '#d9534f',
          });
        } else {
          setLoading(false);
          setError(null);
          Swal.fire({
            icon: 'success',
            title: 'Registration Successful!',
            text: 'We sent an e-mail verification. Please check your e-mail now!',
            allowOutsideClick: false,
            showConfirmButton: true,
            confirmButtonColor: '#f8981e',
          }).then(function () {
            window.location = '/sign-in';
          });
        }
      } catch (error) {
        setLoading(false);
        setError(error.message);
      }
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="enter first name..."
          id="firstName"
          className="border p-3 rounded-lg"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          placeholder="enter last name..."
          id="lastName"
          className="border p-3 rounded-lg"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          placeholder="enter username..."
          id="username"
          className="border p-3 rounded-lg"
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          placeholder="enter contact number..."
          id="contactNumber"
          className="border p-3 rounded-lg"
          onChange={handleChange}
          required
        />
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
          onBlur={validateInput}
          required
        />
        {checkError.password && <span className="text-red-500 mt-5">{checkError.password}</span>}
        <input
          type="password"
          placeholder="repeat password..."
          id="confirmPass"
          name="confirmPass"
          className="border p-3 rounded-lg"
          onChange={handleChange}
          onBlur={validateInput}
          required
        />
        {checkError.confirmPass && <span className="text-red-500 mt-5">{checkError.confirmPass}</span>}
        <button
          type="submit"
          className="bg-orange-400 text-white p-3 rounded-lg uppercase hover:bg-slate-700 disabled:opacity-70"
          disabled={loading}
        >
          {loading ? 'loading...' : 'Sign Up'}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-2 mt-5">
        <p>Do you have an account?</p>
        <Link to={'/sign-in'}>
          <span className="text-blue-400">Sign in</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  );
}
