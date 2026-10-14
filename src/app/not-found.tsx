import Link from "next/link";

export default function NotFound() {
  return (
    <div className="prose-wrap">
      <h1>not found</h1>

      <p className="mt-3">
        there is no page at this address. it may have been renamed, or it may never
        have existed.
      </p>

      <ul className="mt-5 flex flex-wrap gap-x-4 text-sm">
          <li >
            <Link href="/">go home</Link>
          </li>
      </ul>
    </div>
  );
}
