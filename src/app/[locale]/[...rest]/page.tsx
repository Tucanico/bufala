import { notFound } from "next/navigation";

// Any address that matches no page lands here and shows our not-found page in
// the visitor's language, instead of Next.js's default English one.
export default function CatchAll() {
  notFound();
}
