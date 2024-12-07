"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "next/navigation";
import { ICarImage } from "@/app/models/carimage";
import { useRouter } from "next/navigation";

const ImageGallery = () => {
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const params = useParams();
  const carID = params.id;
  const handleClick = () => {
    fileInputRef.current?.click();
  };
  const modalButtonRef = useRef<HTMLButtonElement>(null);
  const handleImageClick = () => {
    modalButtonRef.current?.click();
  };
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  const [galleryImages, setGalleryImages] = useState<ICarImage[]>([]);
  const [imageToDelete, setImageToDelete] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  const handleFileInput = async (files: FileList) => {
    console.log("handlefileinput files ", files);
    const validFiles = Array.from(files).filter((file) =>
      ["image/jpeg", "image/png", "image/webp", "image/jpg"].includes(file.type)
    );
    setFilesToUpload(validFiles);
  };

  async function uploadGalleryImage() {
    if (filesToUpload.length === 0) return;
    setLoading(true);
    try {
      let formData = new FormData();
      filesToUpload.forEach((file) => {
        formData.append("gallery_images", file);
        formData.append("carID", carID as string);
      });

      const uploadResponse = await fetch("/api/gallery", {
        method: "POST",
        body: formData,
      }).then((response) => response.json());
      console.log(uploadResponse);
      if (uploadResponse.msg === "FILES_UPLOADED") {
        toast({ description: "¡Imágenes añadidas!", variant: "default" });
        setFilesToUpload([]);
        getGallery();
        setLoading(false);
      }
    } catch (error) {
      // error alert
      setLoading(false);
      toast({
        description: "Error al añadir imágenes",
        variant: "destructive",
      });
    }
  }

  async function getGallery() {
    setFetchLoading(true)
    try {
      const galleryResponse = await fetch("/api/gallery/" + params.id, {
        method: "GET",
        cache: "no-store",
      }).then((response) => response.json());
      if (galleryResponse) {
        setGalleryImages(galleryResponse);
        setFetchLoading(false)
      }
    } catch (error) {
      // error alert
      toast({
        description: "Error al eliminar imagen",
        variant: "destructive",
      });
    }
  }

  useEffect(() => {
    getGallery();
  }, []);

  async function handleDeleteImage() {
    console.log(imageToDelete);
    setFetchLoading(true)
    if (imageToDelete) {
      try {
        const deleteResponse = await fetch(
          "/api/gallery/getimage/" + imageToDelete,
          {
            method: "DELETE",
          }
        ).then((response) => response.json());
        console.log(deleteResponse);
        if (deleteResponse.msg === "IMAGE_DELETED") {
          toast({
            description: "Imagen eliminada",
            variant: "default",
          });
          getGallery();
        }
      } catch (error) {
        // error alert
        setFetchLoading(false)
        toast({
          description: "Error al eliminar imágen",
          variant: "destructive",
        });
      }
    }
  }

  return (
    <>
      <div className="w-full gap-5 ">
        <span className="block text-xl font-semibold md:hidden">
          Galería de imágenes
        </span>
        {/* above carousel prev cont <div className="grid grid-cols-1 gap-8 px-12 md:grid-cols-2 md:gap-14 "> */}

        <div className="flex flex-col items-center gap-8 pt-6 md:pt-10 md:items-start h-fit md:flex-col md:grid-cols-2 md:gap-0 ">
          {fetchLoading && (
            <>
              <div
                className="flex items-center justify-center w-full my-5 overflow-y-hidden bg-white dark:bg-background"
                style={{ zIndex: "99999999", height: "300px" }}
              >
                <div className=" loaderSmall"></div>
              </div>
            </>
          )}
          {!fetchLoading && (
            <>
              {galleryImages.length > 0 && (
                <>
                  <div className="px-12 md:px-0">
                    <Carousel className="w-full mx-auto md:w-4/5 h-fit">
                      <CarouselContent>
                        {galleryImages.map((image) => (
                          <CarouselItem key={image.uuid}>
                            <Image
                              className="w-full m-auto rounded-md"
                              alt="Imagen del vehículo"
                              onClick={() => {
                                setImageToDelete(image.uuid);
                                handleImageClick();
                              }}
                              src={image.path}
                              width={500}
                              height={500}
                              unoptimized
                            />
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious />
                      <CarouselNext />
                    </Carousel>
                  </div>
                </>
              )}
            </>
          )}
          {/* {galleryImages.length === 0 && (
            <>
              <div className="w-full ">
                <span className="m-auto">La galería del vehiculo esta vacía.</span>
              </div>
            </>
          )} */}

          <Card className="hidden w-full border-none md:block">
            <CardHeader>
              <CardTitle className="mb-1 text-lg">Agregar imágenes</CardTitle>
              <CardDescription>
                Selecciona una o mas imágenes para añadir a la galería del
                vehículo.
              </CardDescription>
            </CardHeader>
            <div className="px-6">
              <Separator className="w-full " />
            </div>
            <CardContent className="py-6">
              {filesToUpload.length === 0 && (
                <>
                  <Button
                    variant="outline"
                    className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50"
                    onClick={handleClick}
                    type="button"
                  >
                    <Camera className="w-12 h-12 mb-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Seleccionar imágenes
                    </span>
                  </Button>
                  <Input
                    type="file"
                    className="sr-only"
                    ref={fileInputRef}
                    name="image_file"
                    accept="image/*"
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files) {
                        handleFileInput(files);
                      }
                    }}
                  />
                </>
              )}
              {filesToUpload.length > 0 && (
                <>
                  <div className="grid gap-10 xl:grid-cols-6 md:grid-cols-2 lg:grid-cols-4">
                    {filesToUpload.map((file) => (
                      <Image
                        key={file.name}
                        className="col-span-1 rounded-lg lg:col-span-2"
                        width={0}
                        height={0}
                        style={{ width: "100%" }}
                        alt=""
                        src={URL.createObjectURL(file)}
                      />
                    ))}
                  </div>
                </>
              )}
              {loading && (
                <>
                  <div
                    className="flex items-center justify-center w-full mb-5 overflow-y-hidden bg-white mt-7 dark:bg-background"
                    style={{ zIndex: "99999999", height: "40px" }}
                  >
                    <div className=" loaderSmall"></div>
                  </div>
                </>
              )}
              {!loading && (
                <>
                  <div className="flex justify-center w-full gap-5 h-fit">
                    {filesToUpload.length > 0 && (
                      <Button
                        variant={"destructive"}
                        className="w-full mt-10 md:w-1/2 "
                        onClick={() => setFilesToUpload([])}
                        type="button"
                      >
                        Cancelar
                      </Button>
                    )}
                    <Button
                      className="mt-10 w-fit md:w-1/2"
                      onClick={uploadGalleryImage}
                      type="button"
                    >
                      Agregar imágenes
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="block w-full mt-8 mb-5 border-none md:hidden">
          <div>
            <CardTitle className="p-0 mb-1 text-lg">Agregar imágenes</CardTitle>
            <CardDescription>
              Selecciona una o mas imágenes para añadir a la galería del
              vehículo.
            </CardDescription>
          </div>
          <Separator className="w-full my-6 " />
          <div className="">
            {filesToUpload.length === 0 && (
              <>
                <Button
                  variant="outline"
                  className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50"
                  onClick={handleClick}
                  type="button"
                >
                  <Camera className="w-12 h-12 mb-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Seleccionar imágenes
                  </span>
                </Button>
                <Input
                  type="file"
                  className="sr-only"
                  ref={fileInputRef}
                  name="image_file"
                  multiple={true}
                  accept="image/*"
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files) {
                      handleFileInput(files);
                    }
                  }}
                />
              </>
            )}
            {filesToUpload.length > 0 && (
              <>
                <div className="grid grid-cols-2 gap-5">
                  {filesToUpload.map((file) => (
                    <Image
                      key={file.name}
                      className="col-span-1 mx-auto rounded-lg"
                      width={0}
                      height={0}
                      style={{ width: "100%" }}
                      alt=""
                      src={URL.createObjectURL(file)}
                    />
                  ))}
                </div>
              </>
            )}
            {loading && (
              <>
                <div
                  className="flex items-center justify-center w-full mb-5 overflow-y-hidden bg-white md:hidden mt-7 dark:bg-background"
                  style={{ zIndex: "99999999", height: "40px" }}
                >
                  <div className=" loaderSmall"></div>
                </div>
              </>
            )}
            {!loading && (
              <>
                <div className="flex justify-center w-full gap-5 h-fit">
                  {filesToUpload.length > 0 && (
                    <Button
                      variant={"destructive"}
                      className="w-full mt-10 "
                      onClick={() => setFilesToUpload([])}
                      type="button"
                    >
                      Cancelar
                    </Button>
                  )}
                  <Button
                    className="w-full mt-10 "
                    onClick={uploadGalleryImage}
                    type="button"
                  >
                    Agregar imágenes
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="sr-only" ref={modalButtonRef} variant="outline">
            Show Dialog
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar imagen</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro que deseas eliminar la imagen de la galería?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setImageToDelete("")}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteImage}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ImageGallery;
