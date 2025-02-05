import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const MatchCard = ({ match }) => {
    const { _id, teamA, teamB, status, matchDate, teamAImg, teamBImg } = match;

    return (
        <Link className=" transform transition duration-300 hover:scale-105 w-[100%] md:w-[90%] lg:w-[60%] min-h-42" href={`/match/${_id}`}>
            <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-2 w-1/3">
                    
                        <Image
                            src={teamAImg}
                            alt={`${teamA} logo`}
                            width={80}
                            height={80}
                            className="rounded-full object-cover"
                        />
                   
                    <span className="font-semibold text-teal-800">{teamA}</span>
                </div>
                <div className="flex flex-col items-center w-1/3">
                    <span className="text-teal-600 font-bold mb-1">{status}</span>
                    <span className="text-sm text-gray-500">{new Date(matchDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-end space-x-2 w-1/3">
                    <span className="font-semibold text-teal-800">{teamB}</span>
                   
                        <Image
                            src={teamBImg}
                            alt={`${teamB} logo`}
                            width={80}
                            height={80}
                            className="rounded-full object-cover"
                        />
                 
                </div>
            </div>
        </Link>
    );
};

export default MatchCard;
