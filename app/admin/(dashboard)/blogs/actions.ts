"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/session";
import { blogFormSchema, blogFaqFormSchema } from "@/lib/validators/blog";
import { createBlog, updateBlog, deleteBlog } from "@/lib/services/adminBlogs";
import { createBlogFaq, updateBlogFaq, deleteBlogFaq } from "@/lib/services/blogFaqs";

type ActionState = { success?: boolean; error?: string } | undefined;

const I18N_CODES = ["fr", "de", "es", "pt", "it", "nl", "zh"];

/** Collect per-language form fields (e.g. titleI18n_fr, titleI18n_de) into a JSON object */
function collectI18n(form: FormData, prefix: string): Record<string, string> | undefined {
  const result: Record<string, string> = {};
  let hasAny = false;
  for (const code of I18N_CODES) {
    const val = form.get(`${prefix}_${code}`);
    if (typeof val === "string" && val.trim()) {
      result[code] = val.trim();
      hasAny = true;
    }
  }
  return hasAny ? result : undefined;
}

function formToBlogInput(form: FormData) {
  return blogFormSchema.parse({
    titleEn: form.get("titleEn"),
    titleAr: form.get("titleAr"),
    titleI18n: collectI18n(form, "titleI18n"),
    excerptEn: form.get("excerptEn") || undefined,
    excerptAr: form.get("excerptAr") || undefined,
    excerptI18n: collectI18n(form, "excerptI18n"),
    contentEn: form.get("contentEn"),
    contentAr: form.get("contentAr"),
    contentI18n: collectI18n(form, "contentI18n"),
    author: form.get("author") || undefined,
    category: form.get("category") || undefined,
    metaTitleEn: form.get("metaTitleEn") || undefined,
    metaTitleAr: form.get("metaTitleAr") || undefined,
    metaTitleI18n: collectI18n(form, "metaTitleI18n"),
    metaDescriptionEn: form.get("metaDescriptionEn") || undefined,
    metaDescriptionAr: form.get("metaDescriptionAr") || undefined,
    metaDescriptionI18n: collectI18n(form, "metaDescriptionI18n"),
    isPublished: form.get("isPublished") === "on",
  });
}

export async function createBlogAction(_prevState: unknown, form: FormData): Promise<ActionState> {
  await requireAdmin("manage_website");
  const input = formToBlogInput(form);
  const imageFile = form.get("image");
  const blog = await createBlog(input, imageFile instanceof File && imageFile.size > 0 ? imageFile : null);
  revalidatePath("/admin/blogs");
  redirect(`/admin/blogs/${blog.id}`);
}

export async function updateBlogAction(blogId: number, _prevState: unknown, form: FormData): Promise<ActionState> {
  await requireAdmin("manage_website");
  const input = formToBlogInput(form);
  const imageFile = form.get("image");
  await updateBlog(blogId, input, imageFile instanceof File && imageFile.size > 0 ? imageFile : null);
  revalidatePath("/admin/blogs");
  revalidatePath(`/admin/blogs/${blogId}`);
  return { success: true };
}

export async function deleteBlogAction(blogId: number) {
  await requireAdmin("manage_website");
  await deleteBlog(blogId);
  revalidatePath("/admin/blogs");
  redirect("/admin/blogs");
}

export async function addBlogFaqAction(blogId: number, form: FormData) {
  await requireAdmin("manage_website");
  const input = blogFaqFormSchema.parse({
    questionEn: form.get("questionEn"),
    questionAr: form.get("questionAr"),
    questionI18n: collectI18n(form, "questionI18n"),
    answerEn: form.get("answerEn"),
    answerAr: form.get("answerAr"),
    answerI18n: collectI18n(form, "answerI18n"),
  });
  await createBlogFaq(blogId, input);
  revalidatePath(`/admin/blogs/${blogId}`);
}

export async function updateBlogFaqAction(blogId: number, faqId: number, form: FormData) {
  await requireAdmin("manage_website");
  const input = blogFaqFormSchema.parse({
    questionEn: form.get("questionEn"),
    questionAr: form.get("questionAr"),
    questionI18n: collectI18n(form, "questionI18n"),
    answerEn: form.get("answerEn"),
    answerAr: form.get("answerAr"),
    answerI18n: collectI18n(form, "answerI18n"),
  });
  await updateBlogFaq(faqId, input);
  revalidatePath(`/admin/blogs/${blogId}`);
}

export async function deleteBlogFaqAction(blogId: number, faqId: number) {
  await requireAdmin("manage_website");
  await deleteBlogFaq(faqId);
  revalidatePath(`/admin/blogs/${blogId}`);
}
