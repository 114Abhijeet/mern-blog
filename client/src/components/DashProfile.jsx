import { Alert, Button, Modal, ModalBody, TextInput } from 'flowbite-react';
import { useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import {getDownloadURL,getStorage,ref,uploadBytesResumable} from 'firebase/storage';
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {updateStart,updateSuccess,updateFailure,deleteUserStart,
  deleteUserSuccess,deleteUserFailure,signoutSuccess} from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { Link } from 'react-router-dom';

export default function DashProfile() {
const { currentUser, error, loading  } = useSelector((state) => state.user);
//Once we choose an image we want to save it inside a piece of state.
const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const filePickerRef = useRef();
  const dispatch = useDispatch();
  const handleImageChange = (e) => {
    //[0]--means we are just uploading one file.
//Avoiding error by not directly assigning e.target.files[0] to if statement arguments--just check first if file exists 
    const file = e.target.files[0];
//Extra edge case you should take care
//One more thing to notice that if you upload an image in firebase(its final stage will be shown 100%).Also if you 
//not navigate to other pages or refresh the pages..Just go to VS code and save some random file..You see the 
// uploaded image(100% wala)will be again uploaded.You can go to firebase and check it.
    if (file) {
        if (!file.type.startsWith('image/')) {
            setImageFileUploadError('File must be an image');
            setImageFile(null);
            setImageFileUrl(null);
            setImageFileUploading(false);
            setImageFileUploadProgress(null);
            return;
          } else if (file.size > 2 * 1024 * 1024) {
            setImageFileUploadError('File must be less than 2MB');
            setImageFile(null);
            setImageFileUrl(null);
            setImageFileUploadProgress(null);
            setImageFileUploading(false);
            return;
          } else {
            setImageFile(file);
            setImageFileUrl(URL.createObjectURL(file));
          }
    }
  };
  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);
  const uploadImage = async () => {
     // service firebase.storage {
    //   match /b/{bucket}/o {
    //     match /{allPaths=**} {
    //       allow read;
    //       allow write: if
    //       request.resource.size < 2 * 1024 * 1024 &&
    //       request.resource.contentType.matches('image/.*')
    //     }
    //   }
    // }
    setImageFileUploading(true);
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        // console.log(error);
        setImageFileUploadError(
          'Image upload failed'
        );
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
          setImageFileUploading(false);
        });
      }
    );
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    if (Object.keys(formData).length === 0) {
      setUpdateUserError('No changes made');
      return;
    }
    if (imageFileUploading) {
      setUpdateUserError('Please wait for image to upload');
      return;
    }
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        setImageFileUploadError(null);
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("User's profile updated successfully");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };
  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };
  const handleSignout = async () => {
    try {
      const res = await fetch('/api/user/signout', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };
    return (
        <div className='max-w-lg mx-auto p-3 w-full'>
        <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
        <form  onSubmit={handleSubmit} className='flex flex-col gap-4'>
    {/* Adding input just before div which contains image.accept='image/*' means accept any type of images only.  */}
        <input type='file' accept='image/*' onChange={handleImageChange} ref={filePickerRef} hidden />
        <div
    //overflow-hidden: Ensures that any content that overflows the bounds of the div is hidden.
          className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full'
    //When we click on this round placed image,we are going to actually click on the input (file chooser input)
    // This is done by useRef hook
          onClick={() => filePickerRef.current.click()}
        >
          {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
            //thickness
              strokeWidth={5}
              styles={{
                root: {
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${
                    imageFileUploadProgress / 100
                  })`,
                },
              }}
            />
          )}
            <img
    //If you choose image only--replacing rounded placed image with choosen image. 
               src={imageFileUrl || currentUser.profilePicture}
              alt='user'
              className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
    //Reduces the opacity of the image to 60% if imageFileUploadProgress is less than 100
                imageFileUploadProgress &&
                imageFileUploadProgress < 100 &&
                'opacity-60'
              }`}
            />
          </div>
          {imageFileUploadError && (
          <Alert color='failure'>{imageFileUploadError}</Alert>
         )}
          <TextInput
            type='text'
            id='username'
            placeholder='username'
            defaultValue={currentUser.username}
            onChange={handleChange}
          />
          <TextInput
            type='email'
            id='email'
            placeholder='email'
            defaultValue={currentUser.email}
            onChange={handleChange}
          />
          <TextInput type='password' id='password' placeholder='password'  onChange={handleChange} />
          <Button
          type='submit'
          gradientDuoTone='purpleToBlue'
          outline
  //Button is disabled(not hidden) when loading is true or when image file is in uploading phase
          disabled={loading || imageFileUploading}
        >
          {loading ? 'Loading...' : 'Update'}
          </Button>
          {currentUser.isAdmin && (
          <Link to={'/create-post'}>
            <Button
//type is button here because we don't want to submit the form here just want to go create-post page if user is admin
              type='button'
              gradientDuoTone='purpleToPink'
              className='w-full'
            >
              Create a post
            </Button>
          </Link>
        )}
        </form>
        <div className='text-red-500 flex justify-between mt-5'>
        <span onClick={() => setShowModal(true)} className='cursor-pointer'>
          Delete Account
        </span>
        <span onClick={handleSignout} className='cursor-pointer'>
          Sign Out
        </span>
        </div>
        {updateUserSuccess && (
        <Alert color='success' className='mt-5'>
          {updateUserSuccess}
        </Alert>
      )}
      {updateUserError && (
        <Alert color='failure' className='mt-5'>
          {updateUserError}
        </Alert>
      )}
      {error && (
        <Alert color='failure' className='mt-5'>
          {error}
        </Alert>
      )}
      <Modal
    //This modal is appear if show property value is true
        show={showModal}
    // If we want to close it we say show model to false
        onClose={() => setShowModal(false)}
        popup
        size='md'
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Are you sure you want to delete your account?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteUser}>
                Yes, I'm sure
              </Button>
              <Button color='gray' onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      </div>
    );
  }