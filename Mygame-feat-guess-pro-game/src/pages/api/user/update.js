// This will be implemented in a later step
import connectMongo from '@/lib/mongodb';
import User from '@/models/User';

export default async function handler(req, res) {
  await connectMongo();

  if (req.method === 'POST') {
    const { email, points, bravePoints } = req.body;
    await User.updateOne({ email }, { $inc: { points, bravePoints } });
    res.status(200).json({ message: 'User updated' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}