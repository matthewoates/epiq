import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './App.css';
import Control from './routes/Control';
import Draw from './routes/Draw';
import Home from './routes/Home';
import Watch from './routes/Watch';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home/>
  },
  {
    path: '/draw',
    element: <Draw/>
  },
  {
    path: '/control',
    element: <Control/>
  },
  {
    path: '/watch',
    element: <Watch/>
  }
]);

function App() {
  return (
    <>
      <Theme appearance='dark'>
        <RouterProvider router={router}/>
      </Theme>
    </>
  );
}

export default App;
