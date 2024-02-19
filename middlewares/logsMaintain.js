// // nodejs-deployment/controllers/loginOutController.js
//  // make sure to create this model

// const loginUser = async(req, res) => {
//     try {
//         // your existing login code here...

//         // after successful login
//         const loginLog = new LoginLogoutLog({ userId: user._id, loginTime: new Date() });
//         await loginLog.save();

//         return res.status(200).json({ 
//             success: true,
//             message: "Login Successful",
//             data: user
//         });

//     } catch (error) {
//         return res.status(400)
//         .json({ success: false, 
//             error: error.message });
//     }
// }

// const logout = async(req, res) => {
//     try {
//         // your existing logout code here...

//         // after successful logout
//         const logoutLog = await LoginLogoutLog.findOne({ userId: bearerToken, logoutTime: null });
//         if (logoutLog) {
//             logoutLog.logoutTime = new Date();
//             await logoutLog.save();
//         }

//         return res.status(200).json({ 
//             success: true,message: "Logout Successful"
//         });
        
//     } catch (error) {
//         return res.status(400)
//         .json({ success: false, 
//             error: error.message });
        
//     }
// }



// module.exports = {
//     loginUser,
//     logout,
//     getTotalLoginLogout
// }

// // nodejs-deployment/models/user/loginLogoutLogModel.js


// // nodejs-deployment/routes/user/userRoutes.js
// router.get('/getTotalLoginLogout/:userId', verifyToken, getTotalLoginLogout)


// const getLoginLogoutByDate = async (req, res) => {
//     try {
//         const userId = req.body.userId;
//         const logs = await LoginLogoutLog.find({ userId });

//         const loginLogoutTimingsByDate = {};
        
//         logs.forEach(log => {
//             const date = log.loginTime.toISOString().split('T')[0]; // get date from loginTime
//             if (!loginLogoutTimingsByDate[date]) {
//                 loginLogoutTimingsByDate[date] = [];
//             }

//             loginLogoutTimingsByDate[date].push({
//                 loginTime: log.loginTime,
//                 logoutTime: log.logoutTime
//             });
//         });

//         return res.status(200).json({ 
//             success: true, 
//             loginLogoutTimingsByDate
//         });

//     } catch (error) {
//         return res.status(400)
//         .json({ success: false, 
//             error: error.message });
//     }
// }




// const getTotalLoginLogout = async (req, res) => {
//     try {
//         const userId = req.body.userId; // get user id from route params
//         const logs = await LoginLogoutLog.find({ userId });

//         const loginLogoutTimings = logs.map(log => ({
//             loginTime: log.loginTime,
//             logoutTime: log.logoutTime
//         }));


//         const totalLogins = logs.length;
//         const totalLogouts = logs.filter(log => log.logoutTime !== null).length;

//         return res.status(200).json({ 
//             success: true, 
//             loginLogoutTimings,
//             totalLogins, 
//             totalLogouts 
//         });

//     } catch (error) {
//         return res.status(400)
//         .json({ success: false, 
//             error: error.message });
        
//     }
// }

// const createProfile = async (req, res) => {
    
//     try {
//       const nextId = await getNextUserId();

//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         return res.status(400).json({ success: false, error: errors.array() });
//       }
      
//       const {
//         email,
//         firstName,
//         lastName,
//         mobile,
//         department,
//         designation,
//         role,
//         password,
//         profilePhoto
//       } = req.body;


//       const existingProfile = await Profile.findOne({ email: email });
//       if (existingProfile) {
//         return res.status(400).json({
//           success: false,
//           error: "User with this Email already exist in the profile",
//         });
//       }

//       const existingUser = await User.findOne({ email: email });
//       if (existingUser) {
//         // Set the existing values
//         firstName = existingUser.firstName;
//         lastName = existingUser.lastName;
//         password = existingUser.password;

//         // Prompt the user for the remaining data
//         return res.status(400).json({
//           success: false,
//           error: "User with this Email already exists. Please provide the following remaining data",
//           firstName,
//           lastName,
//           password
//         });
//       }
      
//       //create username using fullName
//       const mergedName = generateUsername(firstName, lastName);

//       const saltRounds = 10;
//       const hashedPassword = await bcrypt.hash(password, saltRounds);

//       // Update profile's role
//       const updatedProfile = new Profile({
//         userId: nextId,
//         email,
//         firstName,
//         lastName,
//         mobile,
//         department,
//         designation,
//         role,
//         username: mergedName,
//         password: hashedPassword,
//         profilePhoto,
//       });


//       const savedUser = await updatedProfile.save();

//       // Upload profile photo to Google Drive after saving user data to MongoDB
//       try {
//         const userId = savedUser.userId;
//         const photoPath = savedUser.profilePhoto;
//         // Assuming savedUser is the user object returned after saving to MongoDB
//         const fileId = await uploadProfilePhotoToDrive(userId, photoPath);

//         // Update the user's profilePhoto field with the Google Drive file ID
//         savedUser.profilePhoto = fileId;
//       } catch (error) {
//         console.error('Error occurred:', error);
//         res.status(500).json({
//           success: false,
//           message: "Error occurred while uploading photo and updating user's profile",
//         });
//       }
    

//       res.status(200).json({
//         success: true,
//         message: "Profile created successfully",
//         data: updatedProfile,
//       });
//     } catch (error) {
//         res.status(400).json({ 
//             success: false, 
//             error: error.message });
//     }
// };

// <<<<<<<<<<<<<<  ✨ Codeium Command ⭐ >>>>>>>>>>>>>>>>
// // Create a new schema for salary details
// const mongoose = require('mongoose');

// const salarySchema = new mongoose.Schema({
//     userId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Profile',
//     },
//     allowances: {
//         type: Number,
//         required: true
//     },
//     deductions: {
//         type: Number,
//         required: true
//     },
//     // Add more fields as needed for salary details

// });

// // Create a model for the Salary collection
// const Salary = mongoose.model('Salary', salarySchema);

// // Inside the code where you save the user profile, also save the salary details
// // Assuming salaryDetails contains the allowances, deductions, and other salary fields
// const salaryDetails = {
//     userId: savedUser.userId,
//     allowances: 2000, // Example value, replace with actual value
//     deductions: 500, // Example value, replace with actual value
//     // Add more fields as needed
// };

// const newSalary = new Salary(salaryDetails);
// await newSalary.save();
// <<<<<<<  f2ae6cc8-e007-418e-9e30-9e412b6877f3  >>>>>>>¯