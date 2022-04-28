const Campground = require('../models/campground');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');
const mongoose = require('mongoose');

main().catch((err) => {
    console.log('CONNECTION ERROR', err)
})

async function main() {
    await mongoose.connect('mongodb://localhost:27017/projectOne');
    await console.log('CONNECTION OPEN');
}

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedsDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 10) + 20;
        const camp = new Campground({
            author: '623ab8fef8523f9839bd95e9',
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/mizcha12/image/upload/v1649839413/ProjectOne/tr63rpf55h2cmkqngxyf.jpg',
                    filename: 'ProjectOne/tr63rpf55h2cmkqngxyf'
                }
            ],
            description: 'Camping is a fun recreational activity that allows you to enjoy the outdoors,usually amidst all that Mother Nature has to offer. People go camping in a forest, national park, in the woods, near a river or lake, and can stay there for one or more nights. There are private campgrounds as well that are privately owned by people who encourage campers to come and enjoy the nature with them. Camping trips can be fun when organized properly.',
            price
        })

        await camp.save();
    }
}

seedsDB().then(() => console.log('SEEDING SUCCEED'))
    .then(() => mongoose.connection.close())
    .then(() => console.log('SEEDING CLOSED'))
