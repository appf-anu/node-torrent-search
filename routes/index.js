var express = require('express');
var router = express.Router();
var routeCache = require('route-cache');
var parseTorrent = require('parse-torrent');
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/getfiles', routeCache.cacheSeconds(86400), function(req, res, next) {
  var torrents = [];
  fs.readdir('./public/torrents', function(err, items) {

    if (err) {
      res.json(err);
    }

    for (var i = 0; i < items.length; i++) {
      var FileName = items[i];
      if (FileName.includes('.torrent')) {
        let torrent = parseTorrent(fs.readFileSync('./public/torrents/' + FileName))
        let magnetUri = parseTorrent.toMagnetURI(torrent);

        torrents[i] = {
          'name': FileName,
          'Magnet': magnetUri
        };
      }

    }
    res.json(torrents);
  });

});

module.exports = router;
