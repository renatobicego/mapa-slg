import { useHeroStore } from "@/stores/useHeroStore";
import {
  Form,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectItem,
} from "@heroui/react";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { Filter } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

interface FilterForm {
  role: string;
  isCurrentlyWorking: boolean;
  workStartYear: number;
  workEndYear: number;
  graduationYear: number;
}

const FilterButton = () => {
  const { isVisible: isHeroSectionShowed } = useHeroStore();
  const [isOpen, setIsOpen] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FilterForm>();

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
    console.log(data);
  };

  return (
    <Popover>
      <PopoverTrigger>
        <motion.button
          className="font-semibold bg-black text-white cursor-pointer w-auto text-small lg:text-base 2xl:text-lg flex gap-1 lg:gap-1.5 2xl:gap-2 items-center "
          variants={buttonVariants}
          animate={shouldShowExpanded ? "expanded" : "collapsed"}
          whileHover="hover"
          whileTap="tap"
          initial="expanded"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => {}}
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
      </PopoverTrigger>
      <PopoverContent>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <Select
                onChange={field.onChange}
                value={field.value}
                label="¿Cuál es tu relación con la escuela?"
                placeholder="Selecciona tu relación"
                description="Puede ser relación actual o pasada"
                labelPlacement="outside"
                radius="lg"
                errorMessage={errors.role?.message}
                className="flex-1"
                isInvalid={errors.role ? true : false}
              >
                <SelectItem key="student">Alumno</SelectItem>
                <SelectItem key="exstudent">Ex-Alumno</SelectItem>
                <SelectItem key="teacher">Profesor</SelectItem>
                <SelectItem key="employee">Personal no docente</SelectItem>
              </Select>
            )}
          />
        </Form>
      </PopoverContent>
    </Popover>
  );
};

export default FilterButton;
