const Loading = ({ text = "Loading..." }) => {
  return (
    <div className="flex min-h-[36vh] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-black"></div>
        <p className="text-sm text-gray-500">{text}</p>
      </div>
    </div>
  );
};

export default Loading;
