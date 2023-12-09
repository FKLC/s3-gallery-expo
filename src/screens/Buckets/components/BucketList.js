import { useAtomValue, useSetAtom } from "jotai";
import { ScrollView } from "react-native";
import { List } from "react-native-paper";
import { bucketsAtom } from "../../../storage";

export default function BucketList({ selectedBucketAtom }) {
  const buckets = useAtomValue(bucketsAtom);
  const setSelectedBucket = useSetAtom(selectedBucketAtom);

  return (
    <>
      <ScrollView>
        {
          Object.entries(buckets).map(([name]) => (
            <List.Item
              key={name}
              title={name}
              left={props => <List.Icon {...props} icon="bucket" />}
              onPress={() => setSelectedBucket(name)}
            />
          ))
        }
      </ScrollView>
    </>
  );
}