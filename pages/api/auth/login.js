import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const SECRET = process.env.JWT_SECRET;

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { username, password } = req.body;

        const user = {
            username: 'admin',
            password: await bcrypt.hash('admin', 10)  
        };

        if (username === user.username && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ username }, SECRET, { expiresIn: '1h' });
            res.status(200).json({ token });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } else {
        res.status(405).end();
    }
}
