import { F1SeasonProvider } from './context/F1SeasonContext.jsx';
import Ticker from './components/Ticker.jsx';
import Hero from './components/Hero.jsx';
import Race from './components/Race.jsx';
import Calendar from './components/Calendar.jsx';
import Standings from './components/Standings.jsx';
import Stats from './components/Stats.jsx';
import Footer from './components/Footer.jsx';
import GoLive from './components/GoLive.jsx';
import ColophonModal from './components/ColophonModal.jsx';
import RaceDetailsDrawer from './components/RaceDetailsDrawer.jsx';

const App = () => {
  return (
    <F1SeasonProvider>
      <Ticker />
      <Hero />
      <Race />
      <Calendar />
      <Standings />
      <Stats />
      <GoLive />
      <Footer />
      <ColophonModal />
      <RaceDetailsDrawer />
    </F1SeasonProvider>
  );
};

export default App;
