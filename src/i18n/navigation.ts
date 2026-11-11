import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Links that know the locale prefix: Italian at "/", English at "/en".
export const { Link } = createNavigation(routing);
