import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../components/Header/Navbar'
import Footer from '../components/Footer/Footer';

const Root = () => {

  return (
    <div className=''>
      <Navbar></Navbar>
      <main className="overflow-x-clip">
        <Outlet></Outlet>
      </main>
      <Footer></Footer>
    </div>
  );
};

export default Root;
