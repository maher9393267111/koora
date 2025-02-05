import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';

const AdsComponent = dynamic(() => import('../components/AdsComponent'), { ssr: false });

const fetchMatches = async () => {
    const response = await fetch('http://localhost:3000/api/matches', {
        cache: 'no-store',
    });
    if (!response.ok) {
        throw new Error('Failed to fetch matches');
    }
    return response.json();
};

const MatchOverviewPage = async () => {
    let matches = [];
    let error = '';

    try {
        matches = await fetchMatches();
    } catch (err) {
        error = err.message;
    }

    return (
        <div className="min-h-screen bg-[#1a1f2e] overflow-x-hidden">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Live Matches</h1>
                    <p className="text-gray-400">Watch your favorite teams compete live</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 p-4 rounded-lg mb-4">
                        <p className="text-red-500 text-center">{error}</p>
                    </div>
                )}

                {/* Matches Grid */}
                <div className="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-1 gap-6 max-w-5xl mx-auto">
                    {matches.length > 0 ? (
                        matches.map((match) => (
                            <Link 
                                className="w-full transform hover:scale-[1.02] transition-all duration-200"
                                href={`/match/${match._id}`}
                                key={match._id}
                            >
                                <div className="bg-[#242a38] rounded-xl p-6 hover:bg-[#2a3040] transition-colors shadow-lg">
                                    {/* Tournament Name */}
                                    <div className="flex items-center mb-4">
                                        <span className="text-yellow-500 mr-2">🏆</span>

                                        <p className="text-gray-400 text-sm">{match.tournament}</p>
                                    </div>

                                    {/* Teams & Score */}
                                    <div className="flex items-center justify-between space-x-4">
                                        {/* Team A */}
                                        <div className="flex flex-col items-center w-1/3">
                                            <div className="relative w-14 h-14 mb-2">
                                                <Image
                                                    src={match.teamAImg}
                                                    alt={match.teamA}
                                                    fill
                                                    className="object-contain"
                                                />
                                            </div>
                                            <p className="text-white text-sm text-center">{match.teamA}</p>
                                        </div>

                                        {/* Score/Status */}
                                        <div className="flex flex-col items-center">
                                            {match.status === 'live' ? (
                                                <>
                                                    <div className="text-2xl font-bold text-white mb-1">
                                                        {match.scoreA ?? 0} - {match.scoreB ?? 0}
                                                    </div>
                                                    <span className="text-red-500 text-xs">
                                                        ● LIVE
                                                    </span>
                                                </>
                                            ) : (
                                                <div className="text-xl font-bold text-white">
                                                    VS
                                                </div>
                                            )}
                                        </div>

                                        {/* Team B */}
                                        <div className="flex flex-col items-center w-1/3">
                                            <div className="relative w-14 h-14 mb-2">
                                                <Image
                                                    src={match.teamBImg}
                                                    alt={match.teamB}
                                                    fill
                                                    className="object-contain"
                                                />
                                            </div>
                                            <p className="text-white text-sm text-center">{match.teamB}</p>
                                        </div>
                                    </div>

                                    {/* Watch Button */}
                                    <button className="w-full bg-[#1a66ff] hover:bg-[#1a5ae6] text-white rounded-lg py-3 font-medium transition-all duration-200 hover:shadow-lg mt-6">
                                        Watch Match
                                    </button>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="col-span-full">
                            <div className="bg-[#242a38] rounded-lg p-8 text-center shadow-lg">
                                <p className="text-gray-400 text-lg">No matches available at the moment.</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Bottom Ad Space */}
                <div className="mt-12">
                    <AdsComponent />
                </div>
            </div>
        </div>
    );
};

export default MatchOverviewPage;
