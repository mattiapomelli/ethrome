"use client";

import { useAutoAnimate } from "@formkit/auto-animate/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Paperclip } from "lucide-react";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useChainId } from "wagmi";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSetDataForRenting } from "@/lib/hooks/iexec/use-set-data-for-renting";
import { uploadFile } from "@/lib/supabase/storage";
import { resizeImage } from "@/lib/utils";
import { convertFileToBase64 } from "@/lib/utils";

const createBlurredImage = (imageDataUrl: string) => {
  return new Promise<string>((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;

      // Further reduce the scale factor for more blur
      const scaleFactor = 0.02;

      const scaledWidth = Math.max(1, Math.floor(img.width * scaleFactor));
      const scaledHeight = Math.max(1, Math.floor(img.height * scaleFactor));

      // Draw scaled down version
      canvas.width = scaledWidth;
      canvas.height = scaledHeight;
      ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight);

      // Apply two passes of box blur
      const applyBoxBlur = (imageData: ImageData) => {
        const pixels = imageData.data;
        const tempPixels = new Uint8ClampedArray(pixels.length);

        const kernelSize = 3;
        const kernelHalf = Math.floor(kernelSize / 2);

        for (let y = 0; y < scaledHeight; y++) {
          for (let x = 0; x < scaledWidth; x++) {
            let r = 0,
              g = 0,
              b = 0,
              a = 0,
              count = 0;
            for (let ky = -kernelHalf; ky <= kernelHalf; ky++) {
              for (let kx = -kernelHalf; kx <= kernelHalf; kx++) {
                const px = Math.min(scaledWidth - 1, Math.max(0, x + kx));
                const py = Math.min(scaledHeight - 1, Math.max(0, y + ky));
                const i = (py * scaledWidth + px) * 4;
                r += pixels[i];
                g += pixels[i + 1];
                b += pixels[i + 2];
                a += pixels[i + 3];
                count++;
              }
            }
            const i = (y * scaledWidth + x) * 4;
            tempPixels[i] = r / count;
            tempPixels[i + 1] = g / count;
            tempPixels[i + 2] = b / count;
            tempPixels[i + 3] = a / count;
          }
        }
        return new ImageData(tempPixels, scaledWidth, scaledHeight);
      };

      let imageData = ctx.getImageData(0, 0, scaledWidth, scaledHeight);
      imageData = applyBoxBlur(imageData);
      imageData = applyBoxBlur(imageData);
      ctx.putImageData(imageData, 0, 0);

      // Scale back up to original size
      const finalCanvas = document.createElement("canvas");
      finalCanvas.width = img.width;
      finalCanvas.height = img.height;
      const finalCtx = finalCanvas.getContext("2d")!;
      finalCtx.imageSmoothingEnabled = true;
      finalCtx.imageSmoothingQuality = "low";
      finalCtx.drawImage(canvas, 0, 0, scaledWidth, scaledHeight, 0, 0, img.width, img.height);

      resolve(finalCanvas.toDataURL("image/jpeg", 0.3));
    };
    img.src = imageDataUrl;
  });
};

const formSchema = z.object({
  text: z.string().min(1, "Text is required"),
  price: z.number().min(0, "Price must be a positive number"),
  picture: z.instanceof(File),
});

const CreatePage = () => {
  const [animationParentPicture] = useAutoAnimate();

  const chainId = useChainId();
  console.log("chainId", chainId);

  const [picturePreview, setPicturePreview] = useState<string | null>(null);
  const [blurredPreview, setBlurredPreview] = useState<string | null>(null);

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
    if (!data.picture || !blurredPreview) return;

    // Resize the image to a maximum width or height of 1024 pixels
    const resizedImage = await resizeImage(data.picture, 1024);

    // Convert the resized image to base64
    const image = (await convertFileToBase64(resizedImage)) as string;

    // Convert blurred preview data URL to File
    const blurredFile = await fetch(blurredPreview)
      .then((res) => res.blob())
      .then((blob) => new File([blob], "blurred_preview.jpg", { type: "image/jpeg" }));

    const previewUrl = await uploadFile(blurredFile);
    if (!previewUrl) return;

    console.log("previewUrl", previewUrl);

    setDataForRenting({
      price: data.price,
      duration: 60 * 60 * 24 * 30, // 30 days
      data: {
        file: new TextEncoder().encode(image),
      },
      name: data.text,
      previewUrl,
    });
  };

  const handleFileChange = async (
    file: File | undefined,
    onChange: (value: File | undefined) => void,
  ) => {
    onChange(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const imageDataUrl = reader.result as string;
        setPicturePreview(imageDataUrl);
        const blurredDataUrl = await createBlurredImage(imageDataUrl);
        setBlurredPreview(blurredDataUrl);
      };
      reader.readAsDataURL(file);
    } else {
      setPicturePreview(null);
      setBlurredPreview(null);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-y-4 px-2 pt-4">
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
                                  handleFileChange(file, onChange);
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
                  <div className="space-y-2">
                    {blurredPreview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={blurredPreview}
                        alt="Blurred preview"
                        className="h-64 w-full rounded object-cover"
                      />
                    ) : (
                      <div className="h-64 w-full rounded bg-muted" />
                    )}
                    <p className="text-sm text-muted-foreground">
                      Blurred preview (Auto-generated)
                    </p>
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
  );
};

export default CreatePage;
