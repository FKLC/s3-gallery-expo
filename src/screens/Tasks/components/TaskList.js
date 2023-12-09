import { useAtomValue } from "jotai";
import { ScrollView } from "react-native";
import { List } from "react-native-paper";
import { syncDataAtom } from "../../../storage";

export default function TaskList() {
  const syncData = useAtomValue(syncDataAtom);

  return (
    <>
      <ScrollView>
        {
          Object.entries(syncData)
            .filter(([_, { queue }]) => queue.length != 0)
            .map(([title, _]) => (
              <List.Item
                key={title}
                title={title}
                left={props => <List.Icon {...props} icon="cloud-upload" />}
                onPress={() => { }}
              />
            ))
        }
      </ScrollView>
    </>
  );
}