// @ts-ignore
import { name } from '../package.json';

const DEFAULT_CONFIG: Setting = {
    logLevel: LogLevel.DEBUG,
    logModule: [ '*' ],
    database: name,
};


let config = Object.create(DEFAULT_CONFIG);

export const update = (setting: SettingPartial) => {
    config = { ...config, ...setting };
};

export const get = () => config;
