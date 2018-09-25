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


router.get('/getfiles', function (req, res, next) {
    var torrents = getFiles("./public/torrents")
    res.json(torrents);
});


const getMagnet = (path) =>  {
  let torrent = parseTorrent(fs.readFileSync(path));
  return parseTorrent.toMagnetURI(torrent);
}

const getFiles = dir => {
  let output = {};
  fs.readdirSync(dir).forEach(
    cat=>{

      torrents = fs.readdirSync(dir+"/"+cat).filter((v)=>v.endsWith(".torrent"));
      output[cat] = [];

      torrents.forEach(t=>{
        let torrentData = {name: t}
        if (!fs.existsSync(dir+"/"+cat+"/"+t+".magnet")){
          console.log(dir+"/"+cat+"/"+t)
          let mag = getMagnet(dir+"/"+cat+"/"+t);
          fs.writeFileSync(dir+"/"+cat+"/"+t+".magnet", mag, function(err) {
              if(err) {
                  return console.log(err);
              }
              console.log("The file was saved!");
          });
          torrentData.magnet = mag
        }else{
          torrentData.magnet = fs.readFileSync(dir+"/"+cat+"/"+t+".magnet", "utf8")
        }
        output[cat].push(v)
      })
    });
  return output;
}


module.exports = router;
