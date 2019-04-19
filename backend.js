(() => {
"use strict";

const incomingMessages = [
    /* {content, sender, img} */
    {content: "Hey, what's up", sender: "Alberto", img: "assets/ferrari.jpg"},
    {content: "hellooooo", sender: "Ariel", img: "assets/random.jpeg"},
    {content: "Hey there", sender: "John", img: "assets/random2.jpeg"},
    {content: "Hey trrrrhere", sender: "John", img: "assets/random2.jpeg"},
    {content: "Hey jhvjuoyf there", sender: "John", img: "assets/random2.jpeg"},
    {content: "Hey bbg there", sender: "John", img: "assets/random2.jpeg"},
    {content: "Whassupbhv dude", sender: "Kelly", img: "assets/random3.jpeg"},
    {content: "chill buyvitvf dudet", sender: "John", img: "assets/random2.jpeg"},
    {content: "das great", sender: "Kelly", img: "assets/random3.jpeg"},
    {content: "wasabi bvjfti", sender: "Jacktheknife", img: "assets/random4.jpeg"},
    {content: "chill dudet", sender: "John", img: "assets/random2.jpeg"},
    {content: "das great", sender: "Kelly", img: "assets/random3.jpeg"},
    {content: "wasabi", sender: "Jacktheknife", img: "assets/random4.jpeg"},
    {content: "Hey, what's up", sender: "Alberto", img: "assets/random5.jpeg"},
    {content: "Hey there", sender: "John", img: "assets/random3.jpeg"},
    {content: "Hey there", sender: "John", img: "assets/random3.jpeg"},
    {content: "Hey there", sender: "John", img: "assets/random3.jpeg"},
    {content: "Hey there", sender: "John", img: "assets/random3.jpeg"},
    {content: "Whassup dude", sender: "Kelly", img: "assets/random3.jpeg"},
    {content: "chill dudet", sender: "John", img: "assets/random3.jpeg"},
    {content: "das great", sender: "Kelly", img: "assets/random3.jpeg"},
    {content: "wasabi", sender: "Jacktheknife", img: "assets/random4.jpeg"},
    {content: "chill dudet", sender: "John", img: "assets/random3.jpeg"},
    {content: "das great", sender: "Kelly", img: "assets/random3.jpeg"},
    {content: "wasabi", sender: "Jacktheknife", img: "assets/random4.jpeg"}
]

const subs = [];

function getTime() {
    const date = new Date();
    return date.getHours() + ":" + date.getMinutes();
}

setInterval(() => {
    if (incomingMessages.length) {
        const {sender, content, img} = incomingMessages.shift();
        const time = getTime();
        const read = false;
        subs.forEach(sub => {
          sub({sender, content, time, img, read})

        }

      );
        // console.log(subs);
    }
}, 3000);

window.connect = func => { subs.push(func) }
})()