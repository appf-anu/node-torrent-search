const express = require('express');
const router = express.Router();
const routeCache = require('route-cache');
const parseTorrent = require('parse-torrent');
const fs = require('fs');
const path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

const getMagnet = (path) =>  {
  let torrent = parseTorrent(fs.readFileSync(path));
  return parseTorrent.toMagnetURI(torrent);
}

const getFiles = dir => {
  let a = {};
  fs.readdirSync(dir).forEach(
    cat=>{

      torrents = fs.readdirSync(dir+"/"+cat).filter((v)=>v.endsWith(".torrent"));
      a[cat] = [];

      torrents.forEach(t=>{
        let v = {name: t}
        if (!fs.existsSync(dir+"/"+cat+"/"+t+".magnet")){
          console.log(dir+"/"+cat+"/"+t)
          let mag = getMagnet(dir+"/"+cat+"/"+t);
          fs.writeFile(dir+"/"+cat+"/"+t+".magnet", mag, function(err) {
              if(err) {
                  return console.log(err);
              }
              console.log("The file was saved!");
          });
          v.magnet = mag
        }else{
          v.magnet = fs.readFileSync(dir+"/"+cat+"/"+t+".magnet", "utf8")
        }
        a[cat].push(v)
      })
    });
  return a;
}

router.get('/getfiles',
  (req, res, next) => {
    var torrents = {};
    var torrents = getFiles("./public/torrents")
    res.json(torrents);
  });

module.exports = router;
