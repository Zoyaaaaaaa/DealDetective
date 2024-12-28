// "use client"
// import { useState } from 'react';
// import { Dialog, DialogPanel, DialogTitle, Button } from '@headlessui/react';
// import Image from 'next/image';
// import { addUserEmailToProduct } from '@/libs/actions';

// interface Props {
//   productId: string;
// }

// const Modal = ({ productId }: Props) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [email, setEmail] = useState('');

//   const openModal = () => setIsOpen(true);
//   const closeModal = () => setIsOpen(false);

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     if (!email) {
//       alert("Email is required");
//       return;
//     }

//     try {
//       await addUserEmailToProduct(productId, email);
//       setEmail(''); // Reset email input after submission
//       closeModal();
//     } catch (error) {
//       console.error("Error adding email to product:", error);
//     }
//   };

//   return (
//     <>
//       <Button
//         onClick={openModal}
//         className="bg-black text-white py-2 px-4 text-sm font-medium rounded-md focus:outline-none hover:bg-black/30"
//       >
//         Track
//       </Button>

//       <Dialog open={isOpen} onClose={closeModal} className="fixed inset-0 z-10 overflow-y-auto">
//         <div className="flex items-center justify-center min-h-screen p-4">
//           <DialogPanel className="max-w-md bg-white rounded-xl p-6 shadow-lg">
//             <div className="flex justify-between items-center mb-4">
//               <div className="flex items-center">
//                 <Image src="/assets/icons/logo.svg" alt="logo" width={28} height={28} />
//                 <h3 className="ml-2 text-lg font-medium text-black">Stay Updated!</h3>
//               </div>
//               <Image
//                 src="/assets/icons/x-close.svg"
//                 alt="close"
//                 width={24}
//                 height={24}
//                 className="cursor-pointer"
//                 onClick={closeModal}
//               />
//             </div>

//             <p className="text-sm text-gray-600 mb-4">
//               Stay updated with product pricing alerts right in your inbox! Never miss a bargain again with our timely alerts.
//             </p>

//             <form className="flex flex-col mt-5" onSubmit={handleSubmit}>
//               <label htmlFor="email" className="text-sm font-medium text-gray-700">
//                 Email address
//               </label>
//               <div className="flex items-center border rounded-md p-2 mt-1">
//                 <Image 
//                   src="/assets/icons/mail.svg"
//                   alt="mail"
//                   width={18}
//                   height={18}
//                   className="mr-2"
//                 />
//                 <input
//                   type="email"
//                   id="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="Enter your email address"
//                   className="flex-1 outline-none"
//                   required
//                 />
//               </div>
//               <Button
//                 type="submit"
//                 className="mt-4 bg-black text-white py-2 px-4 text-sm font-medium rounded-md focus:outline-none hover:bg-black/80"
//               >
//                 Track
//               </Button>
//             </form>
//           </DialogPanel>
//         </div>
//       </Dialog>
//     </>
//   );
// };

// export default Modal;

"use client"

import { useState } from 'react';
import { Dialog, DialogPanel, DialogTitle, Button } from '@headlessui/react';
import Image from 'next/image';
import { addUserEmailToProduct } from '@/libs/actions';
import { 
  Bell, 
  X, 
  Mail, 
  AlertCircle, 
  Check, 
  LineChart,
  ArrowUpDown,
  AlertTriangle
} from 'lucide-react';

interface Props {
  productId: string;
}

const Modal = ({ productId }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const openModal = () => {
    setIsOpen(true);
    setSubmitted(false);
  };
  
  const closeModal = () => {
    setIsOpen(false);
    setTimeout(() => setSubmitted(false), 500);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email) {
      alert("Email is required");
      setIsLoading(false);
      return;
    }

    try {
      await addUserEmailToProduct(productId, email);
      setEmail('');
      setSubmitted(true);
      setIsLoading(false);
      setTimeout(closeModal, 2000);
    } catch (error) {
      console.error("Error adding email to product:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center mt-6">
      <button
        onClick={openModal}
        className="flex items-center gap-2 bg-black/90 text-white py-3 px-6 rounded-lg 
                   hover:bg-black transition-all duration-300 focus:outline-none focus:ring-2 
                   focus:ring-offset-2 focus:ring-black/50 transform hover:scale-[1.02] active:scale-[0.98]"
      >
        <LineChart size={18} className="opacity-80" />
        <span className="font-medium">Track Price</span>
        <ArrowUpDown size={16} className="opacity-80 ml-1" />
      </button>

      <Dialog 
        open={isOpen} 
        onClose={closeModal} 
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        <div className="min-h-screen px-4 text-center">
          {/* <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity" /> */}
          
          <span className="inline-block h-screen align-middle" aria-hidden="true">&#8203;</span>
          
          <DialogPanel className="inline-block w-full max-w-md p-6 my-8 text-left align-middle transition-all transform bg-white shadow-2xl rounded-2xl">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-black/5 rounded-xl">
                  <AlertTriangle size={24} className="text-black" />
                </div>
                <DialogTitle as="h3" className="text-xl font-semibold text-gray-900">
                  Price Alert
                </DialogTitle>
              </div>
              <button
                onClick={closeModal}
                className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-6">
              {!submitted ? (
                <>
                  <p className="text-gray-600">
                    Never miss a deal! Set up price drop alerts and we'll notify you when the price falls to your target.
                  </p>

                  <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email address
                      </label>
                      <div className="mt-1 relative rounded-lg shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail size={18} className="text-gray-400" />
                        </div>
                        <input
                          type="email"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-black 
                                   focus:border-black text-sm transition-shadow duration-200 ease-in-out
                                   placeholder:text-gray-400 hover:border-gray-300"
                          placeholder="you@example.com"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full flex items-center justify-center gap-2 bg-black text-white py-3 px-4 
                               rounded-lg font-medium hover:bg-black/90 focus:outline-none focus:ring-2 
                               focus:ring-offset-2 focus:ring-black/50 disabled:opacity-50 disabled:cursor-not-allowed
                               transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Bell size={18} className="opacity-80" />
                          Set Alert
                        </>
                      )}
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                    <Check size={24} className="text-green-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">All set!</h3>
                  <p className="text-sm text-gray-600">
                    We'll send you an email when the price drops.
                  </p>
                </div>
              )}
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
};

export default Modal;