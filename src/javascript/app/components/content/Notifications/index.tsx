import React from 'react';
import { Alert, Snackbar } from '@mui/material';
import useNotificationsStore from '../../../stores/notificationsStore';

function Notifications() {
  const { messages, dismissMessage } = useNotificationsStore();

  return (
    <>
      {
        messages.map((message, index) => {
          const close = () => dismissMessage(index);
          return (
            <Snackbar
              key={index}
              open
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
              onClose={close}
            >
              <Alert
                onClose={close}
                severity="error"
                variant="filled"
              >
                { message }
              </Alert>
            </Snackbar>
          );
        })
      }
    </>
  );
}

export default Notifications;
