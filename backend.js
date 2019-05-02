(() => {
"use strict";

const incomingMessages = [
    /* {content, sender, img} */
    {content: "Hey, what's up", sender: "Alberto", img: "assets/ewok.jpg"},
    {content: "hellooooo", sender: "Ariel", img: "assets/boba.jpeg"},
    {content: "Hey there", sender: "John", img: "assets/tarkin.jpeg"},
    {content: "Starting this group chat", group: "Watch Party", sender: "Alberto", img: "assets/ewok.jpg"},
    {content: "Hey trrrrhere", sender: "John", img: "assets/tarkin.jpeg"},
    {content: "Hey jhvjuoyf there", sender: "John", img: "assets/tarkin.jpeg"},
    {content: "Hey bbg there", sender: "John", img: "assets/tarkin.jpeg"},
    {content: "Whassupbhv dude", sender: "Kelly", img: "assets/mothma.jpg"},
    {content: "I'm in", group: "Watch Party", sender: "John", img: "assets/tarkin.jpeg"},
    {content: "What time?", group: "Watch Party", sender: "John", img: "assets/tarkin.jpeg"},
    {content: "???", group: "Watch Party", sender: "John", img: "assets/tarkin.jpeg"},
    {content: "Just don't invite Kelly", group: "Watch Party", sender: "John", img: "assets/tarkin.jpeg"},
    {content: "chill buyvitvf dudet", sender: "John", img: "assets/tarkin.jpeg"},
    {content: "...", group: "Watch Party", sender: "Kelly", img: "assets/mothma.jpg"},
    {content: "das great", sender: "Kelly", img: "assets/mothma.jpg"},
    {content: "wasabi bvjfti", sender: "Sherwino", img: "assets/lando.jpg"},
    {content: "chill dudet", sender: "John", img: "assets/tarkin.jpeg"},
    {content: "das great", group: "Watch Party", sender: "Kelly", img: "assets/mothma.jpg"},
    {content: "wasabi", sender: "Sherwino", img: "assets/lando.jpg"},
    {content: "Hey, what's up", sender: "Alberto", img: "assets/ewok.jpg"},
    {content: "Hey there", sender: "John", img: "assets/tarkin.jpeg"},
    {content: "Hey there", sender: "John", img: "assets/tarkin.jpeg"},
    {content: "Hey there", sender: "John", img: "assets/tarkin.jpeg"},
    {content: "Hey there", sender: "John", img: "assets/tarkin.jpeg"},
    {content: "Whassup dude", sender: "Kelly", img: "assets/mothma.jpg"},
    {content: "chill dudet", sender: "John", img: "assets/tarkin.jpeg"},
    {content: "das great", sender: "Kelly", img: "assets/mothma.jpg"},
    {content: "wasabi", group: "Watch Party", sender: "Sherwino", img: "assets/lando.jpg"},
    {content: "chill dudet", sender: "John", img: "assets/tarkin.jpeg"},
    {content: "das great", sender: "Kelly", img: "assets/mothma.jpg"},
    {content: "wasabi", sender: "Sherwino", img: "assets/lando.jpg"}
]

const subs = [];

function getTime() {
    const date = new Date();
    return date.getHours() + ":" + date.getMinutes();
}

setInterval(() => {
    if (incomingMessages.length) {
        const {group, sender, content, img} = incomingMessages.shift();
        const time = getTime();
        const read = false;
        subs.forEach(sub => {
          sub({group, sender, content, time, img, read})

        }

      );
        // console.log(subs);
    }
}, 1000 + (Math.random() * 4000));

window.connect = func => { subs.push(func) }
})()