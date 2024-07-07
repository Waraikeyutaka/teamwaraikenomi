const express = require('express');
const mongoose = require('mongoose');
const User = require('./user');

const newUser = new User({ name: 'John Doe', email: 'john.doe@example.com', age: 30 });

newUser.save()
    .then(() => {
        console.log('User saved successfully!');
    })
    .catch(err => {
        console.error('Error saving user:', err);
    });







const app = express();
const PORT = 3001;

// ミドルウェアの設定
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDBへの接続
mongoose.connect('mongodb://mongo:27017/mydatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch(err => {
    console.error('Error connecting to MongoDB:', err);
});

// ユーザーを作成するエンドポイント
app.post('/', async (req, res) => {
    try {
        const { name, email, age } = req.body;
        const newUser = new User({ name, email, age }); // User モデルを使用して新しいユーザーを作成
        await newUser.save(); // MongoDB に保存
        res.status(201).json(newUser); // 新しいユーザーをレスポンスとして返す
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).json({ error: 'Failed to create user' });
    }
});

// サーバーを起動する
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
