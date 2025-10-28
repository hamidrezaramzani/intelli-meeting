export type CheckIsEmailAlreadyUsedResponse = {
  isUnique: boolean;
};

export type CheckIsEmailAlreadyUsedRequestBody = {
  email: string;
};
