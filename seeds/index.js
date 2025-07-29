const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '6879f296fe3a35a4a37e484e',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolore quibusdam officiis maxime reprehenderit porro, iure reiciendis dolorum! Distinctio, iste, provident quas ad, laboriosam inventore a dolore magnam dolorem fugit ex!',
            price,
            geometry: {
                type: 'Point',
                coordinates: [cities[random1000].longitude, cities[random1000].latitude]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dlig7gqsb/image/upload/v1753352080/YelpCamp/uzxuajcliacbpujakgbo.jpg',
                    filename: 'YelpCamp/uzxuajcliacbpujakgbo',
                },
                {
                    url: 'https://res.cloudinary.com/dlig7gqsb/image/upload/v1753352081/YelpCamp/gkbavl1p5r2nz5lae1i1.jpg',
                    filename: 'YelpCamp/gkbavl1p5r2nz5lae1i1',
                }
            ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})