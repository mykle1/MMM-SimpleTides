/* Magic Mirror
 * Module: MMM-SimpleTides
 *
 * By Mykle1
 *
 */
Module.register("MMM-SimpleTides", {

    // Module config defaults.
    defaults: {
        apiKey: "",		             // Free apiKey @ https://www.worldtides.info/register
        lat: "",                     // your latitude
        lon: "",                     // your longitude
        useHeader: false,                 // False if you don't want a header      
        header: "",                      // Change in config file. useHeader must be true
        maxWidth: "300px",
        animationSpeed: 3000,            // fade speed
        initialLoadDelay: 3250,
        retryDelay: 2500,
        rotateInterval: 5 * 60 * 1000,   // 5 minutes
        updateInterval: 60 * 60 * 1000,  // 1000 free calls a month
    },

    getStyles: function() {
        return ["MMM-SimpleTides.css"];
    },

    start: function() {
        Log.info("Starting module: " + this.name);

        requiresVersion: "2.1.1",

        //  Set locale.
        this.url = "https://www.worldtides.info/api?extremes&lat=" + this.config.lat + "&lon=" + this.config.lon + "&key=" + this.config.apiKey;
        this.tides = [];
        this.activeItem = 0;
        this.rotateInterval = null;
        this.scheduleUpdate();
    },

    getDom: function() {
		
		var apiKey = this.config.apiKey;
		var lat = this.config.lat;
		var lon = this.config.lon;

        var wrapper = document.createElement("div");
        wrapper.className = "wrapper";
        wrapper.style.maxWidth = this.config.maxWidth;

        if (!this.loaded) {
            wrapper.innerHTML = "First the tide rushes in . . .";
            wrapper.classList.add("bright", "light", "small");
            return wrapper;
        }

        if (this.config.useHeader != false) {
            var header = document.createElement("header");
            header.classList.add("xsmall", "bright", "header");
            header.innerHTML = this.config.header;
            wrapper.appendChild(header);
        }
		
		
		
	//	Rotating my data
		var tides = this.tides;
		
		 var keys = Object.keys(this.tides);
        if (keys.length > 0) {
            if (this.activeItem >= keys.length) {
                this.activeItem = 0;
            }
            var tides = this.tides[keys[this.activeItem]];
		
		
	//	console.log(tides); // for checking

        var top = document.createElement("div");
        top.classList.add("list-row");
		
		
		// TODO! Up arrow icon for high tide. Low arrow icon for low tide
		
		
		// date and time
        var date = document.createElement("div");
        date.classList.add("small", "bright", "date");
	//	console.log(tides) // for checking
		date.innerHTML = tides.date;
        wrapper.appendChild(date);
		
		
        // height
        var height = document.createElement("div");
        height.classList.add("small", "bright", "height");
        height.innerHTML = tides.height + " meters";
        wrapper.appendChild(height);
 

        // type = high or low tide
        var type = document.createElement("div");
        type.classList.add("small", "bright", "type");
		type.innerHTML = tides.type + " tide";
		wrapper.appendChild(type);
						
		}
        return wrapper;
    },


    processTides: function(data) {
        this.tides = data; // Object containing an array that contains objects
        this.loaded = true;
	//	console.log(this.tides); // for checking
    },

    scheduleCarousel: function() {
        console.log("Carousel of Tides fucktion!");
        this.rotateInterval = setInterval(() => {
            this.activeItem++;
            this.updateDom(this.config.animationSpeed);
        }, this.config.rotateInterval);
    },

    scheduleUpdate: function() {
        setInterval(() => {
            this.getTides();
        }, this.config.updateInterval);
        this.getTides(this.config.initialLoadDelay);
    },

    getTides: function() {
        this.sendSocketNotification('GET_TIDES', this.url);
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "TIDES_RESULT") {
            this.processTides(payload);
            if (this.rotateInterval == null) {
                this.scheduleCarousel();
            }
            this.updateDom(this.config.animationSpeed);
        }
        this.updateDom(this.config.initialLoadDelay);
    },
});