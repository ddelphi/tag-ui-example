#tag ui example

##overview

This is an example of tag UI using Backbonejs framework.

##introduce

There are some models or collections:
	
	Option
	TagsCollection
	Tag

Quick introduction about the page:
	
* **the first block**

	The `normal` and `group` are two types in Option model. (but no effect in this example)

	The `show close button` will show the close button after the tag items below.

* **the second block**

	This is the block that contains the normal tags, which data will come from the event "db/tags".

	`ctrl` + `click` will make the tag to be the current state tag, and will show in the third block.

	`middle click` will delete the tag.

	`click` the close button will also delete the tag.

* **the third block**

	This is the block that contains the current state tag set by the second block.
	
	`click` the tag will highlight the tag.
	
	`middle click` will delete the tag, and also turn the tag which in the second block to normal state.


