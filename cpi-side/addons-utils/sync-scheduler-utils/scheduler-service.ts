import * as fs from "fs";
import path from 'path'

export class SchedulerService {

    async manipulateUserDb(params): Promise<void>{
        const userId: number = params.UserID
        const distId: number = params.DistributorID
        const date = new Date(params.SqliteTimeStamp)

        const dbPath = await this.getDbPath(distId, userId)
        await fs.promises.utimes(dbPath, date, date);
    }

    private async getDbPath(distId: number, userId: number): Promise<string> {
        let fullDbPath = '';
        try {
            const rootPath: string = await global['app']['wApp'].constructor.getRootPath()
            const iswebApp = await pepperi.environment.isWebApp()
    
            const userDbPath = `${userId}.sqlite`;
            const distributorDir = iswebApp ? path.join(rootPath, '..', '..') : path.dirname(rootPath);

            fullDbPath = iswebApp ? path.join(distributorDir, distId.toString(), 'WrapperDbs', userDbPath) : path.join(distributorDir, distId.toString(), userDbPath);
            console.log(`SyncScheduler scheduled job Test - DB path: ${fullDbPath}`);
        } catch (error: any) {
            const msg = `Error found during db path construction: ${error.message}`;
            console.error(msg);
            throw new Error(msg);
        }
        return fullDbPath;
    }
}