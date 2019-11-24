# Aurelia Extract Clean

[![Build Status](https://travis-ci.org/homer0/aurelia-extract-clean-loader.svg?branch=master)](https://travis-ci.org/homer0/aurelia-extract-clean-loader) [![Coverage Status](https://coveralls.io/repos/homer0/aurelia-extract-clean-loader/badge.svg?branch=master&service=github)](https://coveralls.io/github/homer0/aurelia-extract-clean-loader?branch=master) [![Dependencies status](https://david-dm.org/homer0/aurelia-extract-clean-loader.svg)](https://david-dm.org/homer0/aurelia-extract-clean-loader) [![Dev dependencies status](https://david-dm.org/homer0/aurelia-extract-clean-loader/dev-status.svg)](https://david-dm.org/homer0/aurelia-extract-clean-loader?type=dev)

Remove [Aurelia](http://aurelia.io) `require` tags of files that are being extracted using the Webpack's [Mini CSS extract plugin](https://yarnpkg.com/en/package/mini-css-extract-plugin).

> If you are wondering why I built this, go to the [Motivation](#motivation) section.

## Usage

On the `modules.rules` section of your Webpack configuration, you probably already have the `html-loader` to handle Aurelia's views, you just need to add `aurelia-extract-clean-loader` before it so it will take HTML, parse it and remove the extracted `require`s:

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

Now, it wouldn't be that cool if the loader removed ALL your `require`s assuming they are being extracted right? Well, for that reason is that **you need to add an special attribute** to the tags you want removed:

```html
<template>
  <require from="./my-styles.scss" extract="true"></require>
  <require from="some/component"></require>
<template>
```

On the case of the code above, the `require` for `my-styles` will be removed and the other won't.

## Options

The loader has a few options that you can modify if the default values don't suit your needs:

| Name             | Type     | Description                                                                                                  |
|------------------|----------|--------------------------------------------------------------------------------------------------------------|
| `extensions`     | `Array`  | The list of extensions to validate on the `require` tags. **Default:** `['css', 'scss', 'sass', 'less']`.    |
| `attributeName`  | `String` | The name of the attribute the `require` needs to have in order to be removed. **Default:** `'extract'`.      |
| `attributeValue` | `String` | The value of the custom attribute the `require` needs to have in order to be removed. **Default:** `'true'`. |

To modify any of them, just change the syntax to an object and use the `options` key:

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

### NPM/Yarn Tasks

| Task   | Description                         |
|--------|-------------------------------------|
| `test` | Run the project unit tests.         |
| `lint` | Lint the project code.              |
| `docs` | Generate the project documentation. |

### Repository hooks

I use [husky](https://yarnpkg.com/en/package/husky) to automatically install the repository hooks so the code will be tested and linted before any commit and the dependencies updated after every merge. The configuration is on the `husky` property of the `package.json` and the hooks' files are on `./utils/hooks`.

### Testing

I use [Jest](https://facebook.github.io/jest/) with [Jest-Ex](https://yarnpkg.com/en/package/jest-ex) to test the project. The configuration file is on `./.jestrc.json`, the tests are on `./tests` and the script that runs it is on `./utils/scripts/test`.

### Linting

I use [ESlint](http://eslint.org) with [my own custom configuration](http://yarnpkg.com/en/package/eslint-plugin-homer0) to validate all the JS code. The configuration file for the project code is on `./.eslintrc` and the one for the tests is on `./tests/.eslintrc`. There's also an `./.eslintignore` to exclude some files on the process. The script that runs it is on `./utils/scripts/lint`.

### Documentation

I use [ESDoc](http://esdoc.org) to generate HTML documentation for the project. The configuration file is on `./.esdocrc.json` and the script that runs it is on `./utils/scripts/docs`.

## Motivation

> I put this at the end because no one usually reads it :P.

A few weeks ago I started playing around with [Aurelia](http://aurelia.io) and I really liked it. I think one of the best features is how it solves separation of concerns by using the `require` tag on the views to specify the dependencies of the UI while keeping the controller/model focused on the logic.

Now, I'm also a big fan of [Webpack](https://webpack.js.org/), so is not surprise I'm using both of them together; but here's the problem that made me write this loader:

I'm sure any Webpack user out there uses, or at least is aware of, the [Mini CSS extract plugin](https://yarnpkg.com/en/package/mini-css-extract-plugin) (the updated version of the old [Extract Text Plugin](https://github.com/webpack-contrib/extract-text-webpack-plugin)): A plugin that takes all the chunks of an specific type and puts them together on a single file.

Most people (like me) uses it to extract stylesheets and create a "style bundle".

The problem is that when you have a `require` tag for a stylesheet (or any file) that is going to be extracted by the the plugin, the contents of the file end up on your extracted bundle, but since the tag is still on the template, Aurelia will try to access it on runtime and kill your app with an error.

The way this was solved on [the official Aurelia Webpack skeleton](https://github.com/aurelia/skeleton-navigation/blob/master/skeleton-esnext-webpack/) was by [removing the Extract Text Plugin from the stylesheets required by views](https://github.com/aurelia/skeleton-navigation/blob/master/skeleton-esnext-webpack/webpack.config.js#L62-L68) and let Aurelia inject the styles on the `<head>` during runtime.

I really wanted to use the plugin and put all my styles on a bundle and only inject on the `<head>` what I consider important, but the only workaround was to do and `import`/`require` on the model/controller file, so it wouldn't be detected by Aurelia.

Well, that's why I wrote this loader: **I want to `require` my stylesheets on my views and I want the Mini CSS extract plugin to bundle them**.
