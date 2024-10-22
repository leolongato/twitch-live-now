export const BasePage: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen max-w-full overflow-hidden bg-zinc-800">
      {children}
    </div>
  );
};
