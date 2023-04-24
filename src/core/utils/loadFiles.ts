import getGlobedFiles from '@/core/utils/getGlobedFiles';
import path from 'path';

export default async function loadFiles<T>(fullPath: string) {
    const routerPath = path.resolve(fullPath);
    const globedFiles = getGlobedFiles(routerPath);

    const files: T[] = await Promise.all(
        globedFiles.map(async (path: string) => {
            const file = await import(path);
            return file.default;
        })
    );

    return files;
}
