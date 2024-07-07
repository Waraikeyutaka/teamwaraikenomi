const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// スキーマの定義例
const userSchema = new Schema({
    name: String,
    email: String,
    age: Number
});

// モデルの作成
const User = mongoose.model('User', userSchema);

// MongoDBに接続
mongoose.connect('mongodb://localhost:27017/mydatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to MongoDB');

    // 新しいユーザーを作成して保存する例
    const newUser = new User({ name: 'John', email: 'john@example.com', age: 30 });
    newUser.save()
        .then(() => {
            console.log('User saved successfully!');
        })
        .catch(err => {
            console.error('Error saving user:', err);
        });
})
.catch(err => {
    console.error('Error connecting to MongoDB:', err);
});
