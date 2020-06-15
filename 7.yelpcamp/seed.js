var mongoose = require("mongoose");
var comment   = require("./models/comment");
var campground = require("./models/campground");
var seeds = [
    {
        name: "Cloud's Rest", 
        img: "https://californiathroughmylens.com/wp-content/uploads/2017/07/clouds-rest-20-640x427.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Desert Mesa", 
        img: "https://www.tourpackagejaisalmer.com/images/jaisalmer-desert-camp.png",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Canyon Floor", 
        img: "https://sp-images.summitpost.org/999027.JPG?auto=format&fit=max&h=800&ixlib=php-2.1.1&q=35&s=b65c0d3d8ba19b32ab82cb542244cfd3",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    }
];

async function seedDB(){
    try {
        await campground.remove({});
        console.log('Campgrounds removed');
        await comment.remove({});
        console.log('Comments removed');

        for(const seed of seeds) {
            let cg = await campground.create(seed);
            console.log('Campground created');
            let cm = await comment.create(
                {
                    text: 'This place is great, but I wish there was internet',
                    author: 'Homer'
                }
            )
            console.log('Comment created');
            cg.comments.push(cm);
            cg.save();
            console.log('Comment added to campground');
        }
    } catch(err) {
        console.log(err);
    }
}

module.exports = seedDB;