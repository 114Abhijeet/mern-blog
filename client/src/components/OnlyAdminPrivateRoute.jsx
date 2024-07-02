import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

export default function OnlyAdminPrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);
  //Suppose admin is at create-post page and if he sign out there(top right side).then currentuser is null 
  // and if you only check currentuser.isAdmin then it is not properly working.you are still in create-post page 
  //and not navigate to sign-in page
  return currentUser && currentUser.isAdmin ? (
    <Outlet />
  ) : (
    <Navigate to='/sign-in' />
  );
}