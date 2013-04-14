var scrape = require('scrape');
var players = [];
var Systems = { DD35:"Dungeons & Dragons (3.5 Edition)",
  DD4:"Dungeons & Dragons (4th Edition)",
  PATHFINDER:"Pathfinder",
  DD:"Dungeons & Dragons"};
function lfgReader(err, $) {
  if (err) return console.error(err);
  var players = [];
  $('div .thing').each(parseLfgDiv);
}

function parseLfgDiv(div,i) {
  var a = div.find('a.title').first();
  var id = div.attribs['data-fullname'];
  players.push(newPlayer(id,a));
  console.log(players);
}

function newPlayer(id,a) {
  var title = a.text;
  return {id:id,
    link:a.attribs['href'],
    system:parseSystem(title),
    location:parseLocation(title)
  };
}

function parseSystem(title) {
  var systems = [];
  if (title.toLowerCase().indexOf('pathfinder')>0) {
    systems.push(Systems.PATHFINDER);
  }
  if (title.toLowerCase().indexOf('3.5') > 0) {
    systems.push(Systems.DD35);
  }
  if (title.toLowerCase().indexOf('4e') > 0) {
    systems.push(Systems.DD4);
  }
  if (title.toLowerCase().indexOf('d&d') > 0 || 
      (title.toLowerCase().indexOf('dungeons') > 0 && 
       title.toLowerCase().indexOf('dragons') >0)) {
    systems.push(Systems.DD);
  }
  return systems;
}

function parseLocation(title) {
  return title.substr('[Offline]') >0 ? 'Offline' : 'Online';
}

scrape.request('http://www.reddit.com/r/lfg', lfgReader);