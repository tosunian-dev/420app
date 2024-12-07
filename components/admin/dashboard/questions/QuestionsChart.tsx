"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IoMdMore } from "react-icons/io";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import dayjs from "dayjs";
import { IoPeople } from "react-icons/io5";
import Link from "next/link";
import { LuArrowUpDown } from "react-icons/lu";
import { IPageLead } from "@/app/models/pagelead";
import { useSession } from "next-auth/react";
import { Separator } from "@/components/ui/separator";
import { IAdmin } from "@/app/models/admin";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { FaUsers, FaWhatsapp } from "react-icons/fa";
import { useRouter } from "next/navigation";
import "dayjs/locale/es";
import { useToast } from "@/hooks/use-toast";
dayjs.locale("es");

const QuestionsChart = () => {
  const [asignedQuestions, setAsignedQuestions] = useState<IPageLead[]>([]);
  const [questions, setQuestions] = useState<IPageLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [openHandleQuestion, setOpenHandleQuestion] = useState(false);
  const [questionToHandle, setQuestionToHandle] = useState<IPageLead>();
  const { data: session }: any = useSession();
  const [employees, setEmployees] = useState<IAdmin[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<IAdmin>();
  const [openConfirmSelectEmployee, setOpenConfirmSelectEmployee] =
    useState<boolean>(false);
  const [message, setMessage] = useState("");
  const [openQuestionDetails, setOpenQuestionDetails] =
    useState<boolean>(false);
  const router = useRouter();
  const { toast } = useToast();
  const [wasContacted, setWasContacted] = useState<boolean>(false);

  async function getEmployees() {
    try {
      const employeesFetch = await fetch("/api/employees", {
        method: "GET",
        cache: "no-store",
      }).then((response) => response.json());
      setEmployees(employeesFetch.employees);
      setLoading(false);
    } catch (error) {}
  }

  async function getQuestions() {
    if (session?.user?.role === "ADMIN") {
      try {
        const questionsFetch = await fetch(`/api/leads/page`, {
          method: "GET",
          cache: "no-store",
        });
        const questions = await questionsFetch.json();

        setLoading(false);
        //setAsignedQuestions(questions.asignedQuestions);
        setQuestions(questions.questions);
      } catch (error) {
        setLoading(false);
        return;
      }
    }

    if (session?.user?.role === "EMPLOYEE") {
      try {
        const questionsFetch = await fetch(
          `/api/leads/page/${session?.user?._id}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );
        const questions = await questionsFetch.json();
        setLoading(false);
        //setAsignedQuestions(questions.asignedQuestions);
        setQuestions(questions.questions);
        setAsignedQuestions(questions.asignedQuestions);
      } catch (error) {
        setLoading(false);
        return;
      }
    }
  }

  async function handleSendMessage() {
    setWasContacted(true);
    const phoneNumber = "549" + questionToHandle?.phone; // Número en formato internacional
    const encodedMessage = encodeURIComponent(message);
    const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    setTimeout(() => {
      window.open(whatsappLink, "_blank");
    }, 300);

    handleAnswerQuestion(true);
  }

  useEffect(() => {
    console.log(wasContacted);
  }, [wasContacted]);

  async function handleAnswerQuestion(wasContactedWP?: boolean) {
    setLoading(true);
    // set answer body to edit
    const answerBody = {
      status: "ANSWERED",
      employeeAsignedID: "",
    };
    if (selectedEmployee !== undefined) {
      answerBody.employeeAsignedID = selectedEmployee?._id!;
    }
    if (selectedEmployee === undefined) {
      answerBody.employeeAsignedID = session?.user?._id;
    }

    // set new lead body to create
    const newLeadBody = {
      name: questionToHandle?.name!,
      surname: questionToHandle?.surname!,
      contactType: "Consulta en la web",
      businessType: "Otro",
      observations: "",
      phone: questionToHandle?.phone!,
      email: questionToHandle?.email!,
      employeeID: answerBody.employeeAsignedID,
      status: "Gestionando",
      pendingTask: "-",
      branchID: "-",
      interestedIn: "No especificado",
    };
    if (message) {
      newLeadBody.observations = `Consulta en la web: ${questionToHandle?.details}`;
    }

    const newLeadVehiclesBody = {
      leadName: "",
      leadYear: "",
      leadKilometers: "",
      leadMotor: "",
      leadType: "",
      leadCurrency: "",
      leadPrice: "",
      interestedIn: "",
      leadID: "",
      leadPrefVehicleUUID: "",
      leadObservations: "",
      leadVehicleImage: "",
    };

    const taskData = {
      leadID: "",
      title: "Consulta en la web respondida por WhatsApp",
      dateToDo: Date.now(),
      completedDate: Date.now(),
      status: "Completada",
      observations: `Consulta: ${questionToHandle?.details} | Respuesta: ${message}`,
    };

    try {
      const questionFetch = await fetch(
        "/api/leads/page/question/" + questionToHandle?._id,
        {
          method: "PUT",
          body: JSON.stringify(answerBody),
        }
      ).then((response) => response.json());

      const newLeadFetch = await fetch("/api/leads", {
        method: "POST",
        body: JSON.stringify(newLeadBody),
      }).then((response) => response.json());
      console.log(newLeadFetch);
      newLeadVehiclesBody.leadID = newLeadFetch.newLead._id;

      await fetch("/api/leads/vehicles/pagelead", {
        method: "POST",
        body: JSON.stringify(newLeadVehiclesBody),
      }).then((response) => response.json());

      if (wasContactedWP === true) {
        taskData.leadID = newLeadFetch.newLead._id;
        const createTaskFetch = await fetch("/api/tasks/message", {
          method: "POST",
          body: JSON.stringify(taskData),
        }).then((response) => response.json());
      }

      router.push("/admin/dashboard/leads/" + newLeadFetch.newLead._id);
    } catch (error) {
      setLoading(false);
    }
  }

  async function handleAsignQuestion() {
    try {
      const questionData = {
        employeeAsignedID: selectedEmployee?._id,
      };
      const asignQuestionFetch = await fetch(
        "/api/leads/page/question/" + questionToHandle?._id,
        {
          method: "PUT",
          body: JSON.stringify(questionData),
        }
      ).then((response) => response.json());
      console.log(asignQuestionFetch);

      toast({
        description: `La tarea fue asignada a ${selectedEmployee?.name} ${selectedEmployee?.surname}`,
        variant: "default",
      });
      getQuestions();
    } catch (error) {
      toast({
        description: "Error al asignar consulta",
        variant: "destructive",
      });
    }
  }

  useEffect(() => {
    if (
      session &&
      session.user &&
      session.user.role &&
      questions.length === 0
    ) {
      getQuestions();
    }
  }, [session]);

  useEffect(() => {
    getEmployees();
  }, []);

  useEffect(() => {
    console.log(questionToHandle);
  }, [questionToHandle]);

  return (
    <>
      {loading && (
        <>
          <div
            className="flex items-center justify-center w-full overflow-y-hidden bg-white dark:bg-background"
            style={{ zIndex: "99999999", height: "50vh" }}
          >
            <div className=" loader"></div>
          </div>
        </>
      )}

      {!loading && (
        <>
          {session?.user?.role === "EMPLOYEE" && (
            <>
              <div className="flex items-center justify-between my-4">
                <h2 className="text-xl font-medium ">Consultas asignadas</h2>
              </div>
              {asignedQuestions?.length === 0 && (
                <>
                  <div className="flex flex-col items-center gap-1 justify-center w-full min-h-[300px] h-full">
                    <IoPeople size={70} strokeWidth={0} />
                    <span className="font-semibold text-center">
                      Todavia no te han asignado consultas pendientes a
                      responder.
                    </span>
                    <span className="mt-3 text-sm font-light text-center opacity-50">
                      Aquí aparecerán las consultas que se hagan en la página
                      web que te hayan sido asignadas para responder.
                    </span>
                  </div>
                </>
              )}

              {asignedQuestions?.length > 0 && (
                <Table>
                  <TableCaption>
                    Listado de consultas pendientes asignadas.
                  </TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="flex items-center gap-1 text-xs w-fit md:text-sm">
                        Fecha <LuArrowUpDown />
                      </TableHead>
                      <TableHead className="text-xs w-fit md:text-sm">
                        Nombre{" "}
                      </TableHead>
                      <TableHead className="text-xs w-fit md:text-sm">
                        Teléfono
                      </TableHead>
                      <TableHead className="w-10 text-xs md:text-sm">
                        Correo
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {asignedQuestions?.map((question) => (
                      <>
                        <TableRow
                          className="cursor-pointer"
                          key={question._id}
                          onClick={() => {
                            setQuestionToHandle(question);
                            setOpenQuestionDetails(true);
                          }}
                        >
                          <TableCell className="text-xs font-medium w-fit">
                            {dayjs(question.createdAt).format("DD-MM-YYYY")}
                          </TableCell>

                          <TableCell className="text-xs font-medium">
                            {question.name} {question.surname}
                          </TableCell>
                          <TableCell className="text-xs font-medium w-fit">
                            {question.phone}
                          </TableCell>
                          <TableCell className="text-xs font-medium w-fit">
                            {question.email}
                          </TableCell>

                          <TableCell className="text-right">
                            {/* edit */}
                            <Button
                              variant="outline"
                              className="p-2 w-fit h-fit"
                              onClick={() => {
                                setQuestionToHandle(question);
                                setOpenQuestionDetails(true);
                              }}
                            >
                              <IoMdMore size={20} className="w-fit h-fit" />
                            </Button>
                            {/* edit */}
                          </TableCell>
                        </TableRow>
                      </>
                    ))}
                  </TableBody>
                </Table>
              )}
              <Separator className="my-5" />
            </>
          )}

          <div className="flex items-center justify-between my-4">
            <h2 className="text-xl font-medium ">Consultas pendientes</h2>
          </div>

          {questions?.length === 0 && (
            <>
              <div className="flex flex-col items-center gap-1 justify-center w-full min-h-[300px] h-full">
                <IoPeople size={70} strokeWidth={0} />
                <span>Aún no se han hecho consultas.</span>
                <span className="text-sm opacity-50">
                  Aquí aparecerán las consultas que se hagan en la página web.
                </span>
              </div>
            </>
          )}

          {questions?.length > 0 && (
            <Table>
              <TableCaption>Listado de consultas pendientes.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="flex items-center gap-1 text-xs w-fit md:text-sm">
                    Fecha <LuArrowUpDown />
                  </TableHead>
                  {session?.user?.role === "ADMIN" && (
                    <>
                      <TableHead className="w-10 text-xs md:text-sm">
                        Estado
                      </TableHead>
                    </>
                  )}
                  <TableHead className="text-xs w-fit md:text-sm">
                    Nombre
                  </TableHead>
                  <TableHead className="text-xs w-fit md:text-sm">
                    Teléfono
                  </TableHead>
                  <TableHead className="w-10 text-xs md:text-sm">
                    Correo
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {questions?.map((question) => (
                  <>
                    <TableRow
                      className="cursor-pointer"
                      key={question._id}
                      onClick={() => {
                        setQuestionToHandle(question);
                        setOpenQuestionDetails(true);
                      }}
                    >
                      <TableCell className="text-xs font-medium w-fit">
                        {dayjs(question.createdAt).format("DD-MM-YYYY")}
                      </TableCell>
                      {session?.user?.role === "ADMIN" && (
                        <>
                          <TableCell className="text-xs font-medium w-fit">
                            {question.employeeAsignedID !== "-" ? (
                              <span className="inline-flex items-center bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
                                Asignado
                              </span>
                            ) : (
                              <span className="inline-flex items-center bg-yellow-100 text-yellow-700 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-yellow-800 dark:text-yellow-100">
                                Pendiente
                              </span>
                            )}
                          </TableCell>
                        </>
                      )}
                      <TableCell className="text-xs font-medium">
                        {question.name} {question.surname}
                      </TableCell>
                      <TableCell className="text-xs font-medium w-fit">
                        {question.phone}
                      </TableCell>
                      <TableCell className="text-xs font-medium w-fit">
                        {question.email}
                      </TableCell>

                      <TableCell className="text-right">
                        {/* open asign seller / handle question modal */}
                        <Button
                          variant="outline"
                          onClick={() => {
                            setQuestionToHandle(question);
                            setOpenQuestionDetails(true);
                          }}
                          className="p-2 w-fit h-fit"
                        >
                          <IoMdMore size={20} className="w-fit h-fit" />
                        </Button>
                        {/* open asign seller / handle question modal */}
                      </TableCell>
                    </TableRow>
                  </>
                ))}
              </TableBody>
            </Table>
          )}
        </>
      )}

      {/* asign seller / handle question role ADMIN */}
      {session?.user?.role === "ADMIN" && (
        <>
          <Dialog
            open={openHandleQuestion}
            onOpenChange={() => {
              setOpenHandleQuestion(!openHandleQuestion);
              setSelectedEmployee(undefined);
            }}
          >
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Responder consulta</DialogTitle>
                <DialogDescription>
                  Podés responder la consulta mediante mensaje de WhatsApp y
                  crear un lead automaticamente, crear un lead y gestionarlo de
                  otra forma o asignarle un vendedor para que se encargue de
                  responderla.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex flex-col gap-3">
                  <Label htmlFor="name" className="text-left">
                    Asignar vendedor
                  </Label>
                  <Select
                    onValueChange={(e) => {
                      setSelectedEmployee(JSON.parse(e));
                      setOpenConfirmSelectEmployee(true);
                      setOpenHandleQuestion(false);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona un vendedor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {employees?.map((employee) => (
                          <SelectItem
                            key={employee._id}
                            value={JSON.stringify(employee)}
                          >
                            {employee.name} {employee.surname}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <span className="mx-auto my-1 text-sm text-gray-400">ó</span>

                <div className="flex flex-col gap-3">
                  <Label htmlFor="username" className="text-left">
                    Responder consulta por WhatsApp
                  </Label>
                  <Input
                    id="username"
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                    }}
                    placeholder="Ingresa un mensaje"
                    className="col-span-3"
                  />
                  <Button
                    type="button"
                    onClick={handleSendMessage}
                    className="text-white bg-green-700 hover:bg-green-800"
                  >
                    <FaWhatsapp size={22} className="mr-1" />
                    Enviar WhatsApp
                  </Button>
                </div>
                <span className="mx-auto my-1 text-sm text-gray-400">ó</span>

                <Button
                  type="button"
                  onClick={() => handleAnswerQuestion(false)}
                  className=""
                >
                  <FaUsers size={22} className="mr-2" />
                  Crear nuevo lead
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
      {/* asign seller / handle question role EMPLOYEE */}
      {session?.user?.role === "EMPLOYEE" && (
        <>
          <Dialog
            open={openHandleQuestion}
            onOpenChange={setOpenHandleQuestion}
          >
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Responder consulta</DialogTitle>
                <DialogDescription>
                  Podés responder la consulta mediante mensaje de WhatsApp y
                  crear un lead automaticamente o crear un lead y gestionarlo de
                  otra forma.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex flex-col gap-3">
                  <Label htmlFor="username" className="text-left ">
                    Responder consulta por WhatsApp
                  </Label>
                  <Input
                    id="username"
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                    }}
                    placeholder="Ingresa un mensaje"
                    className="col-span-3"
                  />
                  <Button
                    type="button"
                    onClick={handleSendMessage}
                    className="text-white bg-green-700 hover:bg-green-800"
                  >
                    <FaWhatsapp size={22} className="mr-1" />
                    Enviar WhatsApp
                  </Button>
                </div>
                <span className="mx-auto my-1 text-sm text-gray-400">ó</span>

                <Button
                  type="button"
                  onClick={() => handleAnswerQuestion(false)}
                  className=""
                >
                  <FaUsers size={22} className="mr-2" />
                  Crear nuevo lead
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}

      {/* confirm asing seller */}
      <AlertDialog
        open={openConfirmSelectEmployee}
        onOpenChange={setOpenConfirmSelectEmployee}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Asignar consulta a un vendedor </AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro que queres asignar la consulta al vendedor{" "}
              {selectedEmployee?.name} {selectedEmployee?.surname}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setSelectedEmployee(undefined);
              }}
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleAsignQuestion}>
              Asignar consulta
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* task details modal */}
      <Dialog onOpenChange={setOpenQuestionDetails} open={openQuestionDetails}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-left">
              Detalles de la consulta
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name" className="text-sm font-semibold text-left">
                Nombre y apellido
              </Label>
              <span className="text-sm ">
                {questionToHandle?.name} {questionToHandle?.surname}{" "}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="name" className="text-sm font-semibold text-left">
                Teléfono
              </Label>
              <span className="text-sm ">{questionToHandle?.phone}</span>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="name" className="text-sm font-semibold text-left">
                Email
              </Label>
              <span className="text-sm ">{questionToHandle?.email}</span>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="name" className="text-sm font-semibold text-left">
                Fecha
              </Label>
              <span className="text-sm capitalize">
                {dayjs(questionToHandle?.createdAt).format(
                  "dddd D [de] MMMM [-] HH:mm [hs] "
                )}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="name" className="text-sm font-semibold text-left">
                Consulta
              </Label>
              <span className="text-sm ">{questionToHandle?.details}</span>
            </div>
          </div>
          <Button
            className="mt-2"
            onClick={() => {
              setOpenQuestionDetails(false);
              setOpenHandleQuestion(true);
            }}
          >
            Contestar consulta
          </Button>
        </DialogContent>
      </Dialog>
      {/* task details modal */}
    </>
  );
};

export default QuestionsChart;
