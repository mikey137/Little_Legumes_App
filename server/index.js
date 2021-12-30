const { cloudinary } = require('./utils/cloudinary')
const express = require('express') 
const cors = require('cors')
const app = express()
const PORT = process.env.PORT || 3001
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const nodemailer = require('nodemailer')
const User = require('./models/User')
const FamilyMember = require('./models/FamilyMember')
const Photo = require('./models/Photo')
const path = require('path')
const { corsOrigin } = require('./CorsOrigins')
let originUrl = corsOrigin.url.API_URL

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
app.use(express.static(path.join(__dirname,'..', "frontend/build")));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({
    origin: { originUrl },
    credentials: true,
}));

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
app.use(passport.session({
    secret: "thisismysecretkey",
    saveUninitialized: true,
}));

app.options('*', cors())
app.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) throw err;
      if (!user) res.send("No User Exists");
      else {
        req.logIn(user, (err) => {
          if (err) throw err;
          res.send("Successfully Authenticated");
          console.log(req.user);
        });
      }
    })(req, res, next);
});

app.get('/logout', function(req, res){
    req.logout();
    res.send("Logged Out")
  });

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
    User.findOne({ email: req.body.email }, async (err, doc) => {
      if (err) throw err;
      if (doc) res.send("User Already Exists");
      if (!doc) {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
  
        const newUser = new User({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          username: req.body.email,
          password: hashedPassword,
        });
        await newUser.save();
        res.send("User Created");
      }
    });
});

app.post("/addFamilyMember", (req, res) => {
    FamilyMember.findOne({ email: req.body.email }, async (err, doc) => {
        if(err) throw err
        if(doc) res.send("Family Member Already Exists")
        if(!doc) {
            const newFamilyMember = new FamilyMember({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                relationship: req.body.relationship,
                email: req.body.email,
                connectedUser: req.body.connectedUser
            })
            await newFamilyMember.save()
            res.send("New Family Member Added")
        }
    })
})

app.post("/addphoto", (req, res) => {
    Photo.findOne({ url: req.body.url }, async (err, photo) => {
        if(err) throw err
        if(photo) res.send("Photo Already Exists")
        if(!photo) {
            const newPhoto = new Photo({
                user: req.body.user,
                dateId: req.body.dateId,
                momentCaption: req.body.momentCaption,
                thumbnailUrl: req.body.thumbnailUrl,
                url: req.body.url
            })
            await newPhoto.save()
            res.send("Photo Added")
        }
    }) 
})

app.post("/send_mail", cors(), async (req, res) => {
	try {
  let emailObject = 
  req.body.map((photo, index) => (
    `<div style = 
      "width: 100%;
       max-width:500px;
       height:fit-content;
       box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
        rgba(60, 64, 67, 0.15) 0px 2px 6px 2px; 
       display:bolck; 
       margin:auto;"
    >
    <div style = 
      "background:url(cid:${photo._id});
       background-repeat: no-repeat;
       background-position: center;
       background-size: cover;
       width: 95%;
       max-width: 450px;
       height: 95vw;
       max-height: 450px;
       border-radius: 5px;
       margin-top: 10px;
       margin-left: auto;
       margin-right: auto; "
    >
    </div>
    <div style="text-align:center;">${photo.momentCaption}</div>
    </div>`
  ))

  let attachmentsArray = []
  for(let i = 0; i < req.body.length; i++){
    attachmentsArray.push({
      path: req.body[i].url,
      cid: req.body[i]._id
    })
  }

	const transport = nodemailer.createTransport({
		host: process.env.MAIL_HOST,
		port: process.env.MAIL_PORT,
		auth: {
			user: process.env.MAIL_USER,
			pass: process.env.MAIL_PASS
		}
	})

	await transport.sendMail({
		from: process.env.MAIL_FROM,
		to: "coachhulmeumb@gmail.com",
		subject: `${req.body[0].user} has shared moments with you!`,
    attachments: attachmentsArray,
		html: `${emailObject}`
	})
} catch (err) {
    console.error(err)
}
})

app.get("/user", (req, res) => {
    console.log(req)
    User.findOne({username: req.user.username}, (err, user) => {
        if(err) throw err
        if(user) res.send({
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username
        })
        else{
            res.status(400).send("no user found")
        }
    })
});

app.get("/photos", (req, res) => {
    Photo.find({user: req.user.username}, (err, photos) => {
        if(err) throw err
        if(photos) res.send({
            photos
        })
        else{
            res.status(400).send("no photos found")
        }
    })
})

app.get("/familymembers", (req, res) => {
    FamilyMember.find({connectedUser: req.user.username}, (err, family) => {
        if(err) throw err
        if(family) res.send({
            family
        })
        else{
            res.status(400).send("no family found")
        }
    })
})

app.delete('/deletefamily/:id', async (req, res) => {
    try {
        let member = await FamilyMember.findById(req.params.id).lean()
    
        if (!member) {
          return res.render('error/404')
        } else {
          await FamilyMember.remove({ _id: req.params.id })
          console.log('family member deleted')
        }
      } catch (err) {
        console.error(err)
        return res.render('error/500')
      }
})

app.delete('/deletephoto/:id', async (req, res) => {
    try {
        let photo = await Photo.findById(req.params.id).lean()
    
        if (!photo) {
          return res.send('photo not found')
        } else {
          await Photo.remove({ _id: req.params.id })
          console.log('photo deleted')
        }
    } catch (err) {
        console.error(err)
        return res.send('error/500')
    }
})

app.put('/editfamilymember/:id', async (req, res) => {
    console.log(req.body)
    try {
        let member = await FamilyMember.findById(req.params.id).lean()
    
        if (!member) {
          return res.render('error/404')
        } else {
          await FamilyMember.findOneAndUpdate({ _id: req.params.id }, req.body, {
            new: true,
            runValidators: true,
          })
          res.send("Member Info Updated")
        }
      } catch (err) {
        console.error(err)
        return res.render('error/500')
      }
})

app.put('/editphoto/:id', async (req, res) => {
    console.log(req.body)
    try {
        let photo = await Photo.findById(req.params.id).lean()
    
        if (!photo) {
          return res.render('error/404')
        } else {
          await Photo.findOneAndUpdate({ _id: req.params.id }, req.body, {
            new: true,
            runValidators: true,
          })
          res.send("Photo Edit Completed")
        }
      } catch (err) {
        console.error(err)
        return res.render('error/500')
      }
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname,'..','frontend/build/index.html'));
  });

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`)
})