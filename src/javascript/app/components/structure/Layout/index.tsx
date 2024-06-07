import React from 'react';
import type { CSSPropertiesVars } from 'react';
import { Outlet } from 'react-router-dom';

import PatchEdit from '../../content/PatchEdit';
import Notifications from '../../content/Notifications';
import Navigation from '../Navigation';
import { useCharMapImageURI } from '../../../hooks/useCharMapImageURI';

function Layout() {
  const { charMapImageURI } = useCharMapImageURI();

  const styles: CSSPropertiesVars | undefined = charMapImageURI ? {
    '--charmap-uri': `url(${charMapImageURI})`,
  } : undefined;

  return (
    <div style={styles}>
      <Navigation />
      <Outlet />
      <Notifications />
      <PatchEdit />
    </div>
  );
}

export default Layout;
