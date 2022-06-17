# Little_Legumes_App

Little Legumes is a photo sharing app, marketed towards parents who want to be able to track and share photos of their kids. Users are able to create an account, login, save photos to an infinitely scrolling calendar and email selected photos to their friends and family. The app is built on a MERN stack (react, nodeJs, and mongoDB). Logging in and out is handled with PassportJs and utilizes the local strategy. Photos are uploaded to Cloudinary via their photo uploading widget (URL address for the photo is saved in a MongoDB collection for easy retrieval). Emailing was handled with SendGrid. 

I chose to include an infinitely scrolling calendar because infinitely scrolling components are a key feature in apps like Facebook, Twitter, TikTok and many others. The ability to seamlessly load new content as the user scrolls keeps the user engaged with the app longer. Understanding how these components function is important for any developer interested in keeping users engaged with their app. 

The ability to share photos is a mainstay of many social media apps. Learning how to upload, save and retrieve are important skills for developers working on social media apps. I wanted to ensure that I had some experience working with photos.

The ability to dynamically send email is also a popular feature of many apps and websites. I chose email as the primary way to share photos because this app is marketed towards parents who want to share photos of their kids, including older family members, who may be more comfortable viewing the photos via email rather than on other social media sites.

view the site here: https://little-legumes.herokuapp.com/
