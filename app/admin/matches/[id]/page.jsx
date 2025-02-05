// app/admin/matches/[id]/page.jsx

"use client"; // Ensure this is a client component

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Use next/navigation for client-side routing

const EditMatchPage = () => {
    const router = useRouter();
    const [id, setId] = useState('');
    const [match, setMatch] = useState(null);
    const [teamA, setTeamA] = useState('');
    const [teamB, setTeamB] = useState('');
    const [status, setStatus] = useState('in-time');
    const [videoUrl, setVideoUrl] = useState('');
    const [matchDate, setMatchDate] = useState('');
    const [tournament, setTournament] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        // Extract ID from the URL
        const pathParts = window.location.pathname.split('/');
        const currentId = pathParts[pathParts.length - 1];
        setId(currentId);

        if (currentId) {
            const fetchMatch = async () => {
                try {
                    const response = await fetch(`/api/matches/${currentId}`);
                    if (response.ok) {
                        const data = await response.json();
                        setMatch(data);
                        setTeamA(data.teamA);
                        setTeamB(data.teamB);
                        setStatus(data.status);
                        setVideoUrl(data.videoUrl);
                        setMatchDate(data.matchDate);
                        setTournament(data.tournament);
                    } else {
                        setError('Failed to load match data');
                    }
                } catch (error) {
                    setError('Failed to load match data');
                }
            };
            fetchMatch();
        }
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(`/api/matches/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ teamA, teamB, status, videoUrl, matchDate, tournament }),
            });

            if (response.ok) {
                router.push('/admin/matches');
            } else {
                const { message } = await response.json();
                setError(message);
            }
        } catch (error) {
            setError('Failed to update match');
        }
    };

    if (!match) return <div>Loading...</div>;

    return (
        <div>
            <h1>Edit Match</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Team A:
                    <input
                        type="text"
                        value={teamA}
                        onChange={(e) => setTeamA(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Team B:
                    <input
                        type="text"
                        value={teamB}
                        onChange={(e) => setTeamB(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Status:
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        required
                    >
                        <option value="in-time">In Time</option>
                        <option value="live">Live</option>
                        <option value="end">End</option>
                    </select>
                </label>
                <label>
                    Video URL:
                    <input
                        type="url"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                    />
                </label>
                <label>
                    Match Date:
                    <input
                        type="date"
                        value={matchDate}
                        onChange={(e) => setMatchDate(e.target.value)}
                    />
                </label>
                <label>
                    Tournament:
                    <input
                        type="text"
                        value={tournament}
                        onChange={(e) => setTournament(e.target.value)}
                        required
                    />
                </label>
                {error && <p>{error}</p>}
                <button type="submit">Update Match</button>
            </form>
        </div>
    );
};

export default EditMatchPage;
