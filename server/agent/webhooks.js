// Define endpoint for adding new listener (new client) to current instance

// Initial load registers all listeners
// @todo: Scaleability 

var Webhooks = function() {
	// All registered clients (users)
	var clients = {};
	/**
	 * Load all clients (for now...  @todo: scaleability?)
	 */
	var loadClients = function() {
		// Dummy it for now
		return {
			'a': {
				followers: ['b']
			}
			, 'b': {
				followers: ['c']
			}
			, 'c': {
				followers: ['a']
			}
		};
	};
	/**
	 * Fetch all followers for a given client
	 */
	 var fetchAllFollowers = function(clientId) {
	 	
	 }

}