import { redirect } from "next/navigation";

export default function PublicProjectsRedirect() {
  redirect("/projects");
}
