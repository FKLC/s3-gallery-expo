import { useAtom } from "jotai";
import { Button } from "react-native-paper";
import { syncDataAtom } from "../../../storage";
import { useEffect, useMemo, useState } from "react";
import * as MediaLibrary from 'expo-media-library';
import { BucketSelector, StartSync } from "./SyncDialog";


const DEFAULT_OPTIONS = {
  mediaType: ["photo", "video"],
  sortBy: [MediaLibrary.SortBy.creationTime],
  first: 100000000,
};

export default function SyncCheck({ album }) {
  const [syncData, setSyncData] = useAtom(syncDataAtom);
  const [assets, setAssets] = useState(null);
  const [dialogVisible, setDialogVisible] = useState(false);

  const syncInfo = useMemo(() => {
    if (syncData == null) return null;

    const albumData = syncData[album.title];
    if (albumData == null) return null;

    return {
      ...albumData,
      syncedImages: new Set(albumData.syncedImages),
    }
  }, [syncData]);

  const [syncStatusMsg, Dialog] = useMemo(() => {
    if (assets == null) return ["Loading...", null];
    if (syncInfo == null) return ["Not Synced", BucketSelector];
    if (syncInfo.queue.length != 0) return [syncInfo.queue.length + " images left", null];

    const notSynced = assets.filter(asset => !syncInfo.syncedImages.has(asset.id));
    if (notSynced.length == 0) {
      return ["Synced", null];
    } else {
      return [`Synced ${assets.length - notSynced.length}/${assets.length}`, StartSync];
    }
  }, [syncInfo, assets]);

  useEffect(() => {
    MediaLibrary.getAssetsAsync({
      album: album.id,
      ...DEFAULT_OPTIONS,
    }).then(r => setAssets(r.assets));
  }, []);

  return (
    <>
      <Button
        icon="cloud-upload"
        style={{ borderRadius: 0 }}
        onPress={() => setDialogVisible(true)}
        disabled={Dialog == null}
      >
        Sync Status: {syncStatusMsg}
      </Button>
      {
        Dialog && <Dialog
          album={album}
          visible={dialogVisible}
          setDialogVisible={setDialogVisible}
          assets={assets}
          syncInfo={syncInfo}
        />
      }
    </>
  )
}