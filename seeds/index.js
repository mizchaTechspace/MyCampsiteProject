const Campground = require('../models/campground');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');
const mongoose = require('mongoose');

if (process.env.NODE_ENVIRONMENT !== "production") {
    require('dotenv').config()
}

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/projectOne'

main().catch((err) => {
    console.log('CONNECTION ERROR', err)
})

async function main() {
    await mongoose.connect(dbUrl);
    await console.log('CONNECTION OPEN');
}

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedsDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 10) + 20;
        const camp = new Campground({
            author: '626f4ddbb07327e4bc75f45e',
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            description: 'Camping is a fun recreational activity that allows you to enjoy the outdoors,usually amidst all that Mother Nature has to offer. People go camping in a forest, national park, in the woods, near a river or lake, and can stay there for one or more nights. There are private campgrounds as well that are privately owned by people who encourage campers to come and enjoy the nature with them. Camping trips can be fun when organized properly.',
            price,
            images: [
                {
                    url: 'https://res.cloudinary.com/mizcha12/image/upload/v1651134047/ProjectOne/j6nuvue9c8yrc8pdeiqz.jpg',
                    filename: 'ProjectOne/j6nuvue9c8yrc8pdeiqz'
                }
            ],
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude]
            }
        })

        await camp.save();
    }
}

seedsDB().then(() => console.log('SEEDING SUCCEED'))
    .then(() => mongoose.connection.close())
    .then(() => console.log('SEEDING CLOSED'))
