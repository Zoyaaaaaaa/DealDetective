"use client"
import { useState } from 'react';
import { Dialog, DialogPanel, DialogTitle, Button } from '@headlessui/react';
import Image from 'next/image';
import { addUserEmailToProduct } from '@/libs/actions';

interface Props {
  productId: string;
}

const Modal = ({ productId }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) {
      alert("Email is required");
      return;
    }

    try {
      await addUserEmailToProduct(productId, email);
      setEmail(''); // Reset email input after submission
      closeModal();
    } catch (error) {
      console.error("Error adding email to product:", error);
    }
  };

  return (
    <>
      <Button
        onClick={openModal}
        className="bg-black text-white py-2 px-4 text-sm font-medium rounded-md focus:outline-none hover:bg-black/30"
      >
        Track
      </Button>

      <Dialog open={isOpen} onClose={closeModal} className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen p-4">
          <DialogPanel className="max-w-md bg-white rounded-xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <Image src="/assets/icons/logo.svg" alt="logo" width={28} height={28} />
                <h3 className="ml-2 text-lg font-medium text-black">Stay Updated!</h3>
              </div>
              <Image
                src="/assets/icons/x-close.svg"
                alt="close"
                width={24}
                height={24}
                className="cursor-pointer"
                onClick={closeModal}
              />
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Stay updated with product pricing alerts right in your inbox! Never miss a bargain again with our timely alerts.
            </p>

            <form className="flex flex-col mt-5" onSubmit={handleSubmit}>
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="flex items-center border rounded-md p-2 mt-1">
                <Image 
                  src="/assets/icons/mail.svg"
                  alt="mail"
                  width={18}
                  height={18}
                  className="mr-2"
                />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 outline-none"
                  required
                />
              </div>
              <Button
                type="submit"
                className="mt-4 bg-black text-white py-2 px-4 text-sm font-medium rounded-md focus:outline-none hover:bg-black/80"
              >
                Track
              </Button>
            </form>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};

export default Modal;
