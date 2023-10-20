import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function Verifier() {
  const params = useParams();
  const navigate = useNavigate();
  if (!params || params.length <= 0 || params === null || params === undefined) {
    navigate('/');
  }
  useEffect(() => {
    const fecthToken = async (token) => {
      const res = await fetch(`/api/auth/verify/${token.token}`);
      const data = await res.json();
      if (data.state === true) {
        Swal.fire({
          icon: 'success',
          title: 'Verification Successful!',
          text: 'You may now log onto your account!',
          allowOutsideClick: false,
          showConfirmButton: true,
          confirmButtonColor: '#f8981e',
        }).then(function () {
          window.location = '/sign-in';
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Please try again!',
          text: data.message,
          allowOutsideClick: false,
          showConfirmButton: true,
          confirmButtonText: 'Try Again!',
          confirmButtonColor: '#d9534f',
        }).then(function () {
          window.location = '/';
        });
      }
    };

    fecthToken(params);
  }, []);
  return <div></div>;
}
