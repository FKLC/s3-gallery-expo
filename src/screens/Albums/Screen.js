import PermissionHandler from './components/PermissionHandler';
import AlbumList from './components/AlbumList';
import { useState } from 'react';

export default function AlbumsScreen() {
  const [hasPermission, setHasPermission] = useState(false);

  return (
    <>
      <PermissionHandler setHasPermission={setHasPermission}/>
      <AlbumList hasPermission={hasPermission} />
    </>
  );
}