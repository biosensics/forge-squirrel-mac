# forge-squirrel-mac
A package containing both a Maker and Plugin for electron-forge that automatically generates a JSON file compatible with Squirrel.Mac for static hosting on services such as S3.  
The Maker variant will also generate the zip package required for Squirrel.Mac to download the update.

## Maker Usage
```ts
// forge.config.js
{
    // ...
    makers: [
        // ... (recommended to use some other maker for
        // initial distribution to users, such as dmg)
        {
            name: "forge-squirrel-mac/plugin",
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
            "forge-squirrel-mac/plugin",
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

- `releasesUrl`: The URL where releases are hosted. This is only needed to retrieve the existing Squirrel.Mac releases json file, the name of which will be appended to the given URL. For example: if the releases JSON file is available at `http://example.com/path/releases.json`, the URL `http://example.com/path` should be provided. This URL is also used as the base for the URLs for releases listed in the JSON file, so any releases should be available adjacent to the hosted release JSON file. When using the `@electron-forge/publisher-s3` package, this should be the case automatically when using either the plugin or maker variant of this package.
- `overwriteExisting`: In the event that there is an existing releases JSON file at the given URL, and that file contains a release of the same version as currently being built, this option will cause the existing version to be overwritten in the updated releases JSON file. Otherwise, the maker/plugin will error.
- `requestHeaders`: An Axios request headers object to be provided with the request to retrieve the releases JSON file. Allows for authentication keys to be provided if needed.
