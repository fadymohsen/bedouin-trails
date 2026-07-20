"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/session";
import { articleFormSchema } from "@/lib/validators/article";
import { createArticle, updateArticle, deleteArticle } from "@/lib/services/adminArticles";

function formToArticleInput(form: FormData) {
  return articleFormSchema.parse({
    titleEn: form.get("titleEn"),
    titleAr: form.get("titleAr"),
    titleI18n: form.get("titleI18n"),
    descriptionEn: form.get("descriptionEn"),
    descriptionAr: form.get("descriptionAr"),
    descriptionI18n: form.get("descriptionI18n"),
    metaTitle: form.get("metaTitle") || undefined,
    metaDescription: form.get("metaDescription") || undefined,
  });
}

type ActionState = { success?: boolean; error?: string } | undefined;

export async function createArticleAction(_prevState: unknown, form: FormData): Promise<ActionState> {
  await requireAdmin("manage_website");
  let articleId: number;
  try {
    const input = formToArticleInput(form);
    const imageFile = form.get("image");
    const article = await createArticle(input, imageFile instanceof File && imageFile.size > 0 ? imageFile : null);
    articleId = article.id;
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to save. Please try again." };
  }
  revalidatePath("/admin/articles");
  redirect(`/admin/articles/${articleId}`);
}

export async function updateArticleAction(articleId: number, _prevState: unknown, form: FormData): Promise<ActionState> {
  await requireAdmin("manage_website");
  try {
    const input = formToArticleInput(form);
    const imageFile = form.get("image");
    await updateArticle(articleId, input, imageFile instanceof File && imageFile.size > 0 ? imageFile : null);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to save. Please try again." };
  }
  revalidatePath("/admin/articles");
  revalidatePath(`/admin/articles/${articleId}`);
  return { success: true };
}

export async function deleteArticleAction(articleId: number) {
  await requireAdmin("manage_website");
  await deleteArticle(articleId);
  revalidatePath("/admin/articles");
  redirect("/admin/articles");
}
