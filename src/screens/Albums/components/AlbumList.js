import { useState, useEffect } from 'react';
import * as MediaLibrary from 'expo-media-library';
import { ActivityIndicator, List } from 'react-native-paper';
import { ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';


export default function AlbumList({ hasPermission }) {
  const [albums, setAlbums] = useState([]);
  const [fetching, setFetching] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    if (!hasPermission) return;

    async function fetchAlbums() {
      const allAlbums = await MediaLibrary.getAlbumsAsync();

      const albums = [];
      for (let album of allAlbums) {
        const { totalCount } = await MediaLibrary.getAssetsAsync({
          album: album.id,
          mediaType: ["photo", "video"],
          first: 1
        });

        if (totalCount > 0) {
          albums.push(album);
        }
      }

      setAlbums(albums);
      setFetching(false);
    }

    fetchAlbums();
  }, [hasPermission]);

  if (fetching) {
    return <ActivityIndicator
      animating={true}
      size={'large'}
      style={{ marginTop: 10 }}
    />;
  }

  return (
    <ScrollView>
      {
        albums.map(album => (
          <List.Item
            key={album.id}
            title={album.title}
            description={`${album.assetCount} photos`}
            left={props => <List.Icon {...props} icon="folder" />}
            onPress={() => navigation.navigate('Album', { album })}
          />
        ))
      }
    </ScrollView>
  );
}