import { atom } from "jotai";
import AddBucket from "./components/AddBucket";
import BucketList from "./components/BucketList";

const selectedBucketAtom = atom(null);

export default function BucketsScreen() {
  return (
    <>
      <BucketList selectedBucketAtom={selectedBucketAtom} />
      <AddBucket selectedBucketAtom={selectedBucketAtom}/>
    </>
  );
}