import * as MediaLibrary from 'expo-media-library';
import { useState, useEffect } from 'react';
import { FlatList, Image } from 'react-native';
import { debounce } from 'underscore';


const DEFAULT_OPTIONS = {
  mediaType: ["photo", "video"],
  sortBy: [MediaLibrary.SortBy.creationTime],
  first: 99,
};

export default function ImageGrid({ album }) {
  const [assets, setAssets] = useState([]);
  const [endCursor, setEndCursor] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadMore = debounce(async () => {
    setLoading(true);

    const r = await MediaLibrary.getAssetsAsync({
      album: album.id,
      ...DEFAULT_OPTIONS,
      after: endCursor,
    });

    setAssets([...assets, ...r.assets]);
    setEndCursor(r.endCursor);
    setLoading(false);
  }, 1000, true);

  useEffect(() => {
    loadMore();
  }, []);

  return (
    <>
      <FlatList
        data={assets}
        renderItem={
          ({ item }) => (
            <Image
              source={{ uri: item.uri }}
              style={{ flex: 1, height: 200, margin: 1 }}
            />
          )
        }
        numColumns={3}
        refreshing={loading}
        onEndReached={loadMore}
        onEndReachedThreshold={3}
        keyExtractor={item => item.id}
      />
    </>
  );
}