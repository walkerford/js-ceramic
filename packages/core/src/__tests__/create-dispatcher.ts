import { IpfsApi, LoggerProvider } from '@ceramicnetwork/common'
import tmp from 'tmp-promise'
import { Dispatcher } from '../dispatcher.js'
import { LevelDbStore } from '../store/level-db-store.js'
import { StreamStateStore } from '../store/stream-state-store.js'
import { Repository, RepositoryDependencies } from '../state-management/repository.js'
import { PinStore } from '../store/pin-store.js'
import { ShutdownSignal } from '../shutdown-signal.js'
import { TaskQueue } from '../ancillary/task-queue.js'

export async function createDispatcher(ipfs: IpfsApi, pubsubTopic: string): Promise<Dispatcher> {
  const loggerProvider = new LoggerProvider()
  const logger = loggerProvider.getDiagnosticsLogger()
  const levelPath = await tmp.tmpName()
  const levelStore = new LevelDbStore(logger, levelPath, 'test')
  const stateStore = new StreamStateStore(logger)
  await stateStore.open(levelStore)
  const repository = new Repository(100, 100, logger)
  const pinStore = {
    stateStore,
  } as unknown as PinStore
  repository.setDeps({ pinStore } as unknown as RepositoryDependencies)
  const shutdownSignal = new ShutdownSignal()

  return new Dispatcher(
    ipfs,
    pubsubTopic,
    repository,
    logger,
    loggerProvider.makeServiceLogger('pubsub'),
    shutdownSignal,
    true,
    10,
    new TaskQueue()
  )
}
