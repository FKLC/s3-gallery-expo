import ImageGrid from './components/ImageGrid';
import SyncInformation from './components/SyncInformation';


export default function AlbumViewScreen({ route: { params: { album } } }) {

  return (
    <>
      <SyncInformation album={album} />
      <ImageGrid album={album} />
    </>
  );
}