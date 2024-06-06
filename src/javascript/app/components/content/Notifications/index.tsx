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
                severity={message.type}
                variant="filled"
              >
                { message.text }
              </Alert>
            </Snackbar>
          );
        })
      }
    </>
  );
}

export default Notifications;
