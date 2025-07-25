import { redirect } from "next/navigation";

export default function ForumNewRedirect() {
  redirect("/forums/posts/new");
}
