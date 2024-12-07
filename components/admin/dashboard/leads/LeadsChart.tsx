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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ILead } from "@/app/models/lead";
import dayjs from "dayjs";
import { BiTaskX } from "react-icons/bi";
import { IoPeople } from "react-icons/io5";
import Link from "next/link";
import { LuArrowUpDown } from "react-icons/lu";

const LeadsChart = () => {
  const [leads, setLeads] = useState<ILead[]>([]);
  const [loading, setLoading] = useState(true);

  async function getLeads() {
    try {
      const leadsFetch = await fetch("/api/leads", {
        method: "GET",
        cache: "no-store",
      });
      const leads = await leadsFetch.json();
      setLoading(false);
      setLeads(leads.leads);
    } catch (error) {
      setLoading(false);
      return;
    }
  }

  useEffect(() => {
    getLeads();
  }, []);

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
          {leads?.length === 0 && (
            <>
              <div className="flex flex-col items-center gap-1 justify-center w-full min-h-[300px] h-full">
                <IoPeople size={70} strokeWidth={0} />
                <span>Tu lista de leads está vacía.</span>
                <span className="text-sm opacity-50">
                  Creá un nuevo lead para comenzar a gestionar tu nuevo cliente.
                </span>
              </div>
            </>
          )}

          {leads?.length > 0 && (
            <Table>
              <TableCaption>Listado de leads.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-fit">Nombre </TableHead>
                  <TableHead className="w-fit">Estado</TableHead>
                  <TableHead className="w-fit">Veh. de interés</TableHead>
                  <TableHead className="flex items-center gap-1 w-fit">Último contacto <LuArrowUpDown /></TableHead>
                  <TableHead className="w-fit">Próxima tarea</TableHead>

                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads?.map((lead) => (
                  <>
                    <TableRow>
                      <TableCell className="text-xs font-medium">
                        {lead.name} {lead.surname}
                      </TableCell>
                      <TableCell className="font-medium">
                        {lead?.status === "Pendiente" && (
                          <span className="inline-flex items-center bg-yellow-100 text-yellow-700 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-yellow-800 dark:text-yellow-100">
                            Pendiente
                          </span>
                        )}
                        {lead?.status === "Gestionando" && (
                          <span className="inline-flex items-center bg-yellow-100 text-yellow-700 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-yellow-800 dark:text-yellow-100">
                            Gestionando
                          </span>
                        )}
                        {lead?.status === "Negociando" && (
                          <span className="inline-flex items-center bg-yellow-100 text-yellow-700 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-yellow-800 dark:text-yellow-100">
                            Negociando
                          </span>
                        )}
                        {lead?.status === "Perdido" && (
                          <span className="inline-flex items-center bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:bg-opacity-65 dark:text-red-200">
                            Perdido
                          </span>
                        )}
                        {lead?.status === "Vendido" && (
                          <span className="inline-flex items-center bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
                            Vendido
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-xs font-medium w-fit">
                        {lead.interestedIn}
                      </TableCell>
                      <TableCell className="text-xs font-medium w-fit">
                        {dayjs(lead.createdAt).format("DD-MM-YYYY")}
                      </TableCell>
                      <TableCell className="text-xs font-medium w-fit">
                        {lead.pendingTask}
                      </TableCell>

                      <TableCell className="text-right">
                        {/* edit */}
                        <Link href={`/admin/dashboard/leads/${lead._id}`}>
                          <Button variant="outline" className="p-2 w-fit h-fit">
                            <IoMdMore size={20} className="w-fit h-fit" />
                          </Button>
                        </Link>
                        {/* edit */}
                      </TableCell>
                    </TableRow>
                  </>
                ))}
              </TableBody>
            </Table>
          )}
        </>
      )}
    </>
  );
};

export default LeadsChart;
