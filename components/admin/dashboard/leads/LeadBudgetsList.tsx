"use client";
import { IBudget } from "@/app/models/budget";
import { IBonif } from "@/app/models/budgetbonif";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import dayjs from "dayjs";
import React, { useState } from "react";
import { BiTaskX } from "react-icons/bi";
import { IoMdAdd, IoMdMore } from "react-icons/io";
import { MdOutlineFileDownload } from "react-icons/md";
import CreateBudgetDownload from "./CreateBudgetDownload";
import Link from "next/link";

interface props {
  budgets: IBudget[];
  leadID: string | undefined;
}

const LeadBudgetsList = ({ budgets, leadID }: props) => {
  const [budget, setBudget] = useState<IBudget>();
  const [budgetBonifs, setBudgetBonifs] = useState<IBonif[]>([]);

  async function onDownload(budget: IBudget) {
    console.log(budget);
    const budgetFetch = await fetch(`/api/budgets/${budget._id}`, {
      method: "GET",
      cache: "no-cache",
    }).then((response) => response.json());
    console.log(budgetFetch);
    setBudget(budgetFetch.budget);
    setBudgetBonifs(budgetFetch.budgetBonifs);
  }
  return (
    <>
      <div className="w-full h-full ">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-medium md:text-2xl ">Presupuestos</h2>
          <Link href={`/admin/dashboard/budgets/create/${leadID}`}>
            <Button variant="outline" className="p-2 w-fit h-fit">
              <IoMdAdd size={20} className="w-fit h-fit" />
              <span className="ml-1 ">Presupuestar</span>
            </Button>
          </Link>
        </div>

        {/* no tasks message */}
        {budgets?.length === 0 && (
          <>
            <div className="flex flex-col items-center gap-1 justify-center w-full min-h-[300px] h-full">
              <BiTaskX size={50} strokeWidth={0} />
              <span>Todavía no creaste un presupuesto.</span>
              <span className="text-sm opacity-50">
                Hacé click en el botón debajo para crear un nuevo presupuesto.
              </span>

              {/* create task modal */}
              <Button
                type="submit"
                //onClick={() => setOpenCreateModal(true)}
                className="w-full mt-7 md:w-1/4"
              >
                Crear presupuesto
              </Button>
              {/* create task modal */}
            </div>
          </>
        )}

        <Separator className="my-4" />
        <div className="flex flex-col gap-5">
          {budgets.length > 0 &&
            budgets?.map((budget) => (
              <>
                <Card className="flex items-center justify-between px-4 py-4">
                  <div className="flex flex-col w-full gap-3 pr-5">
                    <h4 className="font-semibold">
                      Presupuesto N°{budget.budgetNumber}
                    </h4>
                    <Separator className="" />
                    <div className="flex flex-col w-full gap-4 h-fit">
                      <div className="flex flex-col gap-1 ">
                        <span className="text-sm font-semibold">
                          Interesado en
                        </span>
                        <span className="text-xs font-medium text-gray-500">
                          {budget.vehicleName}
                        </span>
                      </div>
                      {budget.clientVehicleName !== "" && (
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-semibold">Usado</span>
                          <span className="text-xs font-medium text-gray-500">
                            {budget.clientVehicleName}
                          </span>
                        </div>
                      )}
                    </div>
                    <Separator className="" />
                    <span className="text-xs">
                      <b>Creado el:</b>{" "}
                      {dayjs(budget.createdAt).format("dddd D [de] MMMM ")} por{" "}
                      {budget.sellerName}
                    </span>
                  </div>

                  <Button
                    variant="default"
                    onClick={() => {
                      onDownload(budget);
                    }}
                    className="flex gap-2 p-2.5 w-fit h-fit"
                  >
                    <MdOutlineFileDownload size={20} />{" "}
                    <span className="hidden md:block">Descargar PDF</span>
                  </Button>
                </Card>
              </>
            ))}
        </div>
      </div>

      <CreateBudgetDownload budget={budget} budgetBonifs={budgetBonifs} />
    </>
  );
};

export default LeadBudgetsList;
