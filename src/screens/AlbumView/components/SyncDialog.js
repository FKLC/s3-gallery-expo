import { useAtomValue, useSetAtom } from "jotai";
import { Button, Dialog, Menu, Portal, Text, TextInput } from "react-native-paper";
import { bucketsAtom, syncDataAtom } from "../../../storage";
import { useState } from "react";

export function BucketSelector({ album, assets, visible, setDialogVisible }) {
  const buckets = useAtomValue(bucketsAtom);

  const [selectedBucket, setSelectedBucket] = useState("");
  const [bucketListVis, setbucketListVis] = useState(false);

  const setSyncData = useSetAtom(syncDataAtom);

  const syncToBucket = () => {
    setSyncData(async (prev) => ({
      ...(await prev),
      [album.title]: {
        syncedImages: [],
        bucketKey: selectedBucket,
        queue: assets.map(asset => ({ id: asset.id, uri: asset.uri, filename: asset.filename })),
      }
    }));
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={() => setDialogVisible(false)}>
        <Dialog.Title>Sync</Dialog.Title>
        <Dialog.Content>
          <Menu
            visible={bucketListVis}
            onDismiss={() => setbucketListVis(false)}
            anchor={
              <TextInput
                label="Bucket"
                editable={false}
                value={selectedBucket}
                right={<TextInput.Icon icon="menu-down" onPress={() => setbucketListVis(true)} />}
              />
            }>
            {
              Object.keys(buckets).map((name) => (
                <Menu.Item
                  onPress={() => setSelectedBucket(name) || setbucketListVis(false)}
                  title={name}
                  key={name}
                />
              ))
            }
          </Menu>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setDialogVisible(false)}>Close</Button>
          <Button onPress={syncToBucket} disabled={selectedBucket === ""}>Sync</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  )
}

export function StartSync({ album, assets, visible, setDialogVisible, syncInfo }) {
  const setSyncData = useSetAtom(syncDataAtom);

  const syncToBucket = () => {
    const notSynced = assets.filter(asset => !syncInfo.syncedImages.has(asset.id));
    setSyncData(async (prev) => {
      return {
        ...await prev,
        [album.title]: {
          ...(await prev)[album.title],
          queue: notSynced.map(asset => ({ id: asset.id, uri: asset.uri, filename: asset.filename })),
        }
      }
    });
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={() => setDialogVisible(false)}>
        <Dialog.Title>Sync</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium">Not all media is synced. Would you like to sync it?</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setDialogVisible(false)}>Close</Button>
          <Button onPress={syncToBucket}>Sync</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  )
}