/*

  SoundManager 2 Demo: Play MP3 links "in-place"
  ----------------------------------------------

  http://schillmania.com/projects/soundmanager2/

  A simple demo making MP3s playable "inline"
  and easily styled/customizable via CSS.

  Requires SoundManager 2 Javascript API.

*/

function InlinePlayer() {
  var self = this;
  var pl = this;
  var sm = soundManager; // soundManager instance
  this.playableClass = 'inline-playable'; // CSS class for forcing a link to be playable (eg. doesn't have .MP3 in it)
  this.excludeClass = 'inline-exclude'; // CSS class for ignoring MP3 links
  this.links = [];
  this.sounds = [];
  this.soundsByURL = [];
  this.strings = [];
  this.indexByURL = [];
  this.lastSound = null;
  this.lastWPExec = new Date();
  this.soundCount = 0;
  var isIE = (navigator.userAgent.match(/msie/i));

  this.config = {
    useMovieStar: true, // [Flash 9 only]: Support for MPEG4 audio formats
    playNext: false, // stop after one sound, or play through list until end
    autoPlay: false,  // start playing the first sound right away
    emptyTime: '-:--'  // null/undefined timer values (before data is available)
  }

  this.css = {
    // CSS class names appended to link during various states
    sDefault: 'sm2_link', // default state
    sLoading: 'sm2_loading',
    sPlaying: 'sm2_playing',
    sPaused: 'sm2_paused'
  }

  this.addEventHandler = (typeof window.addEventListener !== 'undefined' ? function(o, evtName, evtHandler) {
    return o.addEventListener(evtName,evtHandler,false);
  } : function(o, evtName, evtHandler) {
    o.attachEvent('on'+evtName,evtHandler);
  });

  this.removeEventHandler = (typeof window.removeEventListener !== 'undefined' ? function(o, evtName, evtHandler) {
    return o.removeEventListener(evtName,evtHandler,false);
  } : function(o, evtName, evtHandler) {
    return o.detachEvent('on'+evtName,evtHandler);
  });

  this.classContains = function(o,cStr) {
	return (typeof(o.className)!='undefined'?o.className.match(new RegExp('(\\s|^)'+cStr+'(\\s|$)')):false);
  }

  this.addClass = function(o,cStr) {
    if (!o || !cStr || self.classContains(o,cStr)) return false;
    o.className = (o.className?o.className+' ':'')+cStr;
  }

  this.removeClass = function(o,cStr) {
    if (!o || !cStr || !self.classContains(o,cStr)) return false;
    o.className = o.className.replace(new RegExp('( '+cStr+')|('+cStr+')','g'),'');
  }

  this.select = function(className, oParent) {
    var result = self.getByClassName(className, 'div', oParent||null);
    return (result ? result[0] : null);
  };

  this.getByClassName = (document.querySelectorAll ? function(className, tagNames, oParent) { // tagNames: string or ['div', 'p'] etc.
    var pattern = ('.'+className), qs;
    if (tagNames) {
      tagNames = tagNames.split(' ');
    }
    qs = (tagNames.length > 1 ? tagNames.join(pattern+', ') : tagNames[0]+pattern);
    return (oParent?oParent:document).querySelectorAll(qs);

  } : function(className, tagNames, oParent) {

    var node = (oParent?oParent:document), matches = [], i, j, nodes = [];
    if (tagNames) {
      tagNames = tagNames.split(' ');
    }
    if (tagNames instanceof Array) {
      for (i=tagNames.length; i--;) {
        if (!nodes || !nodes[tagNames[i]]) {
          nodes[tagNames[i]] = node.getElementsByTagName(tagNames[i]);
        }
      }
      for (i=tagNames.length; i--;) {
        for (j=nodes[tagNames[i]].length; j--;) {
          if (self.classContains(nodes[tagNames[i]][j], className)) {
            matches.push(nodes[tagNames[i]][j]);
          }
        }
      }
    } else {
      nodes = node.all||node.getElementsByTagName('*');
      for (i=0, j=nodes.length; i<j; i++) {
        if (self.classContains(nodes[i],className)) {
          matches.push(nodes[i]);
        }
      }
    }
    return matches;

  });

  this.getSoundByURL = function(sURL) {
    return (typeof self.soundsByURL[sURL] != 'undefined'?self.soundsByURL[sURL]:null);
  }

  this.isChildOfNode = function(o,sNodeName) {
    if (!o || !o.parentNode) {
      return false;
    }
    sNodeName = sNodeName.toLowerCase();
    do {
      o = o.parentNode;
    } while (o && o.parentNode && o.nodeName.toLowerCase() != sNodeName);
    return (o.nodeName.toLowerCase() == sNodeName?o:null);
  }

  this.getTime = function(nMSec, bAsString) {
    // convert milliseconds to mm:ss, return as object literal or string
    var nSec = Math.floor(nMSec/1000),
        min = Math.floor(nSec/60),
        sec = nSec-(min*60);
    // if (min === 0 && sec === 0) return null; // return 0:00 as null
    return (bAsString?(min+':'+(sec<10?'0'+sec:sec)):{'min':min,'sec':sec});
  };

  this.events = {

    // handlers for sound events as they're started/stopped/played

    play: function() {
      pl.removeClass(this._data.oLink,this._data.className);
      this._data.className = pl.css.sPlaying;
      pl.addClass(this._data.oLink,this._data.className);
    },

    stop: function() {
      pl.removeClass(this._data.oLink,this._data.className);
      this._data.className = '';
    },

    pause: function() {
      pl.removeClass(this._data.oLink,this._data.className);
      this._data.className = pl.css.sPaused;
      pl.addClass(this._data.oLink,this._data.className);
    },

    resume: function() {
      pl.removeClass(this._data.oLink,this._data.className);
      this._data.className = pl.css.sPlaying;
      pl.addClass(this._data.oLink,this._data.className);      
    },

    finish: function() {
      pl.removeClass(this._data.oLink,this._data.className);
      this._data.className = '';
      if (pl.config.playNext) {
        var nextLink = (pl.indexByURL[this._data.oLink.href]+1);
        if (nextLink<pl.links.length) {
          pl.handleClick({'target':pl.links[nextLink]});
        }
      }
    },

    whileplaying: function() {
      var d = null;
      d = new Date();
      if (d-self.lastWPExec>30) {
        self.updateTime.apply(this);
        if (this._data.metadata) {
          this._data.metadata.refreshMetadata(this);
        }
        this._data.oPosition.style.width = (((this.position/self.getDurationEstimate(this))*100)+'%');
        self.lastWPExec = d;
      }
    }
  }

  this.stopEvent = function(e) {
   if (typeof e != 'undefined' && typeof e.preventDefault != 'undefined') {
      e.preventDefault();
    } else if (typeof event != 'undefined' && typeof event.returnValue != 'undefined') {
      event.returnValue = false;
    }
    return false;
  }

  this.getTheDamnLink = (isIE)?function(e) {
    // I really didn't want to have to do this.
    return (e && e.target?e.target:window.event.srcElement);
  }:function(e) {
    return e.target;
  }

  this.handleClick = function(e) {
    // a sound link was clicked
    if (typeof e.button != 'undefined' && e.button>1) {
	  // ignore right-click
	  return true;
    }
    var o = self.getTheDamnLink(e);
    if (o.nodeName.toLowerCase() != 'a') {
      o = self.isChildOfNode(o,'a');
      if (!o) return true;
    }
    var sURL = o.getAttribute('href');
    if (!o.href || (!sm.canPlayLink(o) && !self.classContains(o,self.playableClass)) || self.classContains(o,self.excludeClass)) {
      return true; // pass-thru for non-MP3/non-links
    }
    var soundURL = (o.href);
    var thisSound = self.getSoundByURL(soundURL);
    if (thisSound) {
      // already exists
      if (thisSound == self.lastSound) {
        // and was playing (or paused)
        thisSound.togglePause();
      } else {
        // different sound
        thisSound.togglePause(); // start playing current
        sm._writeDebug('sound different than last sound: '+self.lastSound.sID);
        if (self.lastSound) self.stopSound(self.lastSound);
      }
    } else {
      // create sound
      thisSound = sm.createSound({
       id:'inlineMP3Sound'+(self.soundCount++),
       url:soundURL,
       onplay:self.events.play,
       onstop:self.events.stop,
       onpause:self.events.pause,
       onresume:self.events.resume,
       onfinish:self.events.finish,
       whileplaying:self.events.whileplaying
      });
      // append control template
      oControls = self.oControls.cloneNode(true);
      oLink = o;
      oLink.appendChild(oControls);
      // tack on some custom data
      thisSound._data = {
        oLink: o, // DOM node for reference within SM2 object event handlers
        className: self.css.sPlaying,
        oTimingBox: self.select('timing',oLink),
        oTiming: self.select('timing',oLink).getElementsByTagName('div')[0]
      };
      self.soundsByURL[soundURL] = thisSound;
      // set initial timer stuff (before loading)
      str = self.strings.timing.replace('%s1',self.config.emptyTime);
      str = str.replace('%s2',self.config.emptyTime);
      thisSound._data.oTiming.innerHTML = str;
      self.sounds.push(thisSound);
      if (self.lastSound) self.stopSound(self.lastSound);
      thisSound.play();
      // stop last sound
    }

    self.lastSound = thisSound; // reference for next call

    if (typeof e != 'undefined' && typeof e.preventDefault != 'undefined') {
      e.preventDefault();
    } else {
      event.returnValue = false;
    }
    return false;
  }

  this.stopSound = function(oSound) {
    soundManager.stop(oSound.sID);
    soundManager.unload(oSound.sID);
  }

  this.updateTime = function() {
    var str = self.strings.timing.replace('%s1',self.getTime(this.position,true));
    str = str.replace('%s2',self.getTime(self.getDurationEstimate(this),true));
    this._data.oTiming.innerHTML = str;
  };

  this.getDurationEstimate = function(oSound) {
    if (self.config.useMovieStar) {
      return (oSound.duration);
    } else {
      return (!oSound._data.metadata || !oSound._data.metadata.data.givenDuration ? (oSound.durationEstimate||0) : oSound._data.metadata.data.givenDuration);
    }
  };

  this.init = function() {
    sm._writeDebug('inlinePlayer.init()');
    var oLinks = document.getElementsByTagName('a');
    var oTiming;
    // grab all links, look for .mp3
    var foundItems = 0;
    for (var i=0, j=oLinks.length; i<j; i++) {
      if ((sm.canPlayLink(oLinks[i]) || self.classContains(oLinks[i],self.playableClass)) && !self.classContains(oLinks[i],self.excludeClass)) {
        self.addClass(oLinks[i],self.css.sDefault); // add default CSS decoration
        self.links[foundItems] = (oLinks[i]);
        self.indexByURL[oLinks[i].href] = foundItems; // hack for indexing
        foundItems++;
      }
    }
    if (foundItems>0) {
      self.addEventHandler(document,'click',self.handleClick);
      if (self.config.autoPlay) {
        self.handleClick({target:self.links[0],preventDefault:function(){}});
      }
    }
    controlTemplate = document.createElement('div');
    controlTemplate.setAttribute('class', 'timing');

    controlTemplate.innerHTML = [

     // control markup inserted dynamically after each page player link
     // if you want to change the UI layout, this is the place to do it.

     '   <div id="sm2_timing" class="timing-data">',
     '    <span class="sm2_position">%s1</span> / <span class="sm2_total">%s2</span>',
     '   </div>'

    ].join('\n');
    self.oControls = controlTemplate.cloneNode(true);

    oTiming = self.select('timing-data',controlTemplate);
    self.strings.timing = oTiming.innerHTML;
    oTiming.innerHTML = '';
    oTiming.id = '';
    sm._writeDebug('inlinePlayer.init(): Found '+foundItems+' relevant items.');
  }

  this.init();

}

var inlinePlayer = null;

soundManager.useFlashBlock = true;

// optional: enable MPEG-4/AAC support (requires flash 9)
soundManager.flashVersion = 9;

// ----
soundManager.onready(function() {
  // soundManager.createSound() etc. may now be called
  inlinePlayer = new InlinePlayer();
});