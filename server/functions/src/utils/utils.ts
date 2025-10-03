import { RoleEnum } from "../types";

export const hasRole = (roles: RoleEnum[], roleToCheck: RoleEnum) => {
  return roles.includes(roleToCheck);
};
