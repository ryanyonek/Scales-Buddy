import VexFlowSheet from "../components/music/VexFlowSheet";

export default function Transpose(props) {
  return (
    <>
      <h2>Transpose Scales</h2>
      <h3>Sounding Pitch (concert pitch)</h3>
      <VexFlowSheet mode="original" />
      <h3>Written Pitch (transposed)</h3>
      <VexFlowSheet mode="transpose" />
    </>
  );
}

