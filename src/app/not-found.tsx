import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap">
      <h1>Not found</h1>

      <p className="mt-3">
        There is no page at this address. It may have been renamed, or it may never
        have existed.
      </p>

      <ul className="mt-5 flex flex-wrap gap-x-4 text-sm">
          <li >
            <Link href="/essays">Go to Essays</Link>
          </li>
      </ul>
    </div>
  );
}
