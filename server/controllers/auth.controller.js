   return res.status(500).json({ message: 'Server error' });
  }
};

export const me = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password').lean();

    if (!user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    return res.json({ user });
  } catch (err) {
    console.error('[me]', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
