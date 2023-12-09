import * as FileSystem from "expo-file-system";
import {
  S3Client,
  PutObjectCommand
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { loadable } from "jotai/utils";
import { syncDataAtom as syncDataAtomAsync, bucketsAtom as bucketsAtomAsync } from "../storage";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";

const syncDataAtom = loadable(syncDataAtomAsync);
const bucketsAtom = loadable(bucketsAtomAsync);
const syncedImagesRuntime = new Set();

export default function TaskManager({ children }) {
  const [syncDataLoadable, setSyncData] = [useAtomValue(syncDataAtom), useSetAtom(syncDataAtomAsync)];
  const bucketsLoadable = useAtomValue(bucketsAtom);

  useEffect(() => {
    (async () => {
      if (syncDataLoadable?.state !== 'hasData' || bucketsLoadable?.state !== 'hasData') return;

      const [syncData, buckets] = [syncDataLoadable.data, bucketsLoadable.data];

      const toBeSynced = Object.entries(syncData).filter(([, { queue }]) => queue.length != 0)[0];

      if (toBeSynced == null) return;

      const [title, data] = toBeSynced;
      const bucket = buckets[data.bucketKey];
      const syncedImages = new Set(data.syncedImages);
      const media = data.queue[0];

      if (syncedImages.has(media.id) || syncedImagesRuntime.has(media.id)) {
        setSyncData(async prev => ({
          ...(await prev),
          [title]: {
            ...(await prev)[title],
            queue: (await prev)[title].queue.slice(1),
            syncedImages: [...(await prev)[title].syncedImages, media.id]
          }
        })
        );
      }

      syncedImagesRuntime.add(media.id);
      await upload(bucket, media);
      setSyncData(async prev => ({
        ...(await prev),
        [title]: {
          ...(await prev)[title],
          queue: (await prev)[title].queue.slice(1),
          syncedImages: [...(await prev)[title].syncedImages, media.id]
        }
      }));
    })();
  }, [syncDataLoadable, bucketsLoadable, syncedImagesRuntime]);

  return children;
}

async function upload(bucket, media) {
  const S3 = new S3Client(bucket.clientOptions);

  const uploadURL = await getSignedUrl(S3, new PutObjectCommand({ Bucket: bucket.bucketName, Key: media.filename }), { expiresIn: 3600 });

  await FileSystem.uploadAsync(
    uploadURL,
    media.uri,
    bucket.uploadOptions
  );
}