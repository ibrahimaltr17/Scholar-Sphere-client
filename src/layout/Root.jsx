import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../components/Header/Navbar'

const Root = () => {

  return (
    <div className=''>
      <Navbar></Navbar>
      <main className="overflow-x-clip">
        <Outlet></Outlet>
      </main>
    </div>
  );
};

export default Root;
