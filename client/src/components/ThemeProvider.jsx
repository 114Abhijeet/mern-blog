import { useSelector } from 'react-redux';

//In React, the children prop is a special prop that is automatically populated with the content that is placed 
//between the opening and closing tags of a component. You don't need to explicitly pass the children prop when you
//use a component; it is implicitly passed by React.ThemeProvider is wrapping the App component, which makes App 
// the child of ThemeProvider
export default function ThemeProvider({ children }) {
  const { theme } = useSelector((state) => state.theme);
  return (
    <div className={theme}>
      <div className='bg-white text-gray-700 dark:text-gray-200 dark:bg-[rgb(16,23,42)] min-h-screen'>
        {children}
      </div>
    </div>
  );
}