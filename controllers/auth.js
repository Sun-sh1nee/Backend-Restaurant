const User = require('../models/User');

exports.register = async (req, res, next) => {

    try {
        const { name, email, password, tel, role } = req.body;
        
        if (!name || !email || !password || !tel) {
            return res.status(400).json({ success: false, msg: 'Please provide all required fields: name, email, password, and telephone number' });
        }

        const user = await User.create({
            name,
            email,
            password,
            tel,
            role
        });
        
        sendTokenResponse(user, 201, res);
        
    } catch (error) {
        res.status(400).json({ success: false, msg: 'Error creating user', error: error.message });
        console.error(error.stack);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, msg: 'Please provide an email and password' });
        }
        
        const user = await User.findOne({ email }).select('+password');
        
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ success: false, msg: 'Invalid credentials' });
        }
        
        sendTokenResponse(user, 200, res);
        
    } catch (error) {
        res.status(500).json({ success: false, msg: 'Server error', error: error.message });
    }
};

exports.logout = async (req, res, next) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.status(200).json({ success: true, msg: 'User logged out' });
};

const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token
    });
};

exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(404).json({ success: false, msg: 'Error retrieving user', error: error.message });
    }
};
