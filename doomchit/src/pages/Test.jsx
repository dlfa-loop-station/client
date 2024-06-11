import axios from "axios";

export default function Test() {
  const onClick = async () => {
    const { data } = await axios.get("http://127.0.0.1:8000/midi", {
      responseType: "arraybuffer",
    });
  };
  return (
    <>
      <button onClick={() => onClick()}>get midi file</button>
    </>
  );
}
