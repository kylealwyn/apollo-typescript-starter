import { lstatSync, readdirSync } from 'fs';
import { join } from 'path';

export const isDirectory = (source: string): Boolean => lstatSync(source).isDirectory();
export const getDirectories = (source: string): Array<string> =>
  readdirSync(source)
    .map(name => join(source, name))
    .filter(isDirectory);
