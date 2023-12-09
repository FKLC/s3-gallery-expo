import { atomWithStorage, createJSONStorage } from 'jotai/utils'
import AsyncStorage from '@react-native-async-storage/async-storage'


const storage = createJSONStorage(() => AsyncStorage)

export const bucketsAtom = atomWithStorage("buckets", {}, storage);

export const syncDataAtom = atomWithStorage("syncData", {
  //"WhatsApp Images": {
  //  syncedImages: ["1000072989"],
  //  bucketKey: "bucketName",
  //  queue: [{id: "1000072988", url: "file://..."}],
  //}
}, storage);