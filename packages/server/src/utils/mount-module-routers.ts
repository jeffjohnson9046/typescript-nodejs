/**
 * Module for loading the route(s) for each component/module within the application.
 *
 * @module mountMolduleRouters
 */
import { Router } from "express";
import glob from "glob";
import path from "path";

/**
 * Add route(s) from each module to the {@link Router}.
 *
 * @param router {Router} The root application router for the application
 * @param dir (string) The root directory where the sub routers are stored
 */
function mountMolduleRouters(router: Router, dir: string): void {
    const routerFiles = glob.sync(`${dir}/**/*.routes.ts`);

    routerFiles.forEach((routerFile: string) => {
        const routerModuleName = routerFile.split(".").slice(0, -1).join(".");
        const moduleRouter = require(`${routerModuleName}`);
        const moduleMountPoint = `/${path.basename(routerFile, ".routes.ts")}`;

        console.info(
            `mounting ${path.basename(routerFile)} -> ${moduleMountPoint}`,
        );
        router.use(moduleMountPoint, moduleRouter.default);
    });
}

export default mountMolduleRouters;
