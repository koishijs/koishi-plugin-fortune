import mt19937 from '@stdlib/random-base-mt19937';
import { createHash } from 'crypto';
import moment from 'moment';

export function getTodayBuffer() {
  const today = moment();
  today.set('hour', 0);
  today.set('minute', 0);
  today.set('second', 0);
  today.set('millisecond', 0);
  const buf = Buffer.allocUnsafe(8);
  buf.writeBigUInt64LE(BigInt(today.unix()));
  return buf;
}

export function getRandomState(id: string, masterKey?: string) {
  const hash = createHash('md5').update(id).update(getTodayBuffer());
  if (masterKey) {
    hash.update(masterKey);
  }
  return hash.digest().readUInt32LE(0);
}

export function getRandomValue(id: string, masterKey?: string) {
  const mt = mt19937.factory({ seed: getRandomState(id, masterKey) });
  return mt();
}

export function pickOne<T>(arr: T[], id: string, masterKey?: string): T {
  if (!arr.length) {
    return undefined;
  }
  if (arr.length === 1) {
    return arr[0];
  }
  const index = getRandomValue(id, masterKey) % arr.length;
  return arr[index];
}
