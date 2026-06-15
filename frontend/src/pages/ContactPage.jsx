import { useNavigate } from "react-router-dom";

import Title from "../components/Title";
import Container from "../layout/Container";
import Button from "../components/Button";

const ContactPage = () => {



  const navigate = useNavigate();



  return (
    <Container>
      <div className="text-2xl pt-10 border-t-[0.063rem] text-center border-gray-200">
        <Title text1="contact" text2="us" />
      </div>
      <div className="flex flex-col justify-center gap-10 my-10 md:flex-row mb-28">
        <img
          src="/images/contact_img.png"
          className="w-full max-w-[30rem]"
          alt="contact_img"
        />
        <div className="flex flex-col justify-center gap-6 items-start">
          <p className="text-gray-600 font-semibold text-xl">Our Store</p>
          <p className="text-gray-500">
            ShopWear
            <br />
            42 Park Street
            <br />
            Kolkata, West Bengal 700016, India
          </p>
          {/* <p className="text-gray-500">
            ShopWear 354 Fashion Lane
            <br></br>
            Los Angeles, SC 45678, USA
          </p> */}
          <p className="text-gray-500">
            Tel: (+91) 9876-543-210
            <br></br>
            Email: contact.shopwear@info.com
          </p>
          <p className="text-gray-600 font-semibold text-xl">
            Careers at Forever
          </p>
          <p className="text-gray-500">
            Join us at ShopWear! Explore job openings and help shape the future
            of fashion.
            <br></br>
            Explore our current job openings and discover how you can contribute
            to our mission of setting trends and creating style.
          </p>

          <Button
            size="medium"
            onClick={() => navigate("/careers")}
            className="w-[9.1rem] bg-transparent border border-black text-black transition-all duration-500 hover:bg-gray-800 hover:text-white"
          >
            Explore Jobs
          </Button>

          {/* <Button
            size="medium"
            className="w-[9.1rem] bg-transparent border border-black text-black transition-all duration-500 hover:bg-gray-800 hover:text-white"
          >
            Explore Jobs
          </Button> */}
        </div>
      </div>

    </Container>
  );
};

export default ContactPage;
