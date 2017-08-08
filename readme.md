# AnnotationComments : Collaborate in your VideoJS player

### Goals

- Provide useful collaboration features including annotations, comments/replies, ranged time markers, and more. All with intuitive controls.
- Everything is contained within the player. There is no need to build additional UI components. Just install VideoJS, register the plugin, and start collaborating.
- The plugin can be integrated with existing commenting systems. Custom events are available for communicating with external APIs, providing support for on-page interactions and data persistence. **(In the works)*

### VideoJS Plugins

[VideoJS](http://docs.videojs.com/) is a popular open source HTML5 video player library used by 400k+ sites. As of v6, there is an extendable plugin architecture which was used to create this plugin. Here are some [examples of other VideoJS plugins.](https://github.com/videojs/video.js/wiki/Plugins). This plugin is built against [VideoJS v 6.2.0](https://www.npmjs.com/package/video.js/)

### Add it to your VideoJS player

```javascript
// Initialize VideoJS
var player = videojs('video-id');

// Add plugin after video meta data is finished
// Options here are set to defaults
player.on('loadedmetadata', function() {
    player.annotationComments({
        // Collection of annotation data to initialize
        annotationObjects: [],
        // Use arrow keys to move through annotations when Annotation mode is active
        bindArrowKeys: true,
        // Flexible meta data object. Currently used for user data
        meta: { user_id: null, user_name: null },
        // Show or hide the control panel and annotation toggle button
        showControls: true,
        // Show or hide the comment list when an annotation is active
        // If false, the text 'Click and drag to select', will follow the cursor during annotation mode
        showCommentList: true,
        // If false, annotations mode will be disabled in fullscreen
        showFullScreen: true,
        // Show or hide the tool tips on marker hover
        showMarkerTooltips: true,
        // If false, step two of adding annotations (writing and saving the comment) will be disabled
        internalCommenting: true,
        // If true, toggle the player to annotation mode right after init
        startInAnnotationMode: false
    });
});
```

### Programmatic Control

If you'd like to drive the plugin or render plugin data through external UI elements, you can configure the plugin to hide the internal components and pass data through custom events. There are two kinds of AnnotationComments API events, _externally fired_ and _internally fired_.

##### Supported Externally Fired Events:

```javascript
// openAnnotation : Opens an annotation within the player given an ID
plugin.fire('openAnnotation', { id: myAnnotationId });

// closeActiveAnnotation : Closes any active annotation
plugin.fire('closeActiveAnnotation');

// newAnnotation : Adds a new annotation within the player and opens it given comment data
plugin.fire('newAnnotation', {
    id: 1,
    range: { start: 20, end: null },
    shape: {
        x1: null,
        x2: null,
        y1: null,
        y2: null
    }
    commentStr: ""
});

// destroyAnnotation : Removes an annotation and it's marker within the player given comment data
plugin.fire('destroyAnnotation', { id: 1 });

// addingAnnotation : Plugin enters the adding annotation state
plugin.fire('addingAnnotation');

// cancelAddingAnnotation : Plugin exists the adding annotation state
plugin.fire('cancelAddingAnnotation');

// toggleAnnotationMode : toggle annotation mode to alternative on/off value
plugin.fire('toggleAnnotations');
```

##### Supported Internally Fired Events:

```javascript
// annotationOpened : Fired whenever an annotation is opened
plugin.on('annotationOpened', (event) => {
    // event.detail =
    // {
    //      annotation: (object) annotation data in format {id:.., comments:..., range:..., shape:...},
    //      triggered_by_timeline: (boolean) TRUE = the event was triggered via a timeline action (like scrubbing or playing), FALSE = the annotation was opened via marker click, UI button interactions, or API/event input
    // }
});

// annotationClosed : Fired whenever an annotation is closed
plugin.on('annotationClosed', (event) => {
    // event.detail = annotation (object) in format {id:.., comments:..., range:..., shape:...}
});

// addingAnnotationDataChanged : Fired from adding annotation state if:
//  1. the marker is dragged
//  2. the start of the marker is moved via control buttons
//  3. the shape is dragged
plugin.on('addingAnnotationDataChanged', (event) => {
    var newRange = event.detail.range; // returns range data if range was changed
    var newShape = event.detail.shape; // returns shape data if shape was changed
    // do something with the data
});

// annotationDeleted : Fired when an annotation has been deleted via the UI
plugin.on('annotationDeleted', (event) => {
    // annotationId = event.detail
});

// enteredAnnotationMode : Fired when the plugin enters adding annotation mode
// includes initial range data
plugin.on('enteredAddingAnnotation', (event) => {
    var startTime = event.detail.range.start;
    // do something when adding annotation state begins
});

// onStateChanged: Fired when plugin state has changed (annotation added, removed, etc)
// This is a way to watch global plugin state, as an alternative to watching various annotation events
plugin.on('onStateChanged', (event) => {
    // event.detail = annotation state data
});

// playerBoundsChanged : Fired when the player boundaries change due to window resize or fullscreen mode
plugin.on('playerBoundsChanged', (event) => {
    var bounds = event.detail;
    // do something with the new boundaries
});

// Entering annotation mode (annotation icon was clicked when previously 'off')
plugin.on('annotationModeEnabled', (event) => {
    // do something
});

// Exiting annotation mode (annotation icon was clicked when previously 'on')
plugin.on('annotationModeDisabled', (event) => {
    // do something
});
```

### Develop and Build

We're using [npm](https://www.npmjs.com/) for package management and [gulp](https://github.com/gulpjs/gulp) as our build system.

The fastest way to get started:
- Clone the repo
- Run `npm install`
- Run `npm install -g gulp`
- Run `gulp build`
- Run `gulp watch`
- Visit `http://localhost:3004/test.html` to see the magic happen.

#### Templates

We're using the handlebars templating library to render various components within the plugin. For performance, the templates are pre-compiled into a JS file within the development environment. That way we only need to require the runtime, saving nearly 100kb from the minified build! ⚡️

The `gulp templates` task is used to precompile every template within the `/src/templates` directory. The destination file is `/src/compiled_templates.js`.

#### Testing

##### Feature tests

Feature tests are currently browser-based and run by visiting `http://localhost:3004/mocha/features/index.html`. Feature tests can be added as files in the `/test/mocha/features/` directory and then included within the `index.html` file as an external script. In the future, running these tests should be automated through phantomJS and a gulp task.

##### Unit tests

Unit tests are run through the `gulp test` task. If the `tdd` task is included in `gulp watch`, the tests will run with every change to the test files. Each module should have a corresponding unit test file within the `/test/mocha/modules` directory.

#### Gulp commands

`gulp watch`: Fires up webserver @ `http://localhost:3004/test.html` and watches for any file changes in `/src` (which repackages and transpiles to unminified file in `/build`)

`gulp transpile`: Transpiles modules/files to build file in `/build` with JS maps

`gulp build`: Runs transpile then minifies to distribution filename in `/build` with attribution

`gulp templates`: Uses handlebars cli to pre-compile templates into a javascript file. See Templates section above.

`gulp test`: Runs the mocha unit tests within the `/test/mocha/modules/` directory.

`gulp lint`: Runs jshint linter on javascript files in `/src`
