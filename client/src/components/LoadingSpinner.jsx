// LoadingSpinner.js

const LoadingSpinner = () => {
  return (
    <div className="flex w-full h-full justify-center items-center">
      <div className="custom-spin rounded-full h-8 w-8 border-t-4 border-b-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-spin"></div>
    </div>
  );
};

export default LoadingSpinner;
