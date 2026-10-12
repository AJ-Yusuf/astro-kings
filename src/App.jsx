/* App.jsx — stadium-night stage, hash router + page switch */

import { useEffect } from 'react';
import { useRoute } from './lib/router.js';
import { TopNav, BookBar } from './components/Nav.jsx';
import { Home } from './pages/Home.jsx';
import { Browse } from './pages/Browse.jsx';
import { Venue } from './pages/Venue.jsx';
import { Booking } from './pages/Booking.jsx';
import { Privacy } from './pages/Privacy.jsx';
import { Leagues } from './pages/Leagues.jsx';
import { GetAGame } from './pages/GetAGame.jsx';
import { Parties } from './pages/Parties.jsx';
import { Events } from './pages/Events.jsx';
import { Coaching } from './pages/Coaching.jsx';
import { NottsOlympic } from './pages/NottsOlympic.jsx';
import { PerformanceZone } from './pages/PerformanceZone.jsx';
import { Shop } from './pages/Shop.jsx';
import { Contact } from './pages/Contact.jsx';

const PAGES = {
  home: () => <Home />,
  browse: () => <Browse />,
  venue: (params) => <Venue params={params} />,
  booking: (params) => <Booking params={params} />,
  privacy: () => <Privacy />,
  leagues: () => <Leagues />,
  getagame: () => <GetAGame />,
  parties: () => <Parties />,
  events: () => <Events />,
  coaching: () => <Coaching />,
  nottsolympic: () => <NottsOlympic />,
  performancezone: () => <PerformanceZone />,
  shop: () => <Shop />,
  contact: () => <Contact />,
};

export default function App(){
  const { name, params } = useRoute();
  const render = PAGES[name] || PAGES.home;
  // start every page at the top (hash links don't reset scroll on their own)
  useEffect(() => { window.scrollTo(0, 0); }, [name, params]);

  // persistent mobile Book-a-Pitch bar — everywhere except the booking flow itself
  const showBookBar = name !== 'booking';

  return (
    <div className="ak-stage">
      <div className="ak-grain"></div>
      <TopNav />
      {/* bottom padding on mobile stops the sticky bar overlapping page content */}
      <main id="main" tabIndex={-1} key={name} className={showBookBar ? 'pb-24 md:pb-0' : ''}>{render(params)}</main>
      {showBookBar ? <BookBar /> : null}
    </div>
  );
}
