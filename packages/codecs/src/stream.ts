import { CommitID, StreamID } from '@ceramicnetwork/streamid'
import { type Context, Type, refinement, string } from 'codeco'

/**
 * Verify if `input` is a StreamID string.
 */
export function isStreamIdString(input: string): input is string {
  try {
    StreamID.fromString(input)
    return true
  } catch (err) {
    return false
  }
}

/**
 * codeco codec for StreamID string.
 */
export const streamIdString = refinement(string, isStreamIdString, 'StreamID-string')

/**
 * codeco codec for StreamID encoded as string.
 */
export const streamIdAsString = new Type<StreamID, string, string>(
  'StreamID-as-string',
  (input: unknown): input is StreamID => StreamID.isInstance(input),
  (input: string, context: Context) => {
    try {
      return context.success(StreamID.fromString(input))
    } catch {
      return context.failure()
    }
  },
  (streamId) => {
    return streamId.toString()
  }
)

/**
 * codeco codec for StreamID encoded as Uint8Array bytes.
 */
export const streamIdAsBytes = new Type<StreamID, Uint8Array, Uint8Array>(
  'StreamID-as-bytes',
  (input: unknown): input is StreamID => StreamID.isInstance(input),
  (input: Uint8Array, context: Context) => {
    try {
      return context.success(StreamID.fromBytes(input))
    } catch {
      return context.failure()
    }
  },
  (streamId) => streamId.bytes
)

/**
 * codeco codec for CommitID encoded as string.
 */
export const commitIdAsString = new Type<CommitID, string, string>(
  'CommitID-as-string',
  (input: unknown): input is CommitID => CommitID.isInstance(input),
  (input: string, context: Context) => {
    try {
      return context.success(CommitID.fromString(input))
    } catch {
      return context.failure()
    }
  },
  (commitId) => commitId.toString()
)
