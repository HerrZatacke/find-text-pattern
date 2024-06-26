import React from 'react';
import { matchPath, useLocation, Link } from 'react-router-dom';
import { AppBar, Toolbar, Tabs, Tab, Stack, LinearProgress } from '@mui/material';
import Menus from '../../content/Menus';
import useProgressStore from '../../../stores/progressStore';

function useRouteMatch(patterns: readonly string[]) {
  const { pathname } = useLocation();

  for (let i = 0; i < patterns.length; i += 1) {
    const pattern = patterns[i];
    const possibleMatch = matchPath(pattern, pathname);
    if (possibleMatch !== null) {
      return possibleMatch;
    }
  }

  return null;
}

function Navigation() {
  // You need to provide the routes in descendant order.
  // This means that if you have nested routes like:
  // users, users/new, users/edit.
  // Then the order should be ['users/add', 'users/edit', 'users'].
  const routeMatch = useRouteMatch(['/romview', '/charmap', '/tilemaps']);
  const currentTab = routeMatch?.pattern?.path;

  const { progresss } = useProgressStore();

  return (
    <AppBar
      position="sticky"
      color="secondary"
    >
      <Toolbar>
        <div className="grid__container grid__container--v-slim settings">
          <div className="grid__col grid__col--6">
            <Stack direction="row" useFlexGap justifyContent="start">
              <Tabs value={currentTab}>
                <Tab label="Rom view" value="/romview" to="/romview" component={Link} />
                <Tab label="Charmap" value="/charmap" to="/charmap" component={Link} />
                <Tab label="Tilemaps" value="/tilemaps" to="/tilemaps" component={Link} />
              </Tabs>
            </Stack>
          </div>
          <div className="grid__col grid__col--6">
            <Stack direction="row" useFlexGap justifyContent="end">
              <Menus />
            </Stack>
          </div>
        </div>
      </Toolbar>
      {
        progresss.map((progress) => (
          <LinearProgress
            key={progress.id}
            variant="determinate"
            value={progress.value * 100}
          />
        ))
      }
    </AppBar>
  );
}

export default Navigation;
