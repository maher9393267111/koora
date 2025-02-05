import React from 'react';
import Image from 'next/image';

const fetchMatch = async (matchId) => {
  try {
    const baseUrl = process.env.NODE_ENV === 'production' ? "https://koora-rouge.vercel.app" : 'http://localhost:3000';
    const response = await fetch(`https://koora-rouge.vercel.app/api/matches/${matchId}`, {
      cache: 'no-store' // Disable cache to ensure fresh data
    });
    

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Fetch error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`Failed to fetch match data: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching match:', error);
    throw error;
  }
};

const MatchPage = async ({ params }) => {
  const matchId = params.id;
  console.log(matchId, "matchId");
  let match;
  let error = null;

  try {
    match = matchId ? await fetchMatch(matchId) : null;
  } catch (err) {
    error = err.message;
    console.error('Error in MatchPage:', err);
  }

  if (error) return <div className="text-red-500 p-4">{error}</div>;
  if (!match) return <div className="text-gray-500 p-4">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        {/* Match Header */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 shadow-xl rounded-xl mb-4 sm:mb-8 p-4 sm:p-6 border border-gray-700">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-6 sm:space-y-0">
            {/* Team A */}
            <div className="flex flex-col items-center w-full sm:w-1/3">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-2 sm:mb-4 transform hover:scale-110 transition-transform">
                <Image
                  src={match.teamAImg}
                  alt={`${match.teamA} logo`}
                  fill
                  className="object-contain drop-shadow-lg"
                />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white text-center">{match.teamA}</h2>
            </div>
            
            {/* Score/Time Section */}
            <div className="flex flex-col items-center w-full sm:w-1/3 order-first sm:order-none">
              <div className="bg-gray-700 px-6 sm:px-8 py-3 sm:py-4 rounded-lg w-full sm:w-auto flex flex-col items-center">
                {match.status === 'live' ? (
                  <>
                    <div className="text-3xl sm:text-4xl font-bold text-white mb-2">
                      {match.scoreA ?? 0} - {match.scoreB ?? 0}
                    </div>
                    <div className="text-red-500 font-semibold animate-pulse text-sm sm:text-base">
                      ● LIVE
                    </div>
                  </>
                ) : (
                  <div className="text-xl sm:text-2xl font-bold text-white">
                    VS
                  </div>
                )}
              </div>
              <div className="mt-2 sm:mt-4 text-gray-300 text-sm sm:text-base text-center">
                {new Date(match.matchDate).toLocaleDateString('en-GB', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
              <div className="text-gray-400 text-sm sm:text-base">
                {new Date(match.matchDate).toLocaleTimeString()} GMT
              </div>
            </div>

            {/* Team B */}
            <div className="flex flex-col items-center w-full sm:w-1/3">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-2 sm:mb-4 transform hover:scale-110 transition-transform">
                <Image
                  src={match.teamBImg}
                  alt={`${match.teamB} logo`}
                  fill
                  className="object-contain drop-shadow-lg"
                />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white text-center">{match.teamB}</h2>
            </div>
          </div>
        </div>

        {/* Tournament Info */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 shadow-xl rounded-xl mb-4 sm:mb-8 p-4 sm:p-6 border border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
            <div className="flex items-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-700 rounded-full flex items-center justify-center mr-3 sm:mr-4">
                <span className="text-yellow-500 text-sm sm:text-base">🏆</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                {match.tournament}
              </h2>
            </div>
            <div className="flex items-center text-sm sm:text-base">
              <span className="text-gray-400 mr-2">Venue:</span>
              <span className="text-white">{match.venue || 'TBD'}</span>
            </div>
          </div>
        </div>

        {/* Match Stream Section */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 shadow-xl rounded-xl">
          <div className="p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center">
              {match.status === 'live' && (
                <span className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full mr-2 sm:mr-3 animate-pulse"></span>
              )}
              {match.status === 'live' ? 'Live Match Stream' : 'Match Coverage'}
            </h2>
            <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
              {match.status === 'live' && match.videoUrl ? (
                <iframe
                  src={match.videoUrl}
                  width="100%"
                  height="100%"
                  allowFullScreen
                  title="Match Video"
                  className="w-full h-full"
                ></iframe>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <div className="text-center p-4">
                    <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">📺</div>
                    <p className="text-sm sm:text-base">
                      {match.status === 'live'
                        ? 'Stream will begin shortly'
                        : 'Match coverage not available'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchPage;
