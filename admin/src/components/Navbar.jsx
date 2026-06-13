import { Link } from "react-router-dom";

const Navbar = ({ setToken }) => {
  return (
    <header className='flex py-2 px-[4%] justify-between'>
      <Link to="/" className="flex items-center gap-2">
        <img
          src="/shopwear.png"
          alt="ShopWear Logo"
          className="w-8 h-8 object-contain brightness-0"
        />

        <h1 className="text-[30px] font-semibold">
          ShopWear Admin
        </h1>
      </Link>
      <button onClick={() => setToken("")}
        className='bg-gray-900 hover:bg-gray-800 text-white px-3 py-2 sm:px-7 sm:py-1 rounded-md cursor-pointer'
      >
        Logout
      </button>
    </header>
  );
};

export default Navbar;
