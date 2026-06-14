import "../index.css";

import Container from "../layout/Container";
import Hero from "../components/Hero";
import LatestCollections from "../components/LatestCollections";
import BestSeller from "../components/BestSeller";
import OurPolicy from "../components/OurPolicy";


const Home = () => {


  return (
    <Container>
      <Hero />
      <LatestCollections />
      <BestSeller />
      <OurPolicy />
    </Container>
  );
};

export default Home;




