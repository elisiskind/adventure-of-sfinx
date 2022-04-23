enum Loglevel {
  ERROR = 1,
  WARN = 2,
  INFO = 3,
  DEBUG = 4,
}

type Level = Lowercase<keyof typeof Loglevel>;

export class Logging {
  private static _logLevel = Loglevel.DEBUG;

  static debug = (msg: any, ...more: any[]) => {
    if (Logging._logLevel >= 4) {
      console.debug(this.prefix("debug"), msg, ...more);
    }
  };

  static info = (msg: any, ...more: any[]) => {
    if (Logging._logLevel >= 3) {
      console.info(this.prefix("info"), msg, ...more);
    }
  };

  static warn = (msg: any, ...more: any[]) => {
    if (Logging._logLevel >= 2) {
      console.warn(this.prefix("warn"), msg, ...more);
    }
  };

  static error = (msg: any, ...more: any[]) => {
    if (Logging._logLevel >= 1) {
      console.error(this.prefix("error"), msg, ...more);
    }
  };
  private static prefix = (level: Level) => {
    const now = new Date();
    const [time, ampm] = now.toLocaleTimeString().split(" ");
    return `${time}.${now.getMilliseconds()} ${ampm} [${level}]: `;
  };
}
