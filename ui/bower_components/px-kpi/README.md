# px-kpi [![Build Status](https://travis-ci.org/PredixDev/px-kpi.svg?branch=master)](https://travis-ci.org/PredixDev/px-kpi)

## Overview

`Px-kpi` is a Predix UI component used for displaying KPIs in a dashboard layout. KPIs may be displayed as a tile with one large number or value, with an optional spark line/bar, or as a short px-kpi-list with multiple numeric values and labels. The list layout is not recommended for more than about 6 items.

## Usage

### Prerequisites
1. node.js
2. npm
3. bower
4. [webcomponents-lite.js polyfill](https://github.com/webcomponents/webcomponentsjs)

Node, npm and bower are necessary to install the component and dependencies. webcomponents.js adds support for web components and custom elements to your application.

## Getting Started

First, install the component via bower on the command line:

```
bower install px-kpi --save
```

Second, import the component in your application with the following tag in your head:

```
<link rel="import" href="/bower_components/px-kpi/px-kpi.html"/>
// and/or:
<link rel="import" href="/bower_components/px-kpi/px-kpi-list.html"/>
```

Finally, use the component in your application:

```
<px-kpi label="Availability" value="100" uom="%" status-icon="circle" status-color="green" spark-type="line" spark-data="[{"x":1397102460000,"y":0.5},...]"></px-kpi>
// and/or:
<px-kpi-list label="Asset 123456" values=[{"label":"Availability","value":"99","uom":"%"},...] status-icon="circle" status-color="green" footer="Last 7 Days"></px-kpi-list>
```

<br />
<hr />

## Documentation

Read the full API and view the demo [here](https://predixdev.github.io/px-kpi).

The documentation in this repository is supplemental to the official Predix documentation, which is continuously updated and maintained by the Predix documentation team. Go to [http://predix.io](http://predix.io)  to see the official Predix documentation.


## Local Development

From the component's directory...

```
$ npm install
$ bower install
$ gulp sass
```

From the component's directory, to start a local server run:

```
$ gulp serve
```

The root of that server (e.g. http://localhost:8080/) will automatically open in your default browser with the API documentation page and interactive working examples.

`gulp serve` also runs `gulp watch` concurrently so that when you make a change to your source files and save them, your preview will be updated in any browsers you have opened and turned on in LiveReload.

### GE Coding Style Guide
[GE JS Developer's Guide](https://github.com/GeneralElectric/javascript)

<br />
<hr />

## Known Issues

Please use [Github Issues](https://github.com/PredixDev/px-kpi/issues) to submit any bugs you might find.
