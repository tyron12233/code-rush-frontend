import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';

interface UsernameDialogProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onSubmit: (username: string) => void;
}

const UsernameDialog: React.FC<UsernameDialogProps> = ({
  isOpen,
  onRequestClose,
  onSubmit,
}) => {
  const [username, setUsername] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(username);
  };

  const onClick = () => {
    onSubmit(username);

    console.log("DASDASD");
  };

  return (
    <Dialog as="div"
      className="fixed inset-0 z-10 overflow-y-auto"
      onClose={onRequestClose}
      open={isOpen}>
      <div className="min-h-screen px-4 text-center">

        <span
          className="inline-block h-screen align-middle"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          <Dialog.Title
            as="h3"
            className="text-lg font-medium leading-6 text-gray-900"
          >
            Change username
          </Dialog.Title>
          <form onSubmit={handleSubmit}>
            <div className="mt-2">

              <input
                className="w-full text-sm text-gray-500 border-t pt-2"
                type="text"
                placeholder="Username"
                value={username}
                onChange={handleInputChange}
              />
            </div>

            <div className="mt-4" style={{ display: 'flex' }}>
              <button
                type="button"
                className="inline-flex justify-center px-4 py-2 text-sm text-red-900 bg-red-100 border border-transparent rounded-md hover:bg-red-200 duration-300"
                onClick={onRequestClose}
              >
                Cancel
              </button>

              <div style={{ flex: '1' }} />

              <button
                type="submit"
                onClick={onClick}
                className="inline-flex justify-center px-4 py-2 text-sm text-green-900 bg-green-100 border border-transparent rounded-md hover:bg-green-200 duration-300"
              >
                Submit
              </button>
            </div>
          </form>

        </div>

      </div>
    </Dialog>
  );

  return (
    <Dialog
      open={isOpen}
      onClose={onRequestClose}
    >
      <Dialog.Panel>

        <Dialog.Title>Deactivate account</Dialog.Title>
        <Dialog.Description>
          This will permanently deactivate your account
        </Dialog.Description>


        {/* This dont work for dark mode */}
        <p className="bg-white text-black dark:bg-black dark:text-white">
          Are you sure you want to deactivate your account? All of your data
          will be permanently removed. This action cannot be undone.
        </p>

      </Dialog.Panel>
      {/* <h2>Enter Your Username</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={handleInputChange}
        />
      </form>
      <button type="submit">Submit</button> */}
    </Dialog>
  );
};

export default UsernameDialog;
