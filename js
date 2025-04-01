const timerDisplay = document.getElementById('timer');
const subtitle = document.getElementById('subtitle');
const topicsButton = document.getElementById('topics');
const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const topicsContainer = document.getElementById('topics-container');
const randomWord = document.getElementById('random-word');
const randomQuote = document.getElementById('random-quote');
const randomSentence = document.getElementById('random-sentence');
const dingSound = document.getElementById('ding');
let timeLeft;
let timerId = null;
let timeoutId = null;
let isPaused = false;
let phase = 0; // 0: initial, 1: 30s, 2: 1m, 3: 3m

// 70 quirky, imaginative words for middle/high schoolers
const words = [
    'Gizmo', 'Whimsical', 'Paradox', 'Nimbus', 'Quirky', 'Zephyr', 'Gargoyle', 'Flux', 'Kaleidoscope', 'Phantom',
    'Wanderlust', 'Euphoria', 'Chameleon', 'Vortex', 'Bizarre', 'Jinx', 'Pinnacle', 'Rogue', 'Sphinx', 'Twilight',
    'Cipher', 'Fiasco', 'Glimmer', 'Havoc', 'Mirage', 'Nebula', 'Ogre', 'Prowl', 'Rubble', 'Siren',
    'Tangle', 'Umbra', 'Voodoo', 'Wisp', 'Xenon', 'Yeti', 'Zenith', 'Abyss', 'Banshee', 'Catalyst',
    'Drift', 'Echo', 'Fable', 'Goblin', 'Hologram', 'Inkling', 'Jester', 'Kraken', 'Lunar', 'Mimic',
    'Nomad', 'Oasis', 'Portal', 'Quartz', 'Raven', 'Shimmer', 'Titan', 'Utopia', 'Viper', 'Whirlwind',
    'X-ray', 'Yarn', 'Zombie', 'Aether', 'Blitz', 'Cosmos', 'Doodle', 'Enigma', 'Freak', 'Glitch'
];

// 70 offbeat, thought-provoking quotes
const quotes = [
    '"The universe is a pretty big place. If it’s just us, seems like an awful waste of space."',
    '"I’d rather be a could-be if I cannot be an are."',
    '"The shortest war in history lasted 38 minutes."',
    '"Reality is just a suggestion, not a rule."',
    '"Some people are lost in thought because it’s unfamiliar territory."',
    '"The early bird gets the worm, but the night owl gets the stars."',
    '"A day without laughter is like a day without Wi-Fi."',
    '"If Plan A fails, remember there are 25 more letters."',
    '"The only thing predictable about life is its unpredictability."',
    '"I’m not saying it was aliens, but it was aliens."',
    '"Time flies like an arrow; fruit flies like a banana."',
    '"The world is a book, and those who don’t travel read only one page."',
    '"Normal is just a setting on the dryer."',
    '"Why fit in when you were born to stand out?"',
    '"The best way to keep a secret is to shout it from the rooftops."',
    '"I’m not clumsy; the floor just loves me too much."',
    '"If the world is a stage, I’m rewriting the script."',
    '"A mind is like a parachute—it only works when it’s open."',
    '"The impossible just takes a little longer."',
    '"I dream in pixels and wake up in reality."',
    '"Chaos is just order waiting to be decoded."',
    '"The shadow proves the sunshine."',
    '"Life’s too short to fold fitted sheets."',
    '"I’m not lost; I’m exploring alternative routes."',
    '"The quieter you become, the more you can hear."',
    '"If you think you’re too small to make a difference, try sleeping with a mosquito."',
    '"I’d agree with you, but then we’d both be wrong."',
    '"The future is already here—it’s just not evenly distributed."',
    '"Some people graduate with honors; I am just honored to graduate."',
    '"The best ideas come from the weirdest places."',
    '"I don’t trip; I do random gravity checks."',
    '"There’s no Wi-Fi in the forest, but you’ll find a better connection."',
    '"If you’re not confused, you’re not paying attention."',
    '"The answer to all questions is yes, unless it’s no."',
    '"I’m not arguing; I’m just explaining why I’m right."',
    '"The moon doesn’t care if the dogs bark at it."',
    '"Life is a Wi-Fi signal—just when you think you’re connected, it drops."',
    '"I’m not lazy; I’m just on energy-saving mode."',
    '"The real treasure is the chaos we made along the way."',
    '"If you can’t convince them, confuse them."',
    '"I’m not saying I’m Batman, but have you ever seen us in the same room?"',
    '"The glass is neither half full nor half empty—it’s refillable."',
    '"I don’t follow the crowd; I lead the stampede."',
    '"The only constant in life is change—and snacks."',
    '"If time is money, then I’m broke in every dimension."',
    '"I’m not a rebel; I just color outside the lines."',
    '"The best stories start with ‘what if?’"',
    '"I’d rather chase a comet than follow a map."',
    '"The universe doesn’t give you what you want; it gives you what you’re ready for."',
    '"I’m not weird; I’m a limited edition."',
    '"If you don’t ask, the answer is always no."',
    '"The world spins at 1,000 miles an hour, and I’m just along for the ride."',
    '"I don’t break rules; I bend them into new shapes."',
    '"The best adventures begin where the Wi-Fi ends."',
    '"I’m not late; I’m on my own time zone."',
    '"If you can dream it, you can totally overthink it."',
    '"The stars don’t care about your to-do list."',
    '"I’m not a mess; I’m a masterpiece in progress."',
    '"The only thing faster than light is gossip."',
    '"I don’t need a cape to be a hero—just Wi-Fi."',
    '"The best way to predict the future is to ignore the forecast."',
    '"I’m not falling; I’m diving into the unknown."',
    '"The real magic happens outside the comfort zone."',
    '"If you’re not laughing, you’re not living."',
    '"I don’t climb mountains; I talk them into moving."',
    '"The only limit is the one you set—and I lost mine."',
    '"I’m not a star; I’m a whole galaxy."',
    '"The world is weird, and I’m here for it."',
    '"If you don’t leap, you’ll never fly—or flop hilariously."'
];

// 70 unconventional, creative unfinished sentences
const sentences = [
    'If I could swap bodies with a robot, I’d...',
    'The strangest thing I’ve ever seen in the sky was...',
    'If I lived in a haunted house, I’d ask the ghosts...',
    'The weirdest invention the world needs is...',
    'If I could talk to a cloud, I’d convince it to...',
    'The most bizarre dream I’ve ever had was about...',
    'If I could shrink to the size of an ant, I’d explore...',
    'The oddest rule I’d make as king or queen would be...',
    'If I found a portal in my closet, it’d lead to...',
    'The wildest thing I’d do with a time machine is...',
    'If I could turn into any mythical creature, I’d pick...',
    'The strangest food I’d invent would taste like...',
    'If I could ride a tornado, I’d steer it to...',
    'The most unexpected superpower I’d want is...',
    'If I could replace the moon with something, it’d be...',
    'The weirdest holiday I’d create would celebrate...',
    'If I could talk to my shadow, it’d tell me...',
    'The most out-there place I’d build a treehouse is...',
    'If I could remix reality, I’d add...',
    'The strangest thing I’d teach a parrot to say is...',
    'If I could live inside a video game, I’d choose...',
    'The wildest prank I’d pull on the world would be...',
    'If I could swap voices with an animal, I’d pick...',
    'The most bizarre treasure I’d hunt for is...',
    'If I could paint the sky, I’d use...',
    'The oddest thing I’d trade my phone for is...',
    'If I could make gravity optional, I’d...',
    'The weirdest thing I’d ask an alien about is...',
    'If I could turn rain into something else, it’d be...',
    'The most unexpected place I’d hide a secret is...',
    'If I could race a cheetah on a hoverboard, I’d...',
    'The strangest thing I’d put in a time capsule is...',
    'If I could rewrite the ending of my favorite story, it’d...',
    'The wildest thing I’d do with invisibility is...',
    'If I could replace all music with one sound, it’d be...',
    'The most bizarre thing I’d ask a genie for is...',
    'If I could live on a floating island, I’d...',
    'The oddest way I’d spend a snow day is...',
    'If I could talk to the ocean, I’d ask it...',
    'The strangest thing I’d build with unlimited Legos is...',
    'If I could swap places with a cartoon character, I’d...',
    'The wildest thing I’d do if I ruled the internet is...',
    'If I could turn my backpack into a gadget, it’d...',
    'The most unexpected thing I’d trade a year of my life for is...',
    'If I could make animals glow, I’d start with...',
    'The weirdest thing I’d do if I woke up as a giant is...',
    'If I could turn homework into a game, it’d be...',
    'The strangest thing I’d ask a time traveler is...',
    'If I could live in a bubble, I’d float to...',
    'The wildest thing I’d do with a talking mirror is...',
    'If I could replace the sun with something, it’d be...',
    'The most bizarre way I’d travel to school is...',
    'If I could talk to a star, I’d ask it...',
    'The oddest thing I’d do if I owned a circus is...',
    'If I could turn my voice into a weapon, it’d...',
    'The strangest thing I’d trade my shadow for is...',
    'If I could make a storm do tricks, I’d...',
    'The wildest thing I’d do if I could shrink anything is...',
    'If I could live in a maze, I’d design it to...',
    'The most unexpected thing I’d ask a dragon is...',
    'If I could turn my room into a spaceship, I’d...',
    'The weirdest thing I’d do with a magic pencil is...',
    'If I could swap the seasons around, I’d...',
    'The strangest thing I’d do if I could fly is...',
    'If I could make a cloud my pet, I’d...',
    'The wildest thing I’d do with a talking plant is...',
    'If I could turn my dreams into movies, they’d...',
    'The most bizarre thing I’d do if I ruled the sky is...',
    'If I could make the wind whisper secrets, it’d say...'
];

function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function generateTopics() {
    randomWord.textContent = getRandomItem(words);
    randomQuote.textContent = getRandomItem(quotes);
    randomSentence.textContent = getRandomItem(sentences);
    topicsContainer.style.display = 'block';
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
}

function startTimer(duration) {
    timeLeft = duration;
    timerDisplay.textContent = formatTime(timeLeft);

    if (duration === 30) {
        subtitle.textContent = 'You may look at your topic';
        phase = 1;
    } else if (duration === 60) {
        subtitle.textContent = 'You may now take notes';
        phase = 2;
    } else if (duration === 180) {
        subtitle.textContent = 'SPEECH';
        phase = 3;
    }

    if (timerId) clearInterval(timerId);
    if (timeoutId) clearTimeout(timeoutId);

    timerId = setInterval(() => {
        if (!isPaused) {
            timeLeft--;
            timerDisplay.textContent = formatTime(timeLeft);

            if (phase === 3 && (timeLeft === 120 || timeLeft === 60 || timeLeft === 30)) {
                dingSound.play();
            }

            if (timeLeft <= 0) {
                clearInterval(timerId);
                timerId = null;
                dingSound.play();
                startButton.textContent = 'Start';
                if (phase === 1) {
                    timeoutId = setTimeout(() => startTimer(60), 1000);
                } else if (phase === 2) {
                    subtitle.textContent = 'Click Start for Speech (3:00)';
                    phase = 0;
                    timerDisplay.textContent = '03:00';
                } else if (phase === 3) {
                    subtitle.textContent = 'Speech complete!';
                }
            }
        }
    }, 1000);
}

topicsButton.addEventListener('click', () => {
    console.log('Topics clicked - phase:', phase, 'timerId:', timerId); // Debug log
    if (phase === 0 && !timerId) {
        generateTopics();
    }
});

startButton.addEventListener('click', () => {
    if (startButton.textContent === 'Start') {
        if (phase === 0) {
            if (subtitle.textContent === 'Click Start to Begin' || topicsContainer.style.display === 'block') {
                startTimer(30);
                topicsContainer.style.display = 'none';
            } else {
                startTimer(180);
            }
        }
        startButton.textContent = 'Pause';
        isPaused = false;
    } else if (startButton.textContent === 'Pause') {
        isPaused = true;
        startButton.textContent = 'Resume';
    } else if (startButton.textContent === 'Resume') {
        isPaused = false;
        startButton.textContent = 'Pause';
    }
});

stopButton.addEventListener('click', () => {
    if (timerId) clearInterval(timerId);
    if (timeoutId) clearTimeout(timeoutId);
    timerId = null;
    timeoutId = null;
    phase = 0;
    timeLeft = undefined;
    timerDisplay.textContent = '00:00';
    subtitle.textContent = 'Click Start to Begin';
    topicsContainer.style.display = 'none';
    startButton.textContent = 'Start';
    isPaused = false;
});
