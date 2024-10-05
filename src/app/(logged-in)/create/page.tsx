"use client";

import { useAutoAnimate } from "@formkit/auto-animate/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Paperclip } from "lucide-react";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  text: z.string().min(1, "Text is required"),
  price: z.number().min(0, "Price must be a positive number"),
  picture: z.instanceof(File).optional(),
  preview: z.instanceof(File).optional(),
});

const CreatePage = () => {
  const [animationParentPicture] = useAutoAnimate();
  const [animationParentPreview] = useAutoAnimate();

  const [picturePreview, setPicturePreview] = useState<string | null>(null);
  const [previewPreview, setPreviewPreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      price: undefined,
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
  };

  const handleFileChange = (
    file: File | undefined,
    setPreview: (value: string | null) => void,
    onChange: (value: File | undefined) => void,
  ) => {
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
    <div className="mx-auto flex w-full max-w-md flex-col gap-y-4 px-8 py-4">
      <h1 className="text-4xl font-semibold">Let's cast</h1>
      <Form {...form}>
        <Card className="w-full overflow-hidden bg-background">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="p-0">
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Enter your text here..."
                        className="min-h-[100px] resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="border-t p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2" ref={animationParentPicture}>
                    <Controller
                      name="picture"
                      control={form.control}
                      // eslint-disable-next-line @typescript-eslint/no-unused-vars
                      render={({ field: { onChange, value, ...field } }) => (
                        <FormItem>
                          <FormControl>
                            <>
                              {picturePreview ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={picturePreview}
                                  alt="Uploaded picture"
                                  className="h-64 w-full rounded object-cover"
                                />
                              ) : (
                                <div className="h-64 w-full rounded bg-muted" />
                              )}
                              <input
                                type="file"
                                id="picture-upload"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  handleFileChange(file, setPicturePreview, onChange);
                                }}
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="mt-2 flex w-full items-center justify-center"
                                onClick={() => document.getElementById("picture-upload")?.click()}
                              >
                                <Paperclip className="mr-2 size-4" />
                                {picturePreview ? "Replace picture" : "Add picture"}
                              </Button>
                            </>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="space-y-2" ref={animationParentPreview}>
                    <Controller
                      name="preview"
                      control={form.control}
                      // eslint-disable-next-line @typescript-eslint/no-unused-vars
                      render={({ field: { onChange, value, ...field } }) => (
                        <FormItem>
                          <FormControl>
                            <>
                              {previewPreview ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={previewPreview}
                                  alt="Uploaded preview"
                                  className="h-64 w-full rounded object-cover"
                                />
                              ) : (
                                <div className="h-64 w-full rounded bg-muted" />
                              )}
                              <input
                                type="file"
                                id="preview-upload"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  handleFileChange(file, setPreviewPreview, onChange);
                                }}
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="mt-2 flex w-full items-center justify-center"
                                onClick={() => document.getElementById("preview-upload")?.click()}
                              >
                                <Paperclip className="mr-2 size-4" />
                                {previewPreview ? "Replace preview" : "Add preview"}
                              </Button>
                            </>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Enter price"
                          {...field}
                          onChange={(e) => {
                            if (e.target.value === "") {
                              field.onChange(undefined);
                              return;
                            }
                            field.onChange(Number(e.target.value));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t p-4">
              <Button
                type="submit"
                size="sm"
                className="min-w-32"
                disabled={!form.formState.isValid}
              >
                Cast
              </Button>
            </CardFooter>
          </form>
        </Card>
      </Form>
    </div>
  );
};

export default CreatePage;
