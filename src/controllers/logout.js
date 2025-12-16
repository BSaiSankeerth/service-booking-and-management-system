const logout = (req, res) => {
  res.status(200).json({
    message: "Logout successful. Please remove token on client side."
  });
};

export default logout;
