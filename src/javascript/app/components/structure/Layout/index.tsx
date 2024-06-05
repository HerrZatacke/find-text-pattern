import React from 'react';
import { Outlet } from 'react-router-dom';

import PatchEdit from '../../content/PatchEdit';
import Notifications from '../../content/Notifications';
import Navigation from '../Navigation';

function Layout() {
  return (
    <>
      <Navigation />
      <Outlet />
      <Notifications />
      <PatchEdit />
    </>
  );
}

export default Layout;
