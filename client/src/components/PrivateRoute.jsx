import { useSelector } from 'react-redux';
// Navigate is a component,useNavigate is a hook both have similar purposes.
//Our Purpose is to get access to Dashboard who is sign-in only otherwise redirect it to sign-in page 
import { Outlet, Navigate } from 'react-router-dom';
export default function PrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);
//If currentUser exists we're going to return the children which is the dashboard and the children we can get using
//something called Outlet from react-router-doom .
  return currentUser ? <Outlet /> : <Navigate to='/sign-in' />;
}