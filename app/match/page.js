// app/match/page.jsx

import React from 'react';
import Link from 'next/link';

const fetchMatches = async () => {
    const baseUrl = process.env.NODE_ENV === 'production' ? "https://koora-rouge.vercel.app" : 'http://localhost:3000';
    const response = await fetch(`https://koora-rouge.vercel.app/api/matches`, {
        cache: 'no-store', // Ensure fresh data on each request
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
        <div className="min-h-screen bg-gray-100 p-4">
            <h1 className="text-3xl font-bold mb-4">Match Overview</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <ul className="space-y-4">
                {matches.length > 0 ? (
                    matches.map((match) => (
                        <li key={match._id} className="bg-white p-4 rounded shadow-md">
                            <div className="font-bold">{match.teamA} vs {match.teamB}</div>
                            <div>Status: {match.status}</div>
                            <div>Tournament: {match.tournament}</div>
                            <Link href={`/match/${match._id}`} className="text-blue-500 hover:underline">
                                View Details
                            </Link>
                        </li>
                    ))
                ) : (
                    <p>No matches available.</p>
                )}
            </ul>
        </div>
    );
};

export default MatchOverviewPage;
