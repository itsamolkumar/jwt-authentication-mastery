import User from "../Models/userModel.js";

export const userData = async (req, res) => {
  
  try {
    const userId = req.authUserId; // ✅ Correct way
    // console.log("User ID from middleware:", req.userId); // ✅ ADD THIS LINE

    const currUser = await User.findById(userId);
    if (!currUser) {
      return res.json({ success: false, message: "Please login first" });
    }
    return res.json({
      success: true,
      userData: {
        name: currUser.name,
        isAccountVerified: currUser.isAccountVerified,
      },
    }); 
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};
