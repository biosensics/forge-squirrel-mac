import {basename, dirname} from "path";
import PluginBase from "@electron-forge/plugin-base";
import {ForgeMakeResult} from "@electron-forge/core";
import {ForgeConfig} from "@electron-forge/shared-types";
import SquirrelMacBase, {SquirrelMacConfig} from "./base";


export class PluginSquirrelMac extends PluginBase<SquirrelMacConfig> {
    name = "PluginSquirrelMac";
    squirrelMacBase: SquirrelMacBase;

    constructor(config: SquirrelMacConfig) {
        super(config);
        this.squirrelMacBase = new SquirrelMacBase(config);
    }

    getHook(hookName: string) {
        if(hookName === "postMake")
            return this.postMake.bind(this);

        return null;
    }

    async postMake(config: ForgeConfig, makeResults: ForgeMakeResult[]) {
        const zipTest = RegExp.prototype.test.bind(/\.zip$/);
        const zipResult = makeResults.find(mr => mr.artifacts.some(zipTest));

        if(!zipResult) {
            throw new Error("PluginSquirrelMac: No zip file found in make results. Please ensure the zip maker is included in your forge config.");
        }

        const zipArtifact = zipResult.artifacts.find(zipTest)!;

        const filepath = await this.squirrelMacBase.run(basename(zipArtifact), zipResult.arch, zipResult.packageJSON, dirname(zipArtifact));


        const releasesResult = {
            ...zipResult,
            artifacts: [filepath],
        };

        return [...makeResults, releasesResult];
    }
}

export default PluginSquirrelMac;
