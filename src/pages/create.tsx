import { useAutoAnimate } from "@formkit/auto-animate/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Paperclip } from "lucide-react";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useChainId } from "wagmi";
import { z } from "zod";

import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSetDataForRenting } from "@/lib/hooks/iexec/use-set-data-for-renting";
import { uploadFile } from "@/lib/supabase/storage";
import { convertFileToBase64 } from "@/lib/utils";

const formSchema = z.object({
  text: z.string().min(1, "Text is required"),
  price: z.number().min(0, "Price must be a positive number"),
  picture: z.instanceof(File),
  preview: z.instanceof(File),
});

const CreatePage = () => {
  const [animationParentPicture] = useAutoAnimate();
  const [animationParentPreview] = useAutoAnimate();

  const chainId = useChainId();
  console.log("chainId", chainId);

  const [picturePreview, setPicturePreview] = useState<string | null>(null);
  const [previewPreview, setPreviewPreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      price: undefined,
    },
  });

  const { mutate: setDataForRenting, isPending: isSellPending } = useSetDataForRenting({
    onSuccess({ protectedDataAddress, collectionId }) {
      console.log("Protected Data Address", protectedDataAddress);
      console.log("Collection Id", collectionId);
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!data.picture) return;

    const image = (await convertFileToBase64(data.picture)) as string;
    // const preview = (await convertFileToBase64(data.preview)) as string;

    const previewUrl = await uploadFile(data.preview);
    if (!previewUrl) return;

    console.log("previewUrl", previewUrl);

    setDataForRenting({
      price: data.price,
      duration: 60 * 60 * 24 * 30, // 30 days
      data: {
        // A binary "file" field must be used if you use the app provided by iExec
        file: new TextEncoder().encode(image),
      },
      name: data.text,
      previewUrl,
    });
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
    <Layout>
      <div className="mx-auto flex w-full max-w-md flex-col gap-y-4 px-8 py-4 pb-[5.5rem]">
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
                          className="min-h-[50px] resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
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
                                  <Paperclip className="size-4 min-w-4" />
                                  {picturePreview ? "Replace" : "Add picture"}
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
                                  <Paperclip className="size-4 min-w-4" />
                                  {previewPreview ? "Replace" : "Add preview"}
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
              <CardFooter className="flex justify-center border-t px-4 py-2">
                <Button
                  type="submit"
                  size="sm"
                  className="min-w-32"
                  disabled={!form.formState.isValid || isSellPending}
                  loading={isSellPending}
                >
                  Cast
                </Button>
              </CardFooter>
            </form>
          </Card>
        </Form>
      </div>
    </Layout>
  );
};

export default CreatePage;
