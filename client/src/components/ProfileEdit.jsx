import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { app } from '../app/firebase';
import { updateUserFailure, updateUserStart, updateUserSuccess } from '../app/user/userSlice';

export default function ProfileEdit() {
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePercent, setFilePercent] = useState(0);
  const [fileErr, setFileErr] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);
  const handleFileUpload = async (file) => {
    const storage = getStorage(app);
    const fileName =
      Math.random().toString(36).slice(-8) +
      new Date().getTime() +
      '_' +
      Math.random().toString(36).slice(-8) +
      '_' +
      new Date().getTime() +
      '_' +
      file.name;
    const storageRef = ref(storage, `avatars/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    await uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePercent(Math.round(progress));
      },
      (error) => {
        setFileErr(true);
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data));
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          id="avatar"
          ref={fileRef}
          accept="image/*"
          hidden
        />
        <img
          src={formData.avatar || currentUser.avatar}
          alt="profile"
          className="rounded-full h-32 w-32 object-cover cursor-pointer self-center my-3"
          onClick={() => fileRef.current.click()}
        />
        <p className="text-sm self-center">
          {fileErr === true ? (
            <span className="text-red-700">Error Image Upload (image mus be less than 2mb)</span>
          ) : filePercent > 0 && filePercent < 100 ? (
            <span className="text-blue-500">{`Uploading ${filePercent}%`}</span>
          ) : !fileErr && filePercent === 100 ? (
            <span className="text-green-500">Image uploaded successfully!</span>
          ) : (
            ''
          )}
        </p>
        <input
          type="text"
          className="border p-3 rounded-lg"
          id="firstName"
          placeholder="first name"
          defaultValue={currentUser.firstName}
          onChange={handleChange}
        />
        <input
          type="text"
          className="border p-3 rounded-lg"
          id="lastName"
          placeholder="last name"
          defaultValue={currentUser.lastName}
          onChange={handleChange}
        />
        <input
          type="tel"
          className="border p-3 rounded-lg"
          id="contactNumber"
          placeholder="contact number"
          defaultValue={currentUser.contactNumber}
          onChange={handleChange}
        />
        <input
          type="password"
          className="border p-3 rounded-lg"
          id="password"
          placeholder="password"
          onChange={handleChange}
        />
        <button
          type="submit"
          className="bg-orange-400 text-white rounded-lg p-3 uppercase hover:bg-slate-700 disabled:opacity-70"
          disabled={loading}
        >
          {loading ? 'loading...' : 'update'}
        </button>
      </form>

      <p className="text-red-700 mt-5">{error ? error : ''}</p>
      <p className="text-green-500 mt-5">{updateSuccess ? 'Successfully Updated!' : ''}</p>
    </div>
  );
}
