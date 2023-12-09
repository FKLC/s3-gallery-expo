import { useState } from "react";
import { Button, Dialog, Portal, TextInput } from "react-native-paper";

export default function CloudflareR2({ setResult }) {
  const [accountId, setAccountId] = useState('');
  const [accessKeyId, setAccessKeyId] = useState('');
  const [secretAccessKey, setSecretAccessKey] = useState('');

  const createConfig = () => {
    setResult({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
      },
    });
  }

  const dismiss = () => {
    setResult(null);
  }

  return (
    <Portal>
      <Dialog visible={true} onDismiss={dismiss}>
        <Dialog.Title>Cloudflare R2</Dialog.Title>
        <Dialog.Content style={{ gap: 10 }}>
          <TextInput
            label="Account ID"
            value={accountId}
            onChangeText={text => setAccountId(text)}
          />
          <TextInput
            label="Access Key ID"
            value={accessKeyId}
            onChangeText={text => setAccessKeyId(text)}
          />
          <TextInput
            label="Secret Access Key"
            value={secretAccessKey}
            onChangeText={text => setSecretAccessKey(text)}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={createConfig}>Create Config</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}