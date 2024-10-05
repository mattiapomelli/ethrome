"use client";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  picture: z.instanceof(File),
  preview: z.instanceof(File),
});

const CreatePage = () => {
  const [animationParentPicture] = useAutoAnimate();
  const [animationParentPreview] = useAutoAnimate();

  const [picturePreview, setPicturePreview] = useState<string | null>(null);
  const [previewPreview, setPreviewPreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange", // This will validate the form on every change
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
  };

  const handleFileChange =
    (onChange: (value: File | undefined) => void, setPreview: (value: string | null) => void) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      onChange(file);

      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }
    };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto flex w-full max-w-sm flex-1 flex-col gap-8 p-10"
      >
        <FormField
          control={form.control}
          name="picture"
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem ref={animationParentPicture}>
              <FormLabel>Picture</FormLabel>
              <FormControl>
                <Input
                  {...fieldProps}
                  placeholder="Picture"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange(onChange, setPicturePreview)}
                />
              </FormControl>
              <FormMessage />
              {picturePreview && (
                <div className="mt-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={picturePreview} alt="Picture preview" className="h-auto max-w-full" />
                </div>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="preview"
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem ref={animationParentPreview}>
              <FormLabel>Preview</FormLabel>
              <FormControl>
                <Input
                  {...fieldProps}
                  placeholder="Preview"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange(onChange, setPreviewPreview)}
                />
              </FormControl>
              <FormMessage />
              {previewPreview && (
                <div className="mt-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={previewPreview} alt="Preview preview" className="h-auto max-w-full" />
                </div>
              )}
            </FormItem>
          )}
        />
        <Button type="submit" disabled={!form.formState.isValid}>
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default CreatePage;
