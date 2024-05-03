import { Logger } from 'tslog';

// const BG_GRAY = '\x1b[47m';
const UNDERLINE = '\x1b[4m';
const FG_GRAY = '\x1b[90m';

const logger = new Logger({ name: 'foo', prettyLogTemplate: `${FG_GRAY}{{hh}}${FG_GRAY}:{{MM}}${FG_GRAY}:{{ss}} {{logLevelName}} ${UNDERLINE}{{fileNameWithLine}}\t ` });

export default logger;