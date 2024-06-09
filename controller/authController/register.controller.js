const UserModel = require('../../models/UserModel');
const bcryptjs = require('bcryptjs');

async function registerUser(request, response) {
    try {
        const { username, name, age, email, password, sdt, address } = request.body;

        const existingUser = await UserModel.getUserByEmail(email);
        if (existingUser) {
            return response.status(400).json({ error: 'User already exists with this email' });
        }

        const hashedPassword = await bcryptjs.hash(password, 10);

        const newUser = {
            username,
            name,
            age,
            email,
            password: hashedPassword,
            role: 'customer', // Role mặc định là customer
            sdt,
            address,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        await UserModel.insertUser(newUser);

        response.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error in registerUser:', error);
        response.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = registerUser;
