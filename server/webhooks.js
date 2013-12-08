var http = require('http')
	, request = require('request')
	, url = require('url');

var Webhooks = function ( /* add agent buckets for scaleability later */ ) {
	// Registered clients (users)	
	this.clients = {};
	/**
	 * Initialise the webhooks agent
	 */	
	this.loadClients();
	this.registerWebhooks();
}
/**
 * Load all clients (for now...  @todo: scaleability?)
 */
Webhooks.prototype.loadClients = function ( /* add agent buckets for scaleability later */ ) {
	// Dummy it for now
	this.clients = {
		1: {
			followers: [2, 3, 4, 5]
			, endpoint: 'http://localhost:8081/webhook1'
		}
		, 2: {
			followers: [3, 1]
			, endpoint: 'http://localhost:8081/webhook2'
		}
		, 3: {
			followers: []
			, endpoint: 'http://localhost:8081/webhook3'
		}
		, 4: {
			followers: [3]
		    , endpoint: 'http://localhost:8081/webhook4'
		}
	};
};
/**
 * Fetch all followers for a given client
 */
Webhooks.prototype.fetchAllFollowers = function (clientId) {
	// Track followers between recursive calls of function
	var followers = arguments[1];
	var self = this;
	if (typeof arguments[1] === 'undefined') {
		followers = [];
	}
	// Make sure client exists
	if (this.clients.hasOwnProperty(clientId)) {
		// Add the client as a follower
		followers.push(clientId);
		// Add child followers
		if (this.clients[clientId].followers.length !== 0) {
			this.clients[clientId].followers.forEach(function (follower) {
				// Prevent duplicates / infinite recursion
				if (follower !== clientId && followers.indexOf(follower) === -1) {
					var children = self.fetchAllFollowers(follower, followers);
					children.forEach(function (child) {
						if (followers.indexOf(follower) === -1) {
							followers.push(child);
						}
					});
				}	
			});
		}
	} else {
		return [];
	}
	return followers;
};
Webhooks.prototype.registerWebhooks = function() {
	var self = this
	var server = http.createServer(function (req,res) {
		// Fetch client ID
		var id = parseInt(url.parse(req.url).path.replace('/webhook/', ''));
		if (typeof id === 'number' && self.clients.hasOwnProperty(id)) {
			// Forward request to all follower endpoints
			var followers = self.fetchAllFollowers(id);
			followers.forEach(function(followerId) {
				var followerRequest = new http.request(self.clients[followerId].endpoint);
				followerRequest.on('error', function(e) { 
					console.log(e);
				});
				followerRequest.pipe(req);
				followerRequest.end();
			});
		}
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.end();
	}).listen(8080);
};

var agents = new Webhooks();