import * as glob from 'glob';
import { isArray, isString, unique } from 'radash';

export default function getGlobedFiles(patterns: string | string[], remove?: string) {
    const urlRegex = new RegExp('^(?:[a-z]+:)?\\/\\/', 'i');
    let output: string[] = [];

    if (isArray(patterns)) {
        patterns.forEach((pattern) => {
            const nonUniqueFiles = getGlobedFiles(pattern, remove);
            output = unique(nonUniqueFiles);
        });
    } else if (isString(patterns)) {
        if (urlRegex.test(patterns)) {
            output.push(patterns);
        } else {
            let files = glob.sync(patterns);

            if (remove) {
                files = files.map((file) => file.replace(remove, ''));
            }

            output = unique(files);
        }
    }

    return output;
}
