import React from "react";

interface PaginationButtonProps {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
}

export const PaginationButton: React.FC<PaginationButtonProps> = ({
  children,
  ...props
}) => {
  return (
    <button
      className="flex items-center justify-center rounded-lg size-8 bg-zinc-700 text-zinc-100 disabled:pointer-events-none disabled:bg-zinc-900/80 hover:ring-1 hover:ring-offset-1 hover:ring-offset-zinc-500 hover:ring-zinc-500"
      {...props}
    >
      {children}
    </button>
  );
};
