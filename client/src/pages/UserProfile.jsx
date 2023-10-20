import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function ViewProfile() {
  const params = useParams();
  const [user, setUser] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/user/view/profile/${params.userId}`);
        const data = await res.json();
        if (data.state === false) {
          Swal.fire({
            icon: 'error',
            title: 'Uh oh! Something went wrong!',
            text: data.message,
            allowOutsideClick: false,
            showConfirmButton: true,
            confirmButtonText: 'Try Again!',
            confirmButtonColor: '#d9534f',
          }).then(function () {
            window.location = '/search?type=sale';
          });
        }
        setUser(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-3 max-w-lg mx-auto">
      <div className="flex flex-col gap-4 my-5">
        <img
          src={user.avatar}
          alt="profile"
          className="rounded-full h-32 w-32 object-cover cursor-pointer self-center my-3"
        />
        <p>{user.firstName && user.lastName ? user.firstName + ' ' + user.lastName : user.displayName}</p>
        <p>
          <span className="font-semibold">Contact Number: {user.contactNumber} </span>
        </p>
        <p>
          <span className="font-semibold">Email: </span> {user.email}
        </p>
        <p>
          <span className="font-semibold">Username: </span> {user.username}
        </p>
        <div className="">
          <p className="text-green-500 font-semibold">
            <span className="cursor-pointer line-through">
              Send Message<span className="text-red-500">(Under Construction)</span>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
