export const allPriviliges = {
  dataToken: {
    tokenize: "tokenize",
    detokenize: "detokenize",
  },
  apiKey: {
    createApiKey: "createApiKey",
    deleteApiKey: "deleteApiKey",
  },
} as const;

export const allPriviligesArrayFlattened = Object.values(allPriviliges)
  .map((x) => Object.values(x))
  .flat();

const roleNames = {
  service: "service",
  serviceCreateOnly: "serviceCreateOnly",
  serviceReadonly: "serviceReadonly",
  admin: "admin",
} as const;

const roles = Object.values(roleNames);
type Role = (typeof roles)[number];

export const roleDefinitions: { [key: string]: string[] } = {
  service: [
    allPriviliges.dataToken.tokenize,
    allPriviliges.dataToken.detokenize,
  ],
  serviceCreateOnly: [allPriviliges.dataToken.tokenize],
  serviceReadonly: [allPriviliges.dataToken.detokenize],
  admin: [allPriviliges.apiKey.createApiKey, allPriviliges.apiKey.deleteApiKey],
} as const;

const roleRights = new Map(Object.entries(roleDefinitions).map((x) => x));

export { roles, Role, roleRights };
