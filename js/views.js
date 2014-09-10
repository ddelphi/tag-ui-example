
(function () {


var Backbone = window.Backbone
var _ = window._
var $ = window.jQuery
var app = window.app

var eventSystem = app.eventSystem
var models = app.models



/*
	view things
*/



var OptionView = Backbone.View.extend({
	model: models.option,
	el: "#option",

	initialize: function() {
		this.uis = {
			"$normal": this.$el.find("#normal"),
			"$group": this.$el.find("#group")
		}
		this.lastHighlightElem = this.uis.$normal
		this.initEvents()
	},
	initEvents: function() {
		this.events = {
			"click #normal": "onNormalState",
			"click #group": "onGroupState",
			"click .showCloseBtn": "showCloseBtn"
		}
		this.listenTo(this.model, "change:type", this.onTypeChange)
	},

	/**/

	onTypeChange: function(model) {
		var name = "$" + model.get("type")
		var curElem = this.uis[name]

		this.lastHighlightElem.toggleClass("highlight", false)
		curElem.toggleClass("highlight", true)
		this.lastHighlightElem = curElem
	},
	onNormalState: function() {
		this.model.set({
			"type": "normal"
		})
	},
	onGroupState: function() {
		this.model.set({
			"type": "group"
		})
	},
	showCloseBtn: function() {
		var old = this.model.get("closeButtonState")
		this.model.set({
			"closeButtonState": !old
		})
	}
})



var TagsWellView = Backbone.View.extend({
	el: "#tag",

	initialize: function() {
		this.uis = {
			"$inner": this.$el.find(".tag-inner"),
			"$footer": this.$el.find(".tag-ft")
		}
		this.initEvents()
	},
	initEvents: function() {
		this.listenTo(models.tagsCollection, "add", this.onAddOne)
		this.listenTo(models.option, "change:closeButtonState", this.showCloseBtn)
		eventSystem.on("db/tags", this.getTags.bind(this))
	},

	/**/

	onAddOne: function(model) {
		var view = new TagSingleView({"model": model})
		this.uis.$inner.append(view.render().$el)
	},
	showCloseBtn: function(model) {
		var flag = model.get("closeButtonState")
		this.uis.$inner.toggleClass("showClose", flag)
	},
	getTags: function(tags) {
		if (!_.isArray(tags)) { return }
		models.tagsCollection.add(tags)
	}
})



var TagSingleView = Backbone.View.extend({
	model: null,
	template: _.template($(".template.tag-single").html()),

	initialize: function() {
		this.initEvents()
	},
	initEvents: function() {
		this.events = {
			"click .title": "onItemClick",
			"mousedown .title": "onItemMiddleClick",
			"click .close": "onCloseClick"
		}
		this.listenTo(this.model, "change:current", this.onCurrentState)
	},

	/**/

	render: function() {
		this.$el.html(this.template(this.model.toJSON()))
		return this
	},
	onCurrentState: function(model) {
		var flag = model.get("current")
		this.$el.toggleClass("current", flag)
	},
	onItemClick: function(evt) {
		if (!evt.ctrlKey) { return }
		var old = this.model.get("current")
		this.model.set({"current": !old})
		eventSystem.trigger("tag/addCurrent", this.$el)
	},
	onItemMiddleClick: function(evt) {
		if (evt.button !== 1) { return }
		this.onCloseClick()
	},
	onCloseClick: function() {
		var self = this
		self.model.destroy()
		self.$el.animate({
			"opacity": 0
		}, 300, function() {
			self.remove()
			eventSystem.trigger("tag/remove", this.$el)
		})
	}
})



var CurrentTagsWellView = Backbone.View.extend({
	el: "#currentTag",

	initialize: function() {
		this.uis = {
			"$inner": this.$el.find(".currentTag-inner"),
			"$footer": this.$el.find(".currentTag-ft")
		}
		this.initEvents()
	},
	initEvents: function() {
		this.listenTo(models.tagsCollection, "add", this.onCurrentTag)
		this.listenTo(models.tagsCollection, "change", this.onCurrentTag)
		this.listenTo(models.option, "change:closeButtonState", this.showCloseBtn)
	},

	/**/

	showCloseBtn: function(model) {
		var flag = model.get("closeButtonState")
		this.uis.$inner.toggleClass("showClose", flag)
	},
	onCurrentTag: function(model) {
		if (!model.get("current")) { return }
		var view = new CurrentTagSingleView({"model": model})
		this.uis.$inner.append(view.render().$el)
	}
})



var CurrentTagSingleView = Backbone.View.extend({
	model: null,
	template: _.template($(".template.currentTag-single").html()),

	initialize: function() {
		this.initEvents()
	},
	initEvents: function() {
		this.events = {
			"click .title": "onItemClick",
			"mousedown .title": "onItemMiddleClick",
			"click .close": "onCloseClick"
		}
		this.listenTo(this.model, "change", this.onStateChange)
		this.listenTo(this.model, "destroy", this.onCloseClick)
	},

	/**/

	render: function() {
		var html = this.template(this.model.toJSON())
		this.$el.html(html)
		return this
	},
	onStateChange: function(model) {
		var self = this
		var flag = model.get("current")
		if (!flag) {
			self.$el.animate({
				"opacity": 0
			}, 300, function() {
				self.remove()
			})
		}
	},
	onItemClick: function(evt) {
		this.$el.toggleClass("current")
		eventSystem.trigger("currentTag/click", this.$el)
	},
	onItemMiddleClick: function(evt) {
		if (evt.button !== 1) { return }
		this.onCloseClick()
	},
	onCloseClick: function() {
		this.model.set("current", false)
		eventSystem.trigger("currentTag/remove", this.$el)
	}
})



optionView = new OptionView()
tagsWellView = new TagsWellView()
currentTagsWellView = new CurrentTagsWellView()


})()
