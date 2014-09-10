(function() {

var app = window.app
var models = app.models = {}



/*
	models definations
*/

/*
	modelManager object
	@deprecated
*/
var modelManager = {
	collection: {},

	add: function(name, obj) {
		if (this.collection.hasOwnProperty(name)) {
			throw new Error("object '%name' has been exist.".replace("%name", name))
		}
		this.collection[name] = obj
	},
	get: function(name) {
		return this.collection[name]
	},
	remove: function(name) {
		var temp = this.collection[name]
		delete this.collection[name]
		return temp ? true : false
	}
}

// the single tag model object
models.Tag = Backbone.Model.extend({
	defaults: function() {
		var self = this
		return {
			"name": "",
			"current": false,
			"hide": false,
			"order": self.order.nextOrder()
		}
	},
	order: {
		innerOrder: 1,
		nextOrder: function() {
			return this.innerOrder++
		}
	}
})

// the tags collection object
models.TagsCollection = Backbone.Collection.extend({
	model: models.Tag,
	comparator: "order",

	getVisual: function(flag) {
		return flag
			? this.where({"hide": true})
			: this.where({"hide": false})
	},
	getCurrent: function(flag) {
		return flag
			? this.where({"current": true})
			: this.where({"current": false})
	}
})

// model for option
models.Option = Backbone.Model.extend({
	defaults: {
		"type": "",
		"closeButtonState": false
	}
})



models.tagsCollection = new models.TagsCollection()
models.option = new models.Option()

})()