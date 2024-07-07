mongoose.connect('mongodb://mongo:27017/mydatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to MongoDB');
    // ここでMongooseの操作を行う
})
.catch(err => {
    console.error('Error connecting to MongoDB:', err);
});
