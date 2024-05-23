import { useState, useEffect, useRef } from 'react';
import '../stylesheets/schedule.css';
import LoadingScreen from './LoadingScreen';
import { useNavigate } from 'react-router-dom';

type Match = {
  _id: string;
  date: string;
  time: string;
  home: {
    _id: string;
    name: string;
    president: string;
    director: string;
    coach: string;
    logoPath: string;
    season: number;
    __v: number;
  };
  away: {
    _id: string;
    name: string;
    president: string;
    director: string;
    coach: string;
    logoPath: string;
    season: number;
    __v: number;
  };
  score: string;
  location: string;
  stadium: {
    location: {
      type: string;
      coordinates: [number, number];
    };
    _id: string;
    name: string;
    teamId: string;
    capacity: number;
    buildYear: number;
    imageUrl: string;
    season: number;
    __v: number;
  };
  season: number;
  __v: number;
};

function Schedule() {
  const navigate = useNavigate();

  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true); // State to track loading
  const myRef = useRef<HTMLDivElement | null>(null);

  const [sport, setSport] = useState(() => {
    const storedSport = localStorage.getItem("scheduleSportS");
    return storedSport ? storedSport : "nogomet";
  });
  useEffect(() => {
    localStorage.setItem("scheduleSportS", sport);
  }, [sport])

  const [showScrollButton, setShowScrollButton] = useState(false);
  const defaultScrollPositionRef = useRef(0);
 
  // SCROLLS TO TODAY MATCHES
  useEffect(() => {
    if (myRef.current) {
      const rect = myRef.current.getBoundingClientRect();
      const scrollOffset = rect.top + window.scrollY - window.innerHeight / 4;
      window.scrollTo({ top: scrollOffset, behavior: 'instant' });
      defaultScrollPositionRef.current = scrollOffset;
    }
  }, [matches]);

  
  // BUTTON CLICK TO SCROLL TO DEFAULT
  const scrollToToday = () => {
    window.scrollTo({ top: defaultScrollPositionRef.current, behavior: 'smooth' });
  };

  // GET SCROLL y POSTION
  const handleScroll = () => {
    const position = window.scrollY;
    setShowScrollButton(Math.abs(defaultScrollPositionRef.current - position) > 400); // Show button when scrolled down by 400px
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // GETS FOOTBALL MATCHES
  const getFootballMatches = async (year: number) => {
    try {
      const response = await fetch('http://localhost:3000/footballMatch/filterBySeason/' + year);
      const data = await response.json();
      if (response.ok) {
        setMatches(data);
      } else {
        console.error('Failed to fetch football matches');
      }
    } catch (error) {
      console.error('Error fetching football matches:', error);
    } finally {
        setLoading(false);
    }
  };

  // GETS HANDBALL MATCHES
  const getHandballMatches = async (year: number) => {
    try {
      const response = await fetch('http://localhost:3000/handballMatch/filterBySeason/' + year);
      const data = await response.json();
      if (response.ok) {
        setMatches(data);
      } else {
        console.error('Failed to fetch football matches');
      }
    } catch (error) {
      console.error('Error fetching football matches:', error);
    } finally {
        setLoading(false);
    }
  };

  // RENDER MATCHES ON LOAD OR SPORT CHANGE
  useEffect(() => {
    setLoading(true);
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    if (sport === "nogomet") {getFootballMatches(year);}
    else {getHandballMatches(year)}
  }, [sport]);

  // CHANGE DATE FORMAT
  const formatDateString = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    let dayOfWeek = new Intl.DateTimeFormat('sl-SI', { weekday: 'long' }).format(date);

    if (date.toDateString() === today.toDateString()) {
      dayOfWeek = "Danes";
    } else if (date.toDateString() === yesterday.toDateString()) {
      dayOfWeek = "Včeraj";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      dayOfWeek = "Jutri";
    }

    const day = new Intl.DateTimeFormat('sl-SI', { day: 'numeric' }).format(date);
    const month = new Intl.DateTimeFormat('sl-SI', { month: 'long' }).format(date);
    return `${dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1)} - ${day} ${month}`;
  };

  // CHANGE SPORT FILTER
  const handleSportChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSport = event.target.value;
    setSport(selectedSport);
  };
  
  // SORT MATCHES BY DATE
  const matchesByDate = matches.reduce((acc, match) => {
    if (!acc[match.date]) {
      acc[match.date] = [];
    }
    acc[match.date].push(match);
    return acc;
  }, {} as Record<string, Match[]>);

  let firstEmptyScoreFound = false; 

  const sportToEnglish = (sport: string): string => {
    if (sport === "nogomet") {return "football"};
    return "handball";
  }

  // LOADING SCREEN
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="center2">
        {showScrollButton && (
        <button onClick={scrollToToday} className="return-scroll">
          Danes
        </button>
      )}
      <div className="select-container">
        <select id="sport-filter" onChange={handleSportChange}>
            <option value={sport}>{sport}</option>
            <option value={(sport === "nogomet") ? "rokomet" : "nogomet"}>{(sport === "nogomet") ? "rokomet" : "nogomet"}</option>
        </select>
      </div>
      {Object.entries(matchesByDate).map(([date, dateMatches]) => (
        <div key={date} className="date-group">
          <div className="date-container">
            <h2>{formatDateString(date)}</h2>
          </div>
          {dateMatches.map((match) => {
            if (match.score === "" && !firstEmptyScoreFound) {
              firstEmptyScoreFound = true;
              return (
                <div ref={myRef} key={match._id} className="match" id={match._id}>
                  <div></div>
                  <h2>{match.home.name}</h2>
                  <div className="center-wrapper">
                    <div onClick={() => navigate("/" + sportToEnglish(sport) + "Team/" + match.home._id)} className="home-team">
                      <img id="team-logo" src={match.home.logoPath} alt="home team logo" />
                    </div>
                    <div className="score-container">
                      <h1 id="score">{match.score === '' ? '- : -' : match.score}</h1>
                    </div>
                    <div onClick={() => navigate("/" + sportToEnglish(sport) + "Team/" + match.away._id)} className="away-team">
                      <img id="team-logo" src={match.away.logoPath} alt="away team logo" />
                    </div>
                  </div>
                  <h2>{match.away.name}</h2>
                  <div className="stadium-container">
                    <p>{match.stadium.name}</p>
                    <img id="stadium-logo" src={match.stadium.imageUrl} alt="stadium photo" />
                  </div>
                </div>
              );
            } else {
              return (
                <div key={match._id} className="match" id={match._id}>
                  <div></div>
                  <h2>{match.home.name}</h2>
                  <div className="center-wrapper">
                    <div onClick={() => navigate("/" + sportToEnglish(sport) + "Team/" + match.home._id)} className="home-team">
                      <img id="team-logo" src={match.home.logoPath} alt="home team logo" />
                    </div>
                    <div className="score-container">
                      <h1 id="score">{match.score === '' ? '- : -' : match.score}</h1>
                    </div>
                    <div onClick={() => navigate("/" + sportToEnglish(sport) + "Team/" + match.away._id)} className="away-team">
                      <img id="team-logo" src={match.away.logoPath} alt="away team logo" />
                    </div>
                  </div>
                  <h2>{match.away.name}</h2>
                  <div className="stadium-container">
                    <p>{match.stadium.name}</p>
                    <img id="stadium-logo" src={match.stadium.imageUrl} alt="stadium photo" />
                  </div>
                </div>
              );
            }
          })}
        </div>
      ))}
    </div>
  );
}

export default Schedule;
