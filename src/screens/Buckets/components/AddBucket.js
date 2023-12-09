import { useEffect, useMemo, useState } from "react";
import { Button, Dialog, FAB, Menu, Portal, TextInput } from "react-native-paper";

import CloudflareR2 from "./CloudflareR2";
import { useAtom } from "jotai";
import { bucketsAtom } from "../../../storage";


const configCreators = [
  {
    name: 'Cloudflare R2',
    elementCreator: (setResult) => <CloudflareR2 setResult={setResult} />,
  }
];

export default function AddBucket({ selectedBucketAtom }) {
  const [modalVis, setModalVis] = useState(false);
  const [configMenuVis, setConfigMenuVis] = useState(false);
  const [configCreator, setConfigCreator] = useState(null);

  const [name, setName] = useState('');
  const [clientOptions, setClientOptions] = useState('');
  const [bucketName, setbucketName] = useState('');
  const [uploadOptions, setUploadOptions] = useState(JSON.stringify({ httpMethod: 'PUT' }, null, 4));
  const [deleteable, setDeleteable] = useState(false);

  const [buckets, setBuckets] = useAtom(bucketsAtom);
  const [selectedBucket, setSelectedBucket] = useAtom(selectedBucketAtom);

  const setConfigResult = (result) => {
    setConfigCreator(null);

    if (result == null) return;
    setClientOptions(JSON.stringify(result, null, 4));
  }

  const showModal = () => {
    setModalVis(true);
    setName('');
    setbucketName('');
    setClientOptions('');
    setUploadOptions(JSON.stringify({ httpMethod: 'PUT' }, null, 4));
    setDeleteable(false);
  }

  const saveBucket = async () => {
    const bucket = {
      bucketName,
      clientOptions: JSON.parse(clientOptions),
      uploadOptions: JSON.parse(uploadOptions),
    };

    setBuckets(async buckets => ({ ...await buckets, [name]: bucket }));
    setModalVis(false);
  }

  const deleteBucket = async () => {
    setBuckets(async buckets => {
      const newBuckets = { ...await buckets };
      delete newBuckets[name];
      return newBuckets;
    });
    setModalVis(false);
  }

  useEffect(() => {
    if (selectedBucket == null) return;
    setModalVis(true);
    setName(selectedBucket);
    setDeleteable(true);
    const bucket = buckets[selectedBucket];
    setbucketName(bucket.bucketName);
    setClientOptions(JSON.stringify(bucket.clientOptions, null, 4));
    setUploadOptions(JSON.stringify(bucket.uploadOptions, null, 4));
    setSelectedBucket(null);
  }, [selectedBucket]);

  const valid = useMemo(() => {
    if (name.length === 0) return false;
    if (bucketName.length === 0) return false;
    if (clientOptions.length === 0) return false;
    if (uploadOptions.length === 0) return false;

    try {
      JSON.parse(clientOptions);
      JSON.parse(uploadOptions);
    } catch (e) {
      return false;
    }

    return true;
  }, [name, bucketName, clientOptions, uploadOptions]);

  return (
    <>
      <Portal>
        <Dialog visible={modalVis} onDismiss={() => setModalVis(false)}>
          <Dialog.Title>Bucket Config</Dialog.Title>
          <Dialog.Content style={{ gap: 10 }}>
            <TextInput
              label="Name (must be unique)"
              value={name}
              onChangeText={text => setName(text)}
            />
            <TextInput
              label="Bucket Name"
              value={bucketName}
              onChangeText={text => setbucketName(text)}
            />
            <Menu
              visible={configMenuVis}
              onDismiss={() => setConfigMenuVis(false)}
              anchor={
                <TextInput
                  label="S3 Client Options"
                  value={clientOptions}
                  onChangeText={text => setClientOptions(text)}
                  multiline={true}
                  right={<TextInput.Icon icon="menu-down" onPress={() => setConfigMenuVis(true)} />}
                />
              }>
              {configCreators.map(({ name, elementCreator }) => (
                <Menu.Item
                  onPress={() => setConfigCreator(elementCreator(setConfigResult))}
                  title={name}
                  key={name}
                />
              ))}
            </Menu>
            <TextInput
              label="Upload Options"
              value={uploadOptions}
              onChangeText={text => setUploadOptions(text)}
              multiline={true}
            />
          </Dialog.Content>
          <Dialog.Actions>
            {deleteable && <Button onPress={deleteBucket}>Delete</Button>}
            <Button onPress={saveBucket} disabled={!valid}>Done</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {configCreator}

      <FAB
        icon="plus"
        style={{
          position: 'absolute',
          margin: 20,
          right: 0,
          bottom: 0,
        }}
        onPress={showModal}
      />
    </>
  );
}