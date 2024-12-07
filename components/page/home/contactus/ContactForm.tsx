"use client";
import { Separator } from "@/components/ui/separator";
import React, { useEffect, useState } from "react";
import contactImg from "@/public/contact.png";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { IBranch } from "@/app/models/branch";
import {
  FaFacebook,
  FaInstagram,
  FaLocationDot,
  FaTwitter,
} from "react-icons/fa6";
import { SiMercadopago } from "react-icons/si";
import { formSchema } from "@/app/schemas/contactForm";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import correct from "@/public/correct.png";
import Breadcrumbs from "./Breadcrumbs";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import LoaderFullscreen from "@/components/admin/LoaderFullscreen";
import Footer from "../Footer";

const ContactForm = () => {
  const [branches, setBranches] = useState<IBranch[]>();
  const [loading, setLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);
  const [openCreatedLead, setOpenCreatedLead] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      surname: "",
      email: "",
      phone: "",
      details: "",
    },
  });

  async function getBranches() {
    try {
      const branchesFetch = await fetch("/api/branches", {
        method: "GET",
        cache: "no-store",
      }).then((response) => response.json());
      setLoadingPage(false);
      setBranches(branchesFetch.branches);
    } catch (error) {}
  }

  async function saveLead(values: any) {
    setLoading(true);
    try {
      const saveLeadFetch = await fetch("/api/leads/page", {
        method: "POST",
        body: JSON.stringify(values),
      }).then((response) => response.json());
      setLoading(false);
      setOpenCreatedLead(true);
      form.setValue("details", "");
      form.setValue("email", "");
      form.setValue("name", "");
      form.setValue("surname", "");
      form.setValue("phone", "");
    } catch (error) {
      toast({
        description: "No se pudo enviar tu consulta",
        variant: "destructive",
      });
    }
  }

  useEffect(() => {
    getBranches();
  }, []);

  return (
    <>
      {loadingPage && <LoaderFullscreen />}
      <div className="flex flex-col items-start justify-center gap-8 px-8 mx-auto mb-52 md:gap-10 2xl:gap-20 md:px-32 w-fit ">
        <Breadcrumbs />
        <div className="flex flex-col items-center justify-center gap-8 mx-auto md:gap-24 lg:flex-row w-fit">
          <div className="flex flex-col items-start justify-start w-fit ">
            <div className="flex flex-row items-center justify-start w-full gap-10 h-fit ">
              <div className="w-32">
                <Image alt="" src={contactImg} className="object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="mb-1 text-base font-bold text-red-500 upper ">
                  Pongámonos en contacto
                </span>
                <h4 className="text-2xl font-bold md:text-3xl ">
                  ¡No dudes en consultarnos!
                </h4>
              </div>
            </div>
            <span className="mt-5 text-sm font-normal text-left text-black md:text-base md:mt-8">
              Completá el formulario con tus datos y escribinos tu consulta, lo
              antes posible vamos a estar respondiendo tus dudas
            </span>

            <Separator className="hidden my-10 md:block" />

            <div className="hidden w-full h-fit md:flex">
              <div className="flex flex-col w-full gap-6 h-fit">
                <span className="text-xl font-semibold">Visitanos en</span>
                <div className="flex flex-col gap-3">
                  {branches &&
                    branches.map((branch) => (
                      <>
                        <div className="flex items-center gap-2 ">
                          <FaLocationDot size={17} />
                          <span className="text-sm">
                            {branch.address}, {branch.city}, {branch.state}.
                          </span>
                        </div>
                      </>
                    ))}
                </div>
              </div>
            </div>

            <Separator className="hidden my-10 md:block" />

            <div className="hidden w-full h-fit md:flex">
              <div className="flex flex-col w-full gap-6 h-fit">
                <span className="text-xl font-semibold">
                  Seguinos en nuestras redes
                </span>
                <div className="flex gap-3">
                  <div className="flex flex-wrap gap-5 lg:mb-0">
                    {/* <Link target="_blank" href={"https://wa.me/5492235423025"}>
                      <button
                        className="flex items-center justify-center h-10 gap-3 px-4 font-normal transition duration-300 bg-white border border-gray-200 rounded-full shadow-lg outline-none w-fit hover:ring-1 hover:ring-red-400 align-center hover:shadow-red-100 hover:outline-none"
                        type="button"
                      >
                        <FaWhatsapp  className="m-auto" size={20} />{" "}
                        <span className="text-xs font-medium">
                          +54 9 223 542-3025
                        </span>
                      </button>
                    </Link> */}
                    <Link target="_blank" href={"https://www.instagram.com/"}>
                      <button
                        className="flex items-center justify-center h-10 gap-3 px-4 font-normal transition duration-300 bg-white border border-gray-200 rounded-full shadow-lg outline-none w-fit hover:ring-1 hover:ring-red-400 align-center hover:shadow-red-100 hover:outline-none"
                        type="button"
                      >
                        <FaInstagram className="m-auto" size={20} />{" "}
                        <span className="text-xs font-medium">
                          distrito.automotor
                        </span>
                      </button>
                    </Link>
                    <Link target="_blank" href={"https://www.facebook.com/"}>
                      <button
                        className="flex items-center justify-center h-10 gap-3 px-4 font-normal transition bg-white border border-gray-200 rounded-full shadow-lg outline-none w-fit hover:shadow-red-100duration-300 hover:ring-1 hover:ring-red-400 align-center hover:outline-none"
                        type="button"
                      >
                        <FaFacebook className="m-auto" size={20} />{" "}
                        <span className="text-xs font-medium">
                          Distrito Automotor
                        </span>
                      </button>
                    </Link>
                    <Link
                      target="_blank"
                      href={"https://www.mercadolibre.com.ar/"}
                    >
                      <button
                        className="flex items-center justify-center h-10 gap-3 px-4 font-normal transition duration-300 bg-white border border-gray-200 rounded-full shadow-lg outline-none w-fit hover:shadow-red-100 hover:ring-1 hover:ring-red-400 align-center hover:outline-none"
                        type="button"
                      >
                        <SiMercadopago className="m-auto" size={20} />{" "}
                        <span className="text-xs font-medium">
                          Distrito Automotor
                        </span>
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="container w-full px-0 mx-0 md:w-2/6 md:min-w-96 ">
            <div className="w-full mx-auto">
              <Card className="w-full px-5 py-4 ml-auto bg-white rounded-lg shadow-lg md:px-6">
                <h2 className="text-lg font-semibold md:text-xl ">
                  Envianos tu consulta
                </h2>
                <Separator className="mt-3 mb-5" />
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(saveLead)}>
                    <div className="flex flex-col gap-5 mb-4 md:flex-row">
                      <div className="w-full md:w-1/2">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="block text-xs font-semibold xs:text-sm">
                                Nombre
                              </FormLabel>
                              <FormControl>
                                <input
                                  {...field}
                                  className="w-full px-4 py-2 text-xs font-normal transition duration-300 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
                                  placeholder="Ingrese su nombre"
                                  id="name"
                                  type="text"
                                />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="w-full md:w-1/2">
                        <FormField
                          control={form.control}
                          name="surname"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="block text-xs font-semibold xs:text-sm">
                                Apellido
                              </FormLabel>
                              <FormControl>
                                <input
                                  {...field}
                                  className="w-full px-4 py-2 text-xs font-normal transition duration-300 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
                                  placeholder="Ingrese su apellido"
                                  id="surname"
                                  type="text"
                                />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="block text-xs font-semibold xs:text-sm">
                              Teléfono
                            </FormLabel>
                            <FormControl>
                              <input
                                {...field}
                                className="w-full px-4 py-2 text-xs font-normal transition duration-300 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
                                placeholder="Ingrese su número de teléfono"
                                id="phone"
                                type="number"
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="mb-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="block text-xs font-semibold xs:text-sm">
                              Email
                            </FormLabel>
                            <FormControl>
                              <input
                                {...field}
                                className="w-full px-4 py-2 text-xs font-normal transition duration-300 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
                                placeholder="Ingrese su correo"
                                id="email"
                                type="text"
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="w-full mb-4">
                      <FormField
                        control={form.control}
                        name="details"
                        render={({ field }) => (
                          <FormItem className="w-full ">
                            <FormLabel className="block mb-0 text-xs font-semibold xs:text-sm">
                              Escribinos tu consulta
                            </FormLabel>
                            <textarea
                              {...field}
                              className="w-full px-4 py-2 text-xs font-normal transition duration-300 bg-gray-100 border border-gray-200 rounded-lg h-28 md:h-24 focus:outline-none focus:ring-2 focus:ring-red-400"
                              rows={4}
                              placeholder="Ingrese su consulta"
                              name="message"
                              id="message"
                            ></textarea>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>

                    {!loading && (
                      <button
                        className="w-full px-4 py-3 mt-1 text-xs font-semibold text-white transition duration-300 bg-black rounded-md hover:bg-red-600"
                        type="submit"
                      >
                        Enviar consulta
                      </button>
                    )}

                    {loading && (
                      <>
                        <div
                          className="flex items-center justify-center w-full mt-1 overflow-y-hidden bg-white dark:bg-background"
                          style={{ zIndex: "99999999", height: "40px" }}
                        >
                          <div className=" loaderSmall"></div>
                        </div>
                      </>
                    )}
                  </form>
                </Form>
              </Card>
            </div>
          </div>

          <Separator className="block mt-2 md:hidden" />

          <div className="flex w-full h-fit md:hidden">
            <div className="flex flex-col w-full gap-7 h-fit">
              <span className="text-2xl font-semibold">Visitanos en</span>
              <div className="flex flex-col gap-3">
                {branches &&
                  branches.map((branch) => (
                    <>
                      <div className="flex items-center gap-2 ">
                        <FaLocationDot size={17} />
                        <span className="text-sm">
                          {branch.address}, {branch.city}, {branch.state}.{" "}
                        </span>
                      </div>
                    </>
                  ))}
              </div>
            </div>
          </div>

          <Separator className="block my-3 md:hidden" />

          <div className="flex w-full h-fit md:hidden">
            <div className="flex flex-col w-full gap-7 h-fit">
              <span className="text-2xl font-semibold">
                Seguinos en nuestras redes
              </span>
              <div className="flex gap-3">
                <div className="flex flex-wrap gap-6 md:gap-3 lg:mb-0">
                  <Link target="_blank" href={"https://www.instagram.com/"}>
                    <button
                      className="flex items-center justify-center h-12 gap-3 px-5 font-normal transition duration-300 bg-white border border-gray-200 rounded-full shadow-lg outline-none w-fit hover:ring-1 hover:ring-red-400 align-center hover:outline-none"
                      type="button"
                    >
                      <FaInstagram className="m-auto" size={23} />{" "}
                      <span className="text-sm font-medium">
                        distrito.automotor
                      </span>
                    </button>
                  </Link>
                  <Link target="_blank" href={"https://www.facebook.com/"}>
                    <button
                      className="flex items-center justify-center h-12 gap-3 px-5 font-normal transition duration-300 bg-white border border-gray-200 rounded-full shadow-lg outline-none w-fit hover:ring-1 hover:ring-red-400 align-center hover:outline-none"
                      type="button"
                    >
                      <FaFacebook className="m-auto" size={23} />{" "}
                      <span className="text-sm font-medium">
                        Distrito Automotor
                      </span>
                    </button>
                  </Link>
                  <Link
                    target="_blank"
                    href={"https://www.mercadolibre.com.ar/"}
                  >
                    <button
                      className="flex items-center justify-center h-12 gap-3 px-5 font-normal transition duration-300 bg-white border border-gray-200 rounded-full shadow-lg outline-none w-fit hover:ring-1 hover:ring-red-400 align-center hover:outline-none"
                      type="button"
                    >
                      <SiMercadopago className="m-auto" size={23} />{" "}
                      <span className="text-sm font-medium">
                        Distrito Automotor
                      </span>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <Dialog open={openCreatedLead} onOpenChange={setOpenCreatedLead}>
            <DialogContent className="py-10 sm:max-w-[625px]">
              <div className="flex flex-col items-center justify-center gap-4">
                <Image alt="" className="w-20" src={correct} />
                <div className="flex flex-col items-center gap-2 my-5">
                  <span className="text-xl font-semibold">
                    ¡Tu consulta fue enviada!
                  </span>
                  <span className="text-sm font-normal ">
                    Lo mas pronto posible nos pondremos en contacto para
                    contestar tu consulta
                  </span>
                </div>
              </div>
              <DialogFooter className="mx-auto ">
                <Button onClick={() => setOpenCreatedLead(false)} type="submit">
                  Entendido
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="w-full mt-0 h-fit">
        <Footer />
      </div>
    </>
  );
};

export default ContactForm;
