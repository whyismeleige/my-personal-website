import Image from "next/image";
import type { Cover } from "@/lib/media";

type Shape = "square" | "portrait";

const FRAME: Record<Shape, string> = {
  square: "aspect-square",
  portrait: "aspect-[2/3]",
};

/** One grid of artwork, shared by every section of the Interests page. */
export function CoverGrid({ items, shape = "portrait" }: { items: Cover[]; shape?: Shape }) {
  if (items.length === 0) return null;

  return (
    <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3">
      {items.map((item, index) => {
        const inner = (
          <>
            <div className={`relative overflow-hidden bg-[#f2f2f2] ${FRAME[shape]}`}>
              {item.image && (
                <Image
                  src={item.image}
                  alt=""
                  fill
                  sizes="(min-width: 640px) 170px, 45vw"
                  className="object-cover"
                />
              )}
            </div>

            <p className="mt-1.5 text-sm leading-snug">{item.title}</p>
            {item.meta && <p className="text-sm leading-snug text-muted">{item.meta}</p>}
          </>
        );

        return (
          <li key={`${item.id}-${index}`}>
            {item.url ? (
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer noopener"
                className="quiet-link block"
              >
                {inner}
              </a>
            ) : (
              inner
            )}
          </li>
        );
      })}
    </ul>
  );
}
