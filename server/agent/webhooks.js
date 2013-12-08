// Define endpoint for adding new listener (new client) to current instance

// Initial load registers all listeners
// @todo: Scaleability

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
		'a': {
			followers: ['b', 'c', 'd', 'e']
		}
		, 'b': {
			followers: ['c', 'a']
		}
		, 'c': {
			followers: ['a', 'c']
		}
		, 'd': {
			followers: ['c']
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
	this.clients.forEach(function() {
		console.log(this.fetchAllFollowers('d'));
	});	
};


var agents = new Webhooks();