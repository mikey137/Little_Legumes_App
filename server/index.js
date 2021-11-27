const { cloudinary } = require('./utils/cloudinary')
const express = require('express') 
const cors = require('cors')
const app = express()
const PORT = process.env.PORT || 3001
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const User = require('./models/User')

mongoose.connect(
    "mongodb+srv://mhulme:SThendy137!@cluster0.aq0gb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,  
    },
    () => {
        console.log('Mongoose Is Connected')
    }
)

app.use(express.static('public'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

app.use(
    session({
        store: MongoStore.create({mongoUrl:"mongodb+srv://mhulme:SThendy137!@cluster0.aq0gb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"}),
        secret: "secrectcode",
        resave: true,
        saveUninitialized: true
    })
)
const {passport} = require("./utils/passportConfig");
app.use(passport.initialize());
app.use(passport.session());


app.get('/api', (req,res) => {
    res.json({message: "Hello from server!"})
})

app.post('/api/upload', async (req, res) => {
    try {
        const fileStr = req.body.data;
        const uploadResponse = await cloudinary.v2.uploader.unsigned_upload(fileStr, 'k0l0cx3a');
        res.json({ msg: 'yaya' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Something went wrong' });
    }
});

app.post("/register", (req, res) => {
    User.findOne({ username: req.body.username }, async (err, doc) => {
      if (err) throw err;
      if (doc) res.send("User Already Exists");
      if (!doc) {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
  
        const newUser = new User({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          username: req.body.username,
          email: req.body.email,
          password: hashedPassword,
        });
        await newUser.save();
        res.send("User Created");
      }
    });
  });

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`)
})