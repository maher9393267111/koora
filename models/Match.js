// models/Match.js
import mongoose from 'mongoose';

const MatchSchema = new mongoose.Schema({
    teamA: { type: String, required: true },
    teamB: { type: String, required: true },
    status: { type: String, enum: ['in-time', 'live', 'end'], required: true },
    videoUrl: { type: String },
    matchDate: { type: Date },
    tournament: { type: String, required: true },
    teamAImg: { type: String },
    teamBImg: { type: String },
});

export default mongoose.models.Match || mongoose.model('Match', MatchSchema);
