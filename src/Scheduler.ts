import {
  AsyncTask,
  SimpleIntervalJob,
  SimpleIntervalSchedule,
  ToadScheduler,
} from 'toad-scheduler'

export class Scheduler {
  private scheduler: ToadScheduler
  private task: AsyncTask
  constructor(func: Function) {
    this.scheduler = new ToadScheduler()
    this.task = new AsyncTask(
      'run main',
      () => func(),
      (err: Error) => {
        throw err
      }
    )
  }

  setInterval(simpleIntervalSchedule: SimpleIntervalSchedule) {
    const job = new SimpleIntervalJob(simpleIntervalSchedule, this.task)
    this.scheduler.addSimpleIntervalJob(job)
  }
}
