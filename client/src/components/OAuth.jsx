import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { FaGoogle } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { app } from '../app/firebase';
import { signInSuccess } from '../app/user/userSlice';

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });
      const data = await res.json();
      dispatch(signInSuccess(data));
      navigate('/profile');
    } catch (error) {
      console.log('Could not sign in with google', error);
    }
  };
  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className="bg-red-700 text-white p-3 rounded-lg uppercase hover:bg-blue-700 disabled:opacity-70"
    >
      <span className="flex justify-center">
        <span className="me-2">CONTINUE WITH</span> <FaGoogle className="text-xl" />
        oogle
      </span>
    </button>
  );
}
