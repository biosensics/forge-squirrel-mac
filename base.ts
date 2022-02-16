import {AxiosRequestHeaders} from "axios";
import axios from "axios";
import {join as pathJoin} from "path";
import semverGt from "semver/functions/gt";
import {mkdir, writeFile} from "fs/promises";

export interface SquirrelMacConfig {
    releasesUrl: string,
    requestHeaders?: AxiosRequestHeaders,
    replaceExisting?: boolean,
}

interface ReleaseBody {
    version: string,
    updateTo: {
        version: string,
        pub_date?: string,
        name?: string,
        notes?: string,
        url: string,
    }
}

export default class SquirrelMacBase {
    config: SquirrelMacConfig;

    constructor(config: SquirrelMacConfig) {
        this.config = config;
    }

    async run(zipName: string, arch: string, packageJSON: any, makeDir: string) {
        const filename = `RELEASES-${arch}.json`;
        const baseUrl = this.config.releasesUrl.replace(/\/+$/, "");

        const res = await axios.get(`${baseUrl}/${filename}`, {validateStatus: null, headers: this.config.requestHeaders});

        let releasesJson;
        if(res.status === 200) {
            releasesJson = res.data;
        } else if(res.status === 404) {
            console.debug("No existing releases json file found; creating one from empty");
            releasesJson = {
                currentRelease: "",
                releases: [] as ReleaseBody[],
            };
        } else {
            throw new Error(`Error while retrieving existing releases file: [${res.status}] ${res.statusText}`);
        }

        const releaseBody: ReleaseBody = {
            version: packageJSON.version,
            updateTo: {
                version: packageJSON.version,
                pub_date: new Date().toISOString(),
                name: packageJSON.version,
                url: `${baseUrl}/${zipName}`
            },
        };

        const indexOfVersion = releasesJson.releases.findIndex((r: ReleaseBody) => r.version === releaseBody.version);
        if(indexOfVersion >= 0) {
            if(!this.config.replaceExisting)
                throw new Error("This version already has a release published! Use `replaceExisting` option to replace the previously published version");
            releasesJson.releases.splice(indexOfVersion, 1, releaseBody);
        } else {
            releasesJson.releases.push(releaseBody);
        }

        if(!releasesJson.currentRelease || semverGt(releaseBody.version, releasesJson.currentRelease)) {
            releasesJson.currentRelease = releaseBody.version;
        }

        await mkdir(makeDir, {recursive: true});
        const filepath = pathJoin(makeDir, filename);

        await writeFile(filepath, JSON.stringify(releasesJson));

        return filepath;
    }
}
