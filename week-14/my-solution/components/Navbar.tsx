import Link from "next/link";

export default function NavBar() {
  return (
    <div className="w-screen p-4 flex flex-row justify-around mx-auto">
      <div>
        <Link href="/">
          <button className="p-2 border border-black rounded-md">Home</button>
        </Link>
      </div>
      <div>
        <Link href="/static">
          <button className="p-2 border border-black rounded-md">Static</button>
        </Link>
      </div>
      <div>
        <Link href="/interactive">
          <button className="p-2 border border-black rounded-md">
            Interactive
          </button>
        </Link>
      </div>
    </div>
  );
}
