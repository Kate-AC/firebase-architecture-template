export default class Log {
  static debug(message: string, obj?: any): void {
    const content = { message, date: new Date(), obj }
    console.log(`<DebugLog> ${JSON.stringify(content)}`)
  }
}
