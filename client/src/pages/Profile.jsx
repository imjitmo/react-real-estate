import { useState } from 'react';
import ProfileCard from '../components/ProfileCard';
import ProfileEdit from '../components/ProfileEdit';

export default function Profile() {
  const [saveStatus, setSaveStatus] = useState(false);
  const openEdit = () => {
    setSaveStatus(true);
  };
  const closeEdit = () => {
    setSaveStatus(false);
  };
  return (
    <div className="p-3 max-w-lg rounded-lg my-5 p-5 mx-auto border-solid border-2 border-slate-100">
      <div className="flex justify-end gap-4 mt-5">
        <span
          className="text-red-500 cursor-pointer font-medium hover:opacity-90"
          hidden={saveStatus === true}
          onClick={openEdit}
        >
          Edit Profile
        </span>
        <span
          className="text-green-500 cursor-pointer font-medium hover:opacity-90"
          hidden={saveStatus === false}
          onClick={closeEdit}
        >
          Done
        </span>
      </div>
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      {saveStatus ? <ProfileEdit /> : <ProfileCard />}
    </div>
  );
}
