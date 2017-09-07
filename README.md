# Aurelia Extract Clean

[![Build Status](https://travis-ci.org/aurelia-extract-clean-loader.svg?branch=master)](https://travis-ci.org/aurelia-extract-clean-loader) [![Coverage Status](https://coveralls.io/repos/aurelia-extract-clean-loader/badge.svg?branch=master&service=github)](https://coveralls.io/github/aurelia-extract-clean-loader?branch=master) [![Dependencies status](https://david-dm.org/aurelia-extract-clean-loader.svg)](https://david-dm.org/aurelia-extract-clean-loader) [![Dev dependencies status](https://david-dm.org/aurelia-extract-clean-loader/dev-status.svg)](https://david-dm.org/aurelia-extract-clean-loader#info=devDependencies)

Remove [Aurelia](http://aurelia.io) `require` tags of files that are being extracted using the Webpack's [Extract Text Plugin](https://github.com/webpack-contrib/extract-text-webpack-plugin).

## The motivation

A few weeks ago I started playing around with [Aurelia](http://aurelia.io) and I really liked it. I think one of the best features is how it solves separation of concerns by using the `require` tag on the views to specify the dependencies of the UI while keeping the controller/model focused on just handling that view.

Now, I'm also a big fan of [Webpack](https://webpack.js.org/), so is not surprise I'm using both of them together, and here's the problem that made me write this loader:

I'm sure any Webpack user out there uses, or at least is aware of, the [Extract Text Plugin](https://github.com/webpack-contrib/extract-text-webpack-plugin): A plugin that takes all the chunks of an specific type and puts them together on a single file. Most people (like m) uses it to extract stylesheets and create some sort of `bundle.css`.

The problem is that when you have a `require` tag for a stylesheet (or any file) that is going to be extracted by the the Extract Text Plugin, the contents of the file end up on your extracted bundle, but since the tag is still on the template, Aurelia will try to access it on runtime and kill your app with an error.

The way this was solved on [the official Aurelia Webpack skeleton](https://github.com/aurelia/skeleton-navigation/blob/master/skeleton-esnext-webpack/) was by [removing the Extract Text Plugin from the stylesheets required by views](https://github.com/aurelia/skeleton-navigation/blob/master/skeleton-esnext-webpack/webpack.config.js#L62-L68) and let Aurelia inject the styles on the `<head>` during runtime.

Now, I really wanted to use the Extract Text Plugin and keep all my styles on only one bundle and only inject on the `<head>` what I consider important, and the only workaround was to do and `import`/`require` on the model/controller file, so I wouldn't be interpreted by Aurelia.

Well, that's why I wrote this loader: **I want to `require` my stylesheets on my views and I want the Extract Text Plugin to bundle them**.

## Information

| -            | -                                                                  |
|--------------|--------------------------------------------------------------------|
| Package      | aurelia-extract-clean-loader                                                 |
| Description  | Remove Aurelia require tags of files that are being extracted using the Webpack's Extract Text Plugin. |
| Node Version | >= v6.10.0                                                          |

## Usage

### Basic

On the `modules.rules` section of your Webpack configuration, you probably already have the `html-loader` to handle Aurelia's views so you just need to add `aurelia-extract-clean-loader` before it so it will take HTML as a string, parse it and remove the extracted `require`s:

```js
...
{
  test: /\.html$/,
  use: [
    'aurelia-extract-clean-loader',
    'html-loader',
  ],
},
...
```

Now, it wouldn't be that cool if the loader removed ALL your `require`s assuming they are being extracted right? Well, for that reason is that you need to add an special attribute to the tags you want removed:

```html
<template>
  <require from="./my-styles.scss" extract="true"></require>
  <require from="some/component"></require>
<template>
```

On the case of the code above, the `require` for `my-styles` will be removed and the other won't.

### Options

The loader has a few options that you can modify if the default values doesn't suit your needs:

| Name             | Type     | Description                                                                                              |
|------------------|----------|----------------------------------------------------------------------------------------------------------|
| `extensions`     | `Array`  | The list of extensions to validate on the `require` tags. **Default:** `['css', 'scss', 'sass', 'less']`.|
| `attributeName`  | `String` | The name of the attribute the `require` needs to have to be removed. **Default:** `'extract'`.           |
| `attributeValue` | `String` | The value of the custom attribute the `require` needs to have to be removed. **Default:** `'true'`.      |

To modify any of them, just use the `options` syntax:

```js
...
{
  test: /\.html$/,
  use: [
    {
      loader: 'aurelia-extract-clean-loader',
      options: {
        extensions: ['xcss'],
        attributeName: 'remove',
        attributeValue: 'yes',
      },
    },
    'html-loader',
  ],
},
...
```

That example would make the loader remove `require` tags like this one:

```html
<template>
  <require from="some-weird-file.xcss" remove="yes"></require>
</template>
```

## Development

Before doing anything, install the repository hooks:

```bash
[npm-yarn] run install-hooks
```

### [NPM-Yarn] Tasks

| Task                           | Description                         |
|--------------------------------|-------------------------------------|
| `[npm-yarn] run install-hooks` | Install the GIT repository hooks.   |
| `[npm-yarn] test`              | Run the project unit tests.         |
| `[npm-yarn] run lint`          | Lint the project code.              |
| `[npm-yarn] run docs`          | Generate the project documentation. |

### Testing

I use [Jest](https://facebook.github.io/jest/) to test the project. The configuration file is on `./.jestrc.json`, the tests are on the `./tests` directory and the script that runs them is on `./utils/scripts/test`.

### Linting

I use [ESLint](http://eslint.org) to validate all the JS code. The main configuration file is on `./.eslintrc`, there's also an `./.eslintignore` to ignore some files on the process, and the script that runs it is on `./utils/scripts/lint`.

It's worth mentioning that there's another `.eslintrc` inside the `tests` directory that enables the `jest` environment.

### Documentation

I use [ESDoc](http://esdoc.org) to generate HTML documentation for the project. The configuration file is on `./.esdocrc.json` and the script that runs it is on `./utils/scripts/docs`.