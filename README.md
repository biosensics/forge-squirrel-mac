<a href="https://github.com/biosensics/forge-squirrel-mac/blob/master/LICENSE">
  <img src="https://img.shields.io/github/license/biosensics/forge-squirrel-mac" alt="npm-version" />
</a>
<a href="https://www.npmjs.com/package/@biosensics/forge-squirrel-mac">
  <img src="https://img.shields.io/npm/v/@biosensics/forge-squirrel-mac" alt="license" />
</a>
<a href="https://github.com/biosensics/forge-squirrel-mac">
  <img src="https://img.shields.io/badge/repo--blue?logo=GitHub" alt="license" />
</a>
<a href="https://github.com/biosensics/forge-squirrel-mac/issues">
  <img src="https://img.shields.io/github/issues/biosensics/forge-squirrel-mac?logo=github" alt="license" />
</a>

# forge-squirrel-mac
A package containing both a Maker and Plugin for electron-forge that automatically generates a JSON file compatible with Squirrel.Mac for static hosting on services such as S3.  
The Maker variant will also generate the zip package required for Squirrel.Mac to download the update.

This package was originally designed for use with `@electron-forge/publisher-s3`, but should be usable with any static file host publisher if provided with the correct URL.

## Maker Usage
```ts
// forge.config.js
{
    // ...
    makers: [
        // ... (recommended to use some other maker for
        // initial distribution to users, such as dmg)
        {
            name: "@biosensics/forge-squirrel-mac/maker",
            config: {
                releasesUrl: "http://remote.releases.com/path",
                overwriteExisting: true, // optional
                requestHeaders: { // optional
                    header: "value"
                }
            }
        }
        // ...
    ]
    // ...
}
```

## Plugin Usage
```ts
// forge.config.js
{
    makers: [
        // ...
        { // Requires zip maker for at least darwin (macos) platform
            name: "@electron-forge/maker-zip",
            platforms: ["darwin"]
        }
    ]
    // ...
    plugins: [
        [
            "@biosensics/forge-squirrel-mac/plugin",
            {
                releasesUrl: "http://remote.releases.com/path",
                overwriteExisting: true, // optional
                requestHeaders: { // optional
                    header: "value"
                }
            }
        ]
    ]
    // ...
}
```

## Common Config
Current config options:

- `releasesUrl`: The URL where releases are hosted. This is used to retrieve the Squirrel.Mac releases JSON file if it exists, as well as to build URLs for Squirrel.Mac to download releases from. This URL should be the base URL where the JSON file and releases will be hosted. When using the `@electron-forge/publisher-s3` package, this would be equivalent to `https://{BUCKET}.s3.amazonaws.com/{FOLDER}` where `{BUCKET}` and `{FOLDER}` are the values passed to the corresponding config options for the S3 publisher.  

  _Example_: if the releases JSON file is available at `http://example.com/path/releases.json`, the URL `http://example.com/path` should be provided.
- `overwriteExisting`: In the event that there is an existing releases JSON file, and that file contains a release of the same version as is currently being built, this option will cause the existing version to be overwritten in the updated releases JSON file. Otherwise, the maker/plugin will error.
- `requestHeaders`: An Axios request headers object to be provided with the request to retrieve the releases JSON file. Allows for authentication keys to be provided if needed.
