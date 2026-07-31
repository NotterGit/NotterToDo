import Image from "next/image";

export default function Home() {
  return (
    <div>Hello ToDo <Image src={"/logo.jpg"} height={100} width={100} alt="logo" /></div>
  );
}
