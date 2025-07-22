import React from 'react';


const MainPageLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <main className="relative  flex w-full flex-col items-start justify-start gap-3 overflow-y-auto px-3">
      {children}
    </main>
  );
};

export default MainPageLayout;

