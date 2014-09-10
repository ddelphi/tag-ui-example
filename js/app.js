(function() {

// create the global namespace
var app = {}
app.oldApp = window.app

app.noConflict = function() {
	return app.oldApp ? app.oldApp : app
}
	
window.app = app

})()