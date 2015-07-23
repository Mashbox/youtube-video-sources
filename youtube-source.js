/*--------------------------------------------
Grab YouTube Video Sources for Processing
--------------------------------------------*/
function YouTubeMedia(url) {
  var self = this;

  self.url = url;
  self.id = self.parseId();

  return self;
}

YouTubeMedia.prototype.parseId = function () {
  var self = this;

  if (self.url) {
    var regId = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = self.url.match(regId);

    if (match && match[2].length === 11) {
      return match[2];
    } else {
      return self.url;
    }
  }
};

YouTubeMedia.prototype.getSource = function () {
  var self = this;
  var defer = $.Deferred();
  var source;

  $.ajax({
    url: "http://www.youtube.com/get_video_info?video_id=" + self.id,
    dataType: "text"
  }).done(function (response) {
    if (response) {
      var video = self.queryStringtoObject(response);

      if (video.status === 'fail'){
        defer.resolve(false);
        return;
      }

      video.sources = self.decodeSources(video.url_encoded_fmt_stream_map);

      // Get the highest source of mp4
      if (video.sources['video/mp4']) {
        source = $.map(video.sources['video/mp4'], function (source, i) {
          return source.url;
        })[0];
      }

      defer.resolve({
        name: decodeURIComponent(video.name || video.title),
        url: source
      });
    }
  });

  return defer.promise();
};

YouTubeMedia.prototype.decodeSources = function (map) {
  var self = this;
  var sources = {};

  $.each(map.split(","), function (i, urlEncodedStream) {
    var stream = self.queryStringtoObject(urlEncodedStream);
    var type    = stream.type.split(";")[0];
    var quality = stream.quality.split(",")[0];

    if (!sources[type]) {
      sources[type] = {};
    }
    sources[type][quality] = stream;
  });

  return sources;
};

YouTubeMedia.prototype.queryStringtoObject = function (str) {
  var pairs = str.toString().split('&') || null;
  var results = {};

  if (pairs) {
    pairs.forEach(function(pair) {
      pair = pair.split('=');
      results[pair[0]] = decodeURIComponent(pair[1] || '');
    });
  }

  return results;
};

window.YouTubeMedia = YouTubeMedia;

// Requirify
if (typeof define === 'function' && define.amd) {
  define([], window.YouTubeMedia);

  // Browserify
} else if (typeof module === 'object' && typeof module.exports === 'object') {
  module.exports = window.YouTubeMedia;

}
