import { redirect } from "next/navigation";

export default function ForumRedirect() {
  redirect("/forums/posts");
}
