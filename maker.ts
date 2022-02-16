import Maker, {MakerOptions} from "@electron-forge/maker-base";
import MakerZIP from "@electron-forge/maker-zip";
import {basename} from "path";
import SquirrelMacBase, {SquirrelMacConfig} from "./base";

export class MakerSquirrelMac extends Maker<SquirrelMacConfig> {
    name = "Squirrel.Mac";
    defaultPlatforms = ["darwin"];

    squirrelMacBase: SquirrelMacBase;

    constructor(config: SquirrelMacConfig) {
        super(config);
        this.squirrelMacBase = new SquirrelMacBase(config);
    }

    zipMaker = new MakerZIP();

    isSupportedOnCurrentPlatform(): boolean {
        return process.platform === "darwin";
    }

    async make(makerOpts: MakerOptions): Promise<string[]> {
        const zipResult = await this.zipMaker.make(makerOpts);
        const {makeDir, packageJSON, targetArch} = makerOpts;

        const filepath = await this.squirrelMacBase.run(basename(zipResult[0]), targetArch, packageJSON, makeDir);

        return [...zipResult, filepath];
    }
}

export default MakerSquirrelMac;
