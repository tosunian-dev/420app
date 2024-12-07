"use client";

import { Separator } from "@radix-ui/react-select";
import React, { useState } from "react";
import NewLeadForm from "@/components/admin/dashboard/leads/NewLeadForm";
import NewLeadVehiclesForm from "@/components/admin/dashboard/leads/NewLeadVehiclesForm";
import NewLeadEnd from "@/components/admin/dashboard/leads/NewLeadEnd";
import { ILead } from "@/app/models/lead";

const CreateLeadPage = () => {
  const [componentToShow, setComponentToShow] = useState<number>(1);
  const [createdLeadData, setCreatedLeadData] = useState<ILead>();
  
  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-medium ">Nuevo lead</h2>
      </div>
      <Separator className="my-4" />
      <div>
        {componentToShow !== 3 && (
          <>
            <div className="justify-center w-4/5 mx-0 mt-10 mb-6 md:mx-auto md:my-12 h-fit">
              <ul className="relative flex flex-col gap-2 md:flex-row">
                <li className="flex flex-1 md:shrink md:basis-0 group gap-x-2 md:block">
                  <div className="flex flex-col items-center text-xs align-middle min-w-7 min-h-7 md:w-full md:inline-flex md:flex-wrap md:flex-row">
                    <span
                      className={`dark:bg-white dark:text-black text-white bg-black size-7 flex justify-center items-center shrink-0 font-medium rounded-full `}
                    >
                      1
                    </span>
                    <div className="w-px h-full mt-2 bg-gray-200 md:mt-0 md:ms-2 md:w-full md:h-px md:flex-1 group-last:hidden dark:bg-neutral-700"></div>
                  </div>

                  <div className="pb-5 grow md:grow-0 md:mt-3">
                    <span className="block text-sm font-medium text-gray-800 dark:text-white">
                      Datos personales
                    </span>
                    <p className="text-sm text-gray-500 dark:text-neutral-500">
                      Ingresá los datos del nuevo lead
                    </p>
                  </div>
                </li>

                <li className="flex gap-x-2 md:block">
                  <div className="flex flex-col items-center text-xs align-middle min-w-7 min-h-7 md:w-full md:inline-flex md:flex-wrap md:flex-row">
                    <span
                      className={`${
                        componentToShow === 2
                          ? "dark:bg-white dark:text-black text-white bg-black"
                          : "dark:bg-neutral-800 dark:text-white bg-gray-100"
                      } size-7 flex justify-center items-center shrink-0 font-medium text-gray-800 rounded-full `}
                    >
                      2
                    </span>
                    {/* <div className="w-px h-full mt-2 bg-gray-200 md:mt-0 md:ms-2 md:w-full md:h-px md:flex-1 group-last:hidden dark:bg-neutral-700"></div> */}
                  </div>
                  <div className="pb-5 grow md:grow-0 md:mt-3">
                    <span className="block text-sm font-medium text-gray-800 dark:text-white">
                      Cargar vehículos
                    </span>
                    <p className="text-sm text-gray-500 dark:text-neutral-500">
                      Ingresá el vehículo de interés y el usado del lead
                    </p>
                  </div>
                </li>

                {/* <li className="hidden md:block shrink w-fit">
                  <div className="inline-flex items-center w-full text-xs align-middle min-w-7 min-h-7">
                    <span
                      className={`${
                        componentToShow === 2
                          ? "dark:bg-white dark:text-black text-white bg-black"
                          : "dark:bg-neutral-800 dark:text-white bg-gray-100"
                      } size-7 flex justify-center items-center shrink-0 font-medium text-gray-800 rounded-full `}
                    >
                      3
                    </span>
                  </div>
                </li> */}
              </ul>
            </div>
          </>
        )}

        <div className="grid gap-0 ">
          {/* create lead form*/}
          {componentToShow === 1 && (
            <NewLeadForm
              onChangeFormLastStep={() => setComponentToShow(3)}
              onChangeFormStep={() => setComponentToShow(2)}
              onSaveNewLeadData={(data) => setCreatedLeadData(data)}
            />
          )}

          {/* add lead vehicles form */}
          {componentToShow === 2 && (
            <NewLeadVehiclesForm
            createdLeadData={createdLeadData}
              onChangeFormStep={() => setComponentToShow(3)}
            />
          )}
          {componentToShow === 3 && (
            <NewLeadEnd createdLeadData={createdLeadData} />
          )}
        </div>
      </div>
    </>
  );
};

export default CreateLeadPage;
