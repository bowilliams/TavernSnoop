var scrape = require('scrape');
var Db = require('mongodb').Db,
    MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    ReplSetServers = require('mongodb').ReplSetServers,
    ObjectID = require('mongodb').ObjectID,
    Binary = require('mongodb').Binary,
    GridStore = require('mongodb').GridStore,
    Code = require('mongodb').Code,
    BSON = require('mongodb').pure().BSON,
    assert = require('assert');
var db = new Db('tavern_scene', new Server('localhost', 27017, {}), {w:1});

var players = [];
var Systems = { DD35:"Dungeons & Dragons (3.5 Edition)",
  DD4:"Dungeons & Dragons (4th Edition)",
  PATHFINDER:"Pathfinder",
  DD:"Dungeons & Dragons"};

function lfgReader(err, $) {
  if (err) return console.error(err);
  var things = $('div .thing');
  db.open(function(err, client) {
    client.createCollection("players", function(err,col) {
      client.collection("players", function(err, col) {
        for (var i = 0, l = things.length; i < l; i++) {
          var player = parseLfgDiv(scrape.bindToElement(things[i]));
          console.log(player);
          col.insert(player, function() {});
        }
      });
    });
  });
}

function parseLfgDiv(div,i) {
  var a = div.find('a.title').first();
  var id = div.attribs['data-fullname'];
  return newPlayer(id,a);
}

function newPlayer(id,a) {
  var title = a.text;
  return {id:id,
    title:title,
    link:a.attribs['href'],
    system:parseSystem(title.toLowerCase()),
    location:parseLocation(title.toLowerCase())
  };
}

function parseSystem(title) {
  var systems = [];
  if (title.indexOf('pathfinder')>0) {
    systems.push(Systems.PATHFINDER);
  }
  if (title.indexOf('3.5') > 0) {
    systems.push(Systems.DD35);
  }
  if (title.indexOf('4e') > 0) {
    systems.push(Systems.DD4);
  }
  if (title.indexOf('d&d') > 0 || 
      (title.indexOf('dungeons') > 0 && 
       title.indexOf('dragons') >0)) {
    systems.push(Systems.DD);
  }
  return systems;
}

function parseLocation(title) {
  return (title.indexOf('[offline]') > 0) ? 'Offline' : 'Online';
}

scrape.request('http://www.reddit.com/r/lfg', lfgReader);
