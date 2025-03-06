import { Transition, Dialog } from "@headlessui/react";
import React, { useState, Fragment } from "react";

// Tooltip Component
interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  placement?: "top" | "bottom" | "left" | "right";
  arrow?: boolean;
  trigger?: "hover" | "click" | "visible";
  showArrow?: boolean;
}

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  placement = "top",
  trigger = "hover",
  showArrow = true,
}) => {
  const [isVisible, setIsVisible] = useState(trigger === "visible");

  const getPlacementClasses = () => {
    switch (placement) {
      case "bottom":
        return "top-full mt-2";
      case "left":
        return "right-full mr-2";
      case "right":
        return "left-full ml-2";
      case "top":
      default:
        return "bottom-full mb-2";
    }
  };

  const getArrowClasses = () => {
    switch (placement) {
      case "bottom":
        return "-top-2 left-1/2 -translate-x-1/2 border-b-gray-800 border-l-transparent border-r-transparent border-t-transparent";
      case "left":
        return "right-0 top-1/2 -translate-y-1/2 translate-x-2 border-l-gray-800 border-t-transparent border-b-transparent border-r-transparent";
      case "right":
        return "left-0 top-1/2 -translate-y-1/2 -translate-x-2 border-r-gray-800 border-t-transparent border-b-transparent border-l-transparent";
      case "top":
      default:
        return "-bottom-2 left-1/2 -translate-x-1/2 border-t-gray-800 border-l-transparent border-r-transparent border-b-transparent";
    }
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={
          trigger === "hover" ? () => setIsVisible(true) : undefined
        }
        onMouseLeave={
          trigger === "hover" ? () => setIsVisible(false) : undefined
        }
        onClick={
          trigger === "click" ? () => setIsVisible(!isVisible) : undefined
        }
        onKeyDown={
          trigger === "click"
            ? (e) => {
                if (e.key === "Enter" || e.key === " ")
                  setIsVisible(!isVisible);
              }
            : undefined
        }
        tabIndex={trigger === "click" ? 0 : undefined}
      >
        {children}
      </div>

      {isVisible ? (
        <div
          className={`absolute z-50 ${getPlacementClasses()} left-1/2 w-max max-w-[250px] -translate-x-1/2`}
        >
          <div className="relative rounded-md bg-gray-800 text-white shadow-lg">
            {content}
            {showArrow ? (
              <div
                className={`absolute h-0 w-0 border-8 ${getArrowClasses()}`}
              ></div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
};

// Button Component
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  color?: "primary" | "gray" | "danger";
  className?: string;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  color = "primary",
  className = "",
  disabled = false,
}) => {
  const getColorClasses = () => {
    switch (color) {
      case "primary":
        return "bg-fuchsia-600 hover:bg-fuchsia-500 text-white";
      case "danger":
        return "bg-red-600 hover:bg-red-500 text-white";
      case "gray":
      default:
        return "bg-gray-700 hover:bg-gray-600 text-white";
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors sm:text-base ${getColorClasses()} ${disabled ? "cursor-not-allowed opacity-50" : ""} ${className}`}
    >
      {children}
    </button>
  );
};

// Switch Component
interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

export const Switch: React.FC<SwitchProps> = ({ checked, onChange, label }) => {
  return (
    <label className="inline-flex cursor-pointer items-center">
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div
          className={`h-5 w-10 rounded-full transition-colors ${checked ? "bg-fuchsia-600" : "bg-gray-600"}`}
        ></div>
        <div
          className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${checked ? "translate-x-5 transform" : ""}`}
        ></div>
      </div>
      {label ? (
        <span className="ml-3 text-sm font-medium text-gray-300">{label}</span>
      ) : null}
    </label>
  );
};

// Modal Components
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/75" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-800 text-left align-middle shadow-xl transition-all">
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export const ModalContent: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <div>{children}</div>;
};

export const ModalHeader: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="p-6 pb-3 text-lg font-medium leading-6 text-white">
      {children}
    </div>
  );
};

export const ModalBody: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <div className="p-6 pb-3 pt-3">{children}</div>;
};

export const ModalFooter: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <div className="flex justify-end space-x-3 p-6 pt-3">{children}</div>;
};

// Tabs Components
interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  value,
  onValueChange,
  children,
  className = "",
}) => {
  return (
    <div className={`flex border-b border-gray-700 ${className}`}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            isActive: child.props.value === value,
            onClick: () => onValueChange(child.props.value),
          });
        }
        return child;
      })}
    </div>
  );
};

interface TabProps {
  value: string;
  children: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
}

export const Tab: React.FC<TabProps> = ({ children, isActive, onClick }) => {
  return (
    <button
      className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
        isActive
          ? "border-fuchsia-500 text-fuchsia-400"
          : "border-transparent text-gray-400 hover:border-gray-500 hover:text-gray-300"
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

// Textarea Component
interface TextareaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
}

export const Textarea: React.FC<TextareaProps> = ({
  value,
  onChange,
  placeholder = "",
  rows = 3,
}) => {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className="w-full rounded-md border border-gray-600 bg-gray-700 p-2 text-white focus:border-fuchsia-500 focus:outline-none focus:ring-fuchsia-500"
    />
  );
};

// Badge Component
interface BadgeProps {
  children: React.ReactNode;
  color?: "primary" | "success" | "warning" | "danger" | "info";
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  color = "primary",
}) => {
  const getColorClasses = () => {
    switch (color) {
      case "success":
        return "bg-green-500 text-white";
      case "warning":
        return "bg-yellow-500 text-gray-900";
      case "danger":
        return "bg-red-500 text-white";
      case "info":
        return "bg-blue-500 text-white";
      case "primary":
      default:
        return "bg-fuchsia-500 text-white";
    }
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getColorClasses()}`}
    >
      {children}
    </span>
  );
};

// Radio Group Component
interface RadioGroupProps {
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  value,
  onChange,
  children,
  className = "",
}) => {
  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            // @ts-expect-error TODO: Fix this
            checked: child.props.value === value,
            onChange: () => onChange(child.props.value),
          });
        }
        return child;
      })}
    </div>
  );
};

interface RadioProps {
  value: string;
  children: React.ReactNode;
  checked?: boolean;
  onChange?: () => void;
}

export const Radio: React.FC<RadioProps> = ({
  value,
  children,
  checked = false,
  onChange,
}) => {
  return (
    <label
      className="inline-flex cursor-pointer items-center"
      aria-label="Radio Button"
    >
      <div className="relative flex items-center">
        <input
          type="radio"
          className="sr-only"
          value={value}
          checked={checked}
          onChange={onChange}
        />
        <div
          className={`h-5 w-5 rounded-full border ${checked ? "border-fuchsia-500" : "border-gray-500"} flex items-center justify-center`}
        >
          {checked ? (
            <div className="h-3 w-3 rounded-full bg-fuchsia-500"></div>
          ) : null}
        </div>
        <span className="ml-2 text-sm font-medium text-gray-300">
          {children}
        </span>
      </div>
    </label>
  );
};
