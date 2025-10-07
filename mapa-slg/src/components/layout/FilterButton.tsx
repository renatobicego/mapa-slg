import useMediaQuery from "@/hooks/useMediaQuery";
import { useHeroStore } from "@/stores/useHeroStore";
import {
  Checkbox,
  Form,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  useDisclosure,
} from "@heroui/react";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { Filter } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Button from "../common/Button";
import { FeatureCollection, GeoJsonProperties, Point } from "geojson";

interface FilterForm {
  role: string;
  isCurrentlyWorking: boolean;
  workStartYear: number;
  workEndYear: number;
  graduationYear: number;
}

const FilterButton = ({
  users,
  setFilteredUsers,
}: {
  users: FeatureCollection<Point, GeoJsonProperties> | null;
  setFilteredUsers: React.Dispatch<
    React.SetStateAction<FeatureCollection<Point, GeoJsonProperties> | null>
  >;
}) => {
  const { isVisible: isHeroSectionShowed } = useHeroStore();
  const { isOpen: isModalOpen, onOpen: onOpen, onOpenChange } = useDisclosure();
  const [isOpen, setIsOpen] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const {
    handleSubmit,
    control,
    watch,
    register,
    formState: { errors },
  } = useForm<FilterForm>();

  const role = watch("role");
  const isCurrentlyWorking = watch("isCurrentlyWorking");

  const screenSize = useMediaQuery();
  const modalSize = screenSize.width && screenSize.width < 768 ? "4xl" : "5xl";

  useEffect(() => {
    if (!isHeroSectionShowed) {
      setTimeout(() => {
        setIsOpen(false);
      }, 5000);
    }
  }, [isHeroSectionShowed]);

  const buttonVariants: Variants = {
    expanded: {
      borderRadius: "12px",
      padding: "12px 20px",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    collapsed: {
      borderRadius: "50px",
      padding: "12px",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const textVariants: Variants = {
    visible: {
      width: "auto",
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    hidden: {
      width: 0,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const iconVariants = {
    initial: { scale: 1, rotate: 0 },
    hover: {
      scale: 1.1,
      transition: { duration: 0.2 },
    },
    tap: { scale: 0.95 },
  };

  const shouldShowExpanded = isOpen || isHovered;

  const onSubmit = (data: FilterForm) => {
    const filtered = users?.features.filter((user) => {
      let isMatch = true;

      if (data.role) {
        isMatch = user.properties?.role.includes(data.role);
      }

      if (isMatch && data.role === "exstudent" && data.graduationYear) {
        isMatch = user.properties?.graduationYear === data.graduationYear;
      }

      if (
        isMatch &&
        (data.role === "teacher" || data.role === "employee") &&
        data.workStartYear
      ) {
        isMatch = user.properties?.workStartYear >= data.workStartYear;
      }

      if (
        isMatch &&
        (data.role === "teacher" || data.role === "employee") &&
        !data.isCurrentlyWorking &&
        data.workEndYear
      ) {
        isMatch = user.properties?.workEndYear <= data.workEndYear;
      }

      return isMatch;
    });

    setFilteredUsers({
      type: "FeatureCollection",
      features: filtered || [],
    });

    onOpenChange();
  };

  return (
    <>
      <motion.button
        className="font-semibold bg-black text-white cursor-pointer w-auto text-small lg:text-base 2xl:text-lg flex gap-1 lg:gap-1.5 2xl:gap-2 items-center "
        variants={buttonVariants}
        animate={shouldShowExpanded ? "expanded" : "collapsed"}
        whileHover="hover"
        whileTap="tap"
        initial="expanded"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onOpen}
      >
        <motion.div variants={iconVariants} className="flex items-center">
          <Filter size={16} className="lg:size-6 2xl:size-7" />
        </motion.div>

        <AnimatePresence mode="wait">
          {shouldShowExpanded && (
            <motion.span
              variants={textVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="overflow-hidden whitespace-nowrap"
            >
              Filtrar
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
      <Modal
        size={modalSize}
        placement="center"
        scrollBehavior="inside"
        isOpen={isModalOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          <ModalHeader>Filtrar Pines</ModalHeader>
          <ModalBody>
            <Form
              className="flex flex-col gap-2 w-full"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select
                    onChange={field.onChange}
                    value={field.value}
                    selectedKeys={new Set(field.value ? [field.value] : [])}
                    label="Relación con la escuela"
                    placeholder="Selecciona la relación"
                    labelPlacement="outside"
                    radius="lg"
                    errorMessage={errors.role?.message}
                    className="w-full"
                    isInvalid={errors.role ? true : false}
                  >
                    <SelectItem key="student">Alumno</SelectItem>
                    <SelectItem key="exstudent">Ex-Alumno</SelectItem>
                    <SelectItem key="teacher">Profesor</SelectItem>
                    <SelectItem key="employee">Personal no docente</SelectItem>
                    <SelectItem key="familia">Familia</SelectItem>
                  </Select>
                )}
              />
              {/* Conditional Fields Based on Role */}
              {role?.includes("exstudent") && (
                <>
                  <Input
                    id="graduationYear"
                    type="number"
                    {...register("graduationYear", {
                      valueAsNumber: true,
                      min: {
                        value: 1900,
                        message: "Ingrese un año válido",
                      },
                      max: {
                        value: new Date().getFullYear(),
                        message: "Ingrese un año válido",
                      },
                    })}
                    placeholder="por ejemplo, 2025"
                    label="Año de egreso"
                    pattern="^[0-9]{4}$"
                    min={1900}
                    max={new Date().getFullYear()}
                    errorMessage={errors.graduationYear?.message}
                  />
                </>
              )}

              {(role?.includes("teacher") || role?.includes("employee")) && (
                <>
                  <Input
                    id="workStartYear"
                    type="number"
                    {...register("workStartYear", {
                      min: {
                        value: 1900,
                        message: "Ingrese un año válido",
                      },
                      max: {
                        value: new Date().getFullYear(),
                        message: "Ingrese un año válido",
                      },
                      valueAsNumber: true,
                    })}
                    placeholder="por ejemplo, 2025"
                    label="¿Desde qué año?"
                    pattern="^[0-9]{4}$"
                    errorMessage={errors.workStartYear?.message}
                  />

                  <Controller
                    name="isCurrentlyWorking"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id="isCurrentlyWorking"
                        isSelected={field.value}
                        size="md"
                        onChange={field.onChange}
                      >
                        Actualmente trabaja en la escuela
                      </Checkbox>
                    )}
                  />
                  {!isCurrentlyWorking && (
                    <Input
                      id="workEndYear"
                      type="number"
                      {...register("workEndYear", {
                        valueAsNumber: true,
                        min: {
                          value: 1900,
                          message: "Ingrese un año válido",
                        },
                        max: {
                          value: new Date().getFullYear(),
                          message: "Ingrese un año válido",
                        },
                      })}
                      placeholder="por ejemplo, 2025"
                      label="¿Hasta qué año?"
                      pattern="^[0-9]{4}$"
                      errorMessage={errors.workEndYear?.message}
                    />
                  )}
                </>
              )}
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button
              className="text-black bg-transparent"
              onPress={() => {
                setFilteredUsers(null);
                onOpenChange();
              }}
            >
              Limpiar Filtros
            </Button>
            <Button onClick={handleSubmit(onSubmit)}>Aplicar Filtros</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default FilterButton;
