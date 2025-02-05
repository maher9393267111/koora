import dbConnect from '../../../utils/db';
import Match from '../../../models/Match';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure Multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = './public/uploads';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Multer upload configuration
const upload = multer({ storage: storage });

// Middleware to handle file uploads
const uploadMiddleware = upload.fields([
    { name: 'teamAImg' }, 
    { name: 'teamBImg' }
]);

// Disable Next.js bodyParser to use multer
export const config = {
    api: {
        bodyParser: false 
    }
};

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === 'GET') {
        try {
            const matches = await Match.find({});
            return res.status(200).json(matches);
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching matches' });
        }
    } else if (req.method === 'POST') {
        // Handle image upload using multer
        uploadMiddleware(req, res, async function (err) {
            if (err) {
                return res.status(400).json({ message: 'Error uploading images' });
            }

            try {
                // Extract data from the request
                const { teamA, teamB, status, videoUrl, matchDate, tournament } = req.body;

                // Log the files for debugging
                console.log('Uploaded files:', req.files);

                // Create a new match document with image paths
                const match = new Match({
                    teamA,
                    teamB,
                    status,
                    videoUrl,
                    matchDate,
                    tournament,
                    teamAImg: req.files?.teamAImg ? `/uploads/${req.files.teamAImg[0].filename}` : null,
                    teamBImg: req.files?.teamBImg ? `/uploads/${req.files.teamBImg[0].filename}` : null
                });

                // Save the match to the database
                await match.save();
                return res.status(201).json(match);
            } catch (error) {
                console.error('Error creating match:', error);
                return res.status(400).json({ message: 'Error creating match' });
            }
        });
    } else {
        return res.status(405).json({ message: 'Method not allowed' });
    }
}