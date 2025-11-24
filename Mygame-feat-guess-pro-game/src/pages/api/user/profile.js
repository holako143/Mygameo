// This will be implemented in a later step
import connectMongo from '@/lib/mongodb';
import User from '@/models/User';

export default async function handler(req, res) {
  await connectMongo();

  if (req.method === 'GET') {
    const { email } = req.query;
    const user = await User.findOne({ email });
    res.status(200).json(user);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}