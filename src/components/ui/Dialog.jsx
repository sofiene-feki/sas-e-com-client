import React from "react";
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

const positionClasses = {
  right: "inset-y-0 right-0 flex max-w-full",
  left: "inset-y-0 left-0 flex max-w-full",
  top: "inset-x-0 top-0 flex max-h-full",
  bottom: "inset-x-0 bottom-0 flex max-h-full",
};

const translateClasses = {
  right: "translate-x-full",
  left: "-translate-x-full",
  top: "-translate-y-full",
  bottom: "translate-y-full",
};

export default function CustomDialog({
  open,
  onClose,
  position = "right", // default slide from right
  children,
}) {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10 " onClose={onClose}>
        {/* Overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur bg-opacity-30 transition-opacity" />
        </Transition.Child>

        {/* Panel Container */}
        <div className={`fixed ${positionClasses[position]} overflow-hidden  `}>
          <Transition.Child
            as={Fragment}
            enter="transform transition ease-out duration-300"
            enterFrom={translateClasses[position]}
            enterTo="translate-x-0 translate-y-0"
            leave="transform transition ease-in duration-200"
            leaveFrom="translate-x-0 translate-y-0"
            leaveTo={translateClasses[position]}
          >
            <Dialog.Panel className="w-screen md:max-w-sm  max-w-md bg-white  pt-20 shadow-xl">
              {children}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
