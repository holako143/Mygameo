// The authentication system is temporarily disabled to allow for guest mode.
// This file is intentionally left with a placeholder export.

export default function handler(req, res) {
  res.status(404).json({ message: 'Authentication is disabled.' });
}
