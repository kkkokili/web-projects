// jshint esversion:6
/******************************************
Treehouse FSJS Techdegree:
project 1 - A Random Quote Generator
******************************************/

// For assistance:
  // Check the "Project Resources" section of the project instructions
  // Reach out in your Slack community - https://treehouse-fsjs-102.slack.com/app_redirect?channel=chit-chat

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

let quote = [{
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
 if (quote.length == 0) {
    quotes.forEach(item=> {
      quote.push(item);
    });
  }
  let randomNumber = Math.floor(Math.random() * quote.length);
  let randomQuote = quote[randomNumber];
  /*delete the specific element in an array with the certain index*/
  quote.splice(randomNumber, 1);
  return randomQuote;
}

// set random color function
function color() {
  return Math.floor(Math.random()*256);
}

/***
 * `printQuote` function
***/

function printQuote() {
  let RandomQuote=getRandomQuote();
  let html=`<p class=quote>${RandomQuote.quote}</p>
            <p class=source>${RandomQuote.source}`;
  if (RandomQuote.citation) {
    html+=`<span class=citation>${RandomQuote.citation}</span>`;
  }
  if (RandomQuote.year) {
    html+=`<span class=year>${RandomQuote.year}</span>`;
  }
  if (RandomQuote.tag) {
    html+=`<span class=year>Tag: ${RandomQuote.tag}</span>`;
  }
  html+=`</p>`;
  document.getElementById('quote-box').innerHTML=html;
  // change into a random background color
  document.querySelector('body').style.backgroundColor=`rgb(${color()},${color()},${color()})`;
}

// set interval of 10 second>>> Auto-refreshed quotes
setInterval(printQuote, 10000);




/***
 * click event listener for the print quote button
 * DO NOT CHANGE THE CODE BELOW!!
***/

document.getElementById('load-quote').addEventListener("click", printQuote, false);
