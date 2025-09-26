// jshint esversion:6
/******************************************
Treehouse FSJS Techdegree:
project 1 - A Random Quote Generator
******************************************/

/***
 * `quotes` array
 ***/
const quotes = [{
    quote: 'All of life is an act of letting go but what hurts the most is not taking a moment to say goodbye.',
    source: 'Adult Pi Patel',
    citation: 'Life of Pie',
    year: '2012'
  },

  {
    quote: 'It\'s important in life to conclude things properly. Only then can you let go. Otherwise you are left with words you should have said but never did, and your heart is heavy with remorse.',
    source: 'Adult Pi Patel',
    citation: 'Life of Pie',
    year: '2012'
  },

  {
    quote: 'The world is Hell. We have a chance to start over in the rubble. But first, there has to be rubble.',
    source: 'Derek Frost',
    citation: 'Source Code',
    year: '2011',
    tag: 'philosophy'
  },

  {
    quote: 'You know what kind of plan never fails? No plan. No plan at all. You know why? Because life cannot be planned.',
    source: 'Kang-ho Song',
    citation: 'Parasite',
    year: '2019',
    tag: 'life'
  },

  {
    quote: 'Some of us get dipped in flat, some in satin, some in gloss; but every once in a while, you find someone who\'s iridescent, and once you do, nothing will ever compare.',
    source: 'Chet Duncan',
    citation: 'Flipped',
    year: '2010',
    tag: 'love'
  },

  {
    quote: 'Now go, and don\'t look back.',
    source: 'Haku',
    citation: 'Spirited Away',
    year: '2001'
  },

  {
    quote: 'You have bewitched me, body and soul.',
    source: 'Mr. Darcy',
    citation: 'Pride and Prejudice',
    year: '2005'
  }
];



/***
 * `getRandomQuote` function
 ***/
function getRandomQuote() {
  let randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  return randomQuote;
}


// create a new tag element and append it to the last of element .source
let z = document.createElement('span');
document.querySelector('.source').appendChild(z); // is a node

// set random color function
function color() {return Math.floor(Math.random()*256);}


/***
 * `printQuote` function
 ***/
function printQuote() {
  let RandomQuote = getRandomQuote();
  document.querySelector('.quote').innerText = RandomQuote.quote;
  document.querySelector('.source').childNodes[0].nodeValue = RandomQuote.source;
  document.querySelector('.citation').innerHTML = RandomQuote.citation;
  document.querySelector('.year').innerHTML = RandomQuote.year;
  // add tag if tag exists
  if (RandomQuote.tag != undefined) {
    z.innerHTML = `,    Tag:  ${RandomQuote.tag}`;
  } else {
    z.innerHTML = ` `;
  }
  // add random background color
  randomBackground=`rgb(${color()},${color()},${color()})`;
  document.querySelector('body').style.backgroundColor=`${randomBackground}`;
}

// set interval of 10 second>>> Auto-refreshed quotes
setInterval(printQuote, 10000);

/***
 * click event listener for the print quote button
 * DO NOT CHANGE THE CODE BELOW!!
 ***/
document.getElementById('load-quote').addEventListener("click", printQuote, false);
