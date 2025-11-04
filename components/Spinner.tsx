
import React from 'react';

const Spinner: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => {
  return (
    <div
      className={`${className} animate-spin rounded-full border-4 border-solid border-blue-500 border-t-transparent`}
    ></div>
  );
};

export default Spinner;
