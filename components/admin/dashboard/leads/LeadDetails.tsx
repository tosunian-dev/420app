"use client";
import { MdLocalPhone, MdPendingActions } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { useParams, useRouter } from "next/navigation";
import { es } from "date-fns/locale";
import { ICar } from "@/app/models/car";
import Image from "next/image";
import { FaRegEdit } from "react-icons/fa";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import React from "react";
import { FaRegCalendar } from "react-icons/fa";
import { IoSpeedometerOutline } from "react-icons/io5";
import { IoIosAddCircleOutline, IoMdAdd, IoMdMore } from "react-icons/io";
import Link from "next/link";
import { RiDeleteBin2Line } from "react-icons/ri";
import { HiOutlineMail } from "react-icons/hi";
import { BiTask, BiTaskX } from "react-icons/bi";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { ILead } from "@/app/models/lead";
import dayjs, { locale } from "dayjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "@/app/schemas/createTaskForm";
import { formSchema as completeFormSchema } from "@/app/schemas/completeTaskForm";
import { z } from "zod";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { ITask } from "@/app/models/task";
import "dayjs/locale/es";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FiClock } from "react-icons/fi";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ILeadVehicle } from "@/app/models/leadvehicles";
import LeadBudgetsList from "./LeadBudgetsList";
import { IBudget } from "@/app/models/budget";
import { IAdmin } from "@/app/models/admin";
dayjs.locale("es");

const LeadDetails = () => {
  const tz = "America/Argentina/Buenos_Aires";
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      dateToDo: undefined,
    },
  });
  const editForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      dateToDo: undefined,
    },
  });
  const completeForm = useForm<z.infer<typeof completeFormSchema>>({
    resolver: zodResolver(completeFormSchema),
    defaultValues: {
      observations: "",
    },
  });
  const router = useRouter();
  const [selectedToDelete, setSelectedToDelete] = useState({
    uuid: "",
    leadName: "",
  });
  const modalButtonRef = useRef<HTMLButtonElement>(null);
  const handleClick = () => {
    modalButtonRef.current?.click();
  };
  const [lead, setLead] = useState<ILead>();
  const [completedTasks, setCompletedTasks] = useState<ITask[]>([]);
  const [pendingTasks, setPendingTasks] = useState<ITask[]>([]);
  const [intInVehicle, setIntInVehicle] = useState<ICar>();
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const { id } = useParams();
  const { toast } = useToast();
  const [selectedTaskToEdit, setSelectedTaskToEdit] = useState<ITask>();
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openCompleteModal, setOpenCompleteModal] = useState(false);
  const [openTaskDetailsModal, setOpenTaskDetailsModal] = useState(false);
  const [openDeleteTaskModal, setOpenDeleteTaskModal] = useState(false);
  const [observations, setObservations] = useState<string>("");
  const [leadVehicles, setLeadVehicles] = useState<ILeadVehicle>();
  const [budgets, setBudgets] = useState<IBudget[]>([]);
  const [loading, setLoading] = useState(true);
  const [seller, setSeller] = useState<IAdmin>();
  const [loadingPendingTasks, setLoadingPendingTasks] = useState<boolean>(true);

  async function getLead() {
    try {
      console.log(id);
      const leadFetch = await fetch(`/api/leads/${id}`, {
        method: "GET",
        cache: "no-store",
      });
      const lead = await leadFetch.json();

      console.log(lead);

      setLeadVehicles(lead.leadVehicles);
      setObservations(lead.lead.observations);
      setLead(lead.lead);
      setIntInVehicle(lead.intInVehicle);
      setSeller(lead.seller);
      setLoading(false);
    } catch (error) {
      return;
    }
  }

  async function getTasks() {
    try {
      const tasksFetch = await fetch(`/api/tasks/${lead?._id}`, {
        method: "GET",
        cache: "no-store",
      });
      const tasks = await tasksFetch.json();
      setPendingTasks(tasks.pendingTasks);
      setCompletedTasks(tasks.completedTasks);
      setLoadingPendingTasks(false);
    } catch (error) {
      return;
    }
  }

  async function getBudgets() {
    try {
      const budgetsFetch = await fetch(`/api/budgets/lead/${id}`, {
        method: "GET",
        cache: "no-store",
      });
      const budgets = await budgetsFetch.json();
      setBudgets(budgets);
    } catch (error) {
      return;
    }
  }

  // create task function
  async function onSubmit(values: any) {
    setLoadingPendingTasks(true);
    setOpenCreateModal(false);

    values.leadID = lead?._id;
    values.status = "Pendiente";
    values.completedDate = new Date();
    values.observations = "empty";
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        body: JSON.stringify(values),
      }).then((response) => response.json());
      console.log(response);
      if ((response.msg = "TASK_CREATED")) {
        toast({ description: "¡Tarea creada!", variant: "default" });
        getTasks();
        getLead();
        return;
      }
    } catch (error) {
      setLoadingPendingTasks(false);
      // error alert
      toast({ description: "Error al crear tarea", variant: "destructive" });
    }
  }

  // edit task function
  async function onEdit(values: any) {
    setLoadingPendingTasks(true);
    setOpenEditModal(false);
    values.leadID = lead?._id;
    try {
      const editedTask = await fetch(
        "/api/tasks/task/" + selectedTaskToEdit?._id,
        {
          method: "PUT",
          body: JSON.stringify(values),
        }
      ).then((response) => response.json());
      getTasks();

      toast({ description: "¡Tarea editada!", variant: "default" });
    } catch (error) {
      setLoadingPendingTasks(false);
      // error alert
      toast({ description: "Error al editar tarea", variant: "destructive" });
    }
  }

  // complete task function
  async function onComplete(values: any) {
    setLoadingPendingTasks(true);
    values.leadID = lead?._id;
    values.status = "Completada";
    values.completedDate = new Date();
    setOpenCompleteModal(false);
    setOpenEditModal(false);
    try {
      const completedTask = await fetch(
        "/api/tasks/task/" + selectedTaskToEdit?._id,
        {
          method: "PUT",
          body: JSON.stringify(values),
        }
      ).then((response) => response.json());
      getTasks();
      toast({ description: "¡Tarea completada!", variant: "default" });
    } catch (error) {
      // error alert
      setLoadingPendingTasks(false);
      toast({
        description: "Error al completar tarea",
        variant: "destructive",
      });
    }
  }

  function openDeleteModal({
    leadName,
    uuid,
  }: {
    leadName: string;
    uuid: string;
  }) {
    setSelectedToDelete({ leadName, uuid });
    handleClick();
  }

  async function handleDeleteLead() {
    try {
      const deletedLead = await fetch("/api/leads/" + lead?._id, {
        method: "DELETE",
      }).then((response) => response.json());
      if (deletedLead.msg === "LEAD_DELETED") {
        toast({ description: "¡Lead eliminado!", variant: "default" });
      }
      router.push("/admin/dashboard/leads");
    } catch (error) {
      // error alert
      toast({ description: "Error al eliminar lead", variant: "destructive" });
    }
  }

  async function handleDeleteTask(id: string) {
    setOpenDeleteTaskModal(false);
    setLoadingPendingTasks(true);

    try {
      const deletedTask = await fetch(
        "/api/tasks/task/" + selectedTaskToEdit?._id,
        {
          method: "DELETE",
        }
      ).then((response) => response.json());
      getTasks();
      toast({ description: "¡Tarea eliminada!", variant: "default" });
    } catch (error) {
      // error alert
      setLoadingPendingTasks(false);
      toast({ description: "Error al eliminar tarea", variant: "destructive" });
    }
  }

  async function handleChangeLeadStatus(status: string) {
    const body = { status };
    try {
      await fetch("/api/leads/" + lead?._id, {
        method: "PUT",
        body: JSON.stringify(body),
      }).then((response) => response.json());
      getLead();
      getTasks();
      toast({ description: "¡Estado actualizado!", variant: "default" });
    } catch (error) {
      // error alert
      toast({
        description: "Error al actualizar estado",
        variant: "destructive",
      });
    }
  }

  async function handleSaveObservations() {
    const body = {
      observations: observations,
    };
    try {
      await fetch("/api/leads/" + lead?._id, {
        method: "PUT",
        body: JSON.stringify(body),
      }).then((response) => response.json());
      toast({ description: "¡Observaciones guardadas!", variant: "default" });
    } catch (error) {
      // error alert
      toast({
        description: "Error al guardar observaciones",
        variant: "destructive",
      });
    }
  }

  useEffect(() => {
    getTasks();
  }, [lead]);

  useEffect(() => {
    getLead();
    getBudgets();
  }, []);

  useEffect(() => {
    editForm.setValue("title", selectedTaskToEdit?.title!);
    editForm.setValue("dateToDo", selectedTaskToEdit?.dateToDo!);
  }, [selectedTaskToEdit]);

  useEffect(() => {
    const as = editForm.getValues();
    editForm.setValue("dateToDo", dayjs(selectedTaskToEdit?.dateToDo).toDate());
  }, [openEditModal]);

  return (
    <>
      {loading && (
        <>
          <div
            className="flex items-center justify-center w-full overflow-y-hidden bg-white dark:bg-background"
            style={{ zIndex: "99999999", height: "67vh" }}
          >
            <div className=" loader"></div>
          </div>
        </>
      )}
      {!loading && (
        <>
          {/* Datos personales */}
          <div className="flex flex-col py-2">
            <div className="flex flex-col items-start justify-between mb-5 sm:items-center md:flex-row">
              <div className="flex flex-wrap justify-between w-full gap-2 md:justify-start md:gap-5">
                <span className="text-xl font-semibold sm:text-2xl">
                  {lead?.surname}, {lead?.name}
                </span>
                <div className="block">
                  {lead?.status === "Pendiente" && (
                    <span className="inline-flex items-center bg-yellow-100 text-yellow-700 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-yellow-800 dark:text-yellow-100">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full me-1"></span>
                      Pendiente
                    </span>
                  )}
                  {lead?.status === "Gestionando" && (
                    <span className="inline-flex items-center bg-yellow-100 text-yellow-700 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-yellow-800 dark:text-yellow-100">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full me-1"></span>
                      Gestionando
                    </span>
                  )}
                  {lead?.status === "Negociando" && (
                    <span className="inline-flex items-center bg-yellow-100 text-yellow-700 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-yellow-800 dark:text-yellow-100">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full me-1"></span>
                      Negociando
                    </span>
                  )}
                  {lead?.status === "Perdido" && (
                    <span className="inline-flex items-center bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:bg-opacity-65 dark:text-red-200">
                      <span className="w-2 h-2 bg-red-500 rounded-full me-1"></span>
                      Perdido
                    </span>
                  )}
                  {lead?.status === "Vendido" && (
                    <span className="inline-flex items-center bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
                      <span className="w-2 h-2 bg-green-500 rounded-full me-1"></span>
                      Vendido
                    </span>
                  )}
                </div>
              </div>
              <div className="flex justify-between w-full gap-2 mt-5 md:mt-0 md:justify-end sm:gap-5 ">
                <div className="">
                  <Select
                    onValueChange={(value) => {
                      handleChangeLeadStatus(value);
                    }}
                  >
                    <SelectTrigger className="gap-3 w-fit">
                      <SelectValue placeholder="Cambiar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="Pendiente">Pendiente</SelectItem>
                        <SelectItem value="Gestionando">Gestionando</SelectItem>
                        <SelectItem value="Negociando">Negociando</SelectItem>
                        <SelectItem value="Perdido">Perdido</SelectItem>
                        <SelectItem value="Vendido">Vendido</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-3 md:gap-5">
                  <Link href={"/admin/dashboard/leads/edit/n13jhblmkld"}>
                    <Button
                      variant="outline"
                      className="flex gap-2 p-2 w-fit h-fit"
                    >
                      <span className="hidden lg:block">Editar lead</span>
                      <FaRegEdit size={20} className="w-fit h-fit" />
                    </Button>
                  </Link>
                  <div>
                    <Button
                      onClick={() =>
                        openDeleteModal({
                          leadName: "Leandro Tosunian",
                          uuid: "ausgyhbe123b4",
                        })
                      }
                      variant={"destructive"}
                      className="flex gap-2 p-2 w-fit h-fit"
                    >
                      <span className="hidden lg:block">Eliminar lead</span>
                      <RiDeleteBin2Line size={20} className="w-fit h-fit" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col w-full gap-10 md:flex-row h-fit">
              <div className="flex flex-col justify-between w-full gap-3 md:w-1/2 sm:gap-0 md:gap-5 h-fit">
                <div className="flex flex-col flex-wrap items-start justify-between w-full gap-3 md:items-center md:flex-row h-fit ">
                  <div className="flex flex-col w-full gap-3">
                    <span className="font-semibold">
                      Información de contacto
                    </span>
                    <Separator className="" />
                    <div className="flex flex-col flex-wrap gap-3 md:gap-4">
                      <div className="flex items-center gap-2 w-fit h-fit">
                        <HiOutlineMail />
                        <span className="text-sm">{lead?.email}</span>
                      </div>
                      <div className="flex items-center gap-2 w-fit h-fit">
                        <MdLocalPhone />
                        <span className="text-sm">{lead?.phone} </span>
                      </div>
                      <div className="flex items-center gap-2 w-fit h-fit">
                        <span className="text-sm font-light">
                          <b>Creado el:</b>{" "}
                          {dayjs(lead?.createdAt).format("DD-MM-YYYY")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 w-fit h-fit">
                        <span className="text-sm">
                          <b>Tipo de negocio:</b> {lead?.businessType}
                        </span>
                      </div>
                      {seller && (
                        <div className="flex items-center gap-2 w-fit h-fit">
                          <span className="text-sm">
                            <b>Vendedor:</b> {seller?.name} {seller?.surname}
                          </span>
                        </div>
                      )}
                      {/* <div className="flex gap-2 md:hidden">
                    <span className="text-sm">
                      <b>Estado:</b>
                    </span>
                    {lead?.status === "Pendiente" && (
                      <span className="inline-flex items-center bg-yellow-100 text-yellow-700 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-yellow-800 dark:text-yellow-100">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full me-1"></span>
                        Pendiente
                      </span>
                    )}
                    {lead?.status === "En gestión" && (
                      <span className="inline-flex items-center bg-yellow-100 text-yellow-700 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-yellow-800 dark:text-yellow-100">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full me-1"></span>
                        En gestión
                      </span>
                    )}
                    {lead?.status === "Negociando" && (
                      <span className="inline-flex items-center bg-yellow-100 text-yellow-700 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-yellow-800 dark:text-yellow-100">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full me-1"></span>
                        Negociando
                      </span>
                    )}
                    {lead?.status === "Perdido" && (
                      <span className="inline-flex items-center bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:bg-opacity-65 dark:text-red-200">
                        <span className="w-2 h-2 bg-red-500 rounded-full me-1"></span>
                        Perdido
                      </span>
                    )}
                    {lead?.status === "Venta concretada" && (
                      <span className="inline-flex items-center bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
                        <span className="w-2 h-2 bg-green-500 rounded-full me-1"></span>
                        Venta concretada
                      </span>
                    )}
                  </div> */}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start w-full gap-2 md:w-1/2 ">
                <div className="flex flex-col w-full h-full gap-1">
                  <div className="flex flex-col w-full gap-3">
                    <span className="font-semibold">Observaciones</span>
                    <Separator className="" />
                  </div>
                  <div className="flex flex-col gap-4">
                    <textarea
                      onChange={(e) => setObservations(e.target.value)}
                      value={observations}
                      placeholder="Añadí alguna nota sobre el lead"
                      className="w-full min-h-[110px] p-3 mt-2 text-sm border rounded-md h-fit"
                    ></textarea>
                    <Button onClick={handleSaveObservations}>Guardar</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* interested in section */}
          <Separator className="my-10" />

          <div className="flex flex-col justify-center w-full gap-10 md:gap-0 md:flex-row h-fit">
            {/* Vehiculo de interés */}
            <div className="w-full h-full md:w-fit ">
              <span className="text-xl font-semibold">Vehiculo de interés</span>
              
              {intInVehicle === null && (
                <Link
                  href={"/admin/dashboard/leads/edit/" + lead?._id}
                  className=" opacity-50 flex flex-col items-center justify-center w-full min-h-[350px] h-full"
                >
                  <IoIosAddCircleOutline size={50} strokeWidth={0} />
                  <span>Añadir vehículo</span>
                </Link>
              )}
              {intInVehicle !== null && (
                <div className="flex flex-col items-center justify-center gap-5 mt-5 sm:items-start">
                  <div className="h-full max-w-full sm:max-w-[300px] ">
                    <Card className="flex flex-col h-full shadow-lg">
                      <Image
                        src={intInVehicle?.imagePath!}
                        alt=""
                        unoptimized
                        width={500}
                        height={500}
                        className="object-cover h-full mb-4 overflow-hidden md:h-1/2 rounded-t-md "
                      />
                      <div className="flex flex-col justify-between w-full h-fit md:h-1/2">
                        <CardHeader style={{ padding: "0 16px 10px 16px" }}>
                          <CardTitle className="text-base textCut">
                            {/* {car.name} */}
                            {intInVehicle?.name}
                          </CardTitle>
                          <CardDescription className="flex items-center justify-between w-full pt-1 pb-2 ">
                            <div className="flex items-center gap-2">
                              {/* <FaRegCalendar /> <span>{car.year}</span> */}
                              <FaRegCalendar />{" "}
                              <span> {intInVehicle?.year}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <IoSpeedometerOutline size={20} />
                              {/* <span> {car.kilometers} km</span> */}
                              <span> {intInVehicle?.kilometers} km</span>
                            </div>
                          </CardDescription>
                          <span className="text-lg font-semibold">
                            {/* {car.currency} ${car.price} */}
                            {intInVehicle?.currency} ${intInVehicle?.price}
                          </span>
                        </CardHeader>
                        <CardFooter className="w-full p-4">
                          <Link
                            className="w-full h-full"
                            href={"/admin/dashboard/leads/edit/" + lead?._id}
                          >
                            <Button
                              //onClick={() => setSelectedIntIn(car)}
                              variant={"default"}
                              className="w-full mt-2 md:mt-0"
                            >
                              Cambiar vehículo
                            </Button>
                          </Link>
                        </CardFooter>
                      </div>
                    </Card>
                  </div>
                </div>
              )}
            </div>

            <Separator
              className="my-auto hidden md:block mx-28 h-[400px] "
              orientation="vertical"
            />
            <Separator
              className="block my-3 md:hidden"
              orientation="horizontal"
            />
            {/* Vehiculo del lead */}
            <div className="w-full h-full md:w-fit ">
              <span className="text-xl font-semibold">
                Vehiculo del lead{" "}
                <span className="text-base font-normal text-gray-500">
                  (opcional)
                </span>
              </span>
              {leadVehicles?.leadName === "" && (
                <Link
                  href={"/admin/dashboard/leads/edit/" + lead?._id}
                  className=" opacity-50 flex flex-col items-center justify-center w-full min-h-[350px] h-full"
                >
                  <IoIosAddCircleOutline size={50} strokeWidth={0} />
                  <span>Añadir vehículo</span>
                </Link>
              )}
              {leadVehicles?.leadName !== "" && (
                <div>
                  <div className="flex flex-col items-center justify-center gap-5 mt-8 sm:items-start">
                    <div className="h-full max-w-full sm:max-w-[300px] ">
                      <Card className="flex flex-col h-full shadow-lg">
                        <Image
                          src={leadVehicles?.leadVehicleImage!}
                          alt=""
                          unoptimized
                          width={500}
                          height={500}
                          className="object-cover h-full mb-4 overflow-hidden md:h-1/2 rounded-t-md "
                        />
                        <div className="flex flex-col justify-between w-full h-fit md:h-1/2">
                          <CardHeader style={{ padding: "0 16px 10px 16px" }}>
                            <CardTitle className="text-base textCut">
                              {/* {car.name} */}
                              {leadVehicles?.leadName}
                            </CardTitle>
                            <CardDescription className="flex items-center justify-between w-full pt-1 pb-2 ">
                              <div className="flex items-center gap-2">
                                {/* <FaRegCalendar /> <span>{car.year}</span> */}
                                <FaRegCalendar />{" "}
                                <span> {leadVehicles?.leadYear}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <IoSpeedometerOutline size={20} />
                                {/* <span> {car.kilometers} km</span> */}
                                <span> {leadVehicles?.leadKilometers} km</span>
                              </div>
                            </CardDescription>
                            <span className="text-lg font-semibold">
                              {leadVehicles?.leadCurrency} $
                              {leadVehicles?.leadPrice}
                            </span>
                          </CardHeader>
                          <CardFooter className="w-full p-4">
                            <Link
                              className="w-full h-full"
                              href={"/admin/dashboard/leads/edit/" + lead?._id}
                            >
                              <Button
                                //onClick={() => setSelectedIntIn(car)}
                                variant={"default"}
                                className="w-full mt-2 md:mt-0"
                              >
                                Editar vehículo
                              </Button>
                            </Link>
                          </CardFooter>
                        </div>
                      </Card>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* tasks section */}
          <Separator className="my-10" />
          <div className="w-full h-full ">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-medium md:text-2xl ">Tareas</h2>

              {/* create task modal */}
              <Dialog open={openCreateModal} onOpenChange={setOpenCreateModal}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="p-2 w-fit h-fit">
                    <IoMdAdd size={20} className="w-fit h-fit" />
                    <span className="ml-1 ">Crear tarea</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <Form {...form}>
                    <DialogHeader>
                      <DialogTitle className="text-left">
                        Nueva tarea
                      </DialogTitle>
                      <DialogDescription className="text-left">
                        Ingresá la fecha y el titulo de la tarea a realizar.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                      <div className="grid gap-4 py-4">
                        <div className="flex flex-col gap-3">
                          <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="font-semibold text-left">
                                  Tarea a realizar
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    id="title"
                                    placeholder="Enviar presupuesto por Whatsapp"
                                    className="w-full"
                                    type="text"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="flex flex-col gap-3">
                          <FormField
                            control={form.control}
                            name="dateToDo"
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel>Día a realizar</FormLabel>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant={"outline"}
                                        className={cn(
                                          "w-full pl-3 text-left font-normal",
                                          !field.value &&
                                            "text-muted-foreground"
                                        )}
                                      >
                                        {" "}
                                        {field.value ? (
                                          format(field.value, "PPP", {
                                            locale: es,
                                          })
                                        ) : (
                                          <span>Seleccionar día</span>
                                        )}
                                        <CalendarIcon className="w-4 h-4 ml-auto opacity-50" />
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    className="w-auto p-0"
                                    align="start"
                                  >
                                    <Calendar
                                      mode="single"
                                      selected={field.value}
                                      onSelect={field.onChange}
                                      initialFocus
                                      disabled={(date) =>
                                        date <=
                                        dayjs().subtract(1, "day").toDate()
                                      }
                                    />
                                  </PopoverContent>
                                </Popover>
                                <FormDescription>
                                  Seleccioná el día a realizar la tarea
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <DialogFooter className="mt-5">
                        <Button type="submit">Crear tarea</Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
              {/* create task modal */}
            </div>

            {/* no tasks message */}
            {completedTasks?.length === 0 && pendingTasks?.length === 0 && (
              <>
                <div className="flex flex-col items-center gap-1 justify-center w-full min-h-[300px] h-full">
                  <BiTaskX size={50} strokeWidth={0} />
                  <span>Todavía no creaste tareas.</span>
                  <span className="text-sm opacity-50">
                    Creá una tarea para comenzar la gestión de tu lead.
                  </span>

                  {/* create task modal */}
                  <Button
                    type="submit"
                    onClick={() => setOpenCreateModal(true)}
                    className="w-full mt-7 md:w-1/4"
                  >
                    Crear tarea
                  </Button>
                  {/* create task modal */}
                </div>
              </>
            )}

            {/* task list */}
            {(pendingTasks.length > 0 || completedTasks.length > 0) && (
              <>
                <div className="flex flex-col w-full gap-10 my-5 mb-5 h-fit">
                  <div>
                    <div className="flex items-center gap-2">
                      <MdPendingActions size={29} />
                      <span className="text-base font-medium"> Pendientes</span>
                    </div>
                    <Separator className="my-4" />
                    {loadingPendingTasks && (
                      <>
                        <div
                          className="flex items-center justify-center w-full overflow-y-hidden bg-white dark:bg-background"
                          style={{ zIndex: "99999999", height: "20vh" }}
                        >
                          <div className=" loaderSmall"></div>
                        </div>
                      </>
                    )}
                    {!loadingPendingTasks && (
                      <>
                        {pendingTasks?.length === 0 && (
                          <>
                            <div className="flex flex-col items-center gap-1 justify-center w-full min-h-[200px] h-full">
                              <BiTaskX size={50} strokeWidth={0} />
                              <span>No tenés tareas pendientes</span>
                              <span className="text-sm opacity-50">
                                Creá una tarea para comenzar la gestión de tu
                                lead.
                              </span>
                              <Button
                                type="submit"
                                onClick={() => setOpenCreateModal(true)}
                                className="w-full mt-5 md:w-1/4"
                              >
                                Crear tarea
                              </Button>
                            </div>
                          </>
                        )}
                        {pendingTasks?.length > 0 && (
                          <>
                            <div className="flex flex-col gap-5">
                              {pendingTasks?.map((task) => (
                                <>
                                  <Card className="flex items-center justify-between px-4 py-4">
                                    <div className="flex flex-col w-full gap-3 pr-5">
                                      <div className="w-fit h-fit">
                                        <span className="inline-flex items-center bg-yellow-100 text-yellow-700 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-yellow-800 dark:text-yellow-100">
                                          <span className="w-2 h-2 bg-yellow-500 rounded-full me-1"></span>
                                          Pendiente
                                        </span>
                                      </div>
                                      <h4 className="font-semibold">
                                        {task.title}
                                      </h4>
                                      <Separator className="mb-1" />
                                      <div className="flex items-center gap-2">
                                        <FiClock size={14} />
                                        <span className="text-xs sm:text-sm">
                                          <b>Día a realizar:</b>{" "}
                                          {dayjs(task.dateToDo).format(
                                            "dddd D [de] MMMM "
                                          )}
                                        </span>
                                      </div>
                                    </div>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button
                                          variant="outline"
                                          className="p-2 w-fit h-fit"
                                        >
                                          <IoMdMore size={15} />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent className="w-56">
                                        <DropdownMenuGroup>
                                          <DropdownMenuItem
                                            onClick={() => {
                                              console.log(task);

                                              setSelectedTaskToEdit(task);
                                              setOpenEditModal(true);
                                            }}
                                          >
                                            Editar tarea
                                          </DropdownMenuItem>
                                          <DropdownMenuItem
                                            onClick={() => {
                                              setSelectedTaskToEdit(task);
                                              setOpenCompleteModal(true);
                                            }}
                                          >
                                            Completar tarea
                                          </DropdownMenuItem>
                                          <DropdownMenuItem
                                            onClick={() => {
                                              setSelectedTaskToEdit(task);
                                              setOpenDeleteTaskModal(true);
                                            }}
                                          >
                                            Eliminar tarea
                                          </DropdownMenuItem>
                                        </DropdownMenuGroup>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </Card>
                                </>
                              ))}
                            </div>
                          </>
                        )}
                      </>
                    )}
                  </div>
                  {completedTasks.length > 0 && (
                    <>
                      <div>
                        <div className="flex items-center gap-2">
                          <BiTask size={28} />
                          <span className="text-base font-medium">
                            Completadas
                          </span>
                        </div>
                        <Separator className="my-4" />
                        <div className="flex flex-col gap-5">
                          {completedTasks?.map((task) => (
                            <>
                              <Card className="flex items-center justify-between px-4 py-4">
                                <div className="flex flex-col w-full gap-3 pr-5">
                                  <h4 className="font-semibold">
                                    {task.title}
                                  </h4>
                                  <Separator className="" />
                                  <span className="text-sm">
                                    <b>Completado el:</b>{" "}
                                    {dayjs(task.completedDate).format(
                                      "dddd D [de] MMMM "
                                    )}
                                  </span>
                                  <span className="text-sm">
                                    <b>Observaciones:</b> {task.observations}
                                  </span>
                                </div>
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    setOpenTaskDetailsModal(true);
                                    setSelectedTaskToEdit(task);
                                  }}
                                  className="p-2 w-fit h-fit"
                                >
                                  <IoMdMore size={15} />
                                </Button>
                              </Card>
                            </>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
          <Separator className="my-10" />
          {/* budgets history */}
          <LeadBudgetsList leadID={lead?._id} budgets={budgets} />
          {/* budgets history */}

          {/* delete lead modal */}
          <div className="px-10 rounded-md">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  className="sr-only"
                  ref={modalButtonRef}
                  variant="outline"
                >
                  Show Dialog
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Eliminar lead</AlertDialogTitle>
                  <AlertDialogDescription>
                    ¿Querés eliminar el lead {selectedToDelete.leadName}?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDeleteLead()}>
                    Eliminar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {/* delete task modal */}
          <div className="px-10 rounded-md">
            <AlertDialog
              onOpenChange={setOpenDeleteTaskModal}
              open={openDeleteTaskModal}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Eliminar tarea</AlertDialogTitle>
                  <AlertDialogDescription>
                    ¿Querés eliminar la tarea &ldquo;{selectedTaskToEdit?.title}
                    &ldquo;?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() =>
                      handleDeleteTask(selectedTaskToEdit?._id as string)
                    }
                  >
                    Eliminar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {/* edit task modal */}
          <Dialog onOpenChange={setOpenEditModal} open={openEditModal}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-xl text-left">
                  Editar tarea
                </DialogTitle>
                <DialogDescription className="text-left">
                  Editá la tarea o marcala como completada
                </DialogDescription>
              </DialogHeader>
              <Form {...editForm}>
                <form onSubmit={editForm.handleSubmit(onEdit)}>
                  <div className="grid gap-4 py-2 mb-7">
                    <div className="flex flex-col gap-3">
                      <FormField
                        control={editForm.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold text-left">
                              Tarea a realizar
                            </FormLabel>
                            <FormControl>
                              <Input
                                id="title"
                                placeholder="Enviar presupuesto por Whatsapp"
                                className="w-full"
                                type="text"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex flex-col gap-3">
                      <FormField
                        control={editForm.control}
                        name="dateToDo"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Día a realizar</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP", { locale: es })
                                    ) : (
                                      <span>Seleccionar día</span>
                                    )}
                                    <CalendarIcon className="w-4 h-4 ml-auto opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  {...field}
                                  initialFocus
                                  disabled={(date) =>
                                    date <= dayjs().subtract(1, "day").toDate()
                                  }
                                />
                              </PopoverContent>
                            </Popover>
                            <FormDescription>
                              Seleccioná el día a realizar la tarea
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <DialogFooter className="gap-5 md:gap-2">
                    <Button type="submit" variant={"default"}>
                      Guardar cambios
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          {/* edit details modal */}

          {/* complete task modal */}
          <Dialog onOpenChange={setOpenCompleteModal} open={openCompleteModal}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-xl text-left">
                  Completar tarea
                </DialogTitle>
                <DialogDescription className="text-left">
                  Ingresá acerca de los resultados de tu tarea para completarla
                </DialogDescription>
              </DialogHeader>
              <Form {...completeForm}>
                <form onSubmit={completeForm.handleSubmit(onComplete)}>
                  <div className="grid gap-4 py-2 mb-7">
                    <div className="flex flex-col gap-3">
                      <FormField
                        control={completeForm.control}
                        name="observations"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold text-left">
                              Observaciones
                            </FormLabel>
                            <FormControl>
                              <Input
                                id="observations"
                                placeholder="Ingresa los resultados de tu tarea"
                                className="w-full"
                                type="text"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <DialogFooter className="gap-5 md:gap-2">
                    <Button type="button">Cancelar</Button>
                    <Button type="submit" variant={"outline"}>
                      Completar tarea
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          {/* complete task modal */}

          {/* task details modal */}
          <Dialog
            onOpenChange={setOpenTaskDetailsModal}
            open={openTaskDetailsModal}
          >
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-left">
                  Detalles de la tarea
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="name"
                    className="text-base font-semibold text-left"
                  >
                    Tarea a realizar:
                  </Label>
                  <span className="text-sm ">{selectedTaskToEdit?.title}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="name"
                    className="text-base font-semibold text-left"
                  >
                    Completado el:
                  </Label>
                  <span className="text-sm capitalize">
                    {dayjs(selectedTaskToEdit?.completedDate).format(
                      "dddd D [de] MMMM [-] HH:mm [hs] "
                    )}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="name"
                    className="text-base font-semibold text-left"
                  >
                    Observaciones:
                  </Label>
                  <span className="text-sm ">
                    {selectedTaskToEdit?.observations}
                  </span>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          {/* task details modal */}
        </>
      )}
    </>
  );
};

export default LeadDetails;
