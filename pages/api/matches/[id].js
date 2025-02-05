import dbConnect from '../../../utils/db';
import Match from '../../../models/Match';

export default async function handler(req, res) {
    await dbConnect();
    const { id } = req.query;

    if (req.method === 'GET') {
        try {
            const match = await Match.findById(id);
            if (match) {
                res.status(200).json(match);
            } else {
                res.status(404).json({ message: 'Match not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error fetching match' });
        }
    } else if (req.method === 'PUT') {
        try {
            const match = await Match.findByIdAndUpdate(id, req.body, { new: true });
            if (match) {
                res.status(200).json(match);
            } else {
                res.status(404).json({ message: 'Match not found' });
            }
        } catch (error) {
            res.status(400).json({ message: 'Error updating match' });
        }
    } else if (req.method === 'DELETE') {
        try {
            const match = await Match.findByIdAndDelete(id);
            if (match) {
                res.status(204).end();
            } else {
                res.status(404).json({ message: 'Match not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error deleting match' });
        }
    } else {
        res.status(405).end(); 
    }
}
