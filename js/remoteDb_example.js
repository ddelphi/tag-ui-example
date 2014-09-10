(function() {

var eventSystem = window.app.eventSystem


/*
	remoteDb object
	this is a sample object to get the tag's data,
	and then dispatch to the "db/tags" event,
	which will received by the TagWellView object
*/
var remoteDb = {
	getTags: function() {
		var tags = [
			{"name": "tag 1"},
			{"name": "tag 2"},
			{"name": "tag 3"},
			{"name": "tag 4"},
			{"name": "tag 5"},
			{"name": "tag 6"},
			{"name": "tag 7"},
			{"name": "tag 8"},
			{"name": "tag 9"}
		]
		eventSystem.trigger("db/tags", tags)
		return tags
	}
}


// for test
remoteDb.getTags()


})()